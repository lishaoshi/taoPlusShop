// pages/user/user.js
const app = getApp();
const utils = require("../../../utils/util.js");
const api = require("../../../utils/api.js").api;

let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sum: '0.00',
    mobile: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _this = this;
      let mobile = wx.getStorageSync('contact_phone') || '400-1314-199'
      _this.setData({
          mobile: mobile
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if(app.globalData.mobile){
      _this.getBalanceFn();
    }
    // _this.getBalanceFn();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  getBalanceFn: () => {
    utils.uGet(`${api.HOST}/api/user/${app.globalData.userId}/account/balance`, {
      userId: app.globalData.userId
    }, true, true).then((res) => {
      console.log(res);
      wx.stopPullDownRefresh();
      _this.setData({
        sum: parseFloat(res.balance).toFixed(3)
      })
    })
  },

  bindPhoneCbFn: () => {
    _this.getBalanceFn();
  },

  clearFn: () => {

    utils.showTip('提示', '确定清理缓存！').then(() => {
      wx.clearStorage({
        success: () => {
          utils.errorShow('清理成功, 重新启动小程序生效');
        }
      })
    })
  },
    //拨打电话
    callSomeBody: function (e) {
        wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.moblile
        })
    },

})