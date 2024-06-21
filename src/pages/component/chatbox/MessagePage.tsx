import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiDotsVertical } from 'react-icons/hi';
import { FaAngleLeft } from 'react-icons/fa6';
import { IoMdSend } from 'react-icons/io';
import toast, { Toaster } from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';

import Avatar from '~/component/Avatar';
import backgroundImage from '~/assets/wallapaper.jpeg';
import { currentChatSelector, socketSelector, socketStatusSelector, userSelector } from '~/redux/selector';
import Loading from '~/component/Loading';
import uploadFile from '~/helper/uploadFile';
import { SocketEvent } from '~/model/SocketEvent';
import { AppDispatch } from '~/redux/store';
import { initCurrentChat, Message, setCurrentChat } from '~/redux/currentChatSlice';

import FileUpload from '~/component/FileUpload';
import FilePreview from '~/component/FilePreview';
import MessageItem, { toAscii } from '~/pages/component/chatbox/MessageItem';
import EmojiPicker from '~/component/EmojiPicker';

interface FileUploadProps {
  isImage: boolean;
  file: File;
}

const MessagePage = () => {
  //try to set current chat
  const { type, name } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  dispatch(setCurrentChat({
    ...initCurrentChat,
    'type': type ? parseInt(type) : -1,
    'name': name || '',
  }));

  //all selector
  const user = useSelector(userSelector);
  const webSocket = useSelector(socketSelector);
  const currentChat = useSelector(currentChatSelector);
  const statusSocket = useSelector(socketStatusSelector);

  const [userOnline, setUserOnline] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState<Message[]>([]);
  const currentMessage = useRef<null | HTMLDivElement>(null);
  const [selectedFile, setSelectedFile] = useState<FileUploadProps | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  const CHECK_USER_STATUS: SocketEvent = {
    'action': 'onchat',
    'data': {
      'event': 'CHECK_USER',
      'data': {
        'user': currentChat.name,
      },
    },
  };
  const GET_MESSAGES: SocketEvent = {
    'action': 'onchat',
    'data': {
      'event': currentChat.type === 1 ? 'GET_ROOM_CHAT_MES' : 'GET_PEOPLE_CHAT_MES',
      'data': {
        'name': currentChat.name,
        'page': currentChat.page,
      },
    },
  };

  //when all message updated, scroll to end automatically,
  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [allMessage]);

  //set user status triggers on socket or currentChat changed state
  useEffect(() => {
    //handle the online status
    const handleStatusCheck = (evt: MessageEvent) => {
      const response = JSON.parse(evt.data);
      if (!(response.event === 'CHECK_USER')) return;
      if (response.status === 'success') {
        setUserOnline((prev) => {
          return prev === response.data.status ? prev : response.data.status;
        });
      } else if (response.status === 'error') {
        toast.error('Error when get status of '.concat(name || 'unknown'), { duration: 2000 });
      }
    };
    //handle the get_message
    const handleGetMessage = (evt: MessageEvent) => {
      const response = JSON.parse(evt.data);
      if (!(response.event === 'GET_PEOPLE_CHAT_MES' || response.event === 'GET_ROOM_CHAT_MES')) return;
      if (response.status === 'success') {
        //get message data
        const messageData: Message[] = response.event === 'GET_ROOM_CHAT_MES' ? response.data.chatData : response.data;
        //filter it to get the desired chat for user/group
        const filteredMessages = messageData.filter((message: Message) => (response.event !== 'GET_ROOM_CHAT_MES' && message.name === currentChat.name) || message.to === currentChat.name);
        //and set the preferred chat to the screen
        if (filteredMessages.length > 0) {
          setAllMessage(filteredMessages);
        }
      } else if (response.status === 'error') {
        toast.error('Error when get chat message of '.concat(name || 'unknown'), { duration: 2000 });
      }
    };
    //handle the success send_chat (aka receiving new message)
    const handleReceivedNewMessage = (evt: MessageEvent) => {
      const response = JSON.parse(evt.data);
      if (!(response.event === 'SEND_CHAT')) return;
      //call get message to update
      webSocket.send(JSON.stringify(GET_MESSAGES));
      //only when get new message, should the message scroll to end
      currentMessage.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    };

    let interval: NodeJS.Timer;
    webSocket.addEventListener('message', handleStatusCheck);
    webSocket.addEventListener('message', handleGetMessage);
    webSocket.addEventListener('message', handleReceivedNewMessage);
    if (webSocket) {
      webSocket.send(JSON.stringify(GET_MESSAGES));
      interval = setInterval(() => {
        webSocket.send(JSON.stringify(CHECK_USER_STATUS));
      }, 1000);
    }
    return () => {
      //clean up on detach
      webSocket.removeEventListener('message', handleStatusCheck);
      webSocket.removeEventListener('message', handleGetMessage);
      webSocket.removeEventListener('message', handleReceivedNewMessage);
      clearInterval(interval);
    };
  }, [webSocket, currentChat]);


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
      'action': 'onchat',
      'data': {
        'event': 'SEND_CHAT',
        'data': {
          'type': currentChat.type == 0 ? 'people' : (currentChat.type == 1 ? 'room' : ''),
          'to': currentChat.name,
          'mes': message,
        },
      },
    });
    // If there is an input value or a selected file and the WebSocket is connected
    if ((inputValue || selectedFile) && webSocket) {
      if (selectedFile) {
        // Upload the file and get the URL
        const url = await handleUploadFile();
        if (url) {
          const SEND_FILE: SocketEvent = createSocketEvent(url);
          //just in case socket is not in open state, don't send
          if (webSocket.readyState === WebSocket.OPEN)
            webSocket.send(JSON.stringify(SEND_FILE));
        }
      }
      if (inputValue) {
        // Send a socket event with the input value (converted one to ascii)
        const SEND_MESSAGES: SocketEvent = createSocketEvent(toAscii(inputValue));
        // just in case socket is not in open state, don't send
        if (webSocket.readyState === WebSocket.OPEN)
          webSocket.send(JSON.stringify(SEND_MESSAGES));
        // Clear the input field
        inputRef.current && (inputRef.current.value = '');
      }
      // Dispatch a custom event specifically for send_chat, to update the side bar item on socket
      webSocket.dispatchEvent(new MessageEvent('message', {
        //where data stored in here is name of the chat
        data: JSON.stringify({ 'event': 'SEND_CHAT_SUCCESS', 'status': 'success', 'data': currentChat.name }),
      }));
    }
    // if (submitRef.current) {
    //   submitRef.current.type = 'button';
    //   submitRef.current.disabled = true;
    // }
    // setTimeout(() => {
    //   if (submitRef.current) {
    //     submitRef.current.type = 'submit';
    //     submitRef.current.disabled = false;
    //   }
    // }, 10000);
  };


  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
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
                imageUrl={currentChat.profile_pic}
                name={currentChat.name}
                type={currentChat.type}
              />
            </div>
            <div>
              <h3 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1">{currentChat.name}</h3>
              <p className="-my-2 text-sm">
                {
                  userOnline ? <span className="text-primary">online</span> :
                    <span className="text-slate-400">offline</span>
                }
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
        <section
          className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50">


          {/**all messages show here */}
          <div className="flex flex-col-reverse gap-2 py-2 mx-2 " ref={currentMessage}>
            {
              allMessage.map((msg: Message, index: number) =>
                <MessageItem key={index} msg={msg} username={user.username} type={currentChat.type === 1 ? 1 : 0} />,
              )
            }
          </div>


          {/**upload Image display */}
          {selectedFile && <FilePreview selectedFile={selectedFile} setSelectedFile={setSelectedFile} />}

          {
            loading && (
              <div className="w-full h-full flex sticky bottom-0 justify-center items-center">
                <Loading />
              </div>
            )
          }
        </section>

        {/**send a message */}
        <section className="h-16 bg-white flex items-center px-4">

          {/*show file upload*/}
          <FileUpload setSelectedFile={setSelectedFile} />

          {/**emoji picker */}
          <EmojiPicker inputRef={inputRef} />

          {/**input box */}
          <form className="h-full w-full flex gap-2" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Type here message..."
              className="py-1 px-4 outline-none w-full h-full"
              ref={inputRef}
            />
            <button type="submit" className="text-primary hover:text-secondary" ref={submitRef}>
              <IoMdSend size={28} />
            </button>
          </form>

        </section>
      </div>
    </>
  );
};
export default MessagePage;