import React from 'react';
import { IoChatbubbleEllipses, IoInformationCircle } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { chatDataSelector } from '~/redux/selector';
import { FaUserPlus } from 'react-icons/fa';


const ChatUserMenu: React.FC<{
  userName: string, onClose: () => void, onInfoClick: () => void, onAddUser: () => void,
}> = ({ userName, onClose, onInfoClick, onAddUser }) => {
  const chatData = useSelector(chatDataSelector);
  const chatUserListFunc = () => {
    const result: string[] = [];
    chatData.userList.forEach((chatInfo) => {
      if (chatInfo.type === 0) result.push(chatInfo.name);
    });
    return result;
  };
  const chatUserList = chatUserListFunc();
  const chatUserExist = chatUserList.indexOf(userName) >= 0;
  const navigate = useNavigate();

  const handleInfoClick = () => {
    onClose();
    onInfoClick();
  };

  const handleSendClick = () => {
    onClose();
    if (chatUserExist)
      navigate(`/0/${userName}`);
    else
      onAddUser();
  };

  return (
    <div className="flex flex-col py-1">
      <span className="pl-1">{userName}</span>
      <hr className="my-1" />
      <button className="flex items-center mx-1 p-1 px-2 hover:bg-secondary" onClick={handleInfoClick}>
        <IoInformationCircle /><span className="pl-1">Check user information</span></button>

      <button className="flex items-center mx-1 p-1 px-2 hover:bg-secondary" onClick={handleSendClick}>
        {chatUserExist
          ? (<><IoChatbubbleEllipses /><span className="pl-1">Open chat message</span></>)
          : (<><FaUserPlus /><span className="pl-1">Add user</span></>)}

      </button>

    </div>
  );
};
export default ChatUserMenu;