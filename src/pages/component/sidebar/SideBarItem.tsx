import Avatar from '~/component/Avatar';
import clsx from 'clsx';
import { Link, NavLink, useNavigate, useNavigation, useParams } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import { SideBarProp } from '~/model/SideBarProp';
import { useDispatch, useSelector } from 'react-redux';
import { socketSelector, socketStatusSelector, userSelector } from '~/redux/selector';
import { SocketEvent } from '~/model/SocketEvent';
import toast, { Toaster } from 'react-hot-toast';
import { Message } from '~/redux/currentChatSlice';

interface ClientMessage {
  name: string,
  type: 0 | 1,
  to: string,
  mes: { text: string, imageUrl: string, videoUrl: string },
  createAt: Date,
}

const SideBarItem: React.FC<SideBarProp> = (props) => {
  const { name } = useParams();
  const user = useSelector(userSelector);
  const userName: string | null = localStorage.getItem('userName');
  // const socket: WebSocket | null = useSelector((state: RootState) => state.app.socket.socket);
  //get socket from redux
  const socket: WebSocket | null = useSelector(socketSelector);
  const [lastMessage, setLastMessage] = useState<ClientMessage | null>(null);
  const unseenRef = useRef<boolean>(
    JSON.parse(localStorage.getItem(`unseen_${props.name}`) || 'false'));
  const timeElement = useRef<HTMLParagraphElement | null>(null);

  // const [unseen, setUnseen] = useState<boolean>(unseenRef.current);

  //custom translate ascii-readable to unicode
  const fromAscii = (text: string) => {
    return text.replace(/&#(\d+);/gm, (substring) => {
      let code = substring.substring(2, substring.length - 1);
      return String.fromCharCode(parseInt(code));
    });
  };

  useEffect(() => {
    localStorage.setItem(`unseen_${props.name}`, JSON.stringify(unseenRef.current));
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

  // This effect runs when the `socket` or `lastMessage` changes.
  useEffect(() => {
    // Define the handler for the 'message' event.
    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      if (!(data.event === 'GET_PEOPLE_CHAT_MES' || data.event === 'GET_ROOM_CHAT_MES')) return;
      if (data.status === 'success') {
        // Filter the messages for the current user.
        let messages = [];
        if (data.event === 'GET_ROOM_CHAT_MES')
            messages = data.data.chatData.filter((message: Message) => message.to === props.name);
        else {
          messages = data.data.filter((message: Message) =>
            (message.to === userName && message.name === props.name) || (message.name === userName && message.to === props.name));
        }
        // console.log(props.name, messages)

        // Check if there are any messages.
        if (messages.length > 0) {
          // Get the first message.
          const lastMessage = messages[0];
          // Update the `lastMessage` state.
          let messageData;
          try {
            messageData = JSON.parse(lastMessage.mes);
          } catch (e) {
            messageData = { 'text': lastMessage.mes };
          }
          messageData.text = fromAscii(messageData.text);
          setLastMessage({ ...lastMessage, createAt: new Date(lastMessage.createAt), mes: messageData });
          // Check if the message is for the current user and it's unseen.
          if (lastMessage?.to === userName && !unseenRef.current) {
            // Mark the message as seen.
            unseenRef.current =  true;
            // Update the unseen status in localStorage.
            localStorage.setItem(`unseen_${props.name}`, 'true');
          }
        }
      } else if (data.status === 'error') {
        toast.error('Error when get message', { duration: 2000 });
      }
    };

    const handleReceivedNewMessage = (evt: MessageEvent) => {
      const response = JSON.parse(evt.data);
      if (!(response.event === 'SEND_CHAT')) return;
      if (response.status === 'success') {
        console.log(response.data);
        if (props.name === response.data.name) {
          const date = new Date(Date.now() - 7 * 3600 * 1000);
          let messageData;
          try {
            messageData = JSON.parse(response.data.mes);
          } catch (e) {
            messageData = { 'text': response.data.mes };
          }
          messageData.text = fromAscii(messageData.text);
          setLastMessage({ ...response.data, createAt: date, mes: messageData });
          // Check if the message is for the current user and it's unseen.
          if (lastMessage?.to === userName && !unseenRef.current) {
            // Mark the message as seen.
            unseenRef.current = true;
            // Update the unseen status in localStorage.
            localStorage.setItem(`unseen_${props.name}`, JSON.stringify('true'));
          }
          if (lastMessage?.name === props.name && name! === props.name) {
            handleSeen()
          }
        }
      }
    };


    let timeout: NodeJS.Timeout;
    if (socket) {
      // Add the 'message' event listener and send the "GET_PEOPLE_CHAT_MES" event after 1 second.
      socket.addEventListener('message', handleMessage);
      socket.addEventListener('message', handleReceivedNewMessage);
      timeout = setTimeout(() => {
        socket.send(JSON.stringify(getMessParams));
      }, 1000);
    }
    // Remove the 'message' event listener when the component unmounts.
    return () => {
      socket.removeEventListener('message', handleMessage);
      socket.removeEventListener('message', handleReceivedNewMessage);
      clearTimeout(timeout);
    };
  }, [socket]);

  useEffect(() => {
    const interval: NodeJS.Timer = setInterval(() => {
      timeElement.current!.textContent = lastMessage ? getTime(lastMessage) : 'loading';
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [lastMessage]);


  const getTime = (message: ClientMessage): string => {
    const TIMEZONE_OFFSET = 7; // GMT+7
    const currentDate = new Date();
    // console.log('lastMessage.createAt', lastMessage?.createAt)
    const sameDay = message.createAt.getDate() === currentDate.getDate();
    const sameYear = message.createAt.getFullYear() === currentDate.getFullYear();

    return sameDay
      // ...and if the current hour and the action time's hour are the same...
      ? currentDate.getHours() - TIMEZONE_OFFSET - message.createAt.getHours() === 0
        // ...then set 'time' to the difference in minutes between the current time and the action time,
        ? (currentDate.getMinutes() - message.createAt.getMinutes()) + ' min'
        // ...otherwise, set 'time' to the difference in hours between the current time and the action time,
        : (currentDate.getHours() - TIMEZONE_OFFSET - message.createAt.getHours()) + ' hour'
      : sameYear
        //set 'time' to the action time's date and month.
        ? message.createAt.getDate() + '/' + message.createAt.getMonth()
        // ...otherwise, set 'time' to the action time's month and year.
        : message.createAt.getMonth() + '/' + message.createAt.getFullYear();
  };

  const handleSeen = () => {
    unseenRef.current = false;
    localStorage.setItem(`unseen_${props.name}`, JSON.stringify(false));
    // setUnseen(false);
  };

  return (
    <>
      <Toaster position={'top-center'} />
      <NavLink to={`/${props.type}/${props.name}`} key={props.name}
               onClick={handleSeen}
               className=
                 {clsx('flex items-center gap-2 py-3 px-2 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer',
                   props.name === name ? 'bg-slate-200 ' : '', 'lg:max-w-[322px]')}>
        <div>
          <Avatar
            type={props.type}
            width={40}
            height={40}
            name={props.name}
          />
        </div>
        <div className={'max-w-[180px]'}>
          <h3 className={clsx('text-ellipsis line-clamp-1 text-base',
            { 'font-normal': !unseenRef.current },
            { 'font-bold': unseenRef.current })}
          >
            {props.name}
          </h3>

          <div className="text-slate-500 text-xs flex items-center gap-1 ">
            <p className={clsx('line-clamp-1 text-ellipsis text-gray-950 whitespace-nowrap ',
              { 'font-bold': unseenRef.current })}
            >
              {
                lastMessage ? (lastMessage.name === userName ? 'You: ' : (lastMessage.type === 0 ? '' :lastMessage.name + ': ')) + lastMessage.mes.text : ''
              }
            </p>
          </div>

        </div>

        <div className="flex flex-col ml-auto">
          <p className="text-xs mb-1.5 font-normal w-max text-right" ref={timeElement}></p>
          <span className={clsx('w-2 h-2 flex justify-center items-center ml-auto bg-red-600 rounded-full ',
            { 'invisible': !unseenRef.current })}></span>
        </div>
      </NavLink>
    </>
  );
};

export default SideBarItem;