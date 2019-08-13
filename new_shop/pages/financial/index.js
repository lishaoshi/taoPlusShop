import financial from '../../api/financial.js'
let financialModel = new financial()
const app = getApp()
// pages/financial/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: 0.00
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getBalance()
  },

  // 获取账户余额
  _getBalance() {
    let data = {
      shopId:app.globalData.shopId
    }
    financialModel.getBalance(data).then(res=>{
      this.setData({
        balance: res.result.balance
      })
    })
  },

  // 前往提现页面
  goTakeAway() {
    wx.navigateTo({
      url: '/pages/takeAway/index?total='+this.data.balance,
    })
  },

  // 查看账户详情
  queryDetail(e) {
    wx.navigateTo({
      url: '/pages/account/index?type=financial',
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