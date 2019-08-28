//index.js
//获取应用实例
const app = getApp();
const utils = require("../../../utils/util.js");
const api = require("../../../utils/api.js").api;
const con = require("../../../utils/getUserInfo.js");
import Validator from '../../../utils/validator.js';

let _this;
let pageNum = 1;
let pageSize = 6;

let scrollTop;

Page({
  data: {
    region: ['', '', ''],
    // customItem: '全部',
    latitude: '113.385643', //纬度
    longitude: '23.166129', //经度
    shopSort: [],
    scrollHeight: '',
    isScroll: true,
    banner: [{
      path: '../../../images/banner.jpg'
    }, {
      path: '../../../images/banner.jpg'
    }],
    IMG: '',
    barClass: false,
    screenBar: ['职能排序', '区域', '楼层', '品类'],
    screenIndex: -1,
    screenShow: false,
    name: '',
    goodsList: [],
    noMore: false,
    cityName: '',
    provinceName: '',
    screenContent: [
      [{
          title: '职能排序',
          type: 'sort',
          val: '0',
          checked: false
        },
        {
          title: '离我最近',
          type: 'sort',
          val: '1',
          checked: false
        },
        {
          title: '职能排序',
          type: 'sort',
          val: '0',
          checked: false
        },
        {
          title: '离我最近',
          type: 'sort',
          val: '1',
          checked: false
        },
        {
          title: '职能排序',
          type: 'sort',
          val: '0',
          checked: false
        },
        {
          title: '离我最近',
          type: 'sort',
          val: '1',
          checked: false
        },
        {
          title: '职能排序',
          type: 'sort',
          val: '0',
          checked: false
        },
        {
          title: '离我最近',
          type: 'sort',
          val: '1',
          checked: false
        },
        {
          title: '职能排序',
          type: 'sort',
          val: '0',
          checked: false
        },
        {
          title: '离我最近',
          type: 'sort',
          val: '1',
          checked: false
        },
        {
          title: '职能排序',
          type: 'sort',
          val: '0',
          checked: false
        },
        {
          title: '离我最近',
          type: 'sort',
          val: '1',
          checked: false
        }
      ],
      [{
          title: '区域1',
          type: 'area',
          val: '0',
          checked: false
        },
        {
          title: '区域2',
          type: 'area',
          val: '1',
          checked: false
        }
      ],
      [{
          title: '楼层1',
          type: 'floor',
          val: '0',
          checked: false
        },
        {
          title: '楼层2',
          type: 'floor',
          val: '1',
          checked: false
        }
      ],
      [{
          title: '品类1',
          type: 'cate',
          val: '0',
          checked: false
        },
        {
          title: '品类2',
          type: 'cate',
          val: '1',
          checked: false
        }
      ]
    ],
    type: 1,
    userButton: false,
    phoneShow: false
  },
  //事件处理函数
  bindViewTap: function() {

  },
  onLoad: function(options) {
    _this = this;

    let rpx = 1;
    let systemInfo = wx.getSystemInfoSync();
    let px = rpx / 750 * systemInfo.windowWidth;
    let scrollHeight = systemInfo.windowHeight;
    /**
     * 两种情况：
     * 1. 扫商圈码进入，获取并保存商圈id(为了以后能直接进入该商圈)
     * 2. 直接进入，获取之前保存的商圈id，没有就取app全局商圈id参数
     * bug:
     * 在开发环境中，可能不能实时改变商圈id,因为已经保存了上一次的商圈id
     * 目前解决方法是：
     * 清理缓存并结束小程序进程(除了开发版)
     * 
     */


    if (options.q) {
      let q = decodeURIComponent(options.q);
      app.globalData.agencyId = utils.getQueryString(q, 'agencyId');

      wx.setStorage({
        key: 'plus_agencyId',
        data: utils.getQueryString(q, 'agencyId'),
      })
    } else {
      console.log('indexOption:');
      console.log(app.globalData.agencyId);

      let agencyId = app.globalData.agencyId;
      let shareAgencyId = options.shareAgencyId;
      if (options.shareAgencyId) {
        wx.setStorage({
          key: 'plus_agencyId',
          data: shareAgencyId,
        })
      }
      app.globalData.agencyId = shareAgencyId || agencyId || wx.getStorageSync('plus_agencyId');
    }

    _this.setData({
      scrollHeight: scrollHeight,
      IMG: api.IMG
    });

    // 获取商圈名

    _this.getCircleNameFn();
  },
  onShow: function() {
    _this = this;
  },
  onReady: function() {
    pageNum = 1;
    utils.wxLogin().then(() => {
      if (!app.globalData.userId || app.globalData.userId == '') {
        con.getUserInfoFn(_this, utils, app)
        // _this.setData({
        //   phoneShow: true
        // });
      }
      //获取经纬度
      wx.getLocation({
        type: 'wgs84',
        success: function(res) {
          let latitude = res.latitude
          let longitude = res.longitude
          //地址逆解析
          wx.request({
            url: 'https://api.map.baidu.com/geocoder?location=' + latitude + ',' + longitude + '&output=json&coord_type=wgs84&key=mANIkD2dBjNiel6bbEUGPN0WvU9TY4Kh',
            data: {},
            success: function(data) {
              app.globalData.longitude = longitude;
              app.globalData.latitude = latitude;
              app.globalData.provinceName = data.data.result.addressComponent.province;
              app.globalData.cityName = data.data.result.addressComponent.city;
              _this.setData({
                latitude: latitude,
                longitude: longitude,
                goodsList: [],
                provinceName: data.data.result.addressComponent.province,
                cityName: data.data.result.addressComponent.city,
                region: [data.data.result.addressComponent.province, data.data.result.addressComponent.city, '']
              })
              _this.getListFn();
              _this.getShopFn();
            },
            fail: function(err) {
              console.log(JSON.stringify(err))
            }
          })

        }
      })
      if (app.globalData.userId) {
        con.getUserInfoFn(_this, utils, app)
      }

    });


  },
  // 地区选择器

  bindRegionChange: function(e) {

    _this.setData({
      region: e.detail.value
    })
    _this.getCityPositionFn();
  },

  //获取所选城市的经纬度

  getCityPositionFn: () => {

    let provinceName = _this.data.region[0];
    let cityName = _this.data.region[1];
    //地址解析
    wx.request({
      url: 'https://api.map.baidu.com/geocoder?address=' + (provinceName + cityName) + '&output=json&key=mANIkD2dBjNiel6bbEUGPN0WvU9TY4Kh&city=' + cityName, //仅为示例，并非真实的接口地址
      data: {},
      success(data) {
        wx.showToast({
          title: data.data.status,
        })
        if (data.data.status == 'OK') {
          app.globalData.provinceName = provinceName;
          app.globalData.cityName = cityName;
          _this.setData({
            provinceName: provinceName,
            cityName: cityName,
            goodsList: []
          })
          pageNum = 1;
          pageSize = 6;
          setTimeout(_this.getListFn, 100);
        } else {
          wx.showToast({
            title: '获取位置信息失败',
          })
        }
      },
      fail: function(err) {
        wx.showToast({
          title: err.errMsg + JSON.stringify(err),
        })
      }, //请求失败
    })
  },



  /**
   * 页面滚动事件
   */
  onPageScroll: (e) => {
    scrollTop = e.scrollTop;
    if (scrollTop > 150 && _this.data.barClass == false && !_this.data.screenShow) {
      _this.setData({
        barClass: true
      })
    } else if (scrollTop <= 150 && _this.data.barClass == true && !_this.data.screenShow) {
      _this.setData({
        barClass: false
      })
    }
  },
  /**
   * 筛选
   */
  changeScreenFn: (e) => {
    let index = utils.dataSet(e, 'index');
    let screenIndex = _this.data.screenIndex;
    let screenShow = _this.data.screenShow;
    if (screenIndex == index && screenShow) {
      screenShow = false;
    } else {
      screenShow = true;
    }
    let barClass = scrollTop > 150 || screenShow ? true : false;
    _this.setData({
      screenIndex: index,
      screenShow: screenShow,
      barClass: barClass
    });

  },
  getUserInfo: (e) => {
    _this.setData({
      userButton: false,
    })
    con.getUserInfo(app, _this);
  },
  screenCheckedFn: (e) => {
    let checkedIndex = utils.dataSet(e, 'checked');
    let screenIndex = _this.data.screenIndex;
    let screenContent = _this.data.screenContent;
    let checkedObj = screenContent[screenIndex][checkedIndex];
    let screenBar = _this.data.screenBar;
    let barClass = scrollTop > 128 ? true : false;
    screenContent[screenIndex].forEach((item, i) => {
      item.checked = false;
    });
    screenContent[screenIndex][checkedIndex].checked = true;
    screenBar[screenIndex] = screenContent[screenIndex][checkedIndex].title;
    _this.setData({
      screenContent: screenContent,
      screenShow: false,
      barClass: barClass,
      screenBar: screenBar
    })
  },
  hideScreenFn: () => {
    let screenShow = _this.data.screenShow;
    screenShow = !screenShow;
    let barClass = scrollTop > 128 || screenShow ? true : false;
    _this.setData({
      screenShow: screenShow,
      barClass: barClass
    })
  },

  hideScreenFn: () => {
    let screenShow = _this.data.screenShow;
    screenShow = !screenShow;
    let barClass = scrollTop > 128 || screenShow ? true : false;
    _this.setData({
      screenShow: screenShow,
      barClass: barClass
    })
  },
  onReachBottom: (e) => {
    if (_this.data.noMore) return;
    pageNum++;
    _this.getListFn();
  },
  /**
   * 获取商品列表
   */
  getListFn: () => {
    utils.uGet(`${api.HOST}/api/biz/${app.globalData.agencyId}/recommend`, {
      longitude: _this.data.longitude,
      latitude: _this.data.latitude,
      pageNum: pageNum,
      pageSize: pageSize,
      province_name: _this.data.provinceName,
      city_name: _this.data.cityName
    }).then((res) => {
      app.globalData.provinceName = _this.data.provinceName;
      app.globalData.cityName = _this.data.cityName;
      let goodsList = _this.data.goodsList;
      let noMore;
      if (res.length == 0) {
        noMore = true;
      } else {
        noMore = false;
        if (res.length > 0) {
          res.forEach((item, index) => {
            if (item.juli != null) {
              if (parseFloat(item.juli) > 1000) {
                item.juli = parseFloat(item.juli * 0.001).toFixed(1) + 'km'
              } else {
                item.juli = item.juli + 'm'
              }
            }
            if (item.path.indexOf('.th') === -1) {
              item.path = item.path + '.th'
            }
            if (item.described) {
              item.described.substring(0, 16)
            } else {
              item.described = '好';
            }

          })
          res = utils.getDefaultImg(res, 'path');
          goodsList = goodsList.concat(res);
          noMore = false;

          _this.setData({
            goodsList: goodsList
          })
        }
      }
      _this.setData({
        noMore: noMore
      })


    })
  },
  /*
   * 获取商家分类(首页)
   * 
   */
  getShopFn: () => {
    utils.uGet(`${api.HOST}/api/shop/sys/getProdictTypeList`, {}).then((res) => {
      let shopSort = _this.data.shopSort;
      if (res.length > 0) {
        res = utils.getDefaultImg(res, 'path');
        shopSort = shopSort.concat(res);
        _this.setData({
          shopSort: shopSort
        })
      }
    })
  },
  /**
   * 获取轮播图
   */



  /**
   * 获取商圈名
   * 
   */
  getCircleNameFn: () => {
    // console.log('app.globalData.agencyId'+app.globalData.agencyId)
    // utils.uGet(`${api.HOST}/admin/agency/queryAgencyAndUser`, {
    //   id: app.globalData.agencyId,
    // }).then((res) => {
    //   console.log(res);
    // })
    wx.request({
      url: `${api.HOST}/admin/agency/queryAgencyAndUser`, //仅为示例，并非真实的接口地址
      data: {
        id: app.globalData.agencyId,
      },
      success(data) {
        console.log('联系电话' + data.data.contact_phone)
        wx.setStorage({
          key: 'contact_phone',
          data: data.data.contact_phone,
        })
        //  console.log('11111' + JSON.stringify(data))
        wx.setNavigationBarTitle({
          title: '淘上品TopShopping'
        })

        _this.setData({
          name: data.data.name
        })

      }
    })

  },


  /**
   * 图片加载出错
   */
  imgErrorFn: (e) => {
    utils.imgErrorFn(_this, e);
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function(e) {
    // _this.setData({
    //     goodsList: []
    // });
    // pageNum = 1;
    // _this.getListFn()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    console.log(app.globalData.agencyId)
    let shareAgencyId = app.globalData.agencyId
    return {
      title: '淘上品TopShopping',
      // path: '/pages/index/index? agencyId= ${app.globalData.agencyId}'
      path: '/pages/index/index?shareAgencyId=' + shareAgencyId
    }
  },
  bindPhoneCbFn: () => {
    con.getUserInfoFn(_this, utils, app)
  },
})