import account from '../../api/account.js'
let accountModel = new account()
let app = getApp()

// pages/account/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNo: 1,
    pageSize: 999,
    date: '',
    dataList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCurrentDate()
    this._queryShopAccountList()
  },

  // 查询商家账户明细
  _queryShopAccountList() {
    let data = {
      shopId: app.globalData.shopId,
      pageNum: this.data.pageNo,
      pageSize: this.data.pageSize,
      date: this.data.date
    }
    accountModel.getAccountList(data).then(res => {
      this.setData({
        dataList: res.result
      })
    })
  },

  // 日期控件改变时出发
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
    this._queryShopAccountList()
  },

  // 获取当前时间
  getCurrentDate() {
    let date = new Date()
    let y = date.getFullYear()
    let m = date.getMonth()+1
    let d = date.getDate()
    let currentDate = `${y}-${m}-${d}`
    // console.log(currentDate)
    this.setData({
      date: currentDate
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
  onReachBottom: function (e) {
    console.log(e)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})