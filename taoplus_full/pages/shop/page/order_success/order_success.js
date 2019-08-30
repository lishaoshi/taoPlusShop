// pages/order_success/order_success.js
const app = getApp();
const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;
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
        shareImg: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        _this = this;
        let grouponJson = '';
        if (options.grouponJson) {
            grouponJson = JSON.parse(options.grouponJson);
        }
        _this.setData({
            orderId: options.orderId ,
            goodsName: options.goodsName || '',
          type: options.type || ''
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        if (_this.data.grouponJson) {
            _this.getGoodsDetailFn();
        }

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        _this.getCouponFn();
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
      if(this.data.type !== 'order'){
        wx.reLaunch({
          url: '/pages/index/index',
        })
      }
       

    },
    /**
     * 
     */

    
    /**
     * 完成回到首页
     */
    backIndexFn :function () {
        wx.reLaunch({
          url: '/pages/shop/page/order_list/order_list',
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    getCouponFn: () => {
        utils.uGet(`${api.HOST}/api/user/${app.globalData.userId}/order/${_this.data.orderId}/succeed`, {}).then((res) => {
            res.coupon_code = utils.bankCardStr(res.coupon_code);
            res.coupon_code_url = api.IMG + res.coupon_code_url;
            _this.setData({
                info: res
            })
        })
    }
})