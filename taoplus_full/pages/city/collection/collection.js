// pages/collection/collection.js
const app = getApp();
const utils = require("../../../utils/util.js");
const api = require("../../../utils/api.js").api;
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    colleList:[],
    pageNum: 1,
    pageSize: 6,
    noMore: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      _this = this;
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
      _this.setData({
          pageNum:1,
          colleList: []
      })
      _this.getCollectFn();

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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
      _this.setData({
          pageNum: _this.data.pageNum++
      })
  },

/**
 * 获取收藏列表
 */
  getCollectFn: () => {
      utils.uGet(`${api.HOST}/api/user/${app.globalData.userId}/favorites/item`,{
          userId: app.globalData.userId,
          pageNum: _this.data.pageNum,
          pageSize: _this.data.pageSize,
      },true,true).then((res)=>{
          console.log(res);
            if(res.length == 0){
                _this.setData({
                    noMore: true
                });
                return;
            }
            res.forEach((item,index)=>{
                item.path = api.IMG+item.path
              if (!res[index].described) {
                res[index].described = '好'
              }
            })
            _this.setData({
                noMore: false,
                colleList: res
            });
      })
  },

    imgErrorFn: (e)=>{
        utils.imgErrorFn(_this, e);
    }

})