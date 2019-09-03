import shopPayBalance from '../../api/shopPayBalance.js'
let shopPayBalanceModel = new shopPayBalance()
const app = getApp()
// pages/merchant_entry/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        img: '/img/icon-1.png',
        name: '提交资料'
      },
      {
        img: '/img/icon-2.png',
        name: '店铺审核'
      },
      {
        img: '/img/icon-3.png',
        name: '上线营业'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getShopPayAmount()
  },

  // 前往入驻页
  goIn() {
    wx.navigateTo({
      url: '/pages/shopDetailInfo/index?isIn=1',
    })
  },

  // 获取商家登陆缓存数据
  _getShopPayAmount() {
    let data = wx.getStorageSync('shopLoginInfo')
    app.globalData.userId = data.user_id
    app.globalData.token = data.token
  },

  // 拨打电话
  goCall() {
    wx.makePhoneCall({
      phoneNumber: '4001314199',
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