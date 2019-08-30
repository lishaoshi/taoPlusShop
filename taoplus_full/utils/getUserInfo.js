import utils from './util.js';
const api = require('./api.js').api;
const app = getApp();
// const api = require("../../utils/api.js").api;
/**
 * 查看是否授权
 */

const HOST = app.globalData.HOST;
const getUserInfoFn = (_this, utils, app) => {
    wx.getSetting({
        success: function (res) {
            console.log("res.authSetting['scope.userInfo']", res.authSetting)
            if (res.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                getUserInfo(app)
            }else{
                _this.setData({
                   userButton:true,
                })
            }
        }
    })
}
/**
     * 更新微信用户信息
      */
const updateUserInfoFn = (utils, app, userInfo) => {
    
    utils.uGet(`${HOST}/api/user/updateUserMsg`, {
        userId: app.globalData.userId,
        portraitUrl: userInfo.avatarUrl,
        nickname: userInfo.nickName,
    }).then((res) => {
    })
}

//获取用户信息
const getUserInfo = (app,_this)=>{
  var weixin_res
    wx.getUserInfo({
        success: function (res) {
          weixin_res = res
            if (_this) {
                _this.setData({
                    userButton:false,
                })
            }
          utils.uPost(api.decrypt, {
            encryptedData: res.encryptedData,
            iv: res.iv
          }, false).then((res) => {
            return utils.uPost(api.register, {
              shopId: app.globalData.shopId,
              thirdPartId: app.globalData.openid,
              unionId: res.unionId,
              mobileValidationCode: ''
            }, false);
          }).then((res) => {
            return utils.uGet(api.getUser)
          }).then((res) => {
            if (res) {
              console.log('用户信息', res)
              wx.setStorage({
                key: 'userId',
                data: res.user_id,
              })
              app.globalData.userId = res.user_id;
              app.globalData.mobile = res.mobile;
              app.globalData.nickName = res.nickname;
              app.globalData.portraitUrl = res.portrait_url;
              // app.globalData.username = res.username;
              console.log('登录授权')
              if (weixin_res.userInfo.avatarUrl != app.globalData.portraitUrl || weixin_res.userInfo.nickName != app.globalData.nickName) {
                app.globalData.portraitUrl = weixin_res.userInfo.avatarUrl;
                app.globalData.nickName = weixin_res.userInfo.nickName;
                updateUserInfoFn(utils, app, weixin_res.userInfo);
              }

            }
          });

            
        },
        fail:function(){
            if (_this) {
                _this.setData({
                    userButton: false,
                })
            }
        }
    })
}

module.exports={
    getUserInfoFn: getUserInfoFn,
    updateUserInfoFn: updateUserInfoFn,
    getUserInfo: getUserInfo
}