// pages/shop_pay/shop_pay.js
const app = getApp();

const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;
const con = require("../../utils/getUserInfo.js");
let _this;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopName: '',
    money: '',
    userButton: false,
    phoneShow: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


  },
  bindPhoneCbFn: () => {
    _this.getShopNameFn();
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    _this = this;
    console.log(app.globalData)
    utils.wxLogin().then(() => {
      if (!app.globalData.userId || app.globalData.userId == '') {
        con.getUserInfoFn(_this, utils, app)
      } else {
        
      }
      _this.getShopNameFn();
    });
    // if (!app.globalData.userId || app.globalData.userId == '') {
    //   _this.setData({
    //     phoneShow: true
    //   });
    // } else {
    //   _this.getShopNameFn();
    // }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  //获取输入金额
  changeInputFn: function(e) {
    let id = e.target.id;
    let value = e.detail.value;
    console.log(value)
    _this.setData({
      money: value
    })
  },

  /**
   * 获取商家名字
   */
  getShopNameFn: function() {
    utils.uGet(`${api.HOST}/api/shop/${app.globalData.shopId}/shop`, {
      shopId: app.globalData.shopId
    }, false).then((res) => {
      let result = res;
      let shopName = result.shop_name;
      _this.setData({
        shopName: shopName
      })


    });


  },

  //支付函数

  payBtbFn: () => {
    if (!app.globalData.userId || app.globalData.userId == '') {
      con.getUserInfoFn(_this, utils, app)
      return
    }
    console.log(_this)
    console.log('支付函数1111')
    console.log('_this.data.money' + _this.data.money)
    utils.uPost(api.shopAddOrder, {
      shopId: app.globalData.shopId,
      userId: app.globalData.userId,
      money: _this.data.money,
      payType: 1, //支付类型：1、微信 2、支付宝
      shopName: _this.data.shopName,
      openId: app.globalData.openId,
    }).then((res) => {
      let pay_info = JSON.parse(res.pay_info);
      console.log(pay_info);
      wx.requestPayment({
        'timeStamp': pay_info.timeStamp,
        'nonceStr': pay_info.nonceStr,
        'package': pay_info.package,
        'signType': pay_info.signType,
        'paySign': pay_info.paySign,
        'appId': 'wxfed2470abe61685b',
        'success': function(res) {
          setTimeout(() => {
            wx.showToast({
              title: '支付成功',
            })
            wx.navigateTo({
              url: '/pages/index/index',
            })
          }, 500)
        },
        'fail': function(res) {
          console.log('error');
          console.log(res);
          utils.errorShow('支付失败');
        }
      })


    })

  },
  getUserInfo: (e) => {
    con.getUserInfo(app, _this);
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})