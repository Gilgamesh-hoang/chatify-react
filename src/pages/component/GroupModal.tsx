import React, { useEffect, useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import Loading from './Loading';
import { IoClose } from 'react-icons/io5';
import UserSearchCard from './UserSearchCard';
import { useDebounce } from 'use-debounce';
import { SocketEvent } from '~/model/SocketEvent';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '~/redux/store';
import { socketSendMessage } from '~/redux/socketSlice';
import { chatDataSelector, socketSelector } from '~/redux/selector';
import { UserSideBar } from './SearchUser';
import clsx from 'clsx';
import 'flowbite';
import { useFormik } from 'formik';
import GroupForm from './GroupForm';

const GroupModal = ({ onClose }: { onClose: () => void }) => {
  const [searchUser, setSearchUser] = useState<UserSideBar[]>([]);
  const [tab, setTab] = useState<'create' | 'join'>('create');
  const [search, setSearch] = useState('');
  const chatData = useSelector(chatDataSelector);

  const [debouncedSearch] = useDebounce(search, 400);
  const dispatch = useDispatch<AppDispatch>();
  const socket = useSelector(socketSelector);
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 p-2 z-10">
      <div className="w-full max-w-lg mx-auto mt-10 bg-white rounded">
        {/* Header group options */}
        <div className="">
          <h4 className="text-[20px] font-bold px-4 py-3">Group chat</h4>
          <div className="max-w-2xl mx-auto">
            <div className="border-b border-gray-200 dark:border-gray-700 ">
              <ul
                className="flex flex-wrap -mb-px"
                id="myTab"
                data-tabs-toggle="#myTabContent"
                role="tablist"
              >
                <li className="mr-2" role="presentation">
                  <button
                    className={clsx(
                      'inline-block   rounded-t-lg py-4 px-4 text-sm font-medium text-center border-transparent border-b-2',
                      tab === 'create'
                        ? 'text-blue-500 hover:text-blue-600 border-blue-300'
                        : 'text-gray-500 hover:text-gray-600 hover:border-gray-300'
                    )}
                    onClick={() => setTab('create')}
                  >
                    Create Group
                  </button>
                </li>
                <li className="mr-2" role="presentation">
                  <button
                    className={clsx(
                      'inline-block rounded-t-lg py-4 px-4 text-sm font-medium text-center border-transparent border-b-2',
                      tab === 'join'
                        ? 'text-blue-500 hover:text-blue-600 border-blue-300'
                        : 'text-gray-500 hover:text-gray-600 hover:border-gray-300'
                    )}
                    onClick={() => setTab('join')}
                  >
                    Join Group
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="w-full p-4 rounded">
          <GroupForm tab={tab} />
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

export default GroupModal;
