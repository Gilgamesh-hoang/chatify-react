import { NavLink, useNavigate, useNavigation } from 'react-router-dom';
import clsx from "clsx";
import {IoChatbubbleEllipses} from "react-icons/io5";
import {FaUserPlus} from "react-icons/fa";
import Avatar from "~/component/Avatar";
import {BiLogOut} from "react-icons/bi";
import React from "react";

interface NavSideBarProps {
    name: string;
}

const NavSideBar : React.FC<NavSideBarProps> = ({name}) => {
    const handleLogout = () => {
        localStorage.clear();
        window.location.reload();
    }
    return (
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
                <button className='mx-auto' title={name}>
                    <Avatar
                        type={0}
                        width={40}
                        height={40}
                        name={name}
                    />
                </button>
                <button
                    title="Logout"
                    className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded'
                    onClick={handleLogout}
                    >
                            <span className='-ml-2'>
                                <BiLogOut  size={25}/>
                            </span>
                </button>
            </div>
        </div>
    );
}

export default React.memo(NavSideBar);