import { PiKeyDuotone, PiKeyFill, PiUserCircle } from 'react-icons/pi';
import React, {useMemo} from "react";
import {HiMiniUserGroup} from "react-icons/hi2";

interface AvatarProps {
    type: number;
    name: string;
    width: number;
    height: number;
    imageUrl?: string;
    owner?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({type, name, imageUrl, width, height, owner}) => {
    const avatarName = useMemo(() => {
        if (!name) return '';

        const splitName = name.split(" ");
        if (splitName.length > 1) {
            return splitName[0][0] + splitName[1][0];
        } else if (splitName[0].length > 1) {
            return splitName[0][0] + splitName[0][1];
        } else {
            return splitName[0][0];
        }
    }, [name]);

    // This function is responsible for rendering the avatar based on the provided props.
    const renderAvatar = () => {
        // If the type prop is 'room', render a group icon.
        if (type == 1) {
            return (
                <div className="rounded-full flex justify-center items-center border-2 border-gray-700">
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
                     className="overflow-hidden rounded-full flex justify-center items-center text-lg bg-cyan-200">
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
        <div className="text-slate-800  rounded-full font-bold relative"
             style={{width: width + "px", height: height + "px"}}
             title={name.concat(owner ? " - Room owner" : "")}
        >
            {renderAvatar()}
            {owner && <div className="absolute"
                           style={{ bottom: `-${height / 10}px`, right: `-${width / 10 }px`, }} >
                <PiKeyDuotone strokeWidth={0.25} size={width / 2} className='[&>[opacity="0.2"]]:fill-yellow-200 [&>[opacity="0.2"]]:opacity-100' />
            </div>}
        </div>
    );
}

export default React.memo(Avatar);