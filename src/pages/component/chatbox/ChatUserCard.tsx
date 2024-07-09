import React, { useState } from 'react';
import Avatar from '~/component/Avatar';
import { useSelector } from 'react-redux';
import { userSelector } from '~/redux/selector';
import { useNavigate } from 'react-router-dom';
import { IoChatbubbleEllipses } from 'react-icons/io5';
import { FaUserPlus } from 'react-icons/fa';
import AddUser from '~/pages/component/AddUser';

interface ChatUserCardData {
  name: string;
  type: 0 | 1;
  memberSize?: number;
  isExist: boolean;
  isRoomOwner?: boolean;
  hideFunc: () => void;
}

const ChatUserCard: React.FC<ChatUserCardData> = ({ name, type, memberSize, isExist, isRoomOwner, hideFunc }) => {
  const user = useSelector(userSelector);
  const navigate = useNavigate();
  const [addUser, setAddUser] = useState(false);

  const handleClick = () => {
    if (isExist) {
      hideFunc();
      navigate(`/${type}/${name}`);
    }
    else
      setAddUser(true)
  };

  return (
    <div
      className="flex items-center gap-3 p-2 lg:p-4 border border-transparent border-b-slate-200 hover:border hover:border-primary rounded"
    >
      <div>
        <Avatar type={type} width={40} height={40} name={name} owner={isRoomOwner} />
      </div>
      <div className="min-w-0">
        <div className="font-semibold text-ellipsis line-clamp-1">
          {name}{name === user.username && ' (you)'}
        </div>
        <p className="text-sm text-ellipsis line-clamp-1">
          {type === 0 ? 'User' : (<>{memberSize! + 1} member{memberSize! + 1 > 1 ? 's' : ''}</>)}
        </p>
      </div>
      <div className="ml-auto">
        <button className="border shadow rounded p-2" onClick={handleClick}>
          {isExist ? <IoChatbubbleEllipses /> : type === 0 && <FaUserPlus />}
        </button>
      </div>

      {addUser && <AddUser onClose={()=>setAddUser(false)} username={name} /> }
    </div>
  );
};

export default ChatUserCard;
