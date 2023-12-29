import CryptoJS from 'crypto-js';

function md5(str: string) {
  return CryptoJS.MD5(str).toString(CryptoJS.enc.Hex);
}
export default {
  md5,
};
