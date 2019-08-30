// components/bag_coupon/bag_coupon.js
const app = getApp();

const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: null,
    sum: 0, //商品总价格
    num: 1, // 商品数量
    currentData: [], // 当前商家可用优惠券数据
    currentGiftData: [], // 当前商家可转赠的优惠券数据
    pageIndex: 1, //优惠券 请求页数 
    pageSize: 8, //优惠券每页几条
    noMore: false, //是否有更多数据
    bar: ['卡包', '转赠'],
    barStatus: ['all', 'cangift'], // bar 对应的状态获取优惠券类型: 所有（红包+代金券） + 能够转赠的代金券
    barIndex: 0, //对应barStatus 0->all 1->cangift
    status: 1, //1 可用 3 转赠
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    wx.setNavigationBarTitle({
      title: '我的优惠券'
    })

    // 获取优惠券：代金券+红包
    this.getData();
  },

  // 切换tab
  changeBarFn: function (e) {
    let _this = this;
    let index = utils.dataSet(e, 'index');

    _this.setData({
      barIndex: index
    });

    wx.pageScrollTo({
      scrollTop: 0
    })

    _this.onLoad();
  },
  // 获取数据
  getData: function() {
    let _this = this;

    let status = ((_this.data.barIndex == 0) ? 1 : (_this.data.barIndex == 1) ? 3 : '')
    console.log(status);

    if (status == _this.data.status) {
      _this.setData({
        pageIndex: _this.data.pageIndex,
        currentData: _this.data.currentData,
        noMore: _this.data.noMore
      });
    } else {
      _this.setData({
        pageIndex: 1,
        currentData: [],
        noMore: false
      });
    }

    _this.setData({
      status: status
    });

    console.log('pageIndex', _this.data.pageIndex, 'status', status);

    // 获取所有优惠券 
    utils.uGet(`${api.HOST}/api/coupon/mine`, {
      userId: app.globalData.userId,
      shopId: '',
      status: status,
      alias: '',
      index: _this.data.pageIndex,
      pageSize: _this.data.pageSize,
    }).then((result) => {
      console.log(result);
      let res = result;

      let currentData = _this.data.currentData.concat(res.records);

      let noMore;
      if (res.total == 0 || currentData.length == res.total) {
        noMore = true
      }
      _this.setData({
        currentData: currentData,
        noMore: noMore
      })
      console.log('noMore:'+_this.data.noMore);

    })

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function(e) {
    let _this = this;
    if (_this.data.noMore) return;

    // if (_this.data.barIndex == 0) {
    _this.data.pageIndex++;
    _this.setData({
      pageIndex: _this.data.pageIndex
    });
    _this.getData();
    // }

  },

  // 使用优惠券功能
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

  // 跳转转赠优惠券页面功能
  giftGiving(e) {
    // canGiftGiving  1能 0否  测试：13969111112  本人 app.globalData.mobile
    console.log('app.globalData.mobile:' + app.globalData.mobile);
    let _this = this;
    // //console.log('radio发生change事件，携带value值为：', e.currentTarget.dataset.id)
    let currentId = e.currentTarget.dataset.id; // 当前所选优惠券的id 

    _this.data.currentData.forEach(function(item, index) {
      if (item.id == currentId) {
        let currentCoupon = JSON.stringify(item);
        wx.navigateTo({
          url: `/components/gift_detail/gift_detail?currentCoupon=${currentCoupon}`,
        })
      }
    });

    return;
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
    this.setData({
      pageIndex: 1,
      currentData: [],
      noMore: false
    });
    this.onLoad();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      pageIndex: 1,
      currentData: [],
      noMore: false
    });
    this.onLoad();
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
  onShareAppMessage: function(res) {
    let _this = this;

    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log('转发按钮:');
      console.log(res.target)
      // //console.log('radio发生change事件，携带value值为：', e.currentTarget.dataset.id)
      let currentId = res.target.dataset.id; // 当前所选优惠券的id 
      let currentShopId = res.target.dataset.targetId; //当前优惠券 所属的商家
      console.log('currentId:' + currentId + ',currentShopId:' + currentShopId);

      // 转赠优惠券  /api/coupon/{couponId}/transformation?userId=
      utils.uPost(`${api.HOST}/api/coupon/${currentId}/transformation`, {
        userId: app.globalData.userId
      }).then((result) => {
        console.log('调起分享接口后：');
        console.log(result);

        // 根据优惠券id获取优惠券信息
        utils.uGet(`${api.HOST}/api/coupon/${result}`, {}).then((res) => {
          console.log('调起分享接口后获取该分享优惠券的信息：');
          console.log(res);
        });

      });

      console.log('currentData');
      console.log(JSON.parse);
      console.log(_this.data.currentData);


      return {
        title: this.data.gift_tip || '领取优惠券',
        path: `/components/gift_put/gift_put?currentId=${currentId}`,
        imageUrl:"../../images/shareCoupon.png",
        // 转发成功的回调函数
      }
    }
    return {}

  }
})