import React, {useState} from 'react'
import {useSelector} from "react-redux";
import {userSelector} from '../../redux/selector';
import {UserState} from '../../redux/userSlice';
import ChatItem from "../../component/ChatItem";
import NavSideBar from "../component/NavSideBar";

const Sidebar = () => {
    const user: UserState = useSelector(userSelector);
    const [allUsers, setAllUsers] = useState([1, 2, 3, 4, 5]);

    return (
        <div className='w-full h-full grid grid-cols-[48px,1fr] bg-white'>
            <NavSideBar name={user.username} />

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

                    {/*test*/}
                    {
                        allUsers
                            .map((conv, index) => ({
                                type: "user",
                                name: index + "",
                                unseen: index % 2 == 0,
                                lastMessage: "Learn to build a real-time messaging Chat App using React",
                                actionTime: new Date(Date.now() - (index * 1000000))
                            }))
                            .sort((a, b) => (b.actionTime.getTime() > a.actionTime.getTime() ? 1 : -1))
                            .map((user) => <ChatItem {...user} />)
                    }
                    <ChatItem type='room' actionTime={new Date(new Date().setFullYear(2024, 2, 1))} name="room"
                              unseen={true} lastMessage={"iaubg uahra huirb aigbrior g"}/>
                    {/*end test*/}
                </div>
            </div>
        </div>
    )
}

export default Sidebar;