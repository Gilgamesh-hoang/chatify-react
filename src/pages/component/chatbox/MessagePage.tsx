import React, {useEffect, useRef, useState} from 'react'
import {useSelector} from 'react-redux'
import {HiDotsVertical} from "react-icons/hi";
import {FaAngleLeft, FaImage, FaPlus, FaVideo} from "react-icons/fa6";
import {IoMdSend} from "react-icons/io";
import toast, {Toaster} from "react-hot-toast";
import { Link, useLocation, useParams } from 'react-router-dom';
import {IoClose} from "react-icons/io5";

import Avatar from '~/component/Avatar'
import backgroundImage from '~/assets/wallapaper.jpeg'
import { socketSelector, socketStatusSelector, userSelector } from '~/redux/selector';
import Loading from "~/component/Loading";
import uploadFile from "~/helper/uploadFile";
import {MessagePageProps} from "~/model/MessagePageProps";
import { SocketEvent } from '~/model/SocketEvent';

interface FileUploadProps {
    isImage: boolean;
    file: File;
}

interface Message {
    from: string
    type: 0 | 1
    to: string
    content: string
    createAt: string
}

const MessagePage = () => {
    //Get id
    const {id} = useParams();
    //Get status socket
    const statusSocket = useSelector(socketStatusSelector);

    const token = localStorage.getItem('token') ?? '';
    const userName = localStorage.getItem('userName') ?? '';
    const user = useSelector(userSelector)
    const socketConnection = useSelector(socketSelector)

    const [dataUser, setDataUser] = useState({
        name: id || "error",
        type: 0,
        profile_pic: "",
        online: false,
    })
    const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false)
    const [message, setMessage] = useState({
        text: "",
        imageUrl: "",
        videoUrl: ""
    })
    const [loading, setLoading] = useState(false)
    const [allMessage, setAllMessage] = useState([])
    const currentMessage = useRef<null | HTMLDivElement>(null)
    const [selectedFile, setSelectedFile] = useState<FileUploadProps | null>(null);

    const CHECK_USERS:SocketEvent = {
        "action":"onchat",
        "data": {
            "event": "CHECK_USER",
            "data": {
                "user": dataUser?.name
            }
        }
    };
    //when allMessage updates, try to scroll to newest message
    useEffect(()=>{
        if(currentMessage.current){
            currentMessage.current.scrollIntoView({behavior : 'smooth', block : 'end'})
        }
    },[allMessage])

    //uhh
    useEffect(()=>{
        if (socketConnection) {
            const handler = (evt:MessageEvent) => {
                const response = JSON.parse(evt.data);
                if (response.event === "CHECK_USER" && response.status === "success") {
                    setDataUser((prev) => {
                        return {...prev, online: response.data.status};
                    })
                } else if (response.event === "CHECK_USER" && response.status === "error") {
                    toast.error('Error when get status of '.concat(id || "unknown"), {duration: 2000});
                }
                socketConnection.removeEventListener('message', handler);
            };
            //check active user
            socketConnection.addEventListener('message', handler);
            socketConnection.send(JSON.stringify(CHECK_USERS));
        }
    },[socketConnection, statusSocket])

    const handleUploadImageVideoOpen = () => {
        setOpenImageVideoUpload(prev => !prev)
    }

    const handleShowImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // get the file type
        const fileType = file.type.split('/')[0];
        if (fileType === 'image') {
            setSelectedFile({isImage: true, file: file});
            setOpenImageVideoUpload(false);
        } else {
            toast.error('Chỉ chọn hình ảnh', {
                duration: 3000,
            });
        }
    }

    const handleShowVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // get the file type
        const fileType = file.type.split('/')[0];
        if (fileType === 'video') {
            setSelectedFile({isImage: false, file: file});
            setOpenImageVideoUpload(false);
        } else {
            toast.error('Chỉ chọn video', {
                duration: 3000,
            });
        }
    }

    const handleUploadFile = async () => {
        if (selectedFile) {
            setLoading(true);
            const url = await uploadFile(selectedFile.file);
            //example: https://res.cloudinary.com/dvh2rphf4/image/upload/v1717753457/chatify/backiee-118342_ptwzp8.jpg
            setSelectedFile(null);
            setLoading(false);
        }
    }

    //onChange
    const handleOnChange = () => {

    }

    return (
        <>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <div style={{backgroundImage: `url(${backgroundImage})`}} className='bg-no-repeat bg-cover'>
                <header className='sticky top-0 h-16 bg-white flex justify-between items-center px-4'>
                    <div className='flex items-center gap-4'>
                        <Link to={"/"} className='lg:hidden'>
                            <FaAngleLeft size={25}/>
                        </Link>
                        <div>
                            <Avatar
                                width={50}
                                height={50}
                                imageUrl={dataUser?.profile_pic}
                                name={dataUser?.name}
                                type={dataUser?.type}
                            />
                        </div>
                        <div>
                            <h3 className='font-semibold text-lg my-0 text-ellipsis line-clamp-1'>{dataUser?.name}</h3>
                            <p className='-my-2 text-sm'>
                                {
                                    dataUser.online ? <span className='text-primary'>online</span> :
                                        <span className='text-slate-400'>offline</span>
                                }
                            </p>
                        </div>
                    </div>

                    <div>
                        <button className='cursor-pointer hover:text-primary'>
                            <HiDotsVertical/>
                        </button>
                    </div>
                </header>

                {/***show all messages */}
                <section
                    className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50'>


                    {/**all messages show here */}
                    <div className='flex flex-col gap-2 py-2 mx-2' ref={currentMessage}>
                        {
                            allMessage.map((msg, index) => {
                                return (
                                    <div
                                        className={'p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ml-auto bg-teal-100'}>

                                        <div className='w-full relative'>

                                        </div>
                                        {/*<p className='px-2'>{msg.text}</p>*/}
                                        {/*<p className='text-xs ml-auto w-fit'>{moment(msg.createdAt).format('hh:mm')}</p>*/}
                                    </div>
                                )
                            })
                        }
                    </div>


                    {/**upload Image display */}
                    {
                        selectedFile && selectedFile.isImage && (
                            <div
                                className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
                                <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600'
                                     onClick={() => setSelectedFile(null)}>
                                    <IoClose size={30}/>
                                </div>
                                <div className='bg-white p-3'>
                                    <img
                                        src={URL.createObjectURL(selectedFile.file)}
                                        alt='uploadImage'
                                        className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                                    />
                                </div>
                            </div>
                        )
                    }

                    {/**upload video display */}
                    {
                        selectedFile && !selectedFile.isImage && (
                            <div
                                className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
                                <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600'>
                                    <IoClose size={30} onClick={() => setSelectedFile(null)}/>
                                </div>
                                <div className='bg-white p-3'>
                                    <video
                                        src={URL.createObjectURL(selectedFile.file)}
                                        className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                                        controls
                                        muted
                                        autoPlay
                                    />
                                </div>
                            </div>
                        )
                    }

                    {
                        loading && (
                            <div className='w-full h-full flex sticky bottom-0 justify-center items-center'>
                                <Loading/>
                            </div>
                        )
                    }
                </section>

                {/**send a message */}
                <section className='h-16 bg-white flex items-center px-4'>
                    <div className='relative '>
                        <button onClick={handleUploadImageVideoOpen}
                                className='flex justify-center items-center w-11 h-11 rounded-full hover:bg-primary hover:text-white'>
                            <FaPlus size={20}/>
                        </button>

                        {/**video and image */}
                        {
                            openImageVideoUpload && (
                                <div className='bg-white shadow rounded absolute bottom-14 w-36 p-2'>
                                    <form>
                                        <label htmlFor='uploadImage'
                                               className='flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer'>
                                            <div className='text-primary'>
                                                <FaImage size={18}/>
                                            </div>
                                            <p>Image</p>
                                        </label>
                                        <label htmlFor='uploadVideo'
                                               className='flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer'>
                                            <div className='text-purple-500'>
                                                <FaVideo size={18}/>
                                            </div>
                                            <p>Video</p>
                                        </label>

                                        <input
                                            type='file'
                                            accept=".jpg,.jpeg,.png,.gif,.bmp"
                                            id='uploadImage'
                                            className='hidden'
                                            onChange={handleShowImg}
                                        />

                                        <input
                                            type='file'
                                            accept=".mp4,.avi,.mov,.wmv,.mkv"
                                            id='uploadVideo'
                                            className='hidden'
                                            onChange={handleShowVideo}
                                        />
                                    </form>
                                </div>
                            )
                        }

                    </div>

                    {/**input box */}
                    <form className='h-full w-full flex gap-2'>
                        <input
                            type='text'
                            placeholder='Type here message...'
                            className='py-1 px-4 outline-none w-full h-full'
                            value={message.text}
                            onChange={handleOnChange}
                        />
                        <button type='button' className='text-primary hover:text-secondary' onClick={handleUploadFile}>
                            <IoMdSend size={28}/>
                        </button>
                    </form>

                </section>
            </div>
        </>
    )
}
export default MessagePage