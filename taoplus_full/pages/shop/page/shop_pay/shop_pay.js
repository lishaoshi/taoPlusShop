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
    phoneShow: false,
    sum: 0, // 处理优惠券使用条件： 支付金额sum > 优惠券额度
    couponSum:0,//所需优惠券额度
    reGet:false, //是否选择优惠券后再重填金额
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    // 处理优惠券：红包 & 代金券
    console.log(options);
    console.log(options.preferType + ':' + options.preferId);
    if (options.preferType && options.preferId) {
      wx.getStorage({
        key: 'coupon',
        success(res) {
          console.log(res.data)
          res.data.forEach(function (item) {
            if (item.id == options.preferId) {
              wx.setStorageSync('couponMoney', item)
              // wx.setStorage({
              //   key: options.preferType + 'Money',
              //   data: item
              // })
              
              _this.setData({
                couponSum: Number(wx.getStorageSync('couponMoney').amount),
                money: options.money
              });

            }
          });
        }
      })
    } else {
      wx.removeStorage({
        key: 'couponMoney',
        success: function (res) {
          console.log('清楚上一次所选的优惠券');
        },
      })
    }

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
    console.log('money::' + this.data.money);


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
      money: value,
      reGet: true
    })
    wx.removeStorage({
      key: 'couponMoney',
      success: function(res) {
        console.log('支付金额改变时需要重选优惠券');
      },
    })
    _this.setData({
      couponSum: Number(wx.getStorageSync('couponMoney').amount)
    });
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
    let couponId = wx.getStorageSync('couponMoney').id || ''
    if (!_this.data.money){
      wx.showToast({
        title: '请输入金额',
        icon: 'none'
      })
      return;
    }
    utils.uPost(api.shopAddOrder, {
      shopId: app.globalData.shopId,
      userId: app.globalData.userId,
      money: _this.data.money,
      payType: 1, //支付类型：1、微信 2、支付宝
      shopName: _this.data.shopName,
      openId: app.globalData.openId,
      // 当前优惠券id
      couponId: couponId,
    }).then((res) => {
      console.log('支付函数完后')
      console.log(res)
      let pay_info = JSON.parse(res.pay_info);
      console.log(pay_info);

      let order_id = res.orderId;
      console.log('orderId:' + order_id);

      wx.requestPayment({
        'timeStamp': pay_info.timeStamp,
        'nonceStr': pay_info.nonceStr,
        'package': pay_info.package,
        'signType': pay_info.signType,
        'paySign': pay_info.paySign,
        'appId': 'wxfed2470abe61685b',
        'success': function(res) {
          console.log('res::');
          console.log(res);
          setTimeout(() => {
            wx.showToast({
              title: '支付成功',
            })
            wx.redirectTo({
              // url: '/pages/index/index',
              url: `/components/pay_after/pay_after?orderId=${order_id}&shopName=${_this.data.shopName}&money=${_this.data.money}`,
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
    console.log('onUnload');
    wx.removeStorageSync('bagMoney');
    wx.removeStorageSync('couponMoney');
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