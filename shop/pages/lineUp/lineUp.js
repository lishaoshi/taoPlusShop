// pages/lineUp/lineUp.js
const app = getApp();
const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;
let _this;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        position: [],
        p_index: 0,
        floor_id: 0,
        population: 0

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        _this = this;
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
        this.getFloorFn();
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

    },
    changePeopleFn: function(e) {
        console.log(e);
        _this.setData({
            population: e.detail.value
        });
    },
    /**
     * 获取楼层
     */
    getFloorFn: function() {
        utils.uGet(`${api.HOST}/api/shop/${app.globalData.shopId}/booking/floor`, {
            shopId: app.globalData.shopId
        }).then((res) => {
            let result = res;
            if (result.length > 0) {
                _this.setData({
                    position: result,
                    floor_id: result[0].floor_id
                })
            }

        })
    },
    /**
     * 选择楼层
     */
    bindPickerChange: function(e) {
        let index = e.detail.value;
        let position = _this.data.position;
        _this.setData({
            p_index: index,
            floor_id: position[index].floor_id
        });
    },
    submitFn: function() {
        if (!_this.data.population) {
            utils.errorShow("请填写人数");
            return;
        }
        utils.uPost(`${api.HOST}/api/shop/${app.globalData.shopId}/floor/${_this.data.floor_id}/takeNumber`, {
            shopId: app.globalData.shopId,
            population: _this.data.population,
            floorId: _this.data.floor_id,
            userId: app.globalData.userId
        }).then((res) => {
            wx.navigateTo({
                url: '../lineUp_success/lineUp_success?takeNumberId=' + res,
            })
        });

    },
    bindPhoneCbFn: () => {
        
    },
})