// pages/shop_detail/shop_detail.js
const app = getApp();

const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;

let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsId: "",
    IMG: "",
    info: {},
    carList: [],
    showMask: false, //显示遮罩
    showFormat: false,//显示规格
    showCar: false,//显示购物车详情
    carNum: 0,//购物车数量
    carMoney: 9,//购物车金额,
    phoneShow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this;
    _this.setData({
        goodsId: options.goodsId,
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
      _this.goodsDetails();
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
   * 显示购物车详情
   */
  showCarFn: function (e) {
      
      _this.getCarList();
      _this.setData({
          showCar: true,
          showMask: true
      });
  },
  /**
* 点击遮罩隐藏
*/
  triggerMaskFn: function (e) {
      
      _this.setData({
          showFormat: false,
          showCar: false,
          showMask: false
      });
  },


  /**
   * 点击收藏
   */
    collectFn: function(){
        utils.uPost(`${api.HOST}/api/user/${app.globalData.userId}/favorites/${_this.data.goodsId}/add`,{
            userId: app.globalData.userId,
            businessId: _this.data.goodsId,
            type: 2 //1、商家 2、商品'
        }).then((res)=>{
            utils.errorShow('收藏成功');
            let info = _this.data.info;
            info.is_collect = !info.is_collect;
            _this.setData({
                info: info
            })
        })
    },

    /**
   * 点击取消收藏
   */
    removeCollectFn: function () {
        utils.uPost(`${api.HOST}/api/user/${app.globalData.userId}/favorites/${_this.data.goodsId}/delete`, {
            userId: app.globalData.userId,
            businessId: _this.data.goodsId,
            type: 2 //1、商家 2、商品'
        }).then((res) => {
            utils.errorShow('取消收藏成功');
            let info = _this.data.info;
            info.is_collect = !info.is_collect;
            _this.setData({
                info: info
            })
        })
    },
/**
 * 获取商品详情
 */
  goodsDetails: function(){ 
      utils.uGet(`${api.HOST}/api/shop/item/${_this.data.goodsId}`, { goodsId: _this.data.goodsId, userId: app.globalData.userId, type:0}).then((res)=>{
          let result = res;
          result.banner = result.path?result.path.split(','):'';
          console.log(result.banner);
          result.num = 0;
          if (!result.described){
              result.described =''
          }
          _this.setData({
              info: result
          })
      })
  },
/**
 * 添加商品 + -
 */
  changeCarFn: function(e){
      
      let op = e.currentTarget.dataset.op;
      let info = _this.data.info;
      let num = info.num + parseInt(op);
      num = num > 0 ? num : 0;
      utils.uPost(`${api.HOST}/api/shop/${app.globalData.shopId}/cart-goods`, {
          businessId: info.goods_id,
          userId: app.globalData.userId,
          shopId: app.globalData.shopId,
          num: num
      },false).then((res) => {
          console.log(res);
          info.num = num;
          _this.setData({
              info: info
          })
          _this.getCarList();
      })
  },

  /**
  * 获取购物车列表
  */
  getCarList: function () {
      
      utils.uGet(`${api.HOST}/api/shop/${app.globalData.shopId}/cartList`, {
          userId: app.globalData.userId,
          shopId: app.globalData.shopId
      },false).then((res) => {
          console.log(res);
          if ( res.length>0) {
              let carList = res[0].cartListGoods;
              let info = _this.data.info;
              let carNum = 0;
              let carMoney = 0;
              carList.forEach((car, i) => {
                  carNum += parseInt(car.num);
                  carMoney += parseInt(car.num) * parseFloat(car.goods_shop_price);
                 if(info.goods_id == car.goods_id){
                     console.log(car.goods_id);
                     info.num = car.num;
                 }
              });
              console.log(carList);
              _this.setData({
                  info: info,
                  carList: carList,
                  carNum: carNum,
                  carMoney: carMoney.toFixed(2)
              });

          }else{
              let info = _this.data.info;
              info.num = 0;
              _this.setData({
                  info: info,
                  carList: [],
                  carNum: 0,
                  carMoney: 0.00
              });
          }
      })
  },

    /**
     * 清空购物车
     */
    clearFn: function () {
        let _this = this;
        _this.setPhoneShow();
        let carList = _this.data.carList;
        let shopCartId = '';
        carList.forEach((item, i) => {
            if (i == 0) {
                shopCartId += item.shop_cart_id;
            } else {
                shopCartId += ',' + item.shop_cart_id;
            }

        });
        utils.uPost(`${api.HOST}/api/shop/${_this.data.shopId}/cart/delete`, {
            shopCartId: shopCartId
        }).then((res) => {
            _this.data.info.num = 0;
            _this.setData({
                carList: [],
                carNum: 0,
                carMoney: 0,
                info: _this.data.info,
            })
        })

    },

    setPhoneShow: function () {
        let phoneShow;
        if (app.globalData.userId) {
            phoneShow = false;
        } else {
            phoneShow = true;
        }
        _this.setData({
            phoneShow: phoneShow
        })
    },
    jumpToFn: function () {
        
        var carList = _this.data.carList;
        if (carList.length == 0) {
            wx.showToast({
                title: '请选择商品',
                icon: 'none',
                duration: 1000
            });
            return;
        }

        wx.navigateTo({
            url: '../sublimt_order/sublimt_order',
        });
    },

    bindPhoneCbFn: () => {
        _this.getCarList();
    },
 

})