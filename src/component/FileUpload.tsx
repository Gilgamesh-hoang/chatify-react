import React from 'react';
import { FaImage, FaVideo } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface FileUploadProps {
  setSelectedFile: React.Dispatch<React.SetStateAction<{ isImage: boolean; file: File } | null>>;
  setOpenImageVideoUpload: React.Dispatch<React.SetStateAction<boolean>>;
}

const FileUpload: React.FC<FileUploadProps> = ({ setSelectedFile, setOpenImageVideoUpload }) => {

  console.log('FileUpload');

  const handleFileSelection = async (e: React.ChangeEvent<HTMLInputElement>, isImage: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if the file size is under the limit (10MB). If not, show an error message and exit the function.
    if (!checkFileSize(file, 10)) {
      toast.error('The file is too large, please choose a file under 10MB', {
        duration: 3000,
      });
      return;
    }

    // Get the type of the file.
    const fileType = file.type.split('/')[0];
    // If the file type matches the expected type (image or video), set it as the selected file and close the upload dialog.
    // If the file type does not match, show an error message.
    if ((fileType === 'image' && isImage) || (fileType === 'video' && !isImage)) {
      setSelectedFile({ isImage, file });
      setOpenImageVideoUpload(false);
    } else {
      toast.error(`Incorrect ${isImage ? 'ảnh' : 'video'} format`, {
        duration: 3000,
      });
    }
  };

  const handleShowImg = (e: React.ChangeEvent<HTMLInputElement>) => handleFileSelection(e, true);
  const handleShowVideo = (e: React.ChangeEvent<HTMLInputElement>) => handleFileSelection(e, false);
  const checkFileSize = (file: File, size: number): boolean => {
    return file.size / 1024 / 1024 < size;
  };

  return (
    <div className="bg-white shadow rounded absolute bottom-14 w-36 p-2">
      <form>
        <label htmlFor="uploadImage"
               className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer">
          <div className="text-primary">
            <FaImage size={18} />
          </div>
          <p>Image</p>
        </label>
        <label htmlFor="uploadVideo"
               className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer">
          <div className="text-purple-500">
            <FaVideo size={18} />
          </div>
          <p>Video</p>
        </label>

        <input
          type="file"
          accept=".jpg,.jpeg,.png,.gif,.bmp"
          id="uploadImage"
          className="hidden"
          onChange={handleShowImg}
        />

        <input
          type="file"
          accept=".mp4,.avi,.mov,.wmv,.mkv"
          id="uploadVideo"
          className="hidden"
          onChange={handleShowVideo}
        />
      </form>
    </div>
  );
};

export default FileUpload;