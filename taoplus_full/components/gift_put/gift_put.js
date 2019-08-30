const app = getApp();

const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;
const con = require("../../utils/getUserInfo.js");
import Validator from '../../utils/validator.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentCoupon: {},
    gift_tip: '',
    userButton: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    utils.wxLogin().then(() => {
      if (!app.globalData.userId || app.globalData.userId == '') {
        con.getUserInfoFn(_this, utils, app)
        // _this.setData({
        //   phoneShow: true
        // });
      }
      //获取经纬度
      wx.getLocation({
        type: 'wgs84',
        success: function(res) {
          let latitude = res.latitude
          let longitude = res.longitude
          //地址逆解析
          wx.request({
            url: 'https://api.map.baidu.com/geocoder?location=' + latitude + ',' + longitude + '&output=json&coord_type=wgs84&key=mANIkD2dBjNiel6bbEUGPN0WvU9TY4Kh',
            data: {},
            success: function(data) {
              app.globalData.longitude = longitude;
              app.globalData.latitude = latitude;
              app.globalData.provinceName = data.data.result.addressComponent.province;
              app.globalData.cityName = data.data.result.addressComponent.city;
              _this.setData({
                latitude: latitude,
                longitude: longitude,
                goodsList: [],
                provinceName: data.data.result.addressComponent.province,
                cityName: data.data.result.addressComponent.city,
                region: [data.data.result.addressComponent.province, data.data.result.addressComponent.city, '']
              })
              // _this.getListFn();
              // _this.getShopFn();
            },
            fail: function(err) {
              console.log(JSON.stringify(err))
            }
          })

        }
      })

      if (app.globalData.userId) {
        con.getUserInfoFn(_this, utils, app)
      }

    });

    // // 登录成功后 获取当前query参数并存储起来
    console.log(options);

    let currentId = options.currentId;


    this.setData({
      currentId: options.currentId,
      giftTip: options.giftTip
    })

    // 根据优惠券id获取优惠券信息
    let couponId = this.data.currentId;
    
    utils.uGet(`${api.HOST}/api/coupon/${couponId}`, {}).then((res) => {
      console.log('调起分享接口后获取该分享优惠券的信息：');
      console.log(res);
      if (res) {
        _this.setData({
          currentCoupon: res
        });
      }
    });


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {


    console.log('currentCoupon:');
    console.log(this.data.currentCoupon);

  },

  getUserInfo: (e) => {
    _this.setData({
      userButton: false,
    })
    con.getUserInfo(app, _this);
  },

  // 领取优惠券功能
  getGift(e) {
    let _this = this;
    let currentId = e.currentTarget.dataset.id; // 当前所选优惠券的id 
    console.log('currentId：', e.currentTarget.dataset.id)
    console.log('userId::' + app.globalData.userId);

    // 接收转赠优惠券 /api/coupon/{couponId}/receive?userId=
    utils.uPost(`${api.HOST}/api/coupon/${currentId}/receive?userId=${app.globalData.userId}`, {}).then((res) => {
      console.log('接收转赠优惠券后的信息：');
      console.log(res);

      // _this.setData({
      //   afterCoupon: res
      // });

      // 根据优惠券id获取优惠券信息
      let couponId = this.data.currentCoupon.id;
      utils.uGet(`${api.HOST}/api/coupon/${couponId}`, {}).then((res) => {
        console.log('调起分享接口后获取该分享优惠券的信息：');
        console.log(res);
        if (res) {
          _this.setData({
            currentCoupon: res
          });
        }
      });

    });

    // _this.data.currentGiftData.forEach(function (item, index) {
    //   if (item.id == currentId) {
    //     let currentCoupon = JSON.stringify(item);
    //     wx.navigateTo({
    //       url: `/components/gift_detail/gift_detail?currentCoupon=${currentCoupon}`,
    //     })
    //   }
    // });

  },

  // 使用优惠券功能  useCoupon
  useCoupon: function(e) {
    app.globalData.shopId = '';
    // canGiftGiving  1能 0否  测试：13969111112  本人 app.globalData.mobile
    // console.log('app.globalData.mobile:' + app.globalData.mobile);
    let _this = this;
    // //console.log('radio发生change事件，携带value值为：', e.currentTarget.dataset.id)
    let currentId = e.currentTarget.dataset.id; // 当前所选优惠券的id 
    let currentShopId = e.currentTarget.dataset.targetId; //当前优惠券 所属的商家
    console.log('currentId:' + currentId + ',currentShopId:' + currentShopId);

    app.globalData.shopId = currentShopId;
    if (app.globalData.shopId) {
      wx.navigateTo({
        url: '/pages/shop/page/index/index',
      })
    }

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
  onShareAppMessage: function(res) {
    console.log('gift_tip:' + this.data.gift_tip);
    let currentCoupon = JSON.stringify(this.data.currentCoupon)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.data.gift_tip || '领取优惠券',
      path: `/components/gift_put/gift_put?currentCoupon=${currentCoupon}`,
      imageUrl: "../../images/shareCoupon.png",
    }
  }
})