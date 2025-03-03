import { FileType } from '~/model/FileType';

//try separating string from URL
//ignoring localhost and IP address atm
const splitWithURLs = (str: string) => {
  const regex = new RegExp(
    '(' +
      '(?:https://www\\.|http://www\\.|https://|http://)?' + //protocol being http or https, with or without www
      '[A-Za-z0-9-]{2,}' + //domain name (or subdomain if the below one catches)
      '(?:\\.[A-Za-z0-9-]{2,})?' + //true domain name after subdomain
      '(?:\\.[A-Za-z0-9]{2,})' + //top level domain (second level if the below catches)
      '(?:\\.[A-Za-z0-9]{2,})?' + //true top level domain
      '(?:/\\S+)?' + //path and stuff
      ')',
    'gm'
  );
  return str.split(regex);
};

const isValidURL = (str: string): boolean => {
  //If there's space (not the %20) or next line in the string, it's not an url
  if (
    str.trim().includes(' ') ||
    str.trim().includes('\n') ||
    str.trim().includes('\r')
  )
    return false;
  try {
    // If a url doesn't exists, origin === 'null'
    return new URL(str).origin !== 'null';
  } catch (err) {
    return false;
  }
};

const isFacebookURL = (str: string): boolean => {
  return (
    str.match(
      /(?:https?:\/\/)?(?:www\.)?(mbasic.facebook|m\.facebook|facebook|fb)\.(com|me)\/(?:(?:\w\.)*#!\/)?(?:pages\/)?(?:[\w\-\.]*\/)*([\w\-\.]*)/
    ) != null
  );
};

const isInstagramURL = (str: string): boolean => {
  return (
    str.match(
      /(?:(?:http|https):\/\/)?(?:www.)?(?:instagram.com|instagr.am|instagr.com)\/(\w+)/
    ) != null
  );
};

const isLinkedInURL = (str: string): boolean => {
  return (
    str.match(
      '/(http(s?)://)?(www\\.)?linkedin\\.([a-z])+/(in/)([A-Za-z0-9]+)+/?/'
    ) != null
  );
};

const isTwitterURL = (str: string): boolean => {
  return str.match(/^(?:https?:\/\/)?(?:www\.)?x\.com\/(\S+)$/) != null || str.match(/^(?:https?:\/\/)?(?:www\.)?twitter\.com\/(\S+)$/) != null;
};

const isYoutubeURL = (str: string): boolean => {
  return (
    str.match(
      /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(?:-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?$/
    ) != null
  );
};

const isCloudinaryURL = (str: string): FileType | null => {
  if (!isValidURL(str)) return null;

  if (str.startsWith('https://res.cloudinary.com/dvh2rphf4/')) {
    const result = { isImage: false, isVideo: false };
    const extension = str.split('.').pop()?.toLowerCase();
    // extend is image
    if (
      extension === 'png' ||
      extension === 'jpg' ||
      extension === 'jpeg' ||
      extension === 'gif' ||
      extension === 'webp'
    ) {
      result.isImage = true;
      return result;
    } else if (
      extension === 'mp4' ||
      extension === 'webm' ||
      extension === 'ogg'
    ) {
      result.isVideo = true;
      return result;
    }
  }
  return null;
};

export {
  isValidURL,
  isCloudinaryURL,
  splitWithURLs,
  isYoutubeURL,
  isTwitterURL,
  isLinkedInURL,
  isFacebookURL,
  isInstagramURL,
};
