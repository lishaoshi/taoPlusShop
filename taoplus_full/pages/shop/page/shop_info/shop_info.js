// pages/shop_info/shop_info.js
const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;

let _this
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopId: "",
    info: {},
    ambientNum: 0, //环境
    productNum: 0, //门头
    otherNum: 0, //其他
    ambientImg: [],
    productImg: [],
    otherImg: [],
    IMG: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this=this;
    this.setData({
        shopId: options.shopId,
        IMG: api.IMG
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      this.getShopDetail();
      this.getShopPic();
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

/**
 * 获取商家详情
 * type: 图片类型：1、logo  2、店铺门头  3、店内环境  4、产品图   5、其他  6、营业执照  7、开户人身份证正反面   9、法人省份正正反面、 10、结算人身份证正反面  11、结算账户指定书  12、开户许可证 13、收银柜图  14、租赁合同复印件 15、结算银行卡正反面

 */
  getShopDetail: function () {
      var _this = this;
      utils.uGet(`${api.HOST}/api/shop/${_this.data.shopId}/shop`, { shopId: _this.data.shopId }).then((res) => {
          let result = res;
          result.address = result.address == 'undefined' || !result.address ? '没有地址' :res.province_name + res.city_name + res.area_name + res.address;
          _this.setData({
              info: result
          });
      })
  },

  getShopPic: function(){
      let _this = this;
      utils.uGet(`${api.HOST}/api/shop/${_this.data.shopId}/pic`, { shopId: _this.data.shopId}).then((res)=>{
          console.log(res);
          let result = res;
          let ambientNum = 0;
          let productNum = 0;
          let otherNum = 0;
          let ambientImg = [];
          let productImg = [];
          let otherImg = [];
          let IMG = _this.data.IMG;
          result.forEach((item, i) => {
              if (item.type == 3) {
                  ambientNum++;
                  ambientImg.push(IMG + item.path);
              } else if (item.type == 2) {
                  productNum++;
                  productImg.push(IMG + item.path);
              } else if (item.type == 5) {
                  otherNum++;
                  otherImg.push(IMG + item.path);
              }
          });
          if (ambientNum == 0) {
              ambientImg[0] = "../../images/shop/default.png";
          }
          if (productNum == 0) {
              productImg[0] = "../../images/shop/default.png";
          }
          if (otherNum == 0) {
              otherImg[0] = "../../images/shop/default.png";
          }
          _this.setData({
              ambientNum: ambientNum,
              productNum: productNum,
              otherNum: otherNum,
              ambientImg: ambientImg,
              productImg: productImg,
              otherImg: otherImg
          })
      })
  },
/**
 * 预览图片
 */
  showImgFn: function(e){
      let _this = this;
      let type = e.currentTarget.dataset.type;
      let urls = [];
      if(type == 3){
          urls = _this.data.ambientImg;
      } else if(type == 2){
          urls = _this.data.productImg;
      } else if (type == 5) {
          urls = _this.data.otherImg;
      }

      if (urls[0] == "../../images/shop/default.png"){
          return;
      }

      wx.previewImage({
          current: '', // 当前显示图片的http链接
          urls: urls // 需要预览的图片http链接列表
      })
  },

  callFn: function(e){
      let phone = e.currentTarget.dataset.phone;
      if(phone){
          wx.makePhoneCall({
              phoneNumber: phone //仅为示例，并非真实的电话号码
          })
      }
  },
  openLocation: () => {
    if (_this.data.info.latitude) {
      utils.uGet(`${api.HOST}/api/user/third/geo-converter`, {
        lng: _this.data.info.longitude,
        lat: _this.data.info.latitude
      }, false).then(function (res) {
        console.log(res)
        if (res.status === 0) {
          wx.openLocation({
            latitude: res.result[0].y,
            longitude: res.result[0].x
          })
        }
      })
    }
  }
})