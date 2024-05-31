import Avatar from "~/component/Avatar";
import clsx from "clsx";
import {NavLink} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import {SideBarProp} from "~/model/SideBarProp";
import {useSelector} from "react-redux";
import {socketSelector, userSelector} from "~/redux/selector";
import {SocketEvent} from "~/model/SocketEvent";
import toast, {Toaster} from "react-hot-toast";


interface LastMessage {
    mes: string;
    createAt: Date;
    name: string;
    to: string;
    type: number;
}

const SideBarItem: React.FC<SideBarProp> = (props) => {
    const user = useSelector(userSelector);
    const userName: string | null = localStorage.getItem('userName');
    const socket: WebSocket = useSelector(socketSelector);
    const [lastMessage, setLastMessage] = useState<LastMessage | null>(null);

    const unseenRef = useRef<boolean>(
        JSON.parse(localStorage.getItem(`unseen_${props.name}`) || 'false'));

    // const [unseen, setUnseen] = useState<boolean>(unseenRef.current);

    useEffect(() => {
        localStorage.setItem(`unseen_${props.name}`, JSON.stringify(unseenRef.current));
    }, [unseenRef.current]);

    // This effect runs when the `socket` or `lastMessage` changes.
    useEffect(() => {
        if (socket) {
            const getMessParams: SocketEvent = {
                action: "onchat",
                data: {
                    event: "GET_PEOPLE_CHAT_MES",
                    data: {
                        name: props.name,
                        page: 1
                    }
                }
            };

            // Define the handler for the 'message' event.
            const handleMessage = (event: MessageEvent) => {
                const data = JSON.parse(event.data);
                if (data.event === "GET_PEOPLE_CHAT_MES" && data.status === "success") {
                    // Filter the messages for the current user.
                    const messages = data.data.filter((message: LastMessage) => message.name === props.name || message.to === props.name);
                    // Check if there are any messages.
                    if (messages.length > 0) {
                        // Get the first message.
                        const lastMessage = messages[0];
                        // Update the `lastMessage` state.
                        setLastMessage({
                            ...lastMessage,
                            createAt: new Date(lastMessage.createAt)
                        });

                        // Check if the message is for the current user and it's unseen.
                        if (lastMessage.to === userName && !unseenRef.current) {
                            // Mark the message as seen.
                            unseenRef.current = true;
                            // Update the unseen status in localStorage.
                            localStorage.setItem(`unseen_${props.name}`, JSON.stringify(true));
                        }
                    }
                } else if (data.event === "GET_PEOPLE_CHAT_MES" && data.status === "error") {
                    toast.error('Error when get message', {duration: 2000});
                }
            };

            // Add the 'message' event listener and send the "GET_PEOPLE_CHAT_MES" event after 1 second.
            setTimeout(() => {
                socket.addEventListener('message', handleMessage);
                socket.send(JSON.stringify(getMessParams));

                // Remove the 'message' event listener when the component unmounts.
                return () => {
                    socket.removeEventListener('message', handleMessage);
                };

            }, 1000);
        }
    }, [socket]);

    const getTime = (message: LastMessage): string => {
        const currentDate = new Date();
        const TIMEZONE_OFFSET = 7; // GMT+7
        // console.log('lastMessage.createAt', lastMessage.createAt)
        const sameDay = message.createAt.getDate() === currentDate.getDate();
        const sameYear = message.createAt.getFullYear() === currentDate.getFullYear();

        return sameDay
            // ...and if the current hour and the action time's hour are the same...
            ? currentDate.getHours() - TIMEZONE_OFFSET - message.createAt.getHours() === 0
                // ...then set 'time' to the difference in minutes between the current time and the action time,
                ? (currentDate.getMinutes() - message.createAt.getMinutes()) + " min"
                // ...otherwise, set 'time' to the difference in hours between the current time and the action time,
                : (currentDate.getHours() - TIMEZONE_OFFSET - message.createAt.getHours()) + " hour"
            : sameYear
                //set 'time' to the action time's date and month.
                ? message.createAt.getDate() + "/" + message.createAt.getMonth()
                // ...otherwise, set 'time' to the action time's month and year.
                : message.createAt.getMonth() + "/" + message.createAt.getFullYear();
    }

    const handleSeen = () => {
        unseenRef.current = false;
        localStorage.setItem(`unseen_${props.name}`, JSON.stringify(false));
        // setUnseen(false);
    };

    return (
        <>
            <Toaster position={"top-center"}/>
            <NavLink to={``} key={props.name}
                     onClick={handleSeen}
                     className='flex items-center gap-2 py-3 px-2 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer'>
                <div>
                    <Avatar
                        type={props.type}
                        width={40}
                        height={40}
                        name={props.name}
                    />
                </div>
                <div>
                    <h3 className={clsx('text-ellipsis line-clamp-1 text-base',
                        {'font-normal': !unseenRef.current},
                        {'font-bold': unseenRef.current})}
                    >
                        {props.name}
                    </h3>

                    <div className='text-slate-500 text-xs flex items-center gap-1'>
                        <p className={clsx('text-ellipsis line-clamp-1 text-gray-950',
                            {'font-bold': unseenRef.current})}
                        >
                            {
                                lastMessage ? (lastMessage.name === userName ? 'You: ' : '') + lastMessage.mes : ''
                            }
                        </p>
                    </div>

                </div>

                <div className='flex flex-col ml-auto'>
                    <p className='text-xs mb-1.5 font-normal w-max text-right'>
                        {lastMessage ? getTime(lastMessage) : ''}
                    </p>
                    <span className={clsx('w-2 h-2 flex justify-center items-center ml-auto bg-red-600 rounded-full ',
                        {'invisible': !unseenRef.current})}>
                    </span>
                </div>
            </NavLink>
        </>
    );
};

export default SideBarItem;