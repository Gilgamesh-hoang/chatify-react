import Avatar from '~/component/Avatar';
import clsx from 'clsx';

import { NavLink, useParams } from 'react-router-dom';
import React, { useEffect, useRef } from 'react';
import { SideBarProp } from '~/model/SideBarProp';
import { useDispatch, useSelector } from 'react-redux';
import { chatDataSelector, socketSelector, userSelector } from '~/redux/selector';
import { SocketEvent } from '~/model/SocketEvent';
import toast, { Toaster } from 'react-hot-toast';
import { isCloudinaryURL, isValidURL } from '~/utils/linkUtil';
import { CiImageOn, CiVideoOn } from 'react-icons/ci';
import { AppDispatch } from '~/redux/store';
import { setMessageListToChat, updateChatDataRooms } from '~/redux/chatDataSlice';

import languageUtil from '~/utils/languageUtil';

interface LastMessage {
  mes: string;
  createAt: Date;
  name: string;
  to: string;
  type: number;
}

const SideBarItem: React.FC<SideBarProp> = (props) => {
  const { name } = useParams();
  const user = useSelector(userSelector);
  //get socket from redux
  const socket: WebSocket | null = useSelector(socketSelector);
  const unseenRef = useRef<boolean>(JSON.parse(localStorage.getItem(`unseen_${props.name}`) || 'false'));
  const timeRef = useRef<HTMLParagraphElement>(null);

  // get chat data info
  const dispatch = useDispatch<AppDispatch>();
  const chatData = useSelector(chatDataSelector);
  const chatInfo = chatData.userList.find((userInfo) => userInfo.name === props.name);


  // const [unseen, setUnseen] = useState<boolean>(unseenRef.current);
  useEffect(() => {
    localStorage.setItem(
      `unseen_${props.name}`,
      JSON.stringify(unseenRef.current),
    );
  }, [unseenRef]);

  //boolean to stop stack tracing too much
  const getMessParams: SocketEvent = {
    action: 'onchat',
    data: {
      event: props.type === 1 ? 'GET_ROOM_CHAT_MES' : 'GET_PEOPLE_CHAT_MES',
      data: {
        name: props.name,
        page: 1,
      },
    },
  };
  // Define the handler for the 'message' event.
  const handleMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data);
    if (!(data.event === 'GET_PEOPLE_CHAT_MES' || data.event === 'GET_ROOM_CHAT_MES')) return;
    if (data.status === 'success') {
      if (chatInfo === undefined) return;
      if (chatInfo.messages.length > 0) return;
      // Filter the messages for the current user.
      let filteredMessages;
      if (data.event === 'GET_ROOM_CHAT_MES')
        filteredMessages = data.data.chatData.filter((message: LastMessage) => message.to === props.name);
      else
        filteredMessages = data.data.filter((message: LastMessage) => message.name === props.name || message.to === props.name);
      // Check if there are any messages.
      if (filteredMessages.length > 0) {
        dispatch(setMessageListToChat({ name: props.name, messages: filteredMessages }));
        if (props.type === 1) {
          const roomUserList: string[] = [];
          data.data.userList.forEach((user: { name: string; }) => roomUserList.push(user.name));
          dispatch(updateChatDataRooms({ name: props.name, roomData: { ...data.data, userList: roomUserList } }));
        }

        // Check if the message is for the current user and it's unseen.
        if (filteredMessages[0].to === user.username && !unseenRef.current) {
          // Mark the message as seen.
          unseenRef.current = true;
          // Update the unseen status in localStorage.
          localStorage.setItem(`unseen_${props.name}`, JSON.stringify(true));
        }
      }
    } else if (data.status === 'error') {
      toast.error('Error when get message', { duration: 2000 });
    }
  };

  // This effect runs when the `socket` or `lastMessage` changes.
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (socket) {
      if (chatInfo && chatInfo.messages.length === 0) {
        // Add the 'message' event listener and send the "GET_PEOPLE_CHAT_MES" event after 1 second.
        socket.addEventListener('message', handleMessage);
        // Create timeout to retrieve new message
        timeout = setTimeout(() => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(getMessParams));
          }
        }, 1000);
      }
    }
    // Remove the 'message' event listener when the component unmounts.
    return () => {
      socket?.removeEventListener('message', handleMessage);
      clearTimeout(timeout);
    };
  }, [socket, props]);

  const getTime = (message: LastMessage): string => {
    const currentDate = new Date();
    const deltaTime = currentDate.getTime() - 7 * 3600 * 1000 - message.createAt.getTime();
    const year = (365.25 * 24 * 3600 * 1000), week = (7 * 24 * 3600 * 1000), day = 24 * 3600 * 1000, hour = 3600 * 1000,
      minute = 60 * 1000;
    // if delta is big for year, divide delta by year. Else go for week, day, hour and minute
    return deltaTime > year ? Math.floor(deltaTime / year) + ' year' + (Math.floor(deltaTime / year) > 1 ? 's' : '') :
      deltaTime > week ? Math.floor(deltaTime / week) + ' week' + (Math.floor(deltaTime / week) > 1 ? 's' : '') :
        deltaTime > day ? Math.floor(deltaTime / day) + ' day' + (Math.floor(deltaTime / day) > 1 ? 's' : '') :
          deltaTime > hour ? Math.floor(deltaTime / hour) + ' hour' + (Math.floor(deltaTime / hour) > 1 ? 's' : '') :
            Math.floor(deltaTime / minute) + ' minute' + (Math.floor(deltaTime / minute) > 1 ? 's' : '');

  };

  useEffect(() => {
    if (timeRef.current)
      timeRef.current.innerHTML = chatInfo && chatInfo.messages.length > 0 ? getTime(chatInfo.messages[0]) : '';
    const interval = setInterval(() => {
      if (timeRef.current)
        timeRef.current.innerHTML = chatInfo && chatInfo.messages.length > 0 ? getTime(chatInfo.messages[0]) : '';
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [socket, chatInfo?.messages]);

  const handleSeen = () => {
    unseenRef.current = false;
    localStorage.setItem(`unseen_${props.name}`, JSON.stringify(false));
    // setUnseen(false);
  };

  const renderLastMess = (lastMessage: LastMessage) => {
    const mes = languageUtil.base64ToUtf8(lastMessage.mes);
    const isURL = isValidURL(mes);
    const cloudinaryURL = isURL ? isCloudinaryURL(mes) : null;
    const isImage = cloudinaryURL?.isImage;
    const isVideo = cloudinaryURL?.isVideo;
    const sender =
      lastMessage.name === user.username ? 'You: ' : lastMessage.type === 1 ? `${lastMessage.name}: ` : '';
    const message = isURL ? isImage ? 'Send image ' : isVideo ? 'Send video ' : mes : languageUtil.base64ToUtf8(mes);

    return (
      <p className={clsx('overflow-hidden text-ellipsis whitespace-nowrap', { 'font-bold': unseenRef.current })}>
        <span>{sender + message}</span>
        {isImage && <CiImageOn className="ml-1 size-4 inline" />}
        {isVideo && <CiVideoOn className="ml-1 size-4 inline" />}
      </p>
    );
  };

  return (
    <>
      <Toaster position={'top-center'} />
      <NavLink
        to={`/${props.type}/${props.name}`}
        key={props.name}
        onClick={handleSeen}
        className={clsx(
          'flex items-center gap-2 py-3 px-2 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer',
          props.name === name ? 'bg-slate-200 ' : '',
        )}
      >
        <div className={''}>
          <Avatar type={props.type} width={40} height={40} name={props.name} />
        </div>
        <div className={'min-w-0'}>
          <h3
            className={clsx(
              'text-ellipsis line-clamp-1 text-base whitespace-nowrap',
              { 'font-normal': !unseenRef.current },
              { 'font-bold': unseenRef.current },
            )}
          >
            {props.name}
          </h3>

          <div className="text-slate-500 text-xs items-center gap-1">
            {
              chatInfo && chatInfo.messages.length > 0 && renderLastMess({ ...chatInfo.messages[0] })
            }
          </div>
        </div>

        <div className="flex flex-col ml-auto">
          <p className="text-xs mb-1.5 font-normal w-max text-right" ref={timeRef}>
          </p>
          <span className={clsx('w-2 h-2 flex justify-center items-center ml-auto bg-red-600 rounded-full ',
            { invisible: !unseenRef.current })}></span>
        </div>
      </NavLink>
    </>
  );
};

export default SideBarItem;