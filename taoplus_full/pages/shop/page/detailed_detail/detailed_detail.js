// pages/detailed_detail/detailed_detail.js
//获取应用实例
const app = getApp();
const api = require("../../utils/api.js").api;
const utils = require("../../utils/util.js");
import Validator from "../../utils/validator.js";
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      income: '',
      payment: '',
      type: '',
      showType: '',
      sn: '',   
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options){
    _this = this;
    let type;
      switch (+options.type) {
          case 10:
              type = '让利分润 ';
              break;
          case 11:
              type = '报单分润';
              break;
          case 20:
              type = '余额支付';
              break;
          case 21:
              type = '微信支付';
              break;
          case 22:
              type = '支付宝支付';
              break;
          case 30:
              type = '收款';
              break;
          case 40:
              type = '让利提现';
              break;
          case 41:
              type = '提现申请';
              break;
          case 43:
              type = '让利提现失败';
              break;
          case 42:
              type = '让利提现成功';
              break;
          case 50:
              type = '报单提现 ';
              break;
          case 60:
              type = '提现';
              break;
          case 61:
              type = '提现成功';
              break;
          case 62:
              type = '提现失败 ';
              break;
          case 70:
              type = '跨界让利';
              break;
          case 80:
              type = '支付手续费';
              break;
          case 90:
              type = '团购让利 ';
              break;
          case 91:
              type = '团购团长奖励';
              break;
          case 92:
              type = '商家推广员推广让利';
              break;
          case 100:
              type = '商家推广员推广奖励';
              break;

      }
    _this.setData({
        income: options.income,
        payment: options.payment,
        createTime: options.createTime,
        showType: type,
        sn: options.type == 41 ?options.account_detail_id:(options.sn || ''),
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