import React, {useState} from 'react'
import {IoChatbubbleEllipses} from "react-icons/io5";
import {NavLink} from "react-router-dom";
import clsx from "clsx";
import {FaUserPlus} from "react-icons/fa";
import {BiLogOut} from "react-icons/bi";
import Avatar from "../../component/Avatar";
import {useSelector} from "react-redux";
import {userSelector} from '../../redux/selector';
import {UserState} from '../../redux/userSlice';
import ChatItem from "../../component/ChatItem";

const Sidebar = () => {
    const user: UserState = useSelector(userSelector);
    const [allUsers, setAllUsers] = useState([1, 2, 3, 4, 5]);

    return (
        <div className='w-full h-full grid grid-cols-[48px,1fr] bg-white'>
            <div
                className='bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600 flex flex-col justify-between'>
                <div>
                    <NavLink
                        to=""
                        title="Chat"
                        className={({isActive}) =>
                            clsx(
                                'w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded',
                                {'bg-slate-200': isActive}
                            )
                        }
                    >
                        <IoChatbubbleEllipses size={25}/>
                    </NavLink>

                    <div title="Add friend"
                         className={
                             `w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded`}
                    >
                        <FaUserPlus size={25}/>
                    </div>
                </div>

                <div className='flex flex-col items-center'>
                    <button className='mx-auto' title={user.username}>
                        <Avatar
                            width={40}
                            height={40}
                            username={user?.username}
                            imageUrl={null}
                        />
                    </button>
                    <button
                        title="Logout"
                        className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded'>
                            <span className='-ml-2'>
                                <BiLogOut size={25}/>
                            </span>
                    </button>
                </div>
            </div>

            <div className='w-full'>
                <div className='h-16 flex items-center py-0.5'>
                    <h2 className='text-xl font-bold p-4 text-slate-800 '>Message</h2>
                </div>
                <div className='bg-slate-200 p-[0.5px] mt-1'></div>

                <div className='h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar'>
                    {
                        allUsers.length === 0 && (
                            <p className='text-lg text-center text-slate-400 pt-5'>Explore users to start a conversation
                                with.</p>
                        )
                    }
                    {
                        // Map over allUsers array
                        allUsers
                            .map((conv, index) => ({
                                // For each user, create an object with username, unseenMessNumber, and lastMessage properties
                                username: index + "",
                                // If the index is even, unseenMessNumber is set to 2, otherwise it's set to 0
                                unseenMessNumber: index % 2 == 0 ? 2 : 0,
                                // Set a default lastMessage for each user
                                lastMessage: "Learn to build a real-time messaging Chat App using React"
                            }))
                            // Sort the array of user objects based on unseenMessNumber property
                            // Users with higher unseenMessNumber will come first
                            .sort((a, b) => (b.unseenMessNumber || 0) - (a.unseenMessNumber || 0))
                            // Map over the sorted array and create a ChatItem component for each user
                            .map((user) => <ChatItem {...user} />)
                    }
                </div>
            </div>
        </div>
    )
}

export default Sidebar;