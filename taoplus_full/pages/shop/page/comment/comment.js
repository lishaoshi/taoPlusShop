// pages/comment/comment.js
const app = getApp();

const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      score:0,
      scores: ['不满意','一般般','还可以','满意','非常满意'],
      comtent: '',
      evaluate_pic: [],
      IMG: api.IMG,
      order_id: '',
      shop_name: '',
      shop_img: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      _this = this;
    _this.setData({
        order_id: options.orderId,
        shop_name: app.globalData.shopName,
        shop_img: app.globalData.shopImg
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

    changeScoreFn: function(e){
        let index = e.currentTarget.dataset.index;
        _this.setData({
            score: index
        });
    },

    inputChangeFn: function(e){
        let val = e.detail.value;
        _this.setData({
            comtent: val
        });
    },
    /**
     * 上传图片
     */
    changeImgFn: function(){
        let evaluate_pic = _this.data.evaluate_pic;
        utils.chooseImage().then((res)=>{
            console.log(res);
            evaluate_pic.push({"fileId":res.result.file_id,"path":res.result.path});
            _this.setData({
                evaluate_pic: evaluate_pic
            })
        })
    },
    /**
     * 点击查看图片
     */
    showImgFn: function(e){
        let src = e.currentTarget.dataset.src;
        wx.previewImage({
            current: '', // 当前显示图片的http链接
            urls: [src] // 需要预览的图片http链接列表
        })
    },
    delImgFn: function(e){
        let index = e.currentTarget.dataset.index;
        let evaluate_pic = _this.data.evaluate_pic;
        evaluate_pic.splice(index,1);
        _this.setData({
            evaluate_pic: evaluate_pic
        });

        utils.successShow("删除成功");
    },
    submitFn: function(){
        let comtent = _this.data.comtent;
        if(!comtent){
            utils.errorShow('评价不能为空');
            return;
        }
        utils.uPost(`${api.HOST}/api/user/${app.globalData.userId}/evaluate`,{
            userId: app.globalData.userId,
            orderId: _this.data.order_id,
            shopId: app.globalData.shopId,
            comtent: _this.data.comtent,
            score: _this.data.score+1,
            evaluatePic: JSON.stringify(_this.data.evaluate_pic)
        }).then((res)=>{
            console.log(res);
            utils.successShow('评论成功');
            setTimeout(()=>{
                wx.redirectTo({
                    url: '../order/order'
                });
            },1000)
        })

    }
})