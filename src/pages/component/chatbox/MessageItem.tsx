import moment from 'moment';
import { isCloudinaryURL, isValidURL, isYoutubeURL, splitWithURLs } from '~/utils/linkUtil';
import { FileType } from '~/model/FileType';
import imageError from '~/assets/image-error.png';
import Avatar from '~/component/Avatar';
import Tippy from '@tippyjs/react';
import 'tippy.js/animations/shift-away.css';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/translucent.css';
import FileDownload from '~/component/FileDownload';
import React, { useState } from 'react';
import languageUtil from '~/utils/languageUtil';
import { Message } from '~/redux/chatDataSlice';
import clsx from 'clsx';
import ChatUserMenu from '~/pages/component/chatbox/ChatUserMenu';
import ChatInfoPopup from '~/pages/component/chatbox/ChatInfoPopup';
import AddUser from '~/pages/component/AddUser';
import { YouTubeEmbed } from 'react-social-media-embed';
import MessageEmbedItem from '~/pages/component/chatbox/MessageEmbedItem';

interface MessageItemProps {
  msg: Message;
  username: string;
  type: 0 | 1;
  selected: boolean;
  querySearch?: string;
  roomOwner?: string;
}

const MessageItem: React.FC<MessageItemProps> = ({ msg, username, type, selected, querySearch, roomOwner }) => {
  const [isImageError, setImageError] = useState(false);
  const TIMEZONE_OFFSET = 7 * 3600 * 1000; //GMT+7
  const realCreateAt = new Date(
    new Date(msg.createAt).getTime() + TIMEZONE_OFFSET,
  ); //True time


  const renderMessageContent = (mes: string) => {
    const utf8msg = languageUtil.base64ToUtf8(mes);
    // split the strings with the search query included (case-insensitive + global)
    if (isValidURL(utf8msg)) {
      const cloudinaryURL: FileType | null = isCloudinaryURL(utf8msg);
      if (cloudinaryURL) {
        if (cloudinaryURL.isImage) {
          return (
            <Tippy placement="right-start" content={<FileDownload url={utf8msg} />}
                   interactive={true}
                   delay={[200, 100]}
                   animation={'shift-away'}
                   theme={'translucent'}
                   disabled={isImageError}
            >
              <img
                src={utf8msg}
                className="w-auto h-full min-h-[24px] max-h-[260px] sm:max-h-[300px] md:max-h-[280px] object-scale-down"
                alt={utf8msg}
                loading="lazy"
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
              src={utf8msg}
              controls
              className="w-auto h-full min-h-[24px] max-h-[260px] sm:max-h-[300px] md:max-h-[280px] object-scale-down"
            />
          );
        }
      } else {
        // URL are definitely get the embed, split here for searching purposes ofc
        const split = utf8msg.split(new RegExp(`(${querySearch})`, 'gi'));
        return (
          <>
            <a href={utf8msg} target="_blank" rel="noreferrer" className={'px-2 break-words text-blue-500 underline'}>
              {
                // if there is query search, try to highlight the keywords. else render normal message
                querySearch ?
                  split.map((part, index) =>
                    <span key={index}
                          className={part.toLowerCase() === querySearch.toLowerCase() ? 'bg-yellow-300' : ''}>
                      {part}
                    </span>) : <span>{utf8msg}</span>
              }
            </a>
            <MessageEmbedItem url={utf8msg} width={'100%'} height={240} />
          </>

        );
      }
    } else {
      // here it tries to find section that has URL on top of highlight searching keyword
      const splitMessageWithURL = splitWithURLs(utf8msg);
      const splitPartWithQuerySearch = (part: string) => part.split(new RegExp(`(${querySearch})`, 'gi'));
      return <>
        <p className={'px-2 break-words whitespace-pre-wrap'}>
        {
          splitMessageWithURL.map((part, index) => isValidURL(part) ?
            <a key={index} href={part} target="_blank" rel="noreferrer" className={'text-blue-500 underline'}>
              {
                querySearch ?
                  splitPartWithQuerySearch(part).map((queryPart, queryIndex) =>
                    <span key={queryIndex} className={queryPart.toLowerCase() === querySearch.toLowerCase() ? 'bg-yellow-300' : ''}>
                    {queryPart}</span>) : part
              }
            </a>
            : <span key={index}>
              {
                querySearch ?
                  splitPartWithQuerySearch(part).map((queryPart, queryIndex) =>
                    <span key={queryIndex}
                          className={queryPart.toLowerCase() === querySearch.toLowerCase() ? 'bg-yellow-300' : ''}>
                    {queryPart}</span>) : part
              }
            </span>)
        }
      </p>
        {
          splitMessageWithURL.map((part, index) => isValidURL(part) &&
            <div className="my-2"><MessageEmbedItem url={part} width={'100%'} height={240} /></div>)
        }</>;
    }
  };

  const [visible, setVisible] = useState(false);
  const show = () => setVisible(true);
  const hide = () => setVisible(false);
  //for case popup
  const [popup, setPopup] = useState(false);
  const [addUser, setAddUser] = useState(false);
  //for case group
  const renderAvatar = () => {
    return (
      <Tippy placement="right-start"
             content={<ChatUserMenu userName={msg.name} onClose={hide} onInfoClick={() => setPopup(true)}
                                    onAddUser={() => setAddUser(true)} />}
             interactive={true}
             delay={[100, 100]}
             animation={'shift-away'}
             theme={'translucent'}
             visible={visible}
             onClickOutside={hide}
      >
        <div className="px-2 self-start" title={msg.name} onClick={visible ? hide : show}>
          <Avatar width={35} height={35} type={0} name={msg.name} owner={msg.name === roomOwner} />
        </div>
      </Tippy>
    );
  };
  // console.log(msg)
  return (
    <div className={'flex'}>
      {type === 1 && msg.name !== username && renderAvatar()}
      <div className={clsx(` p-1 rounded w-fit max-w-[243px] md:max-w-sm lg:max-w-md`,
        username === msg.name ? 'ml-auto bg-teal-100 max-w-[280px]' : 'bg-white',
        selected && 'border-2 border-secondary p-[2.4px]')}>
        <div className="w-full relative">
          {renderMessageContent(msg.mes)}
        </div>
        <p className={`px-1 text-xs w-fit ${username === msg.name ? 'ml-auto' : ''}`}>
          {moment(realCreateAt).isSame(new Date(), 'day')
            ? moment(realCreateAt).format('HH:mm')
            : moment(realCreateAt).format('DD/MM/YYYY HH:mm')}
        </p>
      </div>
      {popup && <ChatInfoPopup type={0} name={msg.name} onClose={() => setPopup(false)} />}
      {addUser && <AddUser username={msg.name} onClose={() => setAddUser(false)} />}
    </div>
  );
};

// I set the condition for props to be count for 'dirty'
export default React.memo(MessageItem, (p, n) =>
  p.msg.createAt.getTime() === n.msg.createAt.getTime() && p.querySearch === n.querySearch && p.selected === n.selected);
