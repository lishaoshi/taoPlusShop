// pages/withdraw_success/withdraw_success.js
const app = getApp();
const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;

let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time:'',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this;
    _this.newTime()



  },

  newTime:function(){
    let date=new Date();
    let year = date.getFullYear()
    let month = date.getMonth() + 1 > 10 ? date.getMonth() + 1 : '0'+ date.getMonth() + 1
      let day = date.getDate() > 10 ? date.getDate() : '0' +date.getDate()
      let hour = date.getHours() > 10 ? date.getHours() : '0' + date.getHours()
      let minute = date.getMinutes() > 10 ? date.getMinutes() : '0' + date.getMinutes()
      let second = date.getSeconds() > 10 ? date.getSeconds() : '0' + date.getSeconds()
    _this.setData({
      time: year + '-' + month + '-' + day + ' ' + hour + ":" + minute + ":" + second
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