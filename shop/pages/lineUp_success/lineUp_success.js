// pages/lineUp_success/lineUp_success.js
const app = getApp();
const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      info: {},
      take_number_id: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      _this = this;
      _this.setData({
          take_number_id: options.takeNumberId
      })
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
      _this.takeNumberInfo();
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

    /**
     * 获取取号详情
     */
    takeNumberInfo: function(){
        utils.uGet(`${api.HOST}/api/shop/booking/takeNumberInfo/${_this.data.take_number_id}`, { takeNumberId: _this.data.take_number_id}).then((res)=>{        
            let result = res[0];
            switch(result.type){
                case 1:
                    result.number_type = "排队中";
                    break;
                case 2:
                    result.number_type = "已用餐 ";
                    break;
                case 3:
                    result.number_type = "已取消";
                    break;
            }
            _this.setData({
                info: result
            })
        })
    },
    /**
     * 取消排队
     */
    editTakeNumberFn: function(){
        utils.Post(`${api.HOST}/api/shop/${app.globalData.shopId}/booking/takeNumberInfo/${_this.data.take_number_id}`,{
            shopId: app.globalData.shopId,
            takeNumberId: _this.data.take_number_id,
            userId: app.globalData.userId,
            type: 3
        }).then((res)=>{
            utils.successShow('取消排队成功');
            setTimeout(()=>{
                _this.takeNumberInfo();
            },500)
            
        })
    }
})