import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiDotsVertical } from 'react-icons/hi';
import { FaAngleLeft } from 'react-icons/fa6';
import { IoMdSend } from 'react-icons/io';
import toast, { Toaster } from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';

import Avatar from '~/component/Avatar';
import backgroundImage from '~/assets/wallapaper.jpeg';
import { chatDataSelector, socketSelector, userSelector } from '~/redux/selector';
import uploadFile from '~/helper/uploadFile';
import { SocketEvent } from '~/model/SocketEvent';
import { AppDispatch } from '~/redux/store';

import FileUpload from '~/component/FileUpload';
import FilePreview from '~/component/FilePreview';
import MessageItem from '~/pages/component/chatbox/MessageItem';
import EmojiPicker from '~/component/EmojiPicker';
import { appendMessageListToChat, Message, setChatDataUserOnline, setUpdateNewMessage } from '~/redux/chatDataSlice';
import languageUtil from '~/utils/languageUtil';
import { IoSearch } from 'react-icons/io5';
import clsx from 'clsx';
import MessageHeader from '~/pages/component/chatbox/MessageHeader';
import Loading from '~/pages/component/Loading';
import ChatInfoPopup from '~/pages/component/chatbox/ChatInfoPopup';
import SearchMessageBar from '~/component/SearchMessageBar';

interface FileUploadProps {
  isImage: boolean;
  file: File;
}

