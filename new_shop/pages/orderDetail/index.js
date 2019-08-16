// pages/orderDetail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrderInfo()
  },

  // 获取订单信息
  getOrderInfo() {
    let data = wx.getStorageSync('orderInfo')
    let type
    switch (data.pay_type) {
      case 1:
        type = '微信公众号';
        break;
      case 2:
        type = '支付宝H5';
        break;
      case 3:
        type = '微信H5';
        break;
      case 4:
        type = '小程序支付';
        break;
      case 5:
        type = '微信扫码';
        break;
      case 6:
        type = '支付宝扫码';
        break;
      case 8:
        type = '商家小程序';
        break;
      case 9:
        type = '商圈小程序';
        break;
      case 10:
        type = '平台小程序';
        break;
    }
    data.typeName = type
    let status
    switch (data.order_status) {
      case 1:
        status = '待支付';
        break;
      case 3:
        status = '待使用'
        break;
      case 4:
        status = '已使用';
        break;
      case 5:
        status = '退款中';
        break;
      case 6:
        status = '退款成功';
        break;
      case 7:
        status = '申请退款';
        break;
      case -1:
        status = '已取消';
        break;
    }
    data.status = status
    // console.log(data)
    data.price = data.orderDetailsList[0].total_price / data.orderDetailsList[0].num
    this.setData({
      orderInfo: data
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