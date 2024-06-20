import React from 'react';
import { IoClose } from 'react-icons/io5';

interface FilePreviewProps {
  selectedFile: { isImage: boolean; file: File } | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<{ isImage: boolean; file: File } | null>>;
}

const FilePreview: React.FC<FilePreviewProps> = ({ selectedFile, setSelectedFile }) => {

  if (!selectedFile) return null;

  const handleClose = () => {
    setSelectedFile(null);
  };

  return (
    <div
      className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
      <div className="relative bg-white p-3">
        {selectedFile.isImage ? (
          <img
            src={URL.createObjectURL(selectedFile.file)}
            alt="uploadImage"
            className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
          />
        ) : (
          <video
            src={URL.createObjectURL(selectedFile.file)}
            className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
            controls
            muted
            autoPlay
          />
        )}

        <div className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
             onClick={handleClose}>
          <IoClose size={30} />
        </div>

      </div>
    </div>
  );
};

export default FilePreview;