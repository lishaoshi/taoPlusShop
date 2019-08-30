// pages/remind/remind.js
//获取应用实例
const app = getApp();
const utils = require("../../utils/util.js");
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    remind:"", //备注
    receipt:"", //发票
    tax: "" //税号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      _this = this;
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

changeInputFn: function (e) {
    let id = e.target.id;
    let val = e.detail.value;
    
    _this.setData({
        [id]: val
    });
},
  submitFn: function(){
      let _this = this;
      let remind = _this.data.remind;
      let receipt = _this.data.receipt;
      let tax = _this.data.tax;
      app.globalData.remind = remind;
      app.globalData.receipt = receipt;
      app.globalData.tax = tax;
      utils.back();
  }
  
})