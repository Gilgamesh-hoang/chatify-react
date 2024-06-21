import { FileType } from '~/model/FileType';

const isValidURL = (str: string): boolean => {
  const urlPattern = new RegExp(
    '^(https?:\\/\\/)?' + // giao thức
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // tên miền
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // hoặc địa chỉ IP (IPv4)
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // cổng và đường dẫn
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // chuỗi truy vấn
    '(\\#[-a-z\\d_]*)?$', // mỏ neo
    'i', // cờ không phân biệt hoa thường
  );
  return urlPattern.test(str);
};

const isCloudinaryURL = (str: string): FileType | null => {
  if (!isValidURL(str)) return null;

  if (str.startsWith('https://res.cloudinary.com/dvh2rphf4/')) {
    const result = { isImage: false, isVideo: false };
    const extension = str.split('.').pop()?.toLowerCase();
    // extend is image
    if (extension === 'png' || extension === 'jpg' || extension === 'jpeg' || extension === 'gif') {
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
