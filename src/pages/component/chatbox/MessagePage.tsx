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
import Loading from '~/component/Loading';
import uploadFile from '~/helper/uploadFile';
import { SocketEvent } from '~/model/SocketEvent';
import { AppDispatch } from '~/redux/store';

import FileUpload from '~/component/FileUpload';
import FilePreview from '~/component/FilePreview';
import MessageItem from '~/pages/component/chatbox/MessageItem';
import EmojiPicker from '~/component/EmojiPicker';
import { appendMessageListToChat, Message, setChatDataUserOnline, setUpdateNewMessage } from '~/redux/chatDataSlice';
import languageUtil from '~/utils/languageUtil';
import { IoChevronDown, IoChevronUp, IoClose, IoSearch } from 'react-icons/io5';
import clsx from 'clsx';
import { isCloudinaryURL, isValidURL } from '~/utils/linkUtil';
import MessageHeader from '~/pages/component/chatbox/MessageHeader';

interface FileUploadProps {
  isImage: boolean;
  file: File;
}

const MessagePage = () => {
  // try to set current chat
  const { type, name } = useParams();
  const currentChat = {
    type: type === undefined ? 0 : (type === '1' ? 1 : 0),
    name: name === undefined ? '' : name,
  };

  // all selector
  const user = useSelector(userSelector);
  const webSocket = useSelector(socketSelector);

  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(true);
  const currentMessage = useRef<HTMLDivElement>(null);
  const [selectedFile, setSelectedFile] = useState<FileUploadProps | null>(
    null,
  );

  // send message
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  // get chat data info
  const dispatch = useDispatch<AppDispatch>();
  const chatData = useSelector(chatDataSelector);
  const chatInfo = chatData.userList.find((userInfo) => userInfo.name === name);
  const chatLastMessage = chatInfo && chatInfo.messages && chatInfo.messages.length > 0 ? chatInfo.messages[0] : null;
  // for searching purposes only
  const [searchState, setSearchState] = useState(false);
  const [searchResult, setSearchResult] = useState<number[]>([]);
  const [searchCursor, setSearchCursor] = useState(-1);
  const searchInput = useRef('');
  const searchFocus = useRef<HTMLDivElement>(null);
  // for search input reset
  const resetRef = useRef<HTMLButtonElement>(null);

  const moreMessageButton = useRef<HTMLButtonElement>(null);
  const moreMessageSpinner = useRef<HTMLDivElement>(null);

  // on 'type' and 'name' change (from click to other chat) or new last messages update, scroll to end automatically,
  useEffect(() => {
    // reset search data
    searchInput.current = '';
    setSearchResult([]);
    setSearchCursor(-1);
    if (currentMessage.current)
      currentMessage.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [type, name, chatLastMessage, currentMessage]);

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
        mes: message,
        createAt: new Date(Date.now() - 7 * 3600 * 1000),
      };
      dispatch(setUpdateNewMessage({ type: 'sent', message: messageSent }));
    };
    // If there is an input value or a selected file and the WebSocket is connected
    if ((inputValue || selectedFile) && webSocket) {

      if (selectedFile) {
        // Disable the input field and submit button
        if (inputRef.current)
          inputRef.current.disabled = true;
        if (submitRef.current)
          submitRef.current.disabled = true;
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
          if (submitRef.current)
            submitRef.current.disabled = false;
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
      if (!(response.event === 'GET_PEOPLE_CHAT_MES' || response.event === 'GET_ROOM_CHAT_MES')) return;
      if (response.status === 'success') {
        //get message data
        const messageData: Message[] = response.event === 'GET_ROOM_CHAT_MES' ? response.data.chatData : response.data;
        //filter it to get the desired chat for user/group
        const filteredMessages = messageData.filter((message: Message) => (response.event !== 'GET_ROOM_CHAT_MES' && message.name === currentChat.name) || message.to === currentChat.name);
        //and set the preferred chat to the screen
        dispatch(appendMessageListToChat({
          name: currentChat.name,
          page: (chatInfo.page + 1 + chatInfo.offset / 50),
          messages: filteredMessages,
        }));
      } else if (response.status === 'error') {
        toast.error('Error when get chat message of '.concat(name || 'unknown'), { duration: 2000 });
      }
      webSocket.removeEventListener('message', handleLoadMoreMessages);

      if (moreMessageButton.current)
        moreMessageButton.current.disabled = false;
      if (moreMessageSpinner.current)
        moreMessageSpinner.current.hidden = true;
    };
    const GET_MESSAGE_FOR_NEW_PAGES = {
      action: 'onchat',
      data: {
        event: currentChat.type === 1 ? 'GET_ROOM_CHAT_MES' : 'GET_PEOPLE_CHAT_MES',
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
      currentMessage.current.lastElementChild.scrollIntoView({ behavior: 'smooth' });
    }
    if (moreMessageButton.current)
      moreMessageButton.current.disabled = true;
    if (moreMessageSpinner.current)
      moreMessageSpinner.current.hidden = false;
  };

  // This effect is used to check user status.
  useEffect(() => {
    const CHECK_USER_STATUS = {
      'action': 'onchat',
      'data': {
        'event': 'CHECK_USER',
        'data': {
          'user': currentChat.name,
        },
      },
    };
    //handle the online status
    const handleStatusCheck = (evt: MessageEvent) => {
      const response = JSON.parse(evt.data);
      if (!(response.event === 'CHECK_USER')) return;
      if (response.status === 'success') {
        dispatch(setChatDataUserOnline({ name: currentChat.name, online: response.data.status }));
      } else if (response.status === 'error') {
        toast.error('Error when get status of '.concat(name || 'unknown'), { duration: 2000 });
      }
    };

    let interval: NodeJS.Timer;
    webSocket.addEventListener('message', handleStatusCheck);
    if (webSocket) {
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
  }, [webSocket, name, currentChat.name, dispatch]);

  // text area auto-size
  const handleSizeChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    event.currentTarget.rows = 1;
    const isWarpTooMuch = event.currentTarget.scrollHeight > 20 + 12 + 2;
    // const numberOfLineBreaks = (event.currentTarget.value.match(/\n/g) || []).length;
    // console.log(event.currentTarget.value)
    event.currentTarget.rows = (isWarpTooMuch) ? 2 : 1;
  };

  // do the search chat
  const filterSearch = (queryString: string, keepCursor: boolean) => {
    if (!chatInfo) return;
    if (!chatInfo.messages) return;
    // create a founded array contains INDEXES of messages
    const founded: number[] = [];
    // if query string exists...
    if (queryString.length > 0)
      // find indexes of messages that are url but not Cloudinary URL or just plain text
      chatInfo.messages.forEach((message, index) => {
        const trueMessage = languageUtil.base64ToUtf8(message.mes);
        if (!isCloudinaryURL(trueMessage) || !isValidURL(trueMessage))
          if (languageUtil.base64ToUtf8(message.mes).match(new RegExp(`(${queryString})`, 'gi')) != null)
            founded.push(index);
      });
    // update the search results with those indexes AND search cursor
    setSearchResult(founded);
    // keep cursor to not reset back to 1st search result
    if (!keepCursor) setSearchCursor(founded.length > 0 ? 0 : -1);
    // set the search query string
    searchInput.current = queryString;
  };

  // On 'message' updated (via send, received, load more message), filter search them
  useEffect(() => {
    filterSearch(searchInput.current, true);
  }, [chatInfo?.messages]);

  // On 'search focus' change, focus the founded message
  useEffect(() => {
    if (searchFocus.current)
      searchFocus.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [searchResult, searchState, searchCursor]);

  // on submit search, do the filter search
  const handleSearchSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    // get the input from the form then filter search it
    const inputData = (evt.currentTarget.elements[0] as HTMLInputElement).value;
    filterSearch(inputData, false);
  };

  // clear input and hide the reset button
  const handleResetVisible = (evt: ChangeEvent<HTMLInputElement>) => {
    const hasText = evt.currentTarget.value.trim().length === 0;
    if (resetRef.current)
      resetRef.current.hidden = hasText;
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div style={{ backgroundImage: `url(${backgroundImage})` }} className="bg-no-repeat bg-cover" key={name}>
        <header className="sticky top-0 h-16 bg-white flex justify-between items-center px-4">
          <div className="flex items-center gap-4">
            <Link to={'/'} className="lg:hidden">
              <FaAngleLeft size={25} />
            </Link>
            <div>
              <Avatar
                width={50}
                height={50}
                name={currentChat.name}
                type={currentChat.type}
              />
            </div>
            <div>
              <h3 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1">
                {currentChat.name}
              </h3>
              <p className="-my-2 text-sm">
                {
                  (chatInfo && chatInfo.online) ? <span className="text-primary">online</span> : (
                    <span className="text-slate-400">offline</span>
                  )}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="cursor-pointer hover:text-primary">
              <IoSearch onClick={() => setSearchState(!searchState)} />
            </button>
            <button className="cursor-pointer hover:text-primary">
              <HiDotsVertical />
            </button>
          </div>
        </header>

        {/***searching ui*/}
        {
          searchState && (
            <div className="h-12 bg-white flex px-4 gap-2 items-center">
              {/*search input*/}
              <form className="h-full grow flex gap-2 items-center " onSubmit={handleSearchSubmit}
                    onReset={() => {
                      if (resetRef.current) resetRef.current.hidden = true;
                    }}>
                <input type="text" placeholder="Search here..." className="py-1 px-4 outline-none w-full h-fit"
                       onChange={handleResetVisible} />
                <button type="reset" ref={resetRef} hidden><IoClose size={20} className="text-secondary" /></button>
                <button type="submit" className="text-primary hover:text-secondary">
                  <IoSearch size={24} />
                </button>
              </form>
              {/*Result tracker*/}
              <span className="h-fit text-sm">
                {searchResult.length > 0 ?
                  `${searchCursor + 1} of ${searchResult.length} message${searchResult.length > 1 ? 's' : ''}` :
                  'No message founded'
                }
              </span>

              {/*Next founded message*/}
              <button disabled={searchCursor >= searchResult.length - 1} className="disabled:text-gray-400"
                      onClick={() => setSearchCursor(searchCursor + 1)} title="Next founded message">
                <IoChevronUp size={24} />
              </button>

              {/*Prev founded message*/}
              <button disabled={searchCursor <= 0} className="disabled:text-gray-400"
                      onClick={() => setSearchCursor(searchCursor - 1)} title="Previous founded message">
                <IoChevronDown size={24} />
              </button>

              {/*Close button*/}
              <button>
                <IoClose size={24} onClick={() => setSearchState(false)} />
              </button>
            </div>
          )
        }

        {/***show all messages */}
        <section
          className={clsx(`h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50`,
            searchState && 'h-[calc(100vh-128px-3rem)]')}>
          {/**all messages show here, note: it's in reverse order aka the elements are place upward */}
          <div className="flex flex-col-reverse justify-end gap-2 py-2 mx-2 min-h-full" ref={currentMessage}>
            {
              chatInfo && chatInfo.messages && chatInfo.messages.length > 0 && chatInfo.messages.map((msg: Message, index: number) => {
                  const isSelected = searchState && searchResult[searchCursor] === index;
                  return (<div ref={isSelected ? searchFocus : undefined}>
                    <MessageItem key={index}
                                 msg={msg}
                                 username={user.username}
                                 type={currentChat.type === 1 ? 1 : 0}
                                 selected={isSelected}
                                 querySearch={searchState ? searchInput.current : undefined}
                                 roomOwner={chatInfo.room_owner}
                    />
                  </div>);
                },
              )
            }
            {/*load more message ui*/}
            {
              chatInfo && chatInfo.moreMessage &&
              <button className={'p-4 bg-cyan-200 bg-opacity-75 flex justify-center items-center disabled:bg-white mt-auto'}
                      onClick={loadMoreMessage}
                      ref={moreMessageButton}>
                <div className="px-2" hidden ref={moreMessageSpinner}><Loading /></div>Read more messages...
              </button>
            }
            {/*Loading...*/}
            {
              (chatInfo && !chatInfo.messages) && <div className="mt-auto"><Loading /></div>
            }
            {/*No more message show this*/}
            {
              chatInfo && chatInfo.messages && (chatInfo.messages.length === 0 || !chatInfo.moreMessage) &&
              <MessageHeader key={name} name={chatInfo.name} type={chatInfo.type} owner={chatInfo.room_owner} members={chatInfo.room_member} />
            }
          </div>

          {/**upload Image display */}
          {selectedFile && (
            <FilePreview selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
          )}

          {loading && (
            <div className="w-full h-full flex sticky bottom-0 justify-center items-center bg-black bg-opacity-50">
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
            <textarea rows={1} className="py-1 px-4 outline-none w-full h-fit resize-none disabled:text-gray-500"
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
                      onChange={handleSizeChange} ref={inputRef} placeholder="Type message here"
            />
            <button type="submit" className="text-primary hover:text-secondary disabled:animate-pulse" ref={submitRef}>
              <IoMdSend size={28} />
            </button>
          </form>
        </section>
      </div>
    </>
  );
};
export default MessagePage;