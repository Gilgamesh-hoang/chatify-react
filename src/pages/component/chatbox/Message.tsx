import clsx from "clsx";
import Avatar from "~/component/Avatar";
import React from "react";

interface MessageInfo {
    fromMyself?: boolean;
    messageDetail?: string;
}
const Message:React.FC<MessageInfo> = ({fromMyself, messageDetail}) => {
    return (
        <div className={clsx("flex mb-3", fromMyself && 'content-end')}>
            {!fromMyself && <Avatar
                type={0}
                width={50}
                height={50}
                name={""}
            />}
            {fromMyself && <div className="flex-grow"></div>}
            <div
                className={
                    clsx("flex border border-primary rounded items-center max-w-[65%]",
                        fromMyself && "bg-primary mr-2 flex-end mx-3",
                        !fromMyself && "bg-white ml-2"
                    )
                }>
                <div className={clsx("flex flex-col mx-3", fromMyself && "text-white")}>
                    <p className="font-medium mt-3">{messageDetail}</p>
                    <span className={clsx(fromMyself && "text-end", "mt-2 mb-3 text-xs")}>Time here</span>
                </div>
                {!fromMyself && <div className="flex-grow"></div>}
            </div>
        </div>
    )
}
export default Message