const MessagePage = () => {
  // try to set current chat
  const { type, name } = useParams();
  const currentChat:{type: 0 | 1, name:string} = {
    type: type === undefined ? 1 : type === '0' ? 0 : 1,
    name: name === undefined ? '' : name,
  };

  // all selector
  const user = useSelector(userSelector);
  const webSocket = useSelector(socketSelector);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileUploadProps | null>(
    null,
  );
  const currentMessage = useRef<HTMLDivElement>(null);
  // send message
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  // for loading sections
  const moreMessageButton = useRef<HTMLButtonElement>(null);
  const moreMessageSpinner = useRef<HTMLDivElement>(null);

  // get chat data info
  const dispatch = useDispatch<AppDispatch>();
  const chatData = useSelector(chatDataSelector);
  const chatInfo = chatData.userList.find((userInfo) => userInfo.name === name);
  const chatLatestMessage =
    chatInfo && chatInfo.messages && chatInfo.messages.length > 0
      ? chatInfo.messages[0]
      : null;

  // for searching purposes only
  const [searchState, setSearchState] = useState(false);
  const [searchResult, setSearchResult] = useState<number[]>([]);
  const [searchCursor, setSearchCursor] = useState(-1);
  const searchInput = useRef('');
  const searchFocus = useRef<HTMLDivElement>(null);
  // for show info
  const [openInfo, setOpenInfo] = useState(false);

  // on 'type' and 'name' change (from click to other chat) or new last messages update, scroll to end automatically,
  useEffect(() => {
    // reset search data
    searchInput.current = '';
    setSearchResult([]);
    setSearchCursor(-1);
  }, [type, name]);

  const handleUploadFile = async (): Promise<string | null> => {
    if (selectedFile) {
      // Set loading state to true to indicate that the file is being uploaded
      setLoading(true);
      // Call the uploadFile function to upload the selected file and get the URL
      const url = await uploadFile(selectedFile.file);
      // Reset the selected file to null after the upload is complete
      setSelectedFile(null);
      setLoading(false);
      return url;
    }
    return null;
  };

  const handleSendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Get the value from the input field
    const inputValue = inputRef.current?.value.trim();

    // if inputValue have greater than 800 characters, don't send
    if (inputValue && inputValue.length > 1000) {
      toast.error('Message is too long', { duration: 2000 });
      return;
    }

    const createSocketEvent = (message: string): SocketEvent => ({
      action: 'onchat',
      data: {
        event: 'SEND_CHAT',
        data: {
          type:
            currentChat.type === 0
              ? 'people'
              : currentChat.type === 1
                ? 'room'
                : '',
          to: currentChat.name,
          mes: languageUtil.utf8ToBase64(message),
        },
      },
    });
    // Function used to send the message (used for both plaintext and image/video)
    const sendMessageFunction = (message: string) => {
      const SEND_MESSAGE: SocketEvent = createSocketEvent(message);
      //just in case socket is not in open state, don't send
      if (webSocket.readyState === WebSocket.OPEN)
        webSocket.send(JSON.stringify(SEND_MESSAGE));

      // Add a fake message to reduce call to update chat, minus the timezone because server use gmt-0
      const messageSent: Message = {
        type: currentChat.type === 1 ? 1 : 0,
        name: user.username,
        to: currentChat.name,
        mes: languageUtil.utf8ToBase64(message),
        createAt: new Date(Date.now() - 7 * 3600 * 1000),
      };
      dispatch(setUpdateNewMessage({ type: 'sent', message: messageSent }));
    };
    // If there is an input value or a selected file and the WebSocket is connected
    if ((inputValue || selectedFile) && webSocket) {
      if (selectedFile) {
        // Disable the input field and submit button
        if (inputRef.current) inputRef.current.disabled = true;
        if (submitRef.current) submitRef.current.disabled = true;
        // Upload the file and get the URL
        const url = await handleUploadFile();
        if (url) {
          // IF there's text to send
          if (inputValue) {
            // ...first clear the input field
            inputRef.current && (inputRef.current.value = '');
            // ...Send the message first
            sendMessageFunction(inputValue);
            // ...Then send the URL with a delay of 600 millisecond
            setTimeout(() => {
              sendMessageFunction(url);
            }, 600);
          }
          // ...else just send that url
          else sendMessageFunction(url);
          // Clear the input field
          if (inputRef.current) {
            inputRef.current.disabled = false;
            inputRef.current.value = '';
            inputRef.current.rows = 1;
          }
          if (submitRef.current) submitRef.current.disabled = false;
        }
      }
      // If there's only text, the message is sent with no delay
      else if (inputValue) {
        // Then send it
        sendMessageFunction(inputValue);
        // Clear the input field
        if (inputRef.current) {
          inputRef.current.value = '';
          inputRef.current.rows = 1;
        }
      }
    }
  };

  const loadMoreMessage = () => {
    if (!chatInfo?.moreMessage) return;
    const handleLoadMoreMessages = (evt: MessageEvent) => {
      const response = JSON.parse(evt.data);
      if (
        !(
          response.event === 'GET_PEOPLE_CHAT_MES' ||
          response.event === 'GET_ROOM_CHAT_MES'
        )
      )
        return;
      if (response.status === 'success') {
        //get message data
        const messageData: Message[] =
          response.event === 'GET_ROOM_CHAT_MES'
            ? response.data.chatData
            : response.data;
        //filter it to get the desired chat for user/group
        const filteredMessages = messageData.filter(
          (message: Message) =>
            (response.event !== 'GET_ROOM_CHAT_MES' &&
              message.name === currentChat.name) ||
            message.to === currentChat.name,
        );

        //and set the preferred chat to the screen
        dispatch(
          appendMessageListToChat({
            name: currentChat.name,
            type: currentChat.type === 0 ? 0 : 1,
            page: chatInfo.page + 1 + chatInfo.offset / 50,
            messages: filteredMessages,
          }),
        );
      } else if (response.status === 'error') {
        toast.error(
          'Error when get chat message of '.concat(name || 'unknown'),
          { duration: 2000 },
        );
      }
      webSocket.removeEventListener('message', handleLoadMoreMessages);

      if (moreMessageButton.current) moreMessageButton.current.disabled = false;
      if (moreMessageSpinner.current) moreMessageSpinner.current.hidden = true;
    };
    const GET_MESSAGE_FOR_NEW_PAGES = {
      action: 'onchat',
      data: {
        event:
          currentChat.type === 1 ? 'GET_ROOM_CHAT_MES' : 'GET_PEOPLE_CHAT_MES',
        data: {
          name: currentChat.name,
          page: chatInfo.page + 1 + Math.floor(chatInfo.offset / 50),
        },
      },
    };
    webSocket.addEventListener('message', handleLoadMoreMessages);
    if (webSocket.readyState === WebSocket.OPEN) {
      webSocket.send(JSON.stringify(GET_MESSAGE_FOR_NEW_PAGES));
    }
    if (currentMessage.current && currentMessage.current.lastElementChild) {
      currentMessage.current.lastElementChild.scrollIntoView({
        behavior: 'smooth',
      });
    }
    if (moreMessageButton.current) moreMessageButton.current.disabled = true;
    if (moreMessageSpinner.current) moreMessageSpinner.current.hidden = false;
  };

  // This effect is used to check user status.
  useEffect(() => {
    const CHECK_USER_STATUS = {
      action: 'onchat',
      data: {
        event: 'CHECK_USER',
        data: {
          user: currentChat.name,
        },
      },
    };
    //handle the online status
    const handleStatusCheck = (evt: MessageEvent) => {
      const response = JSON.parse(evt.data);
      if (!(response.event === 'CHECK_USER')) return;
      if (response.status === 'success') {
        dispatch(
          setChatDataUserOnline({
            name: currentChat.name,
            type: currentChat.type === 0 ? 0 : 1,
            online: response.data.status,
          }),
        );
      } else if (response.status === 'error') {
        toast.error('Error when get status of '.concat(name || 'unknown'), {
          duration: 2000,
        });
      }
    };

    let interval: NodeJS.Timer;
    webSocket.addEventListener('message', handleStatusCheck);
    if (
      webSocket &&
      currentChat.type === 0 &&
      currentChat.name !== '' &&
      currentChat.name !== user.username
    ) {
      interval = setInterval(() => {
        if (webSocket.readyState === WebSocket.OPEN)
          webSocket.send(JSON.stringify(CHECK_USER_STATUS));
      }, 1000);
    }
    return () => {
      //clean up on detach
      webSocket.removeEventListener('message', handleStatusCheck);
      clearInterval(interval);
    };
  }, [webSocket, currentChat.name, currentChat.type]);

  // text area auto-size
  const handleSizeChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    event.currentTarget.rows = 1;
    const isWarpTooMuch = event.currentTarget.scrollHeight > 20 + 12 + 2;
    // const numberOfLineBreaks = (event.currentTarget.value.match(/\n/g) || []).length;
    // console.log(event.currentTarget.value)
    event.currentTarget.rows = isWarpTooMuch ? 2 : 1;
  };

  useEffect(() => {
    currentMessage.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
    setTimeout(() => {
      currentMessage.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }, 500);
  }, [chatLatestMessage]);

  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    // Access the items from the clipboard
    const clipboardItems = event.clipboardData.items;

    for (let i = 0; i < clipboardItems.length; i++) {
      const item = clipboardItems[i];
      const handleFile = (type: string, blob: File | null) => {
        if (blob) {
          setSelectedFile({ isImage: type === 'image', file: blob });
          return true;
        }
        return false;
      };

      if (['image', 'video'].some(type => item.type.startsWith(type) && handleFile(type, item.getAsFile()))) {
        break;
      }
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div
        style={{ backgroundImage: `url(${backgroundImage})` }}
        className="bg-no-repeat bg-cover relative"
        key={name}
      >
        <header className="sticky top-0 h-16 bg-white flex justify-between items-center px-4">
          <div className="flex items-center gap-4">
            <Link to={'/'} className="lg:hidden">
              <FaAngleLeft size={25} />
            </Link>
            <div
              className="flex items-center gap-4 rounded-md cursor-pointer p-1.5 hover:bg-slate-200"
              onClick={() => setOpenInfo(true)}
            >
              <div>
                <Avatar
                  width={44}
                  height={44}
                  name={currentChat.name}
                  type={currentChat.type}
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1">
                  {currentChat.name}
                  {currentChat.name === user.username && ' (you)'}
                </h3>
                {currentChat.name !== user.username &&
                  currentChat.type === 0 && (
                    <p className="-my-2 text-sm pb-2">
                      {chatInfo && chatInfo.online ? (
                        <span className="text-primary">online</span>
                      ) : (
                        <span className="text-slate-400">offline</span>
                      )}
                    </p>
                  )}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              className="cursor-pointer hover:text-primary"
              onClick={() => setSearchState(!searchState)}
            >
              <IoSearch />
            </button>
            <button className="cursor-pointer hover:text-primary">
              <HiDotsVertical />
            </button>
          </div>
        </header>

        {/***searching ui*/}
        {searchState && (
          <SearchMessageBar
            searchState={searchState}
            searchFocus={searchFocus}
            searchInput={searchInput}
            chatInfo={chatInfo}
            setSearchState={setSearchState}
            searchResult={searchResult}
            searchCursor={searchCursor}
            setSearchCursor={setSearchCursor}
            setSearchResult={setSearchResult}
          />
        )}

        {/***show all messages */}
        <section
          className={clsx(
            `h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50 `,
            searchState && 'h-[calc(100vh-128px-3rem)]',
          )}
        >
          {/**all messages show here, note: it's in reverse order aka the elements are place upward */}
          <div
            className="flex flex-col-reverse justify-end gap-2 py-2 mx-2 min-h-full"
            ref={currentMessage}
          >
            {chatInfo &&
              chatInfo.messages &&
              chatInfo.messages.length > 0 &&
              chatInfo.messages.map((msg: Message, index: number) => {
                const isSelected =
                  searchState && searchResult[searchCursor] === index;
                return (
                  <div ref={isSelected ? searchFocus : undefined}>
                    <MessageItem
                      key={index}
                      msg={msg}
                      username={user.username}
                      type={currentChat.type === 1 ? 1 : 0}
                      selected={isSelected}
                      querySearch={
                        searchState ? searchInput.current : undefined
                      }
                      roomOwner={chatInfo.room_owner}
                    />
                  </div>
                );
              })}
            {/*load more message ui*/}
            {chatInfo && chatInfo.moreMessage && (
              <button
                className={
                  'p-4 bg-cyan-200 bg-opacity-75 flex justify-center items-center disabled:bg-white mt-auto'
                }
                onClick={loadMoreMessage}
                ref={moreMessageButton}
              >
                <div className="px-2" hidden ref={moreMessageSpinner}>
                  <Loading />
                </div>
                Read more messages...
              </button>
            )}
            {/*Loading...*/}
            {chatInfo && !chatInfo.messages && (
              <div className="mt-auto">
                <Loading />
              </div>
            )}
            {/*No more message show this*/}
            {chatInfo &&
              chatInfo.messages &&
              (chatInfo.messages.length === 0 || !chatInfo.moreMessage) && (
                <MessageHeader
                  key={name}
                  name={chatInfo.name}
                  type={chatInfo.type}
                  owner={chatInfo.room_owner}
                  members={chatInfo.room_member}
                />
              )}
          </div>

          {/**upload Image display */}
          {selectedFile && (
            <FilePreview
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
            />
          )}

          {loading && (
            <div className="w-full h-screen flex sticky bottom-0 justify-center items-center bg-black bg-opacity-50">
              <Loading />
            </div>
          )}
        </section>

        {/**send a message */}
        <section className="h-16 bg-white flex items-center px-4">
          {/*show file upload*/}
          <FileUpload setSelectedFile={setSelectedFile} />

          {/**emoji picker */}
          <EmojiPicker inputRef={inputRef} />

          {/**input box */}
          <form
            className="h-full w-full flex gap-2 items-center"
            onSubmit={handleSendMessage}
          >
            <textarea
              rows={1}
              className="py-1 px-4 w-full h-fit resize-none disabled:text-gray-500 border-none"
              onKeyDown={(event) => {
                // On plain enter or ctrl + enter, send message.
                // On shift + enter or alt + enter, add a new line to it
                if (event.key === 'Enter') {
                  if (!(event.altKey || event.shiftKey) && submitRef.current) {
                    event.preventDefault();
                    event.stopPropagation();
                    submitRef.current.click();
                  }
                }
              }}
              onChange={handleSizeChange}
              onPaste={handlePaste}
              ref={inputRef}
              placeholder="Type message here"
            />
            <button
              type="submit"
              className="text-primary hover:text-secondary disabled:animate-pulse"
              ref={submitRef}
            >
              <IoMdSend size={28} />
            </button>
          </form>
        </section>
        {!chatInfo && (
          <div className="absolute w-full top-0 bottom-0 bg-slate-300 bg-opacity-75 flex justify-center items-center">
            <div className="text-xl">
              <Loading />
            </div>
          </div>
        )}
      </div>
      {openInfo && (
        <ChatInfoPopup onClose={() => setOpenInfo(false)} {...chatInfo!} />
      )}
    </>
  );
};
export default MessagePage;
