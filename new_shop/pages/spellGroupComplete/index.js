import spellGroup from '../../api/spellGroup.js'
let spellGroupModel = new spellGroup()
const app = getApp()
// pages/spellGroupComplete/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    grouponsId:'',
    data: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      grouponsId: options.grouponsId
    })
    this._queryGroupUser()
  },


  // 获取拼团用户列表
  _queryGroupUser() {
    spellGroupModel.queryGroupUser({}, this.data.grouponsId).then(res=>{
      if(res) {
        this.setData({
          data: res
        })
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