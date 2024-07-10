import clsx from 'clsx';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import Loading from './Loading';
import { CiCirclePlus } from 'react-icons/ci';
import { useSelector } from 'react-redux';
import { chatDataSelector, socketSelector } from '~/redux/selector';
import { UserSideBar } from './SearchUser';
import UserSearchCard from './UserSearchCard';
import { SocketEvent } from '~/model/SocketEvent';
import { message } from 'antd';
import { useNavigate } from 'react-router';
const groupSchema = yup.object({
  name: yup.string().required('Please enter group name'),
});
const GroupForm = ({
  tab,
  onClose,
}: {
  tab: 'create' | 'join';
  onClose: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [listUser, setListUser] = useState<UserSideBar[]>([]);
  const socket = useSelector(socketSelector);
  const chatData = useSelector(chatDataSelector);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const initialValues = {
    name: '',
  };
  const navigate = useNavigate();
  const handleCheckboxChange = (userName: string) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(userName)
        ? prevSelectedUsers.filter((user) => user !== userName)
        : [...prevSelectedUsers, userName]
    );
  };
  const handleGroupOptions = (name: string): void => {
    const groupOptionParams: SocketEvent = {
      action: 'onchat',
      data: {
        event: tab === 'create' ? 'CREATE_ROOM' : 'JOIN_ROOM',
        data: {
          name: name,
        },
      },
    };
    const getUserListParams: SocketEvent = {
      action: 'onchat',
      data: { event: 'GET_USER_LIST' },
    };
    socket.send(JSON.stringify(groupOptionParams));
    socket.send(JSON.stringify(getUserListParams));
  };
  const revieceGroupResult = (e: MessageEvent) => {
    const response = JSON.parse(e.data);
    switch (response.event) {
      case 'CREATE_ROOM':
        if (response.status === 'success') {
          message.success('Created group');
          message.info('Sending invite message to group for user');
        } else {
          message.error(response.mes);
        }
        setLoading(false);
        break;
      case 'JOIN_ROOM':
        if (response.status === 'success') {
          const groupName = response.data.name;
          message.success('Joined group');
          setTimeout(() => {
            onClose();
            navigate('/1/' + groupName);
          }, 200);
        } else {
          message.error(response.mes);
        }
        setLoading(false);
        break;
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: groupSchema,
    onSubmit: (values) => {
      setLoading(true);
      handleGroupOptions(values.name);
    },
  });
  useEffect(() => {
    const originalChat = chatData.userList;
    const userChat = originalChat.filter((user) => user.type == 0);
    setListUser(userChat);
  }, [chatData]);
  useEffect(() => {
    socket.addEventListener('message', revieceGroupResult);
    return () => {
      socket.removeEventListener('message', revieceGroupResult);
    };
  });
  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className="w-full max-w-lg mx-auto  bg-white rounded-sm flex flex-col gap-4">
          {/**input group name */}
          <div className="rounded ">
            <input
              type="text"
              placeholder="Enter group name..."
              className="w-full outline-[#4aa8f4] outline-[0.6px] h-[50px] border-[0.6px] border-[#d9d9d9]  py-1 h-full px-4"
              onChange={formik.handleChange('name')}
              onBlur={formik.handleBlur('name')}
              value={formik.values.name}
            />
            <p className="text-rose-500 text-sm ps-3">
              {formik.touched.name && formik.errors.name}
            </p>
          </div>
          {/* end input group name */}
          {tab === 'create' && (
            <div className="border-b-[0.7px] border-gray-200">
              <h3 className="font-bold text-[16px]">Gửi lời mời vào nhóm</h3>
              <div className="max-h-[300px] overflow-auto px-2">
                {listUser.length !== 0 &&
                  listUser.map((user: UserSideBar, index) => {
                    return (
                      <div className="flex gap-2">
                        <input
                          type="checkbox"
                          value={user.name}
                          className="my-auto rounded-full disabled:bg-gray-400"
                          checked={selectedUsers.includes(user.name)}
                          onChange={() => handleCheckboxChange(user.name)}
                          disabled={loading}
                        />
                        <UserSearchCard
                          key={index}
                          user={user}
                          onClose={() => {}}
                        />
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
          <button
            type="submit"
            className={clsx(
              'outline-none border-none bg-[#00ACB4] rounded  text-white px-5 py-3 font-bold ms-auto ',
              loading && 'opacity-70 cursor-default'
            )}
          >
            {loading && <Loading />}
            {!loading && tab == 'create' ? 'Create' : 'Join'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GroupForm;
