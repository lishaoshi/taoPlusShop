
import timePeriod from '../../api/timePeriod.js'
let timePeriodModel = new timePeriod()
const app = getApp()
// pages/timePeriod/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNo: 1,
    pageSize: 20,
    dataList: [],
    week: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._selectTimeIntervalList()
  },

  // 获取时段列表
  _selectTimeIntervalList() {
    let data = {
      shopId: app.globalData.shopId,
      week: '',
      pageNum: this.data.pageNo,
      pageSize: this.data.pageSize
    }
    
    timePeriodModel.selectTimeIntervalList(data).then(res=>{
      res.result.forEach((item, index, arr)=>{
        var weekArr = item.week.split(',');
        let weekStr = []
        weekArr.forEach((items, key, target)=>{
          
          switch (items) {
            case '1':
              weekStr.push('一')
              break;
            case '2':
              weekStr.push('二')
              break;
            case '3':
              weekStr.push('三')
              break;
            case '4':
              weekStr.push('四')
              break;
            case '5':
              weekStr.push('五')
              break;
            case '6':
              weekStr.push('六')
              break;
            case '0':
              weekStr.push('日')
              break;
          }
          
        })
        arr[index].weeks = weekStr
      })
      this.setData({
        dataList: res.result
      })
    })
  },

  editTime(e) {
    // console.log(e)
    wx.setStorageSync('timePer', e.currentTarget.dataset.item)
    wx.navigateTo({
      url: '/pages/addTimePeviod/index?isEdit=1',
    })
  },

  addOrEditTime() {
    wx.navigateTo({
      url: '/pages/addTimePeviod/index',
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