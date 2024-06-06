import React, {useEffect, useState} from 'react'
import {useSelector} from "react-redux";
import {socketSelector, userSelector} from '~/redux/selector';
import {UserState} from '~/redux/userSlice';
import {SideBarItem} from "~/pages/component/sidebar";
import NavSideBar from "~/pages/component/NavSideBar";
import {SocketEvent} from "~/model/SocketEvent";
import {SideBarProp} from "~/model/SideBarProp";

const Sidebar = () => {
    const userName = localStorage.getItem('userName');
    const user: UserState = useSelector(userSelector);
    const [allUsers, setAllUsers] = useState<SideBarProp[]>([]);
    const socket = useSelector(socketSelector);

    const getUserParams: SocketEvent = {
        action: 'onchat',
        data: {
            event: "GET_USER_LIST",
        }
    }

    useEffect(() => {
        if (socket) {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify(getUserParams));
            }

            socket.onmessage = (event: MessageEvent) => {
                const data = JSON.parse(event.data);
                if (data.event === "GET_USER_LIST" && data.status === "success") {

                    const conversationUserData = data.data.filter((conv: any) => {
                        if (conv.name != userName) {
                            let sideBarProp: SideBarProp = {
                                type: conv.type,
                                name: conv.name,
                                unseen: false,
                                actionTime: new Date()
                            }
                            return sideBarProp;
                        }
                    });
                    setAllUsers(conversationUserData);
                }
            }
        } else
            console.log("socket is not connected");
        // eslint-disable-next-line
    }, [socket]);


    return (
        <div className='w-full h-full grid grid-cols-[48px,1fr] bg-white'>
            <NavSideBar name={user.username}/>

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
                        allUsers
                            .map((user, index) => <SideBarItem key={index} {...user} />)
                    }
                </div>
            </div>
        </div>
    )
}

export default Sidebar;