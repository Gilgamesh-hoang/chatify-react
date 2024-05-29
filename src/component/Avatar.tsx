import {PiUserCircle} from "react-icons/pi";
import React from "react";
import {HiMiniUserGroup} from "react-icons/hi2";

interface AvatarProps {
    type?: string;
    name: string;
    imageUrl?: string;
    width: number;
    height: number;
}

const Avatar: React.FC<AvatarProps> = ({type = 'user', name, imageUrl, width, height}) => {

    let avatarName: string = ""
    if (name) {
        // Split the name into an array of words
        const splitName: string[] = name?.split(" ")

        if (splitName.length > 1) {
            // If so, set the avatar name to the first letter of the first two words
            avatarName = splitName[0][0] + splitName[1][0];
        } else if (splitName[0][0].length > 1) {
            // If not, set the avatar name to the first two letters of the first word
            avatarName = splitName[0][0] + splitName[0][1];
        } else
            avatarName = splitName[0][0];
    }

    // This function is responsible for rendering the avatar based on the provided props.
    const renderAvatar = () => {
        // If the type prop is 'room', render a group icon.
        if (type === 'room') {
            return (
                <div className={`rounded-full flex justify-center items-center border-2 border-gray-700` }>
                    <HiMiniUserGroup size={width}/>
                </div>
            );

        }
        // If an imageUrl prop is provided, render an image with the provided URL.
        else if (imageUrl) {
            return (
                <img
                    src={imageUrl}
                    width={width}
                    height={height}
                    alt={name}
                    className='overflow-hidden rounded-full'
                />
            );
        }
        // If a name prop is provided but no imageUrl, render a div with the initials of the name.
        else if (name) {
            return (
                <div style={{width: width + "px", height: height + "px"}}
                     className={`overflow-hidden rounded-full flex justify-center items-center text-lg bg-cyan-200`}>
                    {avatarName}
                </div>
            );
        }
        // If no imageUrl or name prop is provided, render a default user circle icon.
        else {
            return <PiUserCircle size={width}/>;
        }
    };

    return (
        <div className={`text-slate-800  rounded-full font-bold relative`}
             style={{width: width + "px", height: height + "px"}}
        >
            {renderAvatar()}
        </div>
    );
}

export default Avatar;