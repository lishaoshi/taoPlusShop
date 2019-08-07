// pages/spellGroupDetail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headerList: [
      {
        name: '全部',
        type: ''
      },
      {
        name: '进行中',
        type: 1
      },
      {
        name: '已成团',
        type: 2
      },
      {
        name: '未成团',
        type: 3
      },
      {
        name: '未开始',
        type: 4
      }
    ],
    currentIndex: 0,
    dataList: [
      {},
      {}
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 点击查看拼团状态
  chooseStatus(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      currentIndex: index
    })
  },

  // 查看性情
  goDetail(e) {
    wx.navigateTo({
      url: '/pages/spellGroupComplete/index',
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