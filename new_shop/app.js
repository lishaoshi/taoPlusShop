import config from './config.js'
// import login from './api/login.js'
// let loginModel = new login()
//app.js
App({
  onLaunch: function () {
    this._login()
    this.getUserInfo()
    this.getStorage()
  },

  // 获取用户信息
  _login() {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        let code = res.code
        wx.request({
          url: `${config.base_url}/settled/shop/wxLogin`,
          data: {
            code: res.code
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success:(data)=>{
            // console.log(data)
            this.globalData.openId = data.data.openid
          }
        })
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

  // 封装获取缓存数据
  getStorage() {
    // console('11')
   let data = wx.getStorageSync('shopLoginInfo')
    if (data.token &&data.shop_id) {
      this.globalData.token = data.token
      this.globalData.agency_id = data.agency_id
      this.globalData.userId = data.user_id
      this.globalData.shopId = data.shop_id
    } else {
      wx.reLaunch({
        url: '/pages/login/login',
      })
      return
    }
  },
  globalData: {
    // 登录成功保存用户信息
    userInfo: {
    },

    // 测试试用token
    token: '',

    // // 测试用户userId
    // userId: '5ec67fd5e7a44ebfa5344bd60667a605',

    // // 测试用户shopId
    // shopId: '53ff2cdcbe5a49afa5d2c153a611d2cf'

    // 代理机构id
    agency_id: '',

    // 正式试用token
    // token: '13246800297_2f4e0406a9d64e0ab9400b86de893605',

    // 正式用户userId
    userId: '',

    // 正式用户shopId
    shopId: '',
    openId: '',
    isPay: true  //商家是否已经支付  true：已经支付  false：未支付
  }
})