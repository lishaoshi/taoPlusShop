// pages/lineUp_list/lineUp_list.js
const app = getApp();
const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;
let _this;

Page({

  /**
   * 页面的初始数据
   */
  data: {
      loadMore: false,
      lineUp_list: [],
      pageNum:1,
      pageSize: 10,
      IMG: app.IMG
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
      if(app.globalData.userId){
          _this.userTakeNumberListFn();
      }
      
      _this.setData({
          pageNum: 0,
          lineUp_list: []
      })
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
      _this.userTakeNumberListFn();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
    /**
     * 取号列表
     */
    userTakeNumberListFn: function(){
        utils.uGet(`${api.HOST}/api/user/${app.globalData.userId}/user-take-numbers`,{
            userId: app.globalData.userId,
            pageNum: _this.data.pageNum,
            pageSize: _this.data.pageSize
        }).then((res)=>{
            let result = res.records;
            let loadMore;
            let lineUp_list = _this.data.lineUp_list;
            if(result.length == 0){
                loadMore = false;
            }else{
                loadMore = true;
            }
            result.forEach((item, i)=>{
                switch(item.type){
                    case 1:
                        item.type_text = "排队中";
                    break;
                    case 2:
                        item.type_text = "已用餐";
                        break;
                    case 3:
                        item.type_text = "取消";
                        break;
                }
            });
            lineUp_list = lineUp_list.concat(result);
            _this.setData({
                lineUp_list: lineUp_list,
                loadMore: loadMore
            })
        })
    },
    bindPhoneCbFn: () => {
        // _this.userTakeNumberListFn();
    },
})