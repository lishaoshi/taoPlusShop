
import redBag from '../../api/redBag.js'
let redBagModel = new redBag()
import { showToast } from '../../utils/util.js'
const app = getApp()
import dateTimePicker from '../../utils/dateTimePicker.js'
// pages/addRedBag/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    redBagInfo: {
      amount: '',   //优惠券面额
      canGiftGiving: '',  //能否转赠 1、能 0、不能
      couponEndTime: '',  //优惠券使用结束时间
      couponStartTime: '',   //优惠券使用开始时间
      num: '',   //设置可以领取当前创建的优惠券的数量  不填无限制
      orderAmount: '', //需要满足可以领取条件的金额
      ruleEndTime: '',  //规则结束时间,
      ruleStartTime: '',  //规则开始时间
      satisfactionAmount: '',  //使用需要满足的金额   //不填没有限制
      couponName: ''     //优惠券名称
    },
    isEdit: false,
    startYear: 2000,
    endYear: 2050,
    dateTime: null,
    dateTimeArray: null 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRedBagInfo(options.item)
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray
    });
  },

// 时间变动触发
  bindTimeChange(e) {
    // var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;
    // arr = e.detail.value;
    // dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    // this.setData({
    //   dateTimeArray: dateArr,
    //   dateTime: arr
    // });
    // let flag = e.currentTarget.dataset.timeflag
    // let key = `redBagInfo.${flag}`
    // let data = `${this.data.dateTimeArray[0][this.data.dateTime[0]]}-${this.data.dateTimeArray[1][this.data.dateTime[1]]}-${this.data.dateTimeArray[2][this.data.dateTime[2]]} ${this.data.dateTimeArray[3][this.data.dateTime[3]]}:${this.data.dateTimeArray[4][this.data.dateTime[4]]}:${this.data.dateTimeArray[5][this.data.dateTime[5]]}`
    // this.setData({
    //   [key]: data
    // })
    let flag = e.currentTarget.dataset.timeflag
    let data = e.detail.value;
    let key = `redBagInfo.${flag}`
    this.setData({
      [key]: data
    })
    console.log(data)
  },

  // 获取所有输入框内容
  getInputValue(e) {
    let value = e.detail.value
    let inputFlag = e.currentTarget.dataset.input
    let key = `redBagInfo.${inputFlag}`
    this.setData({
      [key]: value
    })
  },

  //获取红包详情
  getRedBagInfo(data) {
    if (!data) {
      return false
    }
    let info = JSON.parse(data)
    info.couponEndTime = info.couponEndTime.split(' ')[0]
    info.couponStartTime = info.couponEndTime.split(' ')[0]
    info.ruleEndTime = info.ruleEndTime.split(' ')[0]
    info.ruleStartTime = info.ruleStartTime.split(' ')[0]
    this.setData({
      redBagInfo: info,
      isEdit: true
    })
    console.log(this.data)
  },

  // 点击确认按钮
  confirmForm() {
    this.data.isEdit && this._uploadRedBag(this.data.redBagInfo.id)
    !this.data.isEdit && this._addRedBag()
  },

  // 创建红包
  _addRedBag() {
    if (!this.data.redBagInfo.amount) return showToast('请输入优惠券面额')
    if (!this.data.redBagInfo.couponEndTime) return showToast('请选择优惠券使用结束时间')
    if (!this.data.redBagInfo.couponStartTime) return showToast('请选择优惠券使用开始时间')
    if (!this.data.redBagInfo.num) return showToast('请输入优惠券数量')
    if (!this.data.redBagInfo.orderAmount) return showToast('请输入领取条件的金额')
    if (!this.data.redBagInfo.ruleEndTime) return showToast('请选择规则结束时间')
    if (!this.data.redBagInfo.ruleStartTime) return showToast('请选择规则开始时间')
    if (!this.data.redBagInfo.satisfactionAmount) return showToast('请输入优惠券满足的金额')
    if (!this.data.redBagInfo.couponName) return showToast('请输入优惠券名称')

    let data = {
      shopId: app.globalData.shopId,
      amount: this.data.redBagInfo.amount,   //优惠券面额
      couponEndTime: `${this.data.redBagInfo.couponEndTime} 23:59:59`,  //优惠券使用结束时间
      couponStartTime: `${this.data.redBagInfo.couponStartTime} 00:00:00`,   //优惠券使用开始时间
      num: this.data.redBagInfo.num,   //设置可以领取当前创建的优惠券的数量  不填无限制
      orderAmount: this.data.redBagInfo.orderAmount, //需要满足可以领取条件的金额
      ruleEndTime: `${this.data.redBagInfo.ruleEndTime} 23:59:59`,  //规则结束时间,
      ruleStartTime: `${this.data.redBagInfo.ruleStartTime} 00:00:00`,  //规则开始时间
      satisfactionAmount: this.data.redBagInfo.satisfactionAmount,  //使用需要满足的金额   //不填没有限制
      couponName: this.data.redBagInfo.ruleStartTime     //优惠券名称
    }
    redBagModel.addRedBag(data).then(res => {
      showToast('新增成功', 0, 'success')
      setTimeout(() => {
        wx.navigateBack()
      }, 1000)
    })
  },

  // 修改红包规则
  _uploadRedBag(id) {
    if (!this.data.redBagInfo.amount) return showToast('请输入优惠券面额')
    if (!this.data.redBagInfo.couponEndTime) return showToast('请选择优惠券使用结束时间')
    if (!this.data.redBagInfo.couponStartTime) return showToast('请选择优惠券使用开始时间')
    if (!this.data.redBagInfo.num) return showToast('请输入优惠券数量')
    if (!this.data.redBagInfo.orderAmount) return showToast('请输入领取条件的金额')
    if (!this.data.redBagInfo.ruleEndTime) return showToast('请选择规则结束时间')
    if (!this.data.redBagInfo.ruleStartTime) return showToast('请选择规则开始时间')
    if (!this.data.redBagInfo.satisfactionAmount) return showToast('请输入优惠券满足的金额')
    if (!this.data.redBagInfo.couponName) return showToast('请输入优惠券名称')
    let data = {
      shopId: app.globalData.shopId,
      amount: this.data.redBagInfo.amount,   //优惠券面额
      couponEndTime: `${this.data.redBagInfo.couponEndTime} 23:59:59`,  //优惠券使用结束时间
      couponStartTime: `${this.data.redBagInfo.couponStartTime} 00:00:00`,   //优惠券使用开始时间
      num: this.data.redBagInfo.num,   //设置可以领取当前创建的优惠券的数量  不填无限制
      orderAmount: this.data.redBagInfo.orderAmount, //需要满足可以领取条件的金额
      ruleEndTime: `${this.data.redBagInfo.ruleEndTime} 23:59:59`,  //规则结束时间,
      ruleStartTime: `${this.data.redBagInfo.ruleStartTime} 00:00:00`,  //规则开始时间
      satisfactionAmount: this.data.redBagInfo.satisfactionAmount,  //使用需要满足的金额   //不填没有限制
      couponName: this.data.redBagInfo.couponName     //优惠券名称
    }
    redBagModel.uploadRedBag(data, id).then(res => {
      showToast('修改成功', 0, 'success')
        setTimeout(() => {
          wx.navigateBack()
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

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let pages = getCurrentPages()
    let prePage = pages[pages.length - 2]
    prePage._queryredBagRule(true)
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