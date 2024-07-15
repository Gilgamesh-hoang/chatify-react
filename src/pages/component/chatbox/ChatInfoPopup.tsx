import React, { useState } from 'react';
import { IoChatbubbleEllipses, IoClose } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { chatDataSelector, userSelector } from '~/redux/selector';
import Avatar from '~/component/Avatar';
import ChatUserCard from '~/pages/component/chatbox/ChatUserCard';
import { MdRunningWithErrors } from 'react-icons/md';
import { FaUserPlus } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import AddUser from '~/pages/component/AddUser';

interface InfoProps {
  type: 0 | 1,
  name: string,
  room_owner?: string,
  room_member?: string[],
  onClose: () => void,
}

const ChatInfoPopup: React.FC<InfoProps> = (props) => {
  const { name } = useParams()

  const user = useSelector(userSelector);
  const chatData = useSelector(chatDataSelector);
  const navigate = useNavigate();

  const chatUserList = chatData.userList.filter((chatInfo) => chatInfo.type === 0 && chatInfo.name !== user.username);
  const chatUsernameList = chatUserList.map((chatInfo) => chatInfo.name);
  const relatedRoomChat = chatData.userList.filter((chatInfo) => chatInfo.type === 1 && (chatInfo.room_member?.indexOf(props.name)! >= 0 || chatInfo.room_owner === props.name));

  const chatUserExist = chatUsernameList.indexOf(props.name) >= 0
  const [addUser, setAddUser] = useState(false)
  const showAddUser = () => setAddUser(true)
  const hideAddUser = () => setAddUser(false)

  const handleClick = () => {
    if (chatUserExist) {
      props.onClose()
      navigate(`/${props.type}/${encodeURIComponent(props.name)}`);
    }
    else  {
      showAddUser();
    }
  };
  console.log(props.room_owner, props.room_member);
  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 p-2 z-10 flex items-center justify-center ">
      <div className="w-full h-5/6 max-h-[500px] max-w-[70%] p-5 bg-white rounded-sm flex flex-col gap-4">
        <div className="flex">
          <p className="text-lg lg:text-xl">{props.type === 1 ? "Room Info" : "User Info"}</p>
          <button className="ml-auto text-2xl lg:text-4xl hover:text-primary" onClick={props.onClose}>
            <IoClose />
          </button>
        </div>
        {/*header*/}
        <div className="flex items-center">
          <Avatar type={props.type} name={props.name} width={60} height={60} />
          <div className="pl-5 ">
            <p className="text-xl">{props.name}</p>
            <p className="text-slate-500 text-md">{props.type === 1 ? 'Room' : 'User'}</p>
          </div>
          {
            props.name !== name && props.name !== user.username && (<div className="ml-auto">
            <button className="border shadow rounded p-2" onClick={handleClick}>
              {chatUsernameList ? <IoChatbubbleEllipses /> : props.type === 0 && <FaUserPlus />}
            </button>
          </div>)
          }
        </div>
        <hr />
        {/*body*/}
        <div className="w-full h-full overflow-y-auto flex flex-col gap-2">
          {/*Room owner */}
          {
            props.type === 1 && props.room_owner && (<>
              <span>Room owner</span>
              <ChatUserCard name={props.room_owner} type={0}
                            hideFunc={props.onClose}
                            isExist={chatUsernameList.indexOf(props.room_owner) >= 0}
                            isRoomOwner={true} />
            </>)
          }
          {/*Members title OR Related chat title*/}
          {
            props.type === 1 ? <span>Members info ({props.room_member?.length})</span> : <span>Related room chat ({relatedRoomChat.length})</span>
          }
          <div className="relative ">
            <div className="sm:grid sm:grid-cols-2 lg:grid-cols-3">
              {
                props.type === 1
                  ? props.room_member?.map((memberName, index) =>
                    <ChatUserCard key={index} name={memberName} type={0} hideFunc={props.onClose}
                                  isExist={chatUsernameList.indexOf(memberName) >= 0} />)
                  : relatedRoomChat.map((chatInfo, index) =>
                    <ChatUserCard key={index} name={chatInfo.name} type={1} hideFunc={props.onClose}
                                  memberSize={chatInfo.room_member?.length} isExist={true} />)
              }
            </div>
            {
              props.type === 0 && relatedRoomChat.length === 0 &&
              <div
                className="flex flex-col items-center h-full text-slate-400">
                <MdRunningWithErrors size={70} />
                <span>No related room chat founded!</span>
              </div>
            }
            {
              props.type === 1 && props.room_member?.length === 0 &&
              <div
                className=" h-full flex flex-col items-center text-slate-400">
                <MdRunningWithErrors size={70} />
                <span>No other members founded in room chat!</span>
              </div>
            }
          </div>
          {
            props.type === 0 && user.username === props.name &&
            (
              <>
                <span>User chat ({chatUsernameList.length})</span>
                <div className=" ">
                  <div className="sm:grid sm:grid-cols-2 lg:grid-cols-3">
                    {
                      chatUserList.map((chatInfo, index) =>
                        <ChatUserCard key={index} name={chatInfo.name} type={0}
                                      hideFunc={props.onClose} isExist={true} />)
                    }
                  </div>
                  {
                    chatUserList.length === 0 &&
                    <div
                      className=" h-full flex flex-col items-center text-slate-400">
                      <MdRunningWithErrors size={70} />
                      <span>You currently have no user to chat!</span>
                    </div>
                  }
                </div>
              </>
            )
          }
        </div>

      </div>
      {addUser && <AddUser username={props.name} onClose={hideAddUser} />}
    </div>
  );
};

export default React.memo(ChatInfoPopup);
