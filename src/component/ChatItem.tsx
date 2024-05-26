import Avatar from "./Avatar";
import clsx from "clsx";
import {NavLink} from "react-router-dom";
import React from "react";

interface ChatItemProps {
    username: string;
    unseenMessNumber: number | null;
    lastMessage: string;
}

const ChatItem: React.FC<ChatItemProps> = ({username, unseenMessNumber, lastMessage}) => {
    return (
        <NavLink to={""} key={username}
                 className='flex items-center gap-2 py-3 px-2 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer'>
            <div>
                <Avatar
                    width={40}
                    height={40}
                    username={username}
                    imageUrl={null}
                />
            </div>
            <div>
                <h3 className={clsx('text-ellipsis line-clamp-1 text-base',
                    {'font-normal': !unseenMessNumber},
                    {'font-bold': unseenMessNumber})}
                >username</h3>
                <div className='text-slate-500 text-xs flex items-center gap-1'>
                    {/*last message*/}
                    <p className={clsx('text-ellipsis line-clamp-1 text-gray-950',
                        {'font-bold': unseenMessNumber})}
                    >{lastMessage} </p>
                </div>
            </div>

            {/*unseenMsg*/}
            { Boolean(unseenMessNumber)&&
                <p className='text-xs w-6 h-6 flex justify-center items-center ml-auto p-1.5 bg-primary text-white font-semibold rounded-full'>{unseenMessNumber}</p>
            }
        </NavLink>
    );
};

export default ChatItem;