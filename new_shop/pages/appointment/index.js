// pages/appointment/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: ['服务设置', '预约管理', '排队管理']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //前往目标页
  goTargetPage(e) {
    let index = e.currentTarget.dataset.index
    index==0&&wx.navigateTo({url: '/pages/serviceMng/index'})
    index == 1 && wx.navigateTo({ url: '/pages/makeAppoint/index' })
    index == 2 && wx.navigateTo({ url: '/pages/lineUp/index' })
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