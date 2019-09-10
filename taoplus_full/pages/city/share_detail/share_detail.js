// pages/goods_detail/goods_detail.js 
const app = getApp();
const utils = require("../../../utils/util.js");
const api = require("../../../utils/api.js").api;
const con = require("../../../utils/getUserInfo.js");
let QQMapWX = require('../../../libs/qqmap-wx-jssdk.js');
let qqmapsdk;
let _this;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        banner: [],
        isScroll: true,
        scrollHeight: '',
        goodsId: '',
        shopId: '',
        info: {},
        shopInfo: {},
        IMG: api.IMG,
        shareImg: '',
        bindPhone: false,
        isGroup: false,
        grouponPrice: '',
        grouponSum:'',
        grouponGoodsId: '',
        grouponList: [],
        timeList: [],
        isShow: false,
        groupingNum: '',
        endTime: '',
        orderId: '',
        grouponsId: '', //团购Id
        commanderList: [], //团员信息
        groupUser: {}, //团长信息
        groupInfo: {}, //团购信息
        lat: '',
        lng: '',
        timeList: '',
        latitude: '',
        longitude: '',
        goodsName:'',
        hasGrouped: false, //判断是否已经拼团
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        if (options.agencyId) {
            wx.setStorage({
                key: 'plus_agencyId',
                data: options.agencyId,
            })
        }
        app.globalData.agencyId = options.agencyId || app.globalData.agencyId;
        _this = this;
        _this.setData({
            goodsId: options.goodsId,
            shopId: options.shopId,
            orderId: options.orderId,
            grouponsId: options.grouponsId,
            price: options.price,
            hasGrouped: false,
        });
        let scrollHeight = utils.getSystemInfo().windowHeight;
        _this.setData({
            scrollHeight: scrollHeight
        })


    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: '我发起了拼团购买' + _this.data.goodsName,
            path: `/pages/city/share_detail/share_detail?goodsId=${_this.data.goodsId}&grouponsId=${_this.data.grouponsId}&shopId=${_this.data.shopId}&price=${_this.data.grouponPrice}&orderId=${_this.data.orderId}&agencyId=${app.globalData.agencyId}`,
            imageUrl: _this.data.shareImg
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
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
          success: function (res) {
            let latitude = res.latitude
            let longitude = res.longitude
            //地址逆解析
            wx.request({
              url: 'https://api.map.baidu.com/geocoder?location=' + latitude + ',' + longitude + '&output=json&coord_type=wgs84&key=mANIkD2dBjNiel6bbEUGPN0WvU9TY4Kh',
              data: {},
              success: function (data) {
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
              fail: function (err) {
                console.log(JSON.stringify(err))
              }
            })

          }
        })
        if (app.globalData.userId) {
          con.getUserInfoFn(_this, utils, app)
        }

      });
        //获取经纬度
        wx.getLocation({
            type: 'wgs84',
            success: function(res) {
                let latitude = res.latitude
                let longitude = res.longitude
                _this.setData({
                    latitude: latitude,
                    longitude: longitude
                })
                _this.getShopInfoFn();
            }
        })
        _this.getGoodsDetailFn();
        _this.checkGroupFn();
        _this.getGroupsFn();
        _this.getGrouponNumFn();
        _this.getgrouponsInfo();
        _this.getBanner()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        let grouponList = _this.data.grouponList;
        grouponList.forEach((item, i) => {
            clearInterval(item.Interval);
            item.Interval = null;
        });
        _this.data.timeList.forEach((item, i) => {
            clearInterval(item.Interval);
            item.Interval = null;
        });
        _this.setData({
            grouponList: grouponList
        })
    },

    /**
     * 获取轮播图
     */
  getBanner: () => {
    utils.uGet(`${api.HOST}/api/shop/goods/pic/path`, {
      goodsId: _this.data.goodsId,
    }, true, true).then((res) => {

      if (res) {
        let banner = [];
        res.forEach(item => {
          banner.push(_this.data.IMG + item.path)
        })
        _this.setData({
          banner: banner
        })
      }
    })
  },
    /**
     * 获取商品详情
     */
    getGoodsDetailFn: () => {
        utils.uGet(`${api.HOST}/api/shop/item/${_this.data.goodsId}`, {
            goodsId: _this.data.goodsId,
            userId: app.globalData.userId,
            type: 0 //类型:1-商家 0-商品
        }, true, true).then((res) => {
          let imgAry = res.path.split(',');
          let banner = utils.getDefaultImg(imgAry, '');
            if (res) {
                _this.setData({
                    info: res,
                    goodsName: res.goods_name,
                    shareImg: banner[0]
                })
            }
        })
    },
    /**
     * 商家详情
     */
    getShopInfoFn: () => {
        utils.uGet(`${api.HOST}/api/shop/${_this.data.shopId}/shop`, {
            latitude: _this.data.latitude,
            longitude: _this.data.longitude
        }).then((res) => {
            let result = utils.getDefaultImg(res, 'portrait_url');
            if (result.juli != null) {
                if (parseFloat(result.juli) > 1000) {
                    result.juli = parseFloat(result.juli * 0.001).toFixed(1) + 'km'
                } else {
                    result.juli = result.juli + 'm'
                }
            }
            if (result.portrait_url.indexOf('.th') === -1) {
                result.portrait_url = result.portrait_url + '.th'
            }
            if (!result.map_flag || result.map_flag === "undefined") {
                result.map_flag = '该商家没有提供地址';
            }
            _this.setData({
                shopInfo: result
            })
        })
    },
    /**
     * 获取团购组信息
     */
    getgrouponsInfo: () => {
        utils.uGet(`${api.HOST}/api/groupons/${_this.data.grouponsId}`, {
            grouponId: _this.data.grouponsId,
        }, true, true).then((res) => { 
            _this.data.groupUser = []; //团员信息
            _this.data.commanderList = {}; //团长信息 
            res.groupUserList.forEach((item, index) => {
                // item.portrait_url = utils.getDefaultImg(item.portrait_url, '')
                item.portrait_url = utils.inspectPic(item.portrait_url)
                if (item.is_head === 1) {
                    _this.data.commanderList = item
                    //判断是否已经拼过团
                    if (_this.data.commanderList.user_id === app.globalData.userId) {
                        _this.setData({
                            hasGrouped: true,
                        })
                    }
                } else {
                    _this.data.groupUser.push(item)
                    _this.data.groupUser.forEach((items, index) => {
                        if (items.user_id === app.globalData.userId) {
                            _this.setData({
                                hasGrouped: true,
                            })
                        }
                    })

                }
            })
            _this.setData({
                groupInfo: res,
                groupUser: _this.data.groupUser,
                commanderList: _this.data.commanderList,
            })
            _this.startIntervalFn([_this.data.groupInfo], "timeList");

        })
    },

    imgErrorFn: (e) => {
        utils.imgErrorFn(_this, e);
    },

    /**
     * 查询商店商品是否有参加团购
     */
    checkGroupFn: () => {
        utils.uGet(`${api.HOST}/api/shop/${_this.data.shopId}/items/${_this.data.goodsId}/has-groupon`, {}, false).then((res) => {
            if (res) {
                _this.setData({
                    isGroup: res.type == 1,
                    grouponPrice: res.groupon_price,
                    grouponGoodsId: res.groupon_goods_id,
                    endTime: res.endTime,
                    grouponSum: res.groupon_sum
                })
            }
        })
    },

    /**
     * 查询商店商品正在拼团的组
     */
    getGroupsFn: () => {
        utils.uGet(`${api.HOST}/api/shop/${_this.data.shopId}/items/${_this.data.goodsId}/groupons`, {
            shopId: _this.data.shopId,
            itemId: _this.data.goodsId
        }, false).then((res) => {
            if (res.records.length > 0) {
                let result = utils.getDefaultImg(res.records, 'portrait_url');
                _this.setData({
                    grouponList: result
                });

                _this.startIntervalFn(result);

            }
        })
    },
    /**
     * 拼团倒计时
     */
    startIntervalFn: (arr, setName) => {
        !setName ? setName = "grouponList" : false
        let timeList = _this.data.timeList;
        arr.forEach((item, i) => {
            item.end_time = item.end_time.replace(/-/g, '/');
            // let endTime = new Date(item.end_time).getTime();
            let endTime = utils.parserDate(item.end_time).getTime();
            let timeStr = '';
            item.over = false;
            item.Interval = setInterval(() => {
                //获取当前时间  
                let date = new Date();
                let now = date.getTime();
                //时间差  
                let leftTime = endTime - now;
                let hhh, mmm, sss; //定义变量 d,h,m,s保存倒计时的时间  
                if (leftTime >= 0) {
                    hhh = Math.floor(leftTime / 1000 / 60 / 60 % 24);
                    mmm = Math.floor(leftTime / 1000 / 60 % 60);
                    sss = Math.floor(leftTime / 1000 % 60);
                    hhh = hhh < 10 ? '0' + hhh : hhh;
                    mmm = mmm < 10 ? '0' + mmm : mmm;
                    sss = sss < 10 ? '0' + sss : sss;
                    timeStr = `${hhh}:${mmm}:${sss}`;
                    item.timeStr = timeStr;
                    _this.setData({
                        [setName]: arr
                    })
                } else {
                    clearInterval(item.Interval);
                    item.Interval = null;
                    item.timeStr = '00:00:00';
                    item.over = true;
                    _this.setData({
                        [setName]: arr
                    })
                }
                if (setName == "timeList") {}
            }, 1000);

        })
    },

    /**
     * 导航
     */
    onClickNavigationMap: function() {
        let that = this
        let address = that.data.shopInfo.map_flag;
        let getkey = new QQMapWX({
            key: 'UI5BZ-BBAKD-TOA46-HDSUJ-QGRJ6-7AFOB'
        });
        getkey.geocoder({
            address: address,
            success: function(res) {
                that.setData({
                    lat: res.result.location.lat,
                    lng: res.result.location.lng,
                })
                wx.openLocation({
                    latitude: that.data.lat,
                    longitude: that.data.lng,
                    scale: 15,
                    address: address,
                })
            },
            fail: function(res) {},
            complete: function(res) {},
        });
    },
    getGrouponNumFn: () => {
        utils.uGet(`${api.HOST}/api/shop/${_this.data.shopId}/items/${_this.data.goodsId}/groupingNum`, {}, false).then((res) => {
            _this.setData({
                groupingNum: res
            })
        })
    },
    //判断是否是否在拼团时间

    onclickFn: () => {

        let now = new Date().getTime();
        let endTime = _this.data.endTime.replace(/-/g, '/');
        if (now > new Date(endTime).getTime()) {
            utils.errorShow('该团购已过期');
            return;
        }
        wx.navigateTo({
            url: `../submit_orders/submit_orders?goodsId=${_this.data.info.goods_id}&shopId=${_this.data.info.shop_id}&type=groupons&price=${_this.data.grouponPrice}`
        })

    },
    /**
     * 显示更多拼单
     */
    showMoreFn: (e) => {
        let isShow = _this.data.isShow;
        _this.setData({
            isShow: !isShow
        })
    },
    //拨打电话
    callSomeBody: function(e) {
        wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.moblile
        })
    },
    bindPhoneCbFn: () => {
        con.getUserInfoFn(_this, utils, app)
    },
})