import React from 'react';
import {Input, message} from 'antd';
import Button from '~/component/Button';
import * as yup from 'yup';
import logo from '~/assets/logo.png';
import {useFormik} from 'formik';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '~/redux/store';
import {Link, useNavigate} from 'react-router-dom';
import clsx from 'clsx';
import {Toaster} from 'react-hot-toast';
import {socketSelector} from '~/redux/selector';
import {SocketEvent} from '~/model/SocketEvent';
import {setUserName} from '~/redux/userSlice';

const loginSchema = yup.object({
    username: yup.string().required('Email or username is required'),
    password: yup.string().min(6).required('Password is required'),
});

export interface LoginParams {
    username: string;
    password: string;
}

type ActionType = 'LOGIN' | 'REGISTER';
const Auth = ({ action }: { action: ActionType }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    // const socket = useSelector(socketSelector);
    const socket = useSelector(socketSelector);

    const initialValues: LoginParams = {
        username: '',
        password: '',
    };

    const formik = useFormik<LoginParams>({
        initialValues,
        validationSchema: loginSchema,
        onSubmit: (values) => {
            switch (action) {
                case 'LOGIN':
                    handleSubmitAuth(socket, values);
                    break;
                case 'REGISTER':
                    handleSubmitAuth(socket, values);
                    break;
                default:
                    break;
            }
        },
    });
    const handleSubmitAuth = (socket: WebSocket | null, values: LoginParams) => {
        if (!socket) return;
        const params: SocketEvent = {
            action: 'onchat',
            data: {
                event: action,
                data: {
                    user: values.username,
                    pass: values.password,
                },
            },
        };
        socket.send(JSON.stringify(params));
        socket.onmessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data.status === 'success') {
                const dataEvent = data.event as ActionType;
                switch (dataEvent) {
                    case 'LOGIN':
                        localStorage.setItem('userName', values.username);
                        localStorage.setItem('token', data.data.RE_LOGIN_CODE);
                        // set username to redux
                        dispatch(setUserName(values.username));
                        message.success('Login successful');
                        setTimeout(() => {
                            window.location.href = '/';
                        }, 200);
                        break;
                    case 'REGISTER':
                        message.success('Register successful');
                        setTimeout(() => {
                            navigate('/login');
                        }, 200);
                        break;
                }
            } else if (data.status === 'error') {
                message.error(data.mes);
            } else if (data.action === 'error') {
                message.error(data.data);
            }
        };
    };
    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <div
                className={clsx(
                    'bg-white flex justify-center items-center w-full flex-col max-h-dvh h-dvh'
                )}
            >
                <header className="flex justify-between px-6 mt-3 w-full">
                    <a href="/" className="">
                        <img src={logo} alt="" width={150} />
                    </a>
                    <div className="flex gap-3 my-auto gap-2">
                        {/*<QuestionCircleOutlined className='my-auto'/>*/}
                        {/*<p className='font-semibold hidden md:block'>Feedback and help</p>*/}
                    </div>
                </header>
                <div className="flex-1 w-full justify-center flex overflow-y-scroll px-3">
                    <div className=" flex  mt-10 md:mt-16 min-w-[330px] max-w-[390px]">
                        <div className="flex flex-col items-center w-full ">
                            <h1 className="text-center font-bold text-3xl">
                                {action === 'LOGIN' && 'Log in'}
                                {action === 'REGISTER' && 'Register'}
                            </h1>
                            <div className="w-full mt-5">
                                <form onSubmit={formik.handleSubmit}>
                                    <p className="font-semibold">Username</p>
                                    <Input
                                        placeholder="Email or username"
                                        className="mt-2 mb-1 rounded-none border-[1px] py-2 ps-3 caret-[#fe2c55] text-color"
                                        style={{
                                            borderColor: '#1618231f',
                                            backgroundColor: '#F1F1F2',
                                        }}
                                        name="Username"
                                        onChange={formik.handleChange('username')}
                                        onBlur={formik.handleBlur('username')}
                                        value={formik.values.username}
                                    />
                                    <p className="text-rose-500 text-sm ps-3">
                                        {formik.touched.username && formik.errors.username}
                                    </p>

                                    <Input.Password
                                        placeholder="Password"
                                        className="mt-2 rounded-none  border-[1px] py-2 ps-3 caret-[#fe2c55] text-color"
                                        style={{
                                            borderColor: '#1618231f',
                                            backgroundColor: '#F1F1F2',
                                        }}
                                        name="password"
                                        onChange={formik.handleChange('password')}
                                        onBlur={formik.handleBlur('password')}
                                        value={formik.values.password}
                                    />
                                    <p className="text-rose-500 text-sm ps-3">
                                        {formik.touched.password && formik.errors.password}
                                    </p>
                                    <Button type="submit" className="mt-4">
                                        {/* { <Spin className='' indicator={<LoadingOutlined
                                            style={{fontSize: 24, color: 'white'}} spin/>}/>} */}
                                        {action === 'LOGIN' && 'Log in'}
                                        {action === 'REGISTER' && 'Register'}
                                    </Button>
                                    <div className="mt-8 mx-auto w-fit flex gap-4"></div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full flex flex-col items-center">
                    <hr className="bg-gray-200 w-full h-[0.4px]" />
                    {action === 'LOGIN' && (
                        <p className="font-semibold py-6 text-center bg-[#f0f0f07f] md:bg-white w-full">
                            Don't have an account?
                            <Link to="/register" className="ms-3 text-[#fe2c55]">
                                Sign up
                            </Link>
                        </p>
                    )}
                    {action === 'REGISTER' && (
                        <p className="font-semibold py-6 text-center bg-[#f0f0f07f] md:bg-white w-full">
                            Already have an account?
                            <Link to="/login" className="ms-3 text-[#fe2c55]">
                                Sign in
                            </Link>
                        </p>
                    )}
                    <div className="bg-[#121212] h-[75px] px-[100px] w-full justify-between hidden md:flex">
                        <div className="border-[0.5px] border-[#ffffff8e] h-fit my-auto text-white px-3 py-1  pe-16">
                            English
                        </div>
                        <p className="text-gray-400 font-semibold opacity-60 my-auto">
                            © 2024 ChatApp
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Auth;