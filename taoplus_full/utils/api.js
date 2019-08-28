const app = getApp();

// const HOST = "https://api.test.olb8.com";
// const IMG = "https://api.test.olb8.com";

const HOST = app.globalData.HOST;
const IMG = app.globalData.HOST;

// const HOST = "http://192.168.3.150:9082";
// const IMG = "http://192.168.3.150:9082";

// const HOST = "http://192.168.3.223:9082";
// const IMG = "http://192.168.3.223:9082";

// const HOST = "http://192.168.3.155:9082";
// const IMG = "http://192.168.3.155:9082";


// const HOST = "http://192.168.3.192:9082";
// const IMG = "http://192.168.3.192:9082";

const api = {
  HOST: HOST,
  IMG: IMG,
  wxLogin: `${ HOST}/oauth/token`, //微信授权登录
  getUser: `${HOST}/api/user/current`, //获取用户信息
  vlidateCode: `${HOST}/api/basic/mobile/vlidate-code`, //获取验证码
  register: `${HOST}/api/user/third/register-form-weixin`, //注册
  upload: `${HOST}/upload`, //上传文件
  pay: `${HOST}/api/pay/payment`, //确定支付
  bankCard: `${HOST}/api/bankcard/names`, //查询银行卡
  decrypt: `${HOST}/api/user/third/dc`, //解密
  
  getQr: `${HOST}/admin/agency/agent/qrcodeV2`, //获取商家二维码 
  // getQr: "http://192.168.3.181:9080/admin/agency/agent/qrcodeV2", //获取商家二维码 
}

module.exports = {
  api: api
}