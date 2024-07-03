import { FileType } from '~/model/FileType';

const isValidURL = (str: string): boolean => {
  try {
    new URL(str);
    return true;
  } catch (err) {
    return false;
  }
};


const isCloudinaryURL = (str: string): FileType | null => {
  if (!isValidURL(str)) return null;

  if (str.startsWith('https://res.cloudinary.com/dvh2rphf4/')) {
    const result = { isImage: false, isVideo: false };
    const extension = str.split('.').pop()?.toLowerCase();
    // extend is image
    if (extension === 'png' || extension === 'jpg' || extension === 'jpeg' || extension === 'gif' || extension === 'webp') {
      result.isImage = true;
      return result;
    } else if (extension === 'mp4' || extension === 'webm' || extension === 'ogg') {
      result.isVideo = true;
      return result;
    }
  }
  return null;
};
export { isValidURL, isCloudinaryURL };
