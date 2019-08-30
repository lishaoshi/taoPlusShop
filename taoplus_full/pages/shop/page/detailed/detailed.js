// pages/detailed/detailed.js
//获取应用实例
const app = getApp();
const api = require("../../utils/api.js").api;
const utils = require("../../utils/util.js");
import Validator from "../../utils/validator.js";
let _this;
let index = 1;
let pageSize = 9;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        detailList: [],
        isShow: true,
        noMore: false

    },


    /**
     * 明细详情
     */
    getDetailsFn: function() {
        utils.uGet(`${api.HOST}/api/user/${app.globalData.userId}/account/details`, {
            index: index,
            pageSize: pageSize
        }, true, true).then((res) => {
            let noMore;
            if (res.records.length > 0) {
                let detailList = _this.data.detailList;
                detailList = detailList.concat(res.records);
                let isShow;
                _this.setData({
                    detailList: detailList,
                    noMore: false
                })
            } else {
                _this.setData({
                    noMore: true
                })
            }
        })

    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        _this = this
        index = 1;
        _this.getDetailsFn()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        if (!_this.data.noMore) {
            index++;
            _this.getDetailsFn();
        }
    },
})