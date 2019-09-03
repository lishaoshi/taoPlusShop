import coupons from '../../api/coupons.js'
let couponsModel = new coupons()
import { showToast } from '../../utils/util.js'
const app = getApp()
import dateTimePicker from '../../utils/dateTimePicker.js'
// pages/addCoupon/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponInfo: {
      amount: '',   //优惠券面额
      canGiftGiving: '',  //能否转赠 1、能 0、不能
      couponEndTime: '',  //优惠券使用结束时间
      couponStartTime: '',   //优惠券使用开始时间
      num: '',   //设置可以领取当前创建的优惠券的数量  不填无限制
      totalOrderAmount: '', //需要满足可以领取条件的金额
      ruleEndTime: '',  //规则结束时间,
      ruleStartTime: '',  //规则开始时间
      satisfactionAmount: '',  //使用需要满足的金额   //不填没有限制
      couponName: ''     //优惠券名称
    },
    items: [
      {
        name: '能',
        type: 1,
        checked: false
      }, {
        name: '不能',
        type: 0,
        checked: false
      }
    ],
    isEdit: false,
    // startYear: 2000,
    // endYear: 2050,
    // dateTime: null,
    // dateTimeArray: null 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.item)
    this.getCouponInfo(options.item)
    // 获取完整的年月日 时分秒，以及默认显示的数组
    // var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // console.log(obj)
    // this.setData({
    //   dateTime: obj.dateTime,
    //   dateTimeArray: obj.dateTimeArray
    // });


  },

  //获取优惠券详情
  getCouponInfo(data) {
    
    if (!data) {
      return
    }
    
    let info = JSON.parse(data)
    let key 
    if (info.canGiftGiving) key =`items[0].checked`
    else key = `items[1].checked`
    console.log(info)
    this.setData({
      [key]: true,
      couponInfo: info,
      isEdit: true
    })
  },

  // 时间列变动出发
  bindTimeChange(e) {
    // console.log(e)
    // var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;
    // arr = e.detail.value;
    // dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    // this.setData({
    //   dateTimeArray: dateArr,
    //   dateTime: arr
    // });
    // let flag = e.currentTarget.dataset.timeflag
    // let key = `couponInfo.${flag}`
    // // let data = `${this.data.dateTimeArray[0][this.data.dateTime[0]]}-${this.data.dateTimeArray[1][this.data.dateTime[1]]}-${this.data.dateTimeArray[2][this.data.dateTime[2]]} ${this.data.dateTimeArray[3][this.data.dateTime[3]]}:${this.data.dateTimeArray[4][this.data.dateTime[4]]}:${this.data.dateTimeArray[5][this.data.dateTime[5]]}`
    // // this.setData({
    // //   [key]: data
    // // })
    // console.log(this.data, key)
    console.log(e)
    let data = e.detail.value
    let key = `couponInfo.${e.currentTarget.dataset.timeflag}`
    this.setData({
      [key]: data
    })
  },

  // 获取所有输入框内容
  getInputValue(e) {
    let value = e.detail.value
    let inputFlag = e.currentTarget.dataset.input
    let key = `couponInfo.${inputFlag}`
    this.setData({
      [key]: value
    })
    // console.log(this.data)
  },

  // 是否可以转赠选择区域
  radioChange(e) {
    let value = e.detail.value
    let key = `couponInfo.canGiftGiving`
    this.setData({
      [key]:value
    })
  },

  // 点击确认按钮
  confirmForm() {
    this.data.isEdit && this._updateCoupon(this.data.couponInfo.id)
    !this.data.isEdit && this._addCoupon()
  },

  // 创建普通优惠券
  _addCoupon() {
    let data = {
      shopId: app.globalData.shopId,
      amount: this.data.couponInfo.amount,   //优惠券面额
      canGiftGiving: this.data.couponInfo.canGiftGiving,  //能否转赠 1、能 0、不能
      couponEndTime: this.data.couponInfo.couponEndTime,  //优惠券使用结束时间
      couponStartTime: this.data.couponInfo.couponStartTime,   //优惠券使用开始时间
      num: this.data.couponInfo.num,   //设置可以领取当前创建的优惠券的数量  不填无限制
      totalOrderAmount: this.data.couponInfo.totalOrderAmount, //需要满足可以领取条件的金额
      ruleEndTime: this.data.couponInfo.ruleEndTime,  //规则结束时间,
      ruleStartTime: this.data.couponInfo.ruleStartTime,  //规则开始时间
      satisfactionAmount: this.data.couponInfo.satisfactionAmount,  //使用需要满足的金额   //不填没有限制
      couponName: this.data.couponInfo.couponName     //优惠券名称
    }
    couponsModel.addCoupon(data).then(res => {
      wx.navigateBack()
    })
  },

  // 修改普通优惠券
  _updateCoupon(id) {
    console.log(this.data)
    if (!this.data.couponInfo.amount) return showToast('面额不能为空!')
    if (!this.data.items[0].checked && !this.data.items[1].checked) return showToast('请选择是否能转赠!')
    if (!this.data.couponInfo.totalOrderAmount) return showToast('领取条件不能为空!')
    let data = {
      shopId: app.globalData.shopId,
      amount: this.data.couponInfo.amount,   //优惠券面额
      canGiftGiving: this.data.couponInfo.canGiftGiving,  //能否转赠 1、能 0、不能
      couponEndTime: this.data.couponInfo.couponEndTime,  //优惠券使用结束时间
      couponStartTime: this.data.couponInfo.couponStartTime,   //优惠券使用开始时间
      num: this.data.couponInfo.num,   //设置可以领取当前创建的优惠券的数量  不填无限制
      totalOrderAmount: this.data.couponInfo.totalOrderAmount, //需要满足可以领取条件的金额
      ruleEndTime: this.data.couponInfo.ruleEndTime,  //规则结束时间,
      ruleStartTime: this.data.couponInfo.ruleStartTime,  //规则开始时间
      satisfactionAmount: this.data.couponInfo.satisfactionAmount,  //使用需要满足的金额   //不填没有限制
      couponName: this.data.couponInfo.couponName     //优惠券名称
    }
    couponsModel.updateCoupon(data, id).then(res => {
      wx.navigateBack()
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
    let prePage = pages[pages.length-2]
    prePage._queryCouponRule()
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