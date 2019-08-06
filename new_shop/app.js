import config from './config.js'
// import login from './api/login.js'
// let loginModel = new login()
//app.js
App({
  onLaunch: function () {
    this._login()
    this.getUserInfo()
  },

  // 获取用户信息
  _login() {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        let code = res.code
        // 用户登录获取token
        // loginModel.signIn()
      }
    })
  },
  // 获取用户微信信息
  getUserInfo() {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        // 已授权
        if (res.authSetting['scope.userInfo']) {
          // 获取用户微信信息
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              // console.log('this.globalData.userInfo', res)
              this.globalData.userInfo = res.userInfo;
            }
          })
        }
      }
    })
  },
  globalData: {
    // 登录成功保存用户信息
    userInfo: {
    },

    // 测试试用token
    token: '13246800297_fb8df2e096c54651a7778a3979f0adcd',

    // 测试用户userId
    userId: '5ec67fd5e7a44ebfa5344bd60667a605',

    // 测试用户shopId
    shopId: '53ff2cdcbe5a49afa5d2c153a611d2cf'
  }
})