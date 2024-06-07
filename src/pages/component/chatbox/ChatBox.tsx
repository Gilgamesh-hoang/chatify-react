import Avatar from "~/component/Avatar";
import Button from "~/component/Button";
import {BiPlusCircle, BiSend} from "react-icons/bi";
import Message from "~/pages/component/chatbox/Message";

export const ChatBox = () => {
    return (
        <div className="flex flex-col h-screen">
            <div className="flex h-[85%]">
                <div className="flex flex-col flex-1 bg-customBackgroundHome rounded m-3">
                    <div className="flex flex-col rounded mx-3 mt-3 content-end overflow-scroll  h-[100%]">
                        {/*Datestamp*/}
                        <div className="flex items-center text-center m-3">
                            <div className="flex-grow border-t border-gray-400"></div>
                            <div className="flex-shrink mx-4 text-gray-400">Date time here</div>
                            <div className="flex-grow border-t border-gray-400"></div>
                        </div>
                        {/*Unread Message*/}
                        <div className="flex items-center text-center m-3">
                            <div className="flex-grow border-t border-red-500"></div>
                            <div className="flex-shrink mx-4 text-red-500">Unread Message!</div>
                            <div className="flex-grow border-t border-red-500"></div>
                        </div>

                        <Message fromMyself={true} messageDetail={"Hi how are you"}/>
                        <Message fromMyself={false} messageDetail={"Fine thank you"}/>

                        {/*Seen message, only if detected?*/}
                        {/*<div className="flex mb-3 content-end mr-2">*/}
                        {/*    <div className="flex-grow"></div>*/}
                        {/*    <Avatar type={0} width={24} height={24} name={""}/>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>

            <div className="flex h-[15%]">
                <div className="flex flex-1 bg-customBackgroundHome bg  rounded m-3">
                    <div className="bg-white rounded flex flex-1 m-3">
                        <div className="m-3 flex flex-1 items-stretch">
                            <Button icon={<BiPlusCircle/>} setWidth={true} secondary={true}/>
                            <input type="text" className=" flex-grow border border-primary pl-5" placeholder="Start mesage here"/>
                            <Button icon={<BiSend/>} setWidth={true} secondary={true}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
}