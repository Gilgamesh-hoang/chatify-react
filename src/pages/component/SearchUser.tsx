import React, { useEffect, useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import Loading from './Loading';
import toast from 'react-hot-toast';
import axios from 'axios';
import { IoClose } from 'react-icons/io5';
import UserSearchCard from './UserSearchCard';
import { useDebounce } from 'use-debounce';
import { message } from 'antd';
import { SocketEvent } from '~/model/SocketEvent';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '~/redux/store';
import { socketSendMessage } from '~/redux/socketSlice';
import { socketSelector } from '~/redux/selector';
export interface UserSideBar {
  name: string;
  type: number;
}
const SearchUser = ({ onClose }: { onClose: () => void }) => {
  const [searchUser, setSearchUser] = useState<UserSideBar[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const [debouncedSearch] = useDebounce(search, 400);
  const dispatch = useDispatch<AppDispatch>();
  const socket = useSelector(socketSelector);

  const fetchUserList = () => {
    setLoading(true);

    const getUserListParams = {
      action: 'onchat',
      data: { event: 'GET_USER_LIST' },
    };
    socket.send(JSON.stringify(getUserListParams));
  };

  const handleReceiveUserList = (e: MessageEvent) => {
    const response = JSON.parse(e.data);
    if (response.event === 'GET_USER_LIST') {
      if (response.status === 'success') {
        let userList: UserSideBar[] = response.data;
        if (debouncedSearch) {
          userList = userList.filter((user) =>
            user.name.toLowerCase().includes(debouncedSearch.toLowerCase())
          );
        }
        userList = userList.slice(0, 5);
        setSearchUser(userList);
      } else {
        message.error('Failed to search user');
      }
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserList();
    socket.addEventListener('message', handleReceiveUserList);
    return () => {
      socket.removeEventListener('message', handleReceiveUserList);
    };
  }, []);
  useEffect(() => {
    socket.addEventListener('message', handleReceiveUserList);
    return () => {
      socket.removeEventListener('message', handleReceiveUserList);
    };
  }, [debouncedSearch]);

  useEffect(() => {
    if (debouncedSearch) {
      fetchUserList();
    }
  }, [debouncedSearch]);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 p-2 z-10">
      <div className="w-full max-w-lg mx-auto mt-10">
        {/**input search user */}
        <div className="bg-white rounded h-14 overflow-hidden flex ">
          <input
            type="text"
            placeholder="Search user by name"
            className="w-full outline-none py-1 h-full px-4"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <div className="h-14 w-14 flex justify-center items-center">
            <IoSearchOutline size={25} />
          </div>
        </div>

        {/**display search user */}
        <div className="bg-white mt-2 w-full p-4 rounded">
          {/**no user found */}
          {searchUser.length === 0 && !loading && (
            <p className="text-center text-slate-500">no user found!</p>
          )}

          {loading && (
            <p>
              <Loading />
            </p>
          )}

          {searchUser.length !== 0 &&
            !loading &&
            searchUser.map((user: UserSideBar, index) => {
              return (
                <UserSearchCard key={index} user={user} onClose={onClose} />
              );
            })}
        </div>
      </div>

      <div
        className="absolute top-0 right-0 text-2xl p-2 lg:text-4xl hover:text-white"
        onClick={onClose}
      >
        <button>
          <IoClose />
        </button>
      </div>
    </div>
  );
};

export default SearchUser;
