import Avatar from "./Avatar";
import clsx from "clsx";
import {NavLink} from "react-router-dom";
import React from "react";

interface ChatItemProps {
    type: string;
    name: string;
    unseen: boolean;
    lastMessage: string;
    actionTime: Date;
}

const ChatItem: React.FC<ChatItemProps> = ({type, name, unseen, lastMessage, actionTime}) => {

    let time: string = "";
    const currentDate = new Date();
    const sameDay = actionTime.getDate() === currentDate.getDate();
    const sameYear = actionTime.getFullYear() === currentDate.getFullYear();

    time =
        sameDay
            // ...and if the current hour and the action time's hour are the same...
            ? currentDate.getHours() - actionTime.getHours() === 0
                // ...then set 'time' to the difference in minutes between the current time and the action time,
                ? (currentDate.getMinutes() - actionTime.getMinutes()) + " min"
                // ...otherwise, set 'time' to the difference in hours between the current time and the action time,
                // Note: +7 is added to account for the timezone difference between UTC and GMT+7.
                : (currentDate.getHours() - actionTime.getHours() + 7) + " hour"
            : sameYear
                //set 'time' to the action time's date and month.
                ? actionTime.getDate() + "/" + actionTime.getMonth()
                // ...otherwise, set 'time' to the action time's month and year.
                : actionTime.getMonth() + "/" + actionTime.getFullYear();

    return (
        <NavLink to={""} key={name}
                 className='flex items-center gap-2 py-3 px-2 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer'>
            <div>
                <Avatar
                    type={type}
                    width={40}
                    height={40}
                    name={name}
                />
            </div>
            <div>
                <h3 className={clsx('text-ellipsis line-clamp-1 text-base',
                    {'font-normal': !unseen},
                    {'font-bold': unseen})}
                >
                    {name}
                </h3>

                <div className='text-slate-500 text-xs flex items-center gap-1'>
                    {/*last message*/}
                    <p className={clsx('text-ellipsis line-clamp-1 text-gray-950',
                        {'font-bold': unseen})}
                    >{lastMessage} </p>
                </div>

            </div>

            {/*unseenMsg*/}
            <div className='flex flex-col ml-auto'>
                <p className='text-xs mb-1.5 font-normal w-max text-right'>{time}</p>
                <span className={clsx('w-2 h-2 flex justify-center items-center ml-auto bg-red-600 rounded-full ',
                    {'invisible': !unseen})}>
                </span>
            </div>
        </NavLink>
    );
};

export default ChatItem;