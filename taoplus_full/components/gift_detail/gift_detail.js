// components/gift_detail/gift_detail.js
const app = getApp();

const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentCoupon:{},//准备转赠的优惠券信息
    afterCoupon:{},//获取转赠后的优惠券信息
    gift_tip:'', // 随言
    status:1, // 1正常 2已使用 3转赠中 4.已转赠
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    // console.log(options);
    // console.log(JSON.parse(options.currentCoupon));
    this.setData({
      currentCoupon: JSON.parse(options.currentCoupon),
    })

    // 根据优惠券id获取优惠券信息
    let couponId = this.data.currentCoupon.id;
    utils.uGet(`${api.HOST}/api/coupon/${couponId}`, {
    }).then((res) => {
      console.log('调起分享接口后获取该分享优惠券的信息：');
      console.log(res);
      _this.setData({
        afterCoupon:res
      });

    });

     wx.showShareMenu({
      withShareTicket: true,
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('currentCoupon:');
    console.log(this.data.currentCoupon);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow');
    // 判断当前优惠券是否已转赠
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let _this = this;
    console.log('onHide');
    // /api/coupon/{couponId}
    // 根据优惠券id获取优惠券信息
    let couponId = this.data.currentCoupon.id;
    utils.uGet(`${api.HOST}/api/coupon/${couponId}`, {
    }).then((res) => {
      console.log('调起分享接口后获取该分享优惠券的信息：');
      console.log(res);
      _this.setData({
        afterCoupon: res
      });
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('onUnload');
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

  inputeidt: function (e) {
    this.setData({
      gift_tip: e.detail.value
    }); 
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    // console.log('gift_tip:' + this.data.gift_tip);
    // console.log('res:::');
    // console.log(res);
    let couponId = this.data.afterCoupon.id;
// 
    
    // 转赠优惠券  /api/coupon/{couponId}/transformation?userId=
    if (this.data.afterCoupon.status == 1){
     utils.uPost(`${api.HOST}/api/coupon/${couponId}/transformation`, {
       userId: app.globalData.userId
     }).then((result) => {
       console.log('调起分享接口后：');
       console.log(result);

       // 根据优惠券id获取优惠券信息
       utils.uGet(`${api.HOST}/api/coupon/${result}`, {}).then((res) => {
         console.log('调起分享接口后获取该分享优惠券的信息：');
         console.log(res);
         if (res) {
           _this.setData({
             afterCoupon: res
           });
         }
       });

     });
   }

    let afterCoupon = JSON.stringify(this.data.afterCoupon)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
    }
    return {
      title: this.data.gift_tip || '领取优惠券',
      path: `/components/gift_put/gift_put?currentCoupon=${afterCoupon}&giftTip=${this.data.gift_tip}`,
      imageUrl:"../../images/shareCoupon.png",
      // 转发成功的回调函数
      success: function (res) {
        // 分享给个人：{errMsg: 'shareAppMessage:ok'}
        // 分享给群：{errMsg: 'shareAppMessage:ok', shareTickets: Array(1)}
        console.log(res);
        /* shareTicket 数组
         * 每一项是一个 shareTicket(是获取转发目标群信息的票据) ,对应一个转发对象
         */
        var shareTicket = (res.shareTickets && res.shareTickets[0]) || ''
        /* 官网的Tip: 由于策略变动，小程序群相关能力进行调整，
         * 开发者可先使用wx.getShareInfo接口中的群ID进行功能开发。
         */
        wx.getShareInfo({
          // 把票据带上
          shareTicket: shareTicket,
          success: function (res) {
            console.log(res);
            // 如果从小程序分享没有source，如果从别人分享的再二次分享带有source
            // 后续会讲_this.data.source的来源
            // let source = _this.data.source ? _this.data.source : '';
            // 上报给后台，把群信息带给后台，后台会去解密得到需要的信息
            // _this.upload_share_Result(res, '1', source)
          }
        })
      },
      fail: function (res) {
        console.log(res);
      },
      cancel:function(res){
        console.log(666666);
      },
    }
  },

  onUserOpStatistic: function (e) {
    console.log('onUserOpStatistic:');
    console.log(e);
    if (e.op == 'share') {
      var path = e.path;
    }
  },
})