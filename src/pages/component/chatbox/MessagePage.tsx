import React, { FormEvent, useEffect, useRef, useState } from 'react';
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
import MessageItem, { toAscii } from '~/pages/component/chatbox/MessageItem';
import EmojiPicker from '~/component/EmojiPicker';
import { appendMessageListToChat, Message, setChatDataUserOnline, setUpdateNewMessage } from '~/redux/chatDataSlice';
import languageUtil from '~/utils/languageUtil';

interface FileUploadProps {
  isImage: boolean;
  file: File;
}

const MessagePage = () => {
  //try to set current chat
  const { type, name } = useParams();
  const currentChat = {
    type: type === undefined ? 0 : (type === '1' ? 1 : 0),
    name: name === undefined ? '' : name,
  }

  //all selector
  const user = useSelector(userSelector);
  const webSocket = useSelector(socketSelector);

  const [loading, setLoading] = useState(false);
  const currentMessage = useRef<null | HTMLDivElement>(null);
  const [selectedFile, setSelectedFile] = useState<FileUploadProps | null>(
    null
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  const CHECK_USER_STATUS: SocketEvent = {
    action: 'onchat',
    data: {
      event: 'CHECK_USER',
      data: {
        user: currentChat.name,
      },
    },
  };
  const GET_MESSAGES: SocketEvent = {
    action: 'onchat',
    data: {
      event: currentChat.type === 1 ? 'GET_ROOM_CHAT_MES' : 'GET_PEOPLE_CHAT_MES',
      data: {
        name: currentChat.name,
        page: 1,
      },
    },
  };

  // get chat data info
  const dispatch = useDispatch<AppDispatch>();
  const chatData = useSelector(chatDataSelector);
  const chatInfo = chatData.userList.find((userInfo) => userInfo.name === name);

  //when all message updated, scroll to end automatically,
  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [chatInfo?.messages]);

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
    }
    // If there is an input value or a selected file and the WebSocket is connected
    if ((inputValue || selectedFile) && webSocket) {
      if (selectedFile) {
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
        }
      }
      // If there's only text, the message is sent with no delay
      else if (inputValue) {
        // Clear the input field
        inputRef.current && (inputRef.current.value = '');
        // Then send it
        sendMessageFunction(inputValue);
      }

      // Then scroll to end when message was sent
      if (currentMessage.current) {
        currentMessage.current.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        });
      }
    }
  };

  const loadMoreMessage = () => {
    if (!chatInfo?.moreMessage) return;
    const handleLoadMoreMessages = (evt:MessageEvent) => {
      const response = JSON.parse(evt.data);
      if (!(response.event === 'GET_PEOPLE_CHAT_MES' || response.event === 'GET_ROOM_CHAT_MES')) return;
      if (response.status === 'success') {
        //get message data
        const messageData: Message[] = response.event === 'GET_ROOM_CHAT_MES' ? response.data.chatData : response.data;
        //filter it to get the desired chat for user/group
        const filteredMessages = messageData.filter((message: Message) => (response.event !== 'GET_ROOM_CHAT_MES' && message.name === currentChat.name) || message.to === currentChat.name);
        //and set the preferred chat to the screen
        if (filteredMessages.length > 0) {
          dispatch(appendMessageListToChat({name: currentChat.name, page: (chatInfo.page + 1 + chatInfo.offset / 50), messages: response.data}));
        }
      } else if (response.status === 'error') {
        toast.error('Error when get chat message of '.concat(name || 'unknown'), { duration: 2000 });
      }
      webSocket.removeEventListener('message', handleLoadMoreMessages);
    }
    const GET_MESSAGE_FOR_NEW_PAGES = {
      action: 'onchat',
      data: {
        event: currentChat.type === 1 ? 'GET_ROOM_CHAT_MES' : 'GET_PEOPLE_CHAT_MES',
        data: {
          name: currentChat.name,
          page: chatInfo.page + 1 + chatInfo.offset / 50,
        },
      },
    };
    webSocket.addEventListener('message', handleLoadMoreMessages);
    if (webSocket.readyState === WebSocket.OPEN)
      webSocket.send(JSON.stringify(GET_MESSAGE_FOR_NEW_PAGES));
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({ block: 'start' });
    }
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
        if (CHECK_USER_STATUS.data.data.user === name)
          dispatch(setChatDataUserOnline({name: currentChat.name, online: response.data.status}))
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
  }, [webSocket, name]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div
        style={{ backgroundImage: `url(${backgroundImage})` }}
        className="bg-no-repeat bg-cover"
        key={name}
      >
        <header className="sticky top-0 h-16 bg-white flex justify-between items-center px-4">
          <div className="flex items-center gap-4">
            <Link to={'/'} className="lg:hidden">
              <FaAngleLeft size={25} />
            </Link>
            <div>
              <Avatar
                width={50}
                height={50}
                imageUrl={''}
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

          <div>
            <button className="cursor-pointer hover:text-primary">
              <HiDotsVertical />
            </button>
          </div>
        </header>

        {/***show all messages */}
        <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50">
          {/**all messages show here, note: it's in reverse order aka the elements are place upward */}
          <div className="flex flex-col-reverse gap-2 py-2 mx-2 " ref={currentMessage}>
            {
              chatInfo && chatInfo.messages.length > 0 && chatInfo.messages.map((msg: Message, index: number) =>
                <MessageItem key={index} msg={msg} username={user.username} type={currentChat.type === 1 ? 1 : 0} />,
              )
            }
            {
              chatInfo && chatInfo.moreMessage && <button className={'p-4 bg-cyan-200 bg-opacity-75'} onClick={loadMoreMessage}>Read more
                messages...</button>
            }
            {
              !(chatInfo && chatInfo.moreMessage) && <p className={'text-center'}>You have read all messages!</p>
            }
          </div>

          {/**upload Image display */}
          {selectedFile && (
            <FilePreview
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
            />
          )}

          {loading && (
            <div className="w-full h-full flex sticky bottom-0 justify-center items-center">
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
            className="h-full w-full flex gap-2"
            onSubmit={handleSendMessage}
          >
            <input
              type="text"
              placeholder="Type here message..."
              className="py-1 px-4 outline-none w-full h-full"
              ref={inputRef}
            />
            <button
              type="submit"
              className="text-primary hover:text-secondary"
              ref={submitRef}
            >
              <IoMdSend size={28} />
            </button>
          </form>
        </section>
      </div>
    </>
  );
};
export default MessagePage;