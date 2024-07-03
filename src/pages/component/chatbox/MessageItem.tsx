import moment from 'moment';
import { isCloudinaryURL, isValidURL } from '~/utils/linkUtil';
import { FileType } from '~/model/FileType';
import imageError from '~/assets/image-error.png';
import Avatar from '~/component/Avatar';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import FileDownload from '~/component/FileDownload';
import React, { useState } from 'react';
import languageUtil from '~/utils/languageUtil';
import { Message } from '~/redux/chatDataSlice';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { chatDataSelector } from '~/redux/selector';

interface MessageItemProps {
  msg: Message;
  username: string;
  type: 0 | 1;
  selected: boolean;
  querySearch?: string;
  roomOwner?: string;
}

const MessageItem: React.FC<MessageItemProps> = ({ msg, username, type, selected, querySearch, roomOwner}) => {
  const [isImageError, setImageError] = useState(false);
  const TIMEZONE_OFFSET = 7 * 3600 * 1000; //GMT+7
  const realCreateAt = new Date(
    new Date(msg.createAt).getTime() + TIMEZONE_OFFSET,
  ); //True time
  const renderMessageContent = (mes: string) => {
    const msg = languageUtil.base64ToUtf8(mes);
    // split the strings with the search query included (case-insensitive + global)
    const split = msg.split(new RegExp(`(${querySearch})`, 'gi'))
    if (isValidURL(msg)) {
      const cloudinaryURL: FileType | null = isCloudinaryURL(msg);
      if (cloudinaryURL) {
        if (cloudinaryURL.isImage) {
          return (
            <Tippy placement="right-start" content={<FileDownload url={msg} />}
                   interactive={true}
                   delay={[200, 100]}
                   animation={'shift-away'}
                   theme={'translucent'}
                   disabled={isImageError}
            >
              <img
                src={msg}
                className="w-auto h-full max-h-[260px] sm:max-h-[300px] md:max-h-[280px] object-scale-down"
                alt={msg}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = imageError;
                  setImageError(true);
                }}
              />
            </Tippy>
          );
        } else if (cloudinaryURL.isVideo) {
          return (
            <video
              src={msg}
              controls
              className="w-auto h-full max-h-[260px] sm:max-h-[300px] md:max-h-[280px] object-scale-down"
            />
          );
        }
      } else {
        return (
          <a href={msg} target="_blank" rel="noreferrer" className={'px-2 break-words text-blue-500 underline'}>
            {
              // if there is query search, try to highlight the keywords. else render normal message
              querySearch ?
              split.map((part, index) =>
              <span key={index} className={part.toLowerCase() === querySearch.toLowerCase() ? 'bg-yellow-300' : '' }>
              {part}</span>) : msg
            }
          </a>
        );
      }
    } else {
      return <p className={'px-2 break-words whitespace-pre-wrap'}>
        {
          // same thing here
          querySearch ?
          split.map((part, index) =>
          <span key={index} className={part.toLowerCase() === querySearch.toLowerCase() ? 'bg-yellow-300' : '' }>
              {part}</span>) : msg
        }
      </p>;
    }
  };
  //for case group
  const renderAvatar = () => {
    return (
      <div className={'px-2'} title={msg.name}>
        <Avatar width={35} height={35} type={0} name={msg.name} owner={msg.name === roomOwner} />
      </div>
    );
  };
  return (
    <div className={'flex '}>
      {type === 1 && msg.name !== username && renderAvatar()}
      <div className={clsx(` p-1 rounded w-fit max-w-[243px] md:max-w-sm lg:max-w-md`,
          username === msg.name ? 'ml-auto bg-teal-100 max-w-[280px]' : 'bg-white',
        selected && 'border-2 border-secondary p-[2.4px]')}>
        <div className="w-full relative">
          {renderMessageContent(msg.mes)}
        </div>
        <p className={`px-1 text-xs w-fit ${username === msg.name ? 'ml-auto' : ''}`} >
          {moment(realCreateAt).isSame(new Date(), 'day')
            ? moment(realCreateAt).format('HH:mm')
            : moment(realCreateAt).format('DD/MM/YYYY HH:mm')}
        </p>
      </div>
    </div>
  );
};
export default React.memo(MessageItem);
