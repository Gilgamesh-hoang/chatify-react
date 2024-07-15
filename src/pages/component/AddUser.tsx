import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import Loading from './Loading';
import { useDispatch, useSelector } from 'react-redux';
import { socketSelector, userSelector } from '~/redux/selector';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { message } from 'antd';
import { UserSideBar } from './SearchUser';
import clsx from 'clsx';
import { useNavigate } from 'react-router';
import languageUtil from '~/utils/languageUtil';

const addUserSchema = yup.object({
  name: yup.string().required('Name is required'),
  msg: yup.string().required('Message is required'),
});
const AddUser = ({ username, onClose }: { username?: string, onClose: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [greeting, setGreeting] = useState('');
  const navigate = useNavigate();
  const user = useSelector(userSelector);
  const socket = useSelector(socketSelector);
  const initialValues = {
    name: username ? username : '',
    msg: `Xin chào, mình là ${user.username}. Rất vui được làm quen với bạn. Hãy phản hồi mình nhé!`,
  };
  const formik = useFormik({
    initialValues,
    validationSchema: addUserSchema,
    onSubmit: (values) => {
      handleSendMsgToUser(values);
    },
  });
  const handleSendMsgToUser = (values: { name: string; msg: string }) => {
    if (!loading) {
      setName(values.name);
      setGreeting(values.msg);
      setLoading(true);
      const sendMsgToUserParams = {
        action: 'onchat',
        data: {
          event: 'SEND_CHAT',
          data: {
            type: 'people',
            to: values.name,
            mes: languageUtil.utf8ToBase64(values.msg),
          },
        },
      };
      try {
        // Gửi tin nhắn
        socket.send(JSON.stringify(sendMsgToUserParams));
        setTimeout(() => {
          const getUserListParams = {
            action: 'onchat',
            data: { event: 'GET_USER_LIST' },
          };
          socket.send(JSON.stringify(getUserListParams));
        }, 300);
      } catch (error) {
        message.error('Some error occurred. Please try again');
      }
    }
  };
  const handleCheckFriend = (e: MessageEvent) => {
    const response = JSON.parse(e.data);
    if (response.event === 'GET_USER_LIST') {
      if (response.status === 'success') {
        let userList: UserSideBar[] = response.data;
        userList = userList.filter((user) => user.name.toLowerCase().match(name.toLowerCase()));
        console.log(userList);
        if (userList.length > 0) {
          message.success('Send greeting to ' + userList[0].name + ' sucessfully');
          setTimeout(() => {
            onClose();
            navigate('/0/' + userList[0].name);
          }, 200);
        } else {
          message.error('Not found user, make sure name is correct');
        }
      } else {
        message.error('Failed to add user');
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    socket.addEventListener('message', handleCheckFriend);
    return () => {
      socket.removeEventListener('message', handleCheckFriend);
    };
  }, [name]);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 p-2 z-10">
      <form onSubmit={formik.handleSubmit}>
        <div className="w-full max-w-lg mx-auto mt-10 p-5 bg-white rounded-sm flex flex-col gap-4">
          {/**input add user */}
          <div className="rounded">
            <input
              type="text"
              placeholder="Enter name to contact..."
              className="w-full outline-[#4aa8f4] outline-[0.6px] h-[50px] border-[0.6px] border-[#d9d9d9]  py-1 h-full px-4"
              onChange={formik.handleChange('name')}
              onBlur={formik.handleBlur('name')}
              value={formik.values.name}
            />
            <p className="text-rose-500 text-sm ps-3">
              {formik.touched.name && formik.errors.name}
            </p>
          </div>
          {/* end input add user */}
          {/* input msg send to user */}
          <div className=" rounded ">
            <textarea
              placeholder="Enter greeting..."
              className="w-full outline-[#4aa8f4] max-h-[200px] min-h-[70px] outline-[0.6px] border-[0.6px] border-[#d9d9d9]  py-1 h-full px-4"
              onChange={formik.handleChange('msg')}
              onBlur={formik.handleBlur('msg')}
              value={formik.values.msg}
            ></textarea>
            <p className="text-rose-500 text-sm ps-3">
              {formik.touched.msg && formik.errors.msg}
            </p>
          </div>
          <button
            type="submit"
            className={clsx(
              'outline-none border-none bg-[#00ACB4] rounded  text-white px-5 py-3 font-bold ms-auto ',
              loading && 'opacity-70 cursor-default',
            )}
          >
            {loading && <Loading />}
            {!loading && 'Send greeting'}
          </button>
        </div>
      </form>

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

export default AddUser;
