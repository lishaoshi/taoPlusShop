// pages/my_collected/my_collected.js
const app = getApp();

const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;

let _this;

Page({

  /**
   * 页面的初始数据
   */
  data: {
      collect_list: [],
      loadMore: true,
      IMG: api.IMG,
      pageNum: 1,
      pageSize: 10
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
      pageNum: 1,
      collect_list: []
  });
    if(app.globalData.userId){
        _this.collectionListFn();
    }

      
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
      _this.collectionListFn();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

    /**
     * 获取收藏列表
     */
    collectionListFn: function(){
        utils.uGet(`${api.HOST}/api/user/${app.globalData.userId}/favorites/item`,{
            userId: app.globalData.userId,
            type: 2, //1、商家 2、商品
            pageNum: _this.data.pageNum,
            pageSize: _this.data.pageSize
        }).then((res)=>{
            console.log(res);
            let result = res;
            let loadMore;
            let collect_list = _this.data.collect_list;
            if(result.length == 0){
                loadMore = false;
            }else{
                loadMore = true;
            }
            collect_list = collect_list.concat(result);
            for (let i in collect_list){
                if (!collect_list[i].described){
                    collect_list[i].described='';
                }
            }
            _this.setData({
                collect_list: collect_list
            })
        })
    },
    /**
     * 加载更多
     */
    loadMoreFn: function (e) {
        console.log('more');
        let _this = this;
        let pageNum = _this.data.pageNum;
        let pageSize = _this.data.pageSize;
        let loadMore = _this.data.loadMore;

        if (loadMore) {
            _this.setData({
                pageNum: pageNum + 1
            });
            console.log('pageNum=' + _this.data.pageNum);
            _this.collectionListFn();
        }

    },

    bindPhoneCbFn: () => {
        // _this.collectionListFn();
    },

})