import { FaDownload } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface FileDownloadProps {
  url: string;
}

const FileDownload = ({ url }: FileDownloadProps) => {

  const downloadFile = () => {
    // Fetch the file from the provided URL
    fetch(url)
      .then((response) => {
        // Convert the response to a blob
        return response.blob();
      })
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        // Set the href of the link to the blob URL
        link.href = blobUrl;
        // Extracted from the URL or 'download' if the file name cannot be determined
        link.download = url.split('/').pop() || 'download';
        // Append the link to the body
        document.body.appendChild(link);
        // Programmatically click the link to start the download
        link.click();
        // Remove the link from the body after the download starts
        document.body.removeChild(link);
        toast.success('Downloaded successfully');
      })
      .catch((error) => {
        console.error('Error:', error);
        toast.error('Download failed');
      });
  };

  return (
    <button className="px-2 py-1" onClick={downloadFile}>
      <FaDownload className="size-4" />
    </button>
  );
};

export default FileDownload;