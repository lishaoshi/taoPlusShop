// components/bag_coupon/bag_coupon.js
const app = getApp();

const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentData: [], // 当前商家可用优惠券数据
    type: null,
    sum: 0, //商品总价格
    num: 1, // 商品数量
    pageIndex:1,//优惠券 请求页数 
    pageSize:8,//优惠券每页几条
    noMore:false,//是否有更多数据
    pagehtml:'',//哪个页面 选择优惠券后 跳转回去
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('urlParams:');
    console.log(options);

    if (options) {
      if (options.type) {
        this.setData({
          sum: options.sum,
          num: options.num,
          alias: options.alias,
          type: options.type,
          pagehtml: options.pagehtml
        });
      }


      let barTitle = '';
      if (options.type == 'bag') {
        barTitle = '请选择红包';
      } else if (options.type == 'coupon') {
        barTitle = '请选择代金券';
      }
      wx.setNavigationBarTitle({
        title: barTitle
      })
    }

    this.getData();
  },

  getData: function() {
    let _this = this;
    let sum = _this.data.sum; // 商品总价
    // //console.log('sum::::'+_this.data.sum);
    // let currentData = wx.getStorageSync(_this.data.type);
    //console.log('userId:+shopId:');
    //console.log(app.globalData.userId + ':' + app.globalData.shopId);

    let alias='';
    if (_this.data.alias == 'redbags') {
      alias = 'RED_PAPER_COUPON';
    } else if (_this.data.alias == 'coupons') {
      alias = 'NORMAL_COUPON';
    } else {
      alias = '';
    }

    utils.uGet(`${api.HOST}/api/coupon/mine`, {
      userId: app.globalData.userId,
      shopId: app.globalData.shopId,
      status: 1,
      alias: alias,
      index: _this.data.pageIndex,
      pageSize: _this.data.pageSize,
    }).then((res) => {
      //console.log(res);

      let currentData = _this.data.currentData.concat(res.records);


      let noMore;
      if (res.total == 0 || currentData.length == res.total) {
        noMore = true
      } else {
        noMore = false
      }

      currentData.forEach(function (item, index) {
        if (item.satisfactionAmount && sum < item.satisfactionAmount) {
          item.noUse = true;
        } else if (sum < item.amount) {
          item.noUse = true;
        } else {
          item.noUse = false;
        }
        // if (item.satisfactionAmount && sum < item.satisfactionAmount) {
        //   item.noUse = true;
        // } else {
        //   item.noUse = false;
        // }
        // //console.log(item.satisfactionAmount,index);
      });

      this.setData({
        currentData: currentData,
        noMore: noMore
      })

      wx.setStorage({
        key: 'coupon',
        data: currentData
      })

      console.log(wx.getStorageSync('coupon'));

    })

  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom:function(e) {
    // //console.log('onReachBottom::');
    // //console.log(this.data.pageIndex);
    // //console.log(this.data.currentData.length);

    let _this = this;
    if (_this.data.noMore) return;

    _this.data.pageIndex++;
    _this.setData({
      pageIndex:_this.data.pageIndex
    });
    _this.getData();

  },

  clickRadio(e) {
    let _this = this;
    // //console.log(e)
    // //console.log('radio发生change事件，携带value值为：', e.currentTarget.dataset.id)
    let type = this.data.type; //当前优惠类型： 红包 || 代金券
    let currentId = e.currentTarget.dataset.id; // 当前所选优惠券的id 
    let nouse = e.currentTarget.dataset.nouse; // 当前所选优惠券是否可用 true 不可用 

    if (nouse) {
      // wx.showToast({
      //   title: '此优惠券不可用',
      //   icon: 'none'
      // })
      return;
    }

    let currentShop = wx.getStorageSync('currentShop');

    // url: `../pay/pay?money=${_this.data.sum}&goodsName=${_this.data.info.goods_name}&orderId=${res.order_id}&shopId=${_this.data.shopId}&grouponJson=${grouponJson}&type=${_this.data.type}&shopName=${_this.data.shopName}`

    // let gotoUrl = `/pages/city/pay/pay?preferType=${type}&preferId=${currentId}&money=${currentShop.money}&goodsName=${currentShop.goodsName}&orderId=${currentShop.orderId}&shopId=${currentShop.shopId}&grouponJson=${currentShop.grouponJson}&type=${currentShop.type}&shopName=${currentShop.shopName}`;

    let gotoUrl;
    if (_this.data.alias == 'redbags') {
      gotoUrl = `/pages/shop/page/shop_pay/shop_pay?preferType=coupon&preferId=${currentId}&money=${_this.data.sum}&num=${_this.data.num}`;
    } else {
      // pagehtml: city district shop shop_car 
      if (_this.data.pagehtml == 'district'){
        gotoUrl = `/pages/district/submit_orders/submit_orders?preferType=${type}&preferId=${currentId}&goodsId=${currentShop.goodsId}&shopId=${currentShop.shopId}&type=${currentShop.type}&shopName=${currentShop.shopName}&money=${_this.data.sum}&num=${_this.data.num}&price=${currentShop.price}`
      } else if (_this.data.pagehtml == 'shop'){
        gotoUrl = `/pages/shop/page/submit_orders/submit_orders?preferType=${type}&preferId=${currentId}&goodsId=${currentShop.goodsId}&shopId=${currentShop.shopId}&type=${currentShop.type}&shopName=${currentShop.shopName}&money=${_this.data.sum}&num=${_this.data.num}&price=${currentShop.price}`
      } else if (_this.data.pagehtml == 'shop_car'){
        gotoUrl = `/pages/shop/page/sublimt_order/sublimt_order?preferType=${type}&preferId=${currentId}&goodsId=${currentShop.goodsId}&shopId=${currentShop.shopId}&type=${currentShop.type}&shopName=${currentShop.shopName}&money=${_this.data.sum}&num=${_this.data.num}&price=${currentShop.price}`
      }else{
        gotoUrl = `/pages/city/submit_orders/submit_orders?preferType=${type}&preferId=${currentId}&goodsId=${currentShop.goodsId}&shopId=${currentShop.shopId}&type=${currentShop.type}&shopName=${currentShop.shopName}&money=${_this.data.sum}&num=${_this.data.num}&price=${currentShop.price}`
      }
      
    }


    wx.navigateBack({
      delta: 1,
      success: function(res) {
        //console.log(res);
      }
    })

    wx.redirectTo({
      url: gotoUrl,
      success: function(res) {
        _this.onLoad()
      }
    })

    //console.log(gotoUrl);

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})