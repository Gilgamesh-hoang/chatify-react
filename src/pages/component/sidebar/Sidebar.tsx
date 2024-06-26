import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { chatDataSelector, socketSelector, socketStatusSelector, userSelector } from '~/redux/selector';
import {UserState} from '~/redux/userSlice';
import {SideBarItem} from '~/pages/component/sidebar';
import NavSideBar from '~/pages/component/NavSideBar';
import {SocketEvent} from '~/model/SocketEvent';
import {SideBarProp} from '~/model/SideBarProp';
import {AppDispatch} from '~/redux/store';
import {socketSendMessage} from '~/redux/socketSlice';
import {useParams} from 'react-router-dom';
import { ChatInfo, Message, setChatDataUsers, setUpdateNewMessage } from '~/redux/chatDataSlice';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const {type, name} = useParams();
  const user: UserState = useSelector(userSelector);
  const chatData = useSelector(chatDataSelector);
  const userName = user.username;
  // const socket = useSelector(socketSelector);
  const socket = useSelector(socketSelector);
  const statusSocket = useSelector(socketStatusSelector);
  const dispatch = useDispatch<AppDispatch>();
  const getUserParams: SocketEvent = {
    action: 'onchat',
    data: {
      event: 'GET_USER_LIST',
    },
  };

  useEffect(() => {
    if (socket && statusSocket === 'open' && userName) {
      socket.onmessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        // I wanted to reload sidebar item, but it's glitching so not yet
        if (data.event === 'SEND_CHAT' && data.status === 'success') {
          console.log(data.data)
          dispatch(setUpdateNewMessage({ type: 'received', message: { ...data.data, createAt:new Date(Date.now() - 7 * 3600 * 1000) } }));
        }
        else if (data.event === 'GET_USER_LIST' && data.status === 'success') {
          const conversationUserData: ChatInfo[] = [];
          data.data.forEach((conv: any) => {
            if (conv.name != userName) {
              let sideBarProp: ChatInfo = {
                type: conv.type,
                name: conv.name,
                messages: [],
                online: false,
                profile_pic: '',
                moreMessage: false,
                offset: 0,
                page: 1,
              };
              conversationUserData.push(sideBarProp);
            }
          });
          console.log('conversationUserData', conversationUserData);
          dispatch(setChatDataUsers(conversationUserData));
        }
      };
      // socket.send(JSON.stringify(getUserParams))
      dispatch(socketSendMessage(getUserParams));
    }
  }, [socket, userName, statusSocket]);

  return (
      <div className="w-full h-full grid grid-cols-[48px,1fr] lg:grid-cols-[48px,322px] bg-white">
        <NavSideBar name={user.username} />

        <div className="w-full">
          <div className="h-16 flex items-center py-0.5">
            <h2 className="text-xl font-bold p-4 text-slate-800 ">Message</h2>
          </div>
          <div className="bg-slate-200 p-[0.5px] mt-1"></div>

          <div className="h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar">
            {chatData.userList.length === 0 && (
                <p className="text-lg text-center text-slate-400 pt-5">
                  Explore users to start a conversation with.
                </p>
            )}
            {chatData.userList && chatData.userList.map((user, index) => (
                <SideBarItem key={index} type={user.type === 1 ? 1 : 0} name={user.name} actionTime={new Date()} unseen={false} />
            ))}
          </div>
        </div>
      </div>
  );
};

export default Sidebar;