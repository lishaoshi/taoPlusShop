// pages/reservations_success/reservations_success.js
const app = getApp();

const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      reserveTablesId:null,
      info: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      _this = this;
      _this.setData({
          reserveTablesId: options.reserveTablesId
      });
     
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      _this.reservationsInfo();
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
  onShareAppMessage: function (res) {
  },

  shareFn: function(){
      wx.showShareMenu({
          withShareTicket: true
      });
      return {
          title: '预定',
          path: `/pages/reservations_success/reservations_success?reserveTablesId=${_this.data.reserveTablesId}&shopId=${app.globalData.shopId}`
      }
  },
    reservationsInfo: function(){
        utils.uGet(`${api.HOST}/api/reservationsInfo/${_this.data.reserveTablesId}`, { reserveTablesId: _this.data.reserveTablesId}).then((res)=>{
            console.log(res);
            let info = res[0];
            info.floorSeat = '';
            info.floorSeatList.forEach((item, i)=>{
                info.floorSeat += `/${item.seat_name}`;
            })
            _this.setData({
                info: info
            })
        })
    }
})