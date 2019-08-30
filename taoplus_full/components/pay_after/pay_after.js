// components/pay_after/pay_after.js
const app = getApp();

const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;
const con = require("../../utils/getUserInfo.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:'',//订单id
    shopName:'test',//商店名称
    money:0,//支付金额
    shopId:'',//商店id
    userId:'',//用户id
    redBagData:[],//优惠券红包数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if(options){
      this.setData({
        orderId: options.orderId,
        shopName:options.shopName,
        money:options.money
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getShopNameFn();
  },
  // 获取支付成功信息 /api/pay/order/{orderId}/coupon/receivable
  getShopNameFn: function() {
    let _this = this;
    console.log('pay_after_orderId:'+this.data.orderId);
    let orderId = this.data.orderId;
    utils.uGet(`${api.HOST}/api/pay/order/${orderId}/coupon/receivable`, {
      // shopId: app.globalData.shopId
    }, false).then((res) => {
      console.log('pay_after_res:');
      console.log(res);
      _this.setData({
        redBagData: res
      })
    });
  },
 
  // 领取代金券-领取优惠券 /coupon/rule/{couponRuleId}/receive
  saveCoupon: function(e) {
    console.log('e.target.dataset.id' + e.target.dataset.id);
    console.log('userId' + app.globalData.userId);
    console.log(this.data.redBagData);

    let _this = this;
    let redBagData = this.data.redBagData;

    let couponRuleId = e.currentTarget.dataset.id;
    let couponRuleIndex = e.currentTarget.dataset.index;

    if (redBagData[couponRuleIndex].isSave){
      wx.showToast({
        title: '已领取',
        icon: 'none'
      })
      return false;
    }

    utils.uPost(`${api.HOST}/api/coupon/rule/${couponRuleId}/receive`, {
      userId: app.globalData.userId
    }).then((res) => {
      console.log(res);

      redBagData.forEach(function(item, index) {
        console.log(item + ':' + index);
        if (item.id == couponRuleId) {
          redBagData[index].isSave = true;
          _this.setData({
            redBagData: redBagData
          });
        }
      })

    })
  },

  // 点击‘完成’按钮回到首页
  gotoHome:function(){
    wx.redirectTo({
      url: '/pages/shop/page/index/index',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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