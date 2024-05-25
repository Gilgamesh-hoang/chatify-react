import React from 'react'
import {IoChatbubbleEllipses} from "react-icons/io5";
import {NavLink} from "react-router-dom";
import clsx from "clsx";
import {FaUserPlus} from "react-icons/fa";
import {BiLogOut} from "react-icons/bi";
import Avatar from "../../component/Avatar";
import {useSelector} from "react-redux";
import {userSelector} from '../../redux/selector';
import {UserState} from '../../redux/userSlice';

const Sidebar = () => {
    const user: UserState = useSelector(userSelector);

    return (
        <div className='w-full h-full'>
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

                    <NavLink
                        to=''
                        title="Add friend"
                        className={
                            `w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded`}
                    >
                        <FaUserPlus size={25}/>
                    </NavLink>
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
        </div>
    )
}

export default Sidebar