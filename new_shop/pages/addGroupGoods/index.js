import spellGroup from '../../api/spellGroup.js'
let spellGroupModel = new spellGroup()
const app = getApp()
// pages/addGroupGoods/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDate:'',
    startTime: '',
    endDate: '',
    endTime: '',
    array: ['即时消费', '等待消费'],
    index:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 点击前往选择商品
  chooseGoods() {
    wx.navigateTo({
      url: '/pages/chooseGoods/index',
    })
  },

  // 发起团购操作
  sendGroupGoods() {
    // let data = {
    //   goodsId: //goodsId,
    //   shopId: //SHOPID,
    //   grouponPrice: //团购价格,
    //   headAward: //团长奖励,
    //   grouponSum: //成团数量,
    //   grouponTime: //成团时限 1、一天 2、两天   以次类推,
    //   finallyTime: //最后使用时间,
    //   startTime: //startTime,
    //   endTime: //endTime,
    //   grouponGoodsType: //拼团商品类型：1、即时拼团  2、线上拼团,
    // }
    // spellGroupModel.addGroupGoods(data).then(res=>{

    // })
  },

  // 选择开始日期回调
  bindStartDateChange(e) {
    let startDate = e.detail.value
    this.setData({
      startDate
    })
  },
  // 选择开始时间回调
  bindStartTimeChange(e) {
    let startTime = e.detail.value
    this.setData({
      startTime
    })
  },
  // 选择结束日期回调
  bindEndDateChange(e) {
    let endDate = e.detail.value
    this.setData({
      endDate
    })
  },
  // 选择结束时间回调
  bindEndTimeChange(e) {
    let endTime = e.detail.value
    this.setData({
      endTime
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