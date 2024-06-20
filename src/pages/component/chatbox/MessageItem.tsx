import { Message } from '~/redux/currentChatSlice';
import moment from 'moment';
import { isCloudinaryURL, isValidURL } from '~/utils/linkUtil';
import { FileType } from '~/model/FileType';
import imageError from '~/assets/image-error.png';
interface MessageItemProps {
  msg: Message;
  username: string;
}

const MessageItem: React.FC<MessageItemProps> = ({ msg, username }) => {

  const renderMessageContent = (mes: string) => {

    if (isValidURL(mes)) {
      const cloudinaryURL: FileType | null = isCloudinaryURL(mes);
      if (cloudinaryURL) {
        if (cloudinaryURL.isImage) {
          return (
            <img
              src={mes}
              className="w-full h-full object-scale-down"
              alt={mes}
              onError={(e) => {
                (e.target as HTMLImageElement).src = imageError;
              }}
            />
          );

        } else if (cloudinaryURL.isVideo) {
          return <video src={mes} controls className="w-full h-full object-scale-down" />;
        }
      } else {
        return <a href={mes} target="_blank" rel="noreferrer" className="px-2">{mes}</a>;
      }

    } else {
      return <p className="px-2">{mes}</p>;
    }
  };

  return (
    <div
      className={` p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${username == msg.name ? 'ml-auto bg-teal-100' : 'bg-white'}`}>
      <div className="w-full relative">
        {renderMessageContent(msg.mes)}
      </div>
      <p className="text-xs ml-auto w-fit">{moment(msg.createAt).format('hh:mm')}</p>
    </div>
  );
};
export default MessageItem;