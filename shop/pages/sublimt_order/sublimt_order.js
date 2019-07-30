// pages/sublimt_order/sublimt_order.js
var app = getApp();
const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;
let shopCartIds = '';
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carList:[],//购物车列表
    sumMoney: 0,//总金额
    shopName: "",
    IMG: api.IMG,
    tableShow: false, //是否显示餐桌
    remind: "备注/发票",//备注
    shippingAddress: "", //收货地址
    shippingName: "", //收货人名称
    shippingPhone: "", //收货人号码
    positionName: '',
    seatName: '',
    // Types: ['配送','到店'],
    Types: ['到店'],
    tIndex: 0,
    content: '', //备注
    phoneShow: false
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
      shopCartIds = '';
  if(app.globalData.userId && app.globalData.userId != ''){
          this.getCarList();
      }else{
        _this.setData({
          phoneShow: true
        });
      }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //   if (app.globalData.remind || app.globalData.receipt || app.globalData.tax){
    //       this.setData({
    //           remind: `备注:${app.globalData.remind}; 发票:${app.globalData.receipt}; 税号:${app.globalData.tax}`
    //       })
    //   }else{
    //       this.setData({
    //           remind: "备注/发票"
    //       })
    //   }
      this.setData({
          shippingAddress: app.globalData.shippingAddress,
          shippingName: app.globalData.shippingName,
          shippingPhone: app.globalData.shippingPhone,
          shopName: app.globalData.shopName,
          positionName: app.globalData.positionName,
          seatName: app.globalData.seatName,
          content: app.globalData.content,
      });
      
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },
    /**
     * 选择
     */
    bindPickerChange: function (e){
        this.setData({
            tIndex: e.detail.value
        })
    },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
      app.globalData.content = '';
  },
  /**
   * 获取购物车列表
   */
  getCarList: function () {
      let _this = this;
      utils.uGet(`${api.HOST}/api/shop/${app.globalData.shopId}/cartList`, {
          userId: app.globalData.userId,
          shopId: app.globalData.shopId
      }).then((res) => {
          let carList = res[0].cartListGoods;
          let info = _this.data.info;
          let sumMoney = 0;
        
          carList.forEach((car, i) => {
              sumMoney += parseInt(car.num) * parseFloat(car.goods_shop_price);
              if(i == 0){
                  shopCartIds += car.shop_cart_id;
              }else{
                  shopCartIds += ','+car.shop_cart_id;
              }
              if (carList[i].path.indexOf('.th') === -1){
                  carList[i].path = carList[i].path +'.th'
              }
          });
          _this.setData({
              carList: carList,
              sumMoney: sumMoney.toFixed(2)
          });
      })
  },

  submitFn: function(){
    //   url = '../payment/payment?sumMoney={{sumMoney}}'
    let _this = this;
    let carList = _this.data.carList;
    let goodsJSON = [];
    let positionName = _this.data.positionName;
    carList.forEach((item, i)=>{
        let obj = {};
        obj.goodsId = item.goods_id;
        obj.sum = item.num;
        obj.sunMoney = (parseInt(item.num) * parseFloat(item.goods_shop_price)).toFixed(2);
        obj.money = obj.sunMoney;
        obj.goodsName = item.goods_name;
        obj.path = item.path;
        goodsJSON.push(obj);
    });
    //   if (!app.globalData.userAddressId&&!positionName&&_this.data.tIndex==0){
    //       utils.errorShow('请选择地址');
    //       return;
    //   }
      let type;
      let list;
      if (positionName || _this.data.tIndex == 1){
          type = 1;
      }else{
          type = 2;
      }
      if (positionName || _this.data.tIndex == 1){
          list = {
              shopId: app.globalData.shopId,
              userId: app.globalData.userId,
              userAddressId: '',
              money: _this.data.sumMoney,
              type: type,
              remarks: app.globalData.content,
              goodsJSON: JSON.stringify(goodsJSON),
              invoice: app.globalData.receipt,
              shopCartIds: shopCartIds,
              positionName: _this.data.positionName,
              seatName: _this.data.seatName,
              userMobile: app.globalData.mobile
          };
      }else{
          list = {
              shopId: app.globalData.shopId,
              userId: app.globalData.userId,
              userAddressId: app.globalData.userAddressId,
              money: _this.data.sumMoney,
              type: type,
              remarks: app.globalData.content,
              goodsJSON: JSON.stringify(goodsJSON),
              invoice: app.globalData.receipt,
              shopCartIds: shopCartIds,
              positionName: _this.data.positionName,
              seatName: _this.data.seatName,
              userMobile: app.globalData.mobile
          };
      }
       
      utils.uPost(`${api.HOST}/api/order/shop/${app.globalData.shopId}/add`,list).then((res)=>{
        console.log(res);
        app.globalData.content = '';
        wx.navigateTo({
            url: '../pay/pay?money=' + _this.data.sumMoney + '&orderId=' + res + '&shopName=' + _this.data.shopName + '&type=normal&grouponJson=""&goodsName=""&shopId=""',
        })
    })
  },
    bindPhoneCbFn: () => {
        _this.getCarList();
    },
})