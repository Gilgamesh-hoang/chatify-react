import { NavLink, useNavigate, useNavigation } from 'react-router-dom';
import clsx from 'clsx';
import { IoChatbubbleEllipses } from 'react-icons/io5';
import { FaSearch, FaUserPlus } from 'react-icons/fa';
import Avatar from '~/component/Avatar';
import { BiLogOut } from 'react-icons/bi';
import React, { useState } from 'react';
import AddUser from './AddUser';
import SearchUser from './SearchUser';
import ChatInfoPopup from '~/pages/component/chatbox/ChatInfoPopup';
import { MdGroups } from 'react-icons/md';
import GroupModal from './GroupModal';

interface NavSideBarProps {
  name: string;
}

const NavSideBar: React.FC<NavSideBarProps> = ({ name }) => {
  const [openAddUser, setOpenAddUser] = useState(false);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const [openUserInfo, setOpenUserInfo] = useState(false);
  const [openGroupModal, setOpenGroupModal] = useState(false);
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };
  return (
    <div className="bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600 flex flex-col justify-between">
      <div>
        <NavLink
          to=""
          title="Chat"
          className={({ isActive }) =>
            clsx(
              'w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded',
              { 'bg-slate-200': isActive }
            )
          }
        >
          <IoChatbubbleEllipses size={25} />
        </NavLink>

        <div
          title="Add friend"
          onClick={() => setOpenAddUser(true)}
          className={`w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded`}
        >
          <FaUserPlus size={25} />
        </div>
        <div
          title="Group chat"
          onClick={() => setOpenGroupModal(true)}
          className={`w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded`}
        >
          <MdGroups size={25} />
        </div>
        <div
          title="Search user"
          onClick={() => setOpenSearchUser(true)}
          className={`w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded`}
        >
          <FaSearch size={25} />
        </div>
      </div>

      <div className="flex flex-col items-center">
        <button
          className="mx-auto"
          title={name}
          onClick={() => setOpenUserInfo(true)}
        >
          <Avatar type={0} width={40} height={40} name={name} />
        </button>
        <button
          title="Logout"
          className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded"
          onClick={handleLogout}
        >
          <span className="-ml-2">
            <BiLogOut size={25} />
          </span>
        </button>
      </div>
      {openAddUser && <AddUser onClose={() => setOpenAddUser(false)} />}
      {openSearchUser && (
        <SearchUser onClose={() => setOpenSearchUser(false)} />
      )}
      {openGroupModal && (
        <GroupModal onClose={() => setOpenGroupModal(false)} />
      )}
      {openUserInfo && (
        <ChatInfoPopup
          type={0}
          name={name}
          onClose={() => setOpenUserInfo(false)}
        />
      )}
    </div>
  );
};

export default React.memo(NavSideBar);
