import {PiUserCircle} from "react-icons/pi";
import React from "react";

interface AvatarProps {
    username: string;
    imageUrl: string | null;
    width: number;
    height: number;
}

const Avatar: React.FC<AvatarProps> = ({username, imageUrl, width, height}) => {

    let avatarName: string = ""
    if (username) {
        // Split the username into an array of words
        const splitName: string[] = username?.split(" ")

        if (splitName.length > 1) {
            // If so, set the avatar name to the first letter of the first two words
            avatarName = splitName[0][0] + splitName[1][0];
        } else {
            // If not, set the avatar name to the first two letters of the first word
            avatarName = splitName[0][0] + splitName[0][1];
        }
    }

    return (
        <div className={`text-slate-800  rounded-full font-bold relative`}
             style={{width: width + "px", height: height + "px"}}>
            {
                imageUrl ? (
                    <img
                        src={imageUrl}
                        width={width}
                        height={height}
                        alt={username}
                        className='overflow-hidden rounded-full'
                    />
                ) : (
                    username ? (
                        <div style={{width: width + "px", height: height + "px"}}
                             className={`overflow-hidden rounded-full flex justify-center items-center text-lg bg-cyan-200`}>
                            {avatarName}
                        </div>
                    ) : (
                        <PiUserCircle
                            size={width}
                        />
                    )
                )
            }
        </div>
    )
}

export default Avatar;