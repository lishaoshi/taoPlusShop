import { showToast } from '../../utils/util.js'
import verify from '../../api/verify.js'
let verifyModel = new verify()
const app = getApp()
// pages/verify/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '11',
    value: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 打开扫码
  openScanCode() {
    wx.scanCode({
      scanType: ['barCode', 'qrCode', 'datamatrix','pdf417'],
      success:res=>{
        
      }
    })
  },
  // 获取输入框券码
  getCode(e) {
    // console.log(e)
    let val = e.detail.value
    this.setData({
      value:val
    })
  },

  // 查询要销毁的订单
  queryOrder() {
    if (!this.data.value && !this.data.inputValue) {
      showToast('券码不能为空！')
      return
    }
    let data = {
      shopId: app.global.shopId,
      couponCode: this.data.value
    }
    verifyModel.queryTicket(data, this.data.value, app.global.shopId)
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