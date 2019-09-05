// pages/pay/index.js
import shopPayBalance from '../../api/shopPayBalance.js'
let shopPayBalanceModel = new shopPayBalance()
import {showToast} from '../../utils/util.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    amount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getShopPayAmount()
  },

  // 获取商家入驻价格
  _getShopPayAmount() {
    console.log('get')
    shopPayBalanceModel.getShopPayAmount({}).then(res => {
      this.setData({
        shopInPrice: res.value
      })
    })
  },

  // 确认支付
  confirmPay() {
    // console.log('comfrimPay')
    // return
    let data = {
      shopId: app.globalData.shopId,
      price: this.data.shopInPrice,
      openId: app.globalData.openId
    }
    shopPayBalanceModel.confirmPay(data).then(res => {
      let data = JSON.parse(res.pay_info)
      console.log(data)
      wx.requestPayment({
        timeStamp: data.timeStamp,
        nonceStr: data.nonceStr,
        package: data.package,
        signType: data.signType,
        paySign: data.paySign,
        success: (res) => {
          // console.log(res)
          showToast('支付成功')
          app.globalData.isPay = true
        },
        fail: (err) => {
          showToast('取消支付')
        }
      })
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