import { Message } from '~/redux/currentChatSlice';
import moment from 'moment';
import { isCloudinaryURL, isValidURL } from '~/utils/linkUtil';
import { FileType } from '~/model/FileType';
import imageError from '~/assets/image-error.png';
import Avatar from '~/component/Avatar';

interface MessageItemProps {
  msg: Message;
  username: string;
  type: 0 | 1;
}

//custom translate unicode to ascii-readable
export const toAscii = (text: string) => {
  let result = '';
  for (let i = 0; i < text.length; i++)
    result = result.concat(text.charCodeAt(i) > 255 ? '&#' + String(text.charCodeAt(i)) + ';' : text.charAt(i));
  return result;
};
//custom translate ascii-readable to unicode
export const fromAscii = (text: string) => {
  return text?.replace(/&#(\d+);/gm, (substring) => {
    let code = substring.substring(2, substring.length - 1);
    return String.fromCharCode(parseInt(code));
  });
};

const MessageItem: React.FC<MessageItemProps> = ({ msg, username, type }) => {
  const TIMEZONE_OFFSET = 7 * 3600 * 1000; //GMT+7
  const realCreateAt = new Date(new Date(msg.createAt).getTime() + TIMEZONE_OFFSET); //True time
  const fromAsciiMessage = fromAscii(msg.mes);
  const renderMessageContent = (mes: string) => {
    if (isValidURL(mes)) {
      const cloudinaryURL: FileType | null = isCloudinaryURL(mes);
      if (cloudinaryURL) {
        if (cloudinaryURL.isImage) {
          return (
            <img
              src={mes}
              className="w-auto h-full max-h-[260px] sm:max-h-[300px] md:max-h-[280px] object-scale-down"
              alt={mes}
              onError={(e) => {
                (e.target as HTMLImageElement).src = imageError;
              }}
            />
          );

        } else if (cloudinaryURL.isVideo) {
          return <video src={mes} controls
                        className="w-auto h-full max-h-[260px] sm:max-h-[300px] md:max-h-[280px] object-scale-down" />;
        }
      } else {
        return <a href={mes} target="_blank" rel="noreferrer" className={'px-2 break-words'}>{mes}</a>;
      }

    } else {
      return <p className={'px-2 break-words'}>{mes}</p>;
    }
  };
  //for case group
  const renderAvatar = () => {
    return <div className={'px-2'} title={msg.name}><Avatar width={35} height={35} type={0} name={msg.name}
                                                            imageUrl={''} /></div>;
  };
  return (
    <div className={'flex'}>
      {type === 1 && msg.name !== username && renderAvatar()}
      <div
        className={` p-1 py-1 rounded w-fit max-w-[243px] md:max-w-sm lg:max-w-md ${username == msg.name ? 'ml-auto bg-teal-100 max-w-[280px]' : 'bg-white'}`}>
        <div className="w-full relative">
          {renderMessageContent(fromAsciiMessage)}
        </div>
        <p
          className={`px-1 text-xs w-fit ${username == msg.name ? 'ml-auto' : ''}`}>{moment(realCreateAt).format('DD/MM/YYYY @ hh:mm A')}</p>
      </div>
    </div>
  );
};
export default MessageItem;