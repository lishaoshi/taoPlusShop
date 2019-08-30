// pages/order/order.js
const app = getApp();
const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_list: [],
    pageNum: 1,
    pageSize: 6,
    IMG:"",
    loadMore: true,
    phoneShow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      _this = this;
    this.setData({
        IMG: api.IMG
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
    if (!app.globalData.userId || app.globalData.userId == '') {
      _this.setData({
        phoneShow: true
      });
    } else {
      _this.bindPhoneCbFn()
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
        this.loadMoreFn();
    },

/**
 * 获取订单列表
 */
  orderList: function(append = false){
      let _this = this;
      utils.uGet(api.orderList,{
          userId: app.globalData.userId,
        //   shopId: app.globalData.shopId,
          type: "",
          pageNum: _this.data.pageNum,
          pageSize: _this.data.pageSize
      }).then((res)=>{
          let result = res.records;
          let loadMore ;
          if(result.length == 0){
              loadMore = false;
          }else{
              loadMore = true;
          }
          _this.setData({
              loadMore: loadMore
          });
          
          result.forEach((item, i)=>{
              //旧订单状态： -1、待支付 1、待评价 2、已完成 3、已取消',
              //新的： -1.已失效，1.待付款，2.付款中，3.待使用  4.已使用',
              if (item.order_status ==  -1){
                  item.pay_status_text = "已失效";
              }
              if (item.order_status == 1) {
                  item.pay_status_text = "待付款";
                //   if (item.is_evaluate){
                //       item.pay_status_text = "已评价";
                //   }else{
                //       item.pay_status_text = "待评价";
                //   }
                  
              }
              if (item.order_status == 2) {
                  item.pay_status_text = "付款中";
              }
              if (item.order_status == 3) {
                  item.pay_status_text = "待使用";
              }
              if (item.order_status == 4) {
                  item.pay_status_text = "已使用";
              }
              let rep = /^(http|https)/g;
              let matches = rep.exec(item.orderDetailsList[0].path);
              if (matches){
                  item.path = item.orderDetailsList[0].path;
              }else{
                  item.path = api.IMG + item.orderDetailsList[0].path;
              }
              
          });
            let order_list;
          if(append){
              order_list = _this.data.order_list;
              order_list = order_list.concat(result);
          }else{
              order_list = result;
          }
        for (let i in order_list){
          if (order_list[i].path.indexOf('.th') === -1){
            order_list[i].path = order_list[i].path+'.th'
          }
        }
          _this.setData({
              order_list: order_list
          });
          
      })
  },

    loadMoreFn: function (e) {
        let _this = this;
        let pageNum = _this.data.pageNum;
        let pageSize = _this.data.pageSize;
        let loadMore = _this.data.loadMore;

        if (loadMore) {
            _this.setData({
                pageNum: pageNum + 1
            });
            _this.orderList(true);
        }

    },

    bindPhoneCbFn: () => {
        _this.orderList();
    },
})