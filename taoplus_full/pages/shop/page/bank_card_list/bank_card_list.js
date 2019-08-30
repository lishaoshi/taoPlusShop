// pages/bank_card_list/bank_card_list.js
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
    bankList:[],


  },

  /**
   * 查询银行卡列表
   */
  getBankCardListFn: () => {
    utils.uGet(`${api.HOST}/api/user/${app.globalData.userId}/bankcards`, { index: 1, pageSize:20}).then((res) => {
      console.log(res);
      let bankList = res.records;
      bankList.forEach((item, i) => {
        // item.account_type = '1' ?'储蓄卡':'信用卡'
        let num = item.bankcard_num;
        let last = num.slice(-3);
        item.bankcard_num = "**** ***** **** "+last
        switch (item.account_type) {
          case 1:
            item.account_type = "储蓄卡";
            break;
          case 2:
            item.account_type = "信用卡";
            break;
        }
        
      });

      _this.setData({
        bankList: bankList,
      })
    })


  },

  /**
   * 长按删除银行卡
   */

  deleteImage: function (e) {
    let _this = this;
    let bankCardId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除此银行卡吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('点击确定了');
      
          utils.uPost(`${api.HOST}/api/user/bankcard/deleteBankCard`, { userId: app.globalData.userId, bankCardId: bankCardId}).then((res) => {
            utils.successShow('删除成功').then(() => {
              _this.getBankCardListFn();
            })
          })

        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }
        
      }
    })
  },

  
  /**
   * 跳转到添加银行卡
   */
  addBankCardFn(){
    wx.navigateTo({
      url:'../add_bank_card/add_bank_card'
    })
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
    _this.getBankCardListFn();

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