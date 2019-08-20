import { showToast } from '../../utils/util.js'
import verify from '../../api/verify.js'
let verifyModel = new verify()
const app = getApp()
// pages/verification_detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: {},
    orderId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let val = JSON.parse(options.code)
    this.setData({
      orderInfo: val,
      orderId: val.orderId
    })
    // this.queryOrder(val)
  },
  // // 查询要销毁的订单
  // queryOrder(val) {
  //   let data = {
  //     shopId: app.globalData.shopId
  //   }
  //   verifyModel.queryTicket(data, val, app.globalData.shopId).then(res => {
  //     if (res.length > 0) {
  //       let orderId = res[0].orderId;
  //       this.setData({
  //         orderInfo: res[0],
  //         orderId: orderId
  //       })
  //     } else {
  //       showToast('该商家没有此券码或已使用该券码');
  //     }
  //   })
  // },
// 核销订单
  _verifyOrder() {
    wx.showModal({
      title: '提示',
      content: '确定核销该订单吗？',
      success:res=> {
        if(res.confirm) {
          verifyModel.verifyOrder({}, app.globalData.shopId, this.data.orderId).then(res=>{
            if (res === true) {
              showToast("核销成功");
              wx.navigateBack()
            } else {
              showToast("核销失败")
            }
          })
        }
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

  }
})