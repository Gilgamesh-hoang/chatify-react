function utf8ToBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

function base64ToUtf8(str: string): string {
  try {
    return isBase64(str) ? decodeURIComponent(escape(atob(str))) : str;
  } catch (err) {
    return str;
  }
}

function isBase64(str: string): boolean {
  try {
    return btoa(atob(str)) === str;
  } catch (err) {
    return false;
  }
}

const languageUtil = { utf8ToBase64, base64ToUtf8 };

export default languageUtil;
