// pages/addBankCard/index.js
// var util = require('../../utils/bank.js');
// import bankCard from '../../api/bankCard.js'
// import code from '../../api/getCode.js'
// let bankName = new bankCard()
// let getcode = new code()
const app = getApp()
import financial from '../../api/financial.js'
let financialModel = new financial()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: "获取验证码",
    bankNameList: [],
    flag: false, //是否正在获取验证码
    bankCardData: {
      bankCardNum: '',
      userName: '',
      userIdCard: '',   //身份证号
      code: ''       //验证码
    },
    index: null,
    bankNo: null,
    bankCode: null,
    bankName: null,
    showBank: true,
    mobile: ''
  },

  // 获取全部银行名称
  _getAllBankName() {
    financialModel.getAllBankName().then(res => {
      this.setData({
        bankNameList: res
      })
    })
  },

  /**
 * 选择银行卡
 */
  bindPickerChangeFn(e) {
    console.log(e)
    let index = e.detail.value;
    // console.log(this.data.bankNameList)
    let bankNameList = this.data.bankNameList;
    let bankNo = bankNameList[index].bank_no;
    let bankCode = bankNameList[index].bank_code;
    let bankName = bankNameList[index].bank_name;
    this.setData({
      index: index,
      bankNo: bankNo,
      bankCode: bankCode,
      bankName: bankName,
      showBank: false
    })
    console.log(this.data)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var pages = getCurrentPages();//当前页面栈
    console.log(pages)
    this._getAllBankName()
    // this._getCode()
  },

  // 发送请求获取验证码
  _getCode(e) {
    financialModel.getcode({
      mobile: this.data.mobile
    })
  },

  // 获取银行号码
  getBankCardNum(e) {
    const bankCardNum = e.detail.value
    const key = 'bankCardData.bankCardNum'
    this.setData({
      [key]: bankCardNum
    })
  },

  // 获取持卡人姓名
  getUserName(e) {
    const userName = e.detail.value
    const key = 'bankCardData.userName'
    this.setData({
      [key]: userName
    })
    // console.log(this.data)
  },

  // 获取身份证号码
  getIdCard(e) {
    const userIdCard = e.detail.value
    const key = 'bankCardData.userIdCard'
    this.setData({
      [key]: userIdCard
    })
  },

  // 获取手机号
  getPhone(e) {
    // console.log(e)
    const userPhone = e.detail.value
    // const key = 'bankCardData.userPhone'
    this.setData({
      mobile: userPhone
    })
    // console.log(this.data)
  },

  // 获取输入框验证码
  getInputCode(e) {
    const code = e.detail.value
    const key = 'bankCardData.code'
    this.setData({
      [key]: code
    })
  },

  // 点击获取验证码
  getCode() {
    var compare = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    console.log(this.data.mobile)
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
    wx.showToast({
      title: '发送成功',
      icon: 'success',
      image: '',
      duration: 1000
    })
    this._getCode()
    let num = 60
    this.setData({
      code: num + 's'
    })
    let timing = setInterval(() => {
      this.setData({
        code: num + 's'
      })
      num--
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

  // 提交银行信息
  submitBankInfo() {
    var compare = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    var idCard = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i;
    if (this.data.bankCardData.userName.length == 0) {
      wx.showToast({
        title: '用户名不能为空',
        icon: 'none',
        image: '',
        duration: 1000
      })
      return
    } else if (this.data.mobile.length != 11) {
      wx.showToast({
        title: '手机号长度有误',
        icon: 'none',
        image: '',
        duration: 1000
      })
      return false;
    } else if (!compare.test(this.data.mobile)) {
      wx.showToast({
        title: '请输入正确的手机号！',
        icon: 'none',
        image: '',
        duration: 1000
      })
      return false;
    } else if (!this.data.bankCardData.bankCardNum) {
      wx.showToast({
        title: '银行卡号不能为空',
        icon: 'none',
        image: '',
        duration: 1000
      })
      return
    } else if (!idCard.test(this.data.bankCardData.userIdCard)) {
      wx.showToast({
        title: '请输入正确身份证号',
        icon: 'none',
        image: '',
        duration: 1000
      })
      return
    } else if (!this.data.bankCardData.code) {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 1000
      })
      return
    }

    let data = {
      userId: app.globalData.shopId,
      bankcardName: this.data.bankName,
      username: this.data.bankCardData.userName,
      bankcardNum: this.data.bankCardData.bankCardNum,
      type: '1',
      mobile: this.data.mobile,     //手机号
      bankNo: this.data.bankNo,     //银行no
      bankCode: this.data.bankCode,
      identity: this.data.bankCardData.userIdCard, //身份证号
      vCode: this.data.bankCardData.code
    }
    financialModel.addBindBankCard(data).then(res => {
      wx.showToast({
        title: '绑定成功'
      })
      setTimeout(function () {
        var pages = getCurrentPages();//当前页面栈
        console.log(pages)
        var beforePage = pages[pages.length - 2];//获取上一个页面实例对象
        beforePage._getBankCardList();//触发父页面中的方法
        wx.navigateBack({
          delta: 1
        })
      }, 1000)

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
    console.log('添加银行卡页面隐藏')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // console.log('添加银行卡页面卸载')
    // if(flag)
    return
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