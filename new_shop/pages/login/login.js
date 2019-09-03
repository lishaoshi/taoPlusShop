import login from '../../api/login.js'
let loginModel = new login()
import { showToast } from '../../utils/util.js'
let app = getApp()
// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden_login : false,
    hidden_register : true,
    c_w : "white",
    c_b : "black",
    mobile: '',
    password: '',
    code: '获取验证码',
    upMobile: '',
    flag: false,
    vCode: '',
    upPsw: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 获取账号密码
  getInputValue(e) {
    let flag = e.currentTarget.dataset.flag
    let value = e.detail.value
    let key
    switch(flag) {
      case 'mobile':
        key = 'mobile'
        break;
      case 'psw':
        key = 'password'
        break;
      case 'upMobile':
        key = 'upMobile'
        break
      case 'code':
        key = 'vCode'
        break
      case 'upPsw':
        key = 'upPsw'
        break
    }
    this.setData({
      [key]: value
    })
    // console.log(this.data)
  },

  // 登陆
  _login() {
    if(!this.data.mobile) {
      showToast('请输入手机号码')
      return
    } else if (this.data.mobile.length < 11) {
      showToast('手机号码不合法')
      return
    } else if (!this.data.password.length) {
      showToast('请输入密码')
      return
    }
    let data = {
      loginName: this.data.mobile,
      password: this.data.password
    }
    loginModel.signIn(data).then(res=>{
       if(res.code == 0) {
        //  app.globalData.userInfo = res.result
        //  app.globalData.shopId = res.result.shop_id
        //  app.globalData.userId = res.result.user_id
        //  app.globalData.agency_id = res.result.agency_id
        //  app.globalData.token = res.result.token
         wx.setStorageSync('shopLoginInfo', res.result)
        //  console.log(app)
        //  return
         wx.reLaunch({
           url: '/pages/index/index',
         })
       } else if(res.code==160) {
         wx.setStorageSync('shopLoginInfo', res.result)
         wx.navigateTo({
           url: '/pages/merchant_entry/index',
         })
         return
       } else if(res.code==163) {
         showToast('商家正在审核')
         wx.setStorageSync('shopLoginInfo', res.result)
         wx.reLaunch({
           url: '/pages/index/index',
         })
         return
       }
       else if (res.code == 165) {
         showToast('商家审核不通过，重新修改信息审核')
         wx.setStorageSync('shopLoginInfo', res.result)
         wx.reLaunch({
           url: '/pages/index/index',
         })
         return
       }
       else if (res.code == 153) {
         showToast('账号被禁用,如有疑问请联系客服0757-85913731', 3000)
         return
       } else if (res.code == 153) {
         showToast('商家被禁用,如有疑问请联系客服0757-85913731', 3000)
         return
       } else {
         showToast(res.message)
       }
    })
  },

  // 点击获取验证码
  getCode() {
    var compare = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    console.log(this.data.upMobile)
    if (!compare.test(this.data.upMobile)) {
      wx.showToast({
        title: '请输入正确的手机号！',
        icon: 'none',
        image: '',
        duration: 1000
      })
      return
    }
    if (this.data.flag) {
      return
    }
    this.setData({
      flag: true
    })
    // this._getCode()
    this._sendCode()
    let num = 60
    this.setData({
      code: num + 's'
    })
    let timing = setInterval(() => {
      num--
      this.setData({
        code: num + 's'
      })
      if (num < 10) {
        this.setData({
          code: `0${num}s`
        })
      }
      if (num <= 0) {
        this.setData({
          code: `获取验证码`,
          flag: false
        })
        clearInterval(timing)
      }
    }, 1000)
  },

  // 发送验证码
  _sendCode() {
    let data = {
      mobile: this.data.upMobile
    }
    loginModel.sendCode(data).then(res=>{
      wx.showToast({
        title: '发送成功',
        icon: 'success',
        image: '',
        duration: 1000
      })
    })
  },

  // 注册
  _signup() {
    if (!this.data.upMobile) {
      showToast('手机号不能为空')
      return
    }
    if (!this.data.upPsw) {
      showToast('密码不能为空')
      return
    }
    if (!this.data.vCode) {
      showToast('验证码不能为空')
      return
    }
    let data = {
      mobile: this.data.upMobile,
      password: this.data.upPsw,
      vCode: this.data.vCode
    }
    loginModel.registerAPP(data).then(res=>{
      showToast(res.message, 1000)
      if(res.code==0) {
        this.setData({
          upPsw: '',
          vCode: '',
          upMobile: '',
          hidden_login: false,
          hidden_register: true,
          c_w: "white",
          c_b: "black"
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  login: function (e){
    this.setData({
      hidden_login: false,
      hidden_register: true,
      c_w: "white",
      c_b: "black",
      password: '',
      mobile: ''
    })
  },

  register: function (e) {
    this.setData({
      upPsw: '',
      vCode:'',
      upMobile: '',
      hidden_login: true,
      hidden_register: false,
      c_w: "black",
      c_b: "white"
    })
  },

})