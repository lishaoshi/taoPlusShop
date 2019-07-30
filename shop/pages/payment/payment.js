// pages/payment/payment.js
//获取应用实例
const app = getApp();
const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      sumMoney: 0, //总金额
      orderId: "",//订单id
      shopName: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let sumMoney = options.sumMoney || 0;
      let orderId = options.orderId || "";
      let shopName = options.shopName || "";
      this.setData({
          sumMoney: sumMoney,
          orderId: orderId,
          shopName: shopName
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

  paymentFn: function(){
    let _this = this;
    utils.uPost(api.userAddOrder,{
        orderId: _this.data.orderId,
        shopId: app.globalData.shopId,
        userId: app.globalData.userId,
        openId: app.globalData.openId,
        actualPrice: _this.data.sumMoney,
        payType  : 1,
        shopName: app.globalData.shopName
    }).then((res)=>{
        console.log(res);
        let pay_info = JSON.parse(res.pay_info);
        console.log(pay_info);
        wx.requestPayment({
            'timeStamp': pay_info.timeStamp,
            'nonceStr': pay_info.nonceStr,
            'package': pay_info.package,
            'signType': pay_info.signType,
            'paySign': pay_info.paySign,
            'appId': 'wxfed2470abe61685b',
            'success': function (res) {
                console.log('success');
                console.log(res);
                wx.showToast({
                    title: '支付成功',
                    icon: 'none',
                    success: () => {
                        setTimeout(function(){
                            wx.redirectTo({
                                url: '../order_success/order_success?orderId=' + _this.data.orderId
                            });
                        },3000)
                    }
                })
            },
            'fail': function (res) {
                console.log('error');
                console.log(res);
                utils.errorShow('支付失败');
            }
        })
    })
  },

    bindPhoneCbFn: () => {

    },
})