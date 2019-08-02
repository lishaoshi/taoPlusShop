//app.js
App({
  onLaunch: function () {
    this.login()
    this.getUserInfo()
  },
  // 获取用户信息
  login() {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
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
    userInfo: null
  }
})