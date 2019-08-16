import login from '../../api/login.js'
let loginModel = new login()
import { showToast } from '../../utils/util.js'
let app = getApp()
// pages/forget/forget.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    vCode: '',
    password: '',
    confirmPsw:'',
    code: '发送验证码',
    userId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 点击获取验证码
  getCode() {
    var compare = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    console.log(this.data.upMobile)
    if (!compare.test(this.data.mobile)) {
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
      mobile: this.data.mobile
    }
    loginModel.sendCode(data).then(res => {
      wx.showToast({
        title: '发送成功',
        icon: 'success',
        image: '',
        duration: 1000
      })
    })
  },

  // 发送验证
  _validateMobileAndVocde() {
    if(!this.data.mobile) {
      showToast('手机不能为空')
      return
    }
    if (!this.data.vCode) {
      showToast('验证码不能为空')
      return
    }
    if (!this.data.password) {
      showToast('密码不能为空')
      return
    }
    if (!this.data.confirmPsw) {
      showToast('确认密码不能为空')
      return
    }
    let data = {
      mobile: this.data.mobile,
      vCode: this.data.vCode
    }
    loginModel.validateMobileAndVocde(data).then(res=>{
      if(res.code==0) {
        if(this.data.password!==this.data.confirmPsw) {
          showToast('两次密码不一致')
          return
        }
        this.setData({
          userId: res.result
        })
        this.changPsw()
      } else {
        showToast(res.message)
      }
    })
  },

  // 封装修改密码函数
  changPsw() {
    let data = {
      mobile: this.data.mobile,
      userId: this.data.userId,
      password:this.data.password
    }
    loginModel.setNewPassword(data).then(res=>{
      showToast('密码修改成功')
      setTimeout(()=>{
        wx.navigateBack()
      },1000)
    })
  },

  // 获取输出框内容
  getInputValue(e) {
    let flag = e.currentTarget.dataset.flag
    let value = e.detail.value
    let key
    switch(flag) {
      case 'mobile':
        key='mobile';
        break;
      case 'code':
        key = 'vCode';
        break;
      case 'password':
        key = 'password';
        break;
      case 'confirmPsw':
        key = 'confirmPsw';
        break;
    }
    this.setData({
      [key]:value
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

  }
})