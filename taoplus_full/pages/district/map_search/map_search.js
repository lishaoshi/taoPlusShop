// pages/map_search/map_search.js
// 引入SDK核心类
let QQMapWX = require('../../../libs/qqmap-wx-jssdk.js');
const app = getApp();

const utils = require("../../../utils/util.js");
const api = require("../../../utils/api.js").api;

let qqmapsdk;

let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    map_data: [],
    key: '',
    longitude: "",
    latitude: "",
    address: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      _this = this;
      // 实例化API核心类
      qqmapsdk = new QQMapWX({
          key: 'QTSBZ-SGVK6-E55SA-EB37R-K7KOQ-WQBOW'
      });
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
      wx.getSetting({
          success(res) {
              console.log(res);
              if (!res.authSetting['scope.userLocation']) {
                  wx.authorize({
                      scope: 'scope.userLocation',
                      success() {
                          _this.location();
                      }
                  })
              }else{
                  _this.location();
              }
          }
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
   * 输入框变化
   */
  inputChange: function(e){

      var _this = this;
      var val = e.detail.value;

      _this.setData({
          key: val
      });

  },
    /**
     * 搜索
     */
  search: function(){

      var _this = this;
      var key = _this.data.key;
      wx.showLoading({
          title: '搜索中',
      })
      // 调用接口
      qqmapsdk.search({
          keyword: key,
          page_size: 20,
          address_format: 'short',
          success: function (res) {
              console.log(res);
              _this.setData({
                  map_data: res.data
              });
          },
          fail: function (res) {
              console.log(res);
          },
          complete: function (res) {
              console.log(res);
              wx.hideLoading();
          }
      });

  },
  /**
   * 定位
   */
  location: function(){
      let _this = this;
      console.log('location');
      
      wx.getLocation({
          altitude: true,
          success: (res)=>{
            console.log(res);
            let latitude = res.latitude;
            let longitude = res.longitude;
            qqmapsdk.reverseGeocoder({
                location: {
                    latitude: latitude,
                    longitude: longitude
                },
                success: (res)=>{
                    console.log(res);
                    _this.setData({
                        latitude: latitude,
                        longitude: longitude,
                        address: res.result.address
                    })
                }
            })
          },
          fail: ()=>{
              utils.errorShow('定位失败');
          }

      })
  },
  /**
   * 点击选择地址
   */
  choiseAddress: function(e){
        let _this = this;
        let dataset = e.currentTarget.dataset;
        let address_obj = {
            address: dataset.address,
            longitude: dataset.longitude,
            latitude: dataset.latitude
        };

        wx.setStorage({
            key: 'addAddress',
            data: JSON.stringify(address_obj)
            
        });

        // 关闭当前页面
        wx.navigateBack();
  }
})