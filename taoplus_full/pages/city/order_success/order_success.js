// pages/order_success/order_success.js
const app = getApp();
const utils = require("../../../utils/util.js");
const api = require("../../../utils/api.js").api;
let _this;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderId: '',
        goodsName: '',
        info: {},
        grouponJson: '',
        shareImg: '',
        phoneShow: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        _this = this;
        let grouponJson = '';
        if (options.grouponJson) {
            grouponJson = JSON.parse(options.grouponJson);
        }
        _this.setData({
            orderId: options.orderId,
            goodsName: options.goodsName,
            grouponJson: grouponJson,
          type: options.type || ''
        })
        
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        if (_this.data.grouponJson) {
            _this.getGoodsDetailFn();
        }
      if (!app.globalData.userId || app.globalData.userId == '') {
        _this.setData({
          phoneShow: true
        });
      }else{
        _this.getCouponFn();
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
      if (this.data.type !== 'order') {
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
      
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
        return {
            title: '我发起了拼团购买' + _this.data.goodsName,
            path: `/pages/submit_orders/submit_orders?goodsId=${_this.data.grouponJson.goodsId}&grouponsId=${_this.data.grouponJson.grouponsId}&shopId=${_this.data.grouponJson.shopId}&type=${_this.data.grouponJson.type}&price=${_this.data.grouponJson.grouponPrice}&orderId=${_this.data.orderId}`,
            imageUrl: _this.data.shareImg
        }

    },

    getCouponFn: () => {
        utils.uGet(`${api.HOST}/api/user/${app.globalData.userId}/order/${_this.data.orderId}/succeed`, {}).then((res) => {
            console.log(res);
            res.coupon_code = utils.bankCardStr(res.coupon_code);
            res.coupon_code_url = api.IMG + res.coupon_code_url;
            _this.setData({
                info: res
            })
        })
    },

    /**
     * 获取商品详情
     */
    getGoodsDetailFn: () => {
        utils.uGet(`${api.HOST}/api/shop/item/${_this.data.grouponJson.goodsId}`, {
            goodsId: _this.data.grouponJson.goodsId,
            userId: app.globalData.userId,
            type: 0 //类型:1-商家 0-商品
        }, true, true).then((res) => {
            console.log(res);
            let imgAry = res.path.split(',');
            let banner = utils.getDefaultImg(imgAry, '');

            if (res) {
                _this.setData({
                    shareImg: banner[0]
                })
            }
        })
    },

    bindPhoneCbFn: () => {
        _this.getCouponFn();
    },
})