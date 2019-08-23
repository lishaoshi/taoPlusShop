import coupons from '../../api/coupons.js'
let couponsModel = new coupons()
const app = getApp()
// pages/coupon/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNo: 1,
    pageSize: 8,
    redBagData: {    //创建红包对象
      amount: 0,   //红包面额，0
      canGiftGiving: 0,   //设置红包是否能转赠  1、能 0、不能
      couponEndTime: '',   //优惠券有限期
      couponStartTime: '',
      num:  0, //优惠券d数量
      totalOrderAmount: 0,  //领取条件： 没有使用优惠券的总价格满足金额
      ruleEndTime: '',
      ruleStartTime: '',
      satisfactionAmount: '',
      couponName: ''
    },
    couponRuleList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._queryCouponRule()
  },

  // 获取优惠券规则列表
  _queryCouponRule() {
    this.setData({
      couponRuleList: []
    })
    let data = {
      index: this.data.pageNo,
      pageSize: this.data.pageSize,
      alias: 'NORMAL_COUPON'
    }
    couponsModel.queryCouponRule(data).then(res=>{
      this.setData({
        couponRuleList: [...this.data.couponRuleList, ...res.records],
        total: res.total
      })
    })
  },

  // 点击前往修改优惠券详情页
  _updateCoupon(e) {
    let item = e.currentTarget.dataset.item
    // console.log(item)
    let value  = JSON.stringify(item)
    wx.navigateTo({
      url: '/pages/addCoupon/index?item='+value,
    })
  },

  // 前往添加页
  goAddCoupon() {
    wx.navigateTo({
      url: '/pages/addCoupon/index',
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
    if(this.data.total <= this.data.couponRuleList.length) return
    this.setData({
      pageNo: ++this.data.pageNo
    })
    this._queryCouponRule()
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