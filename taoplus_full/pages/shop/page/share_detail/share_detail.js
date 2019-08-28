// pages/goods_detail/goods_detail.js
const app = getApp();
const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;
const con = require("../../utils/getUserInfo.js");
let QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
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
        goodsName:'',
        info: {},
        shopInfo: {},
        IMG: api.IMG,
        bindPhone: false,
        isGroup: false,
        grouponPrice: '',
        grouponSum: '',
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
        hasGrouped: false, //判断是否已经拼团
        buyState: '',
        buyButton: '',
        shareImg:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
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
        if (options.shopId) {
            wx.setStorage({
                key: 'olb_shopId',
                data: options.shopId,
            })
        }
        app.globalData.shopId = options.shopId;
        _this.setData({
            scrollHeight: scrollHeight
        })
        // var hasGroupedT = [true, false]
        // var on_saleT = [1, -1]
        // var typeT = [2, 3, 5]
        // var groupon_goods_typeT = [-1, 1]

        // hasGroupedT.forEach((hasGrouped) => {
        //     on_saleT.forEach((on_sale) => {
        //         typeT.forEach((type) => {
        //             groupon_goods_typeT.forEach((groupon_goods_type) => {
        //                 console.log('hasGrouped, on_sale, type, groupon_goods_type', hasGrouped, on_sale, type, groupon_goods_type)
        //                 console.log('buyBtnState', this.buyBtnState(hasGrouped, on_sale, type, groupon_goods_type))
        //             })
        //         })
        //     })
        // })

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: '我发起了拼团购买' + _this.data.goodsName,
            path: `/pages/share_detail/share_detail?goodsId=${_this.data.goodsId}&grouponsId=${_this.data.grouponsId}&shopId=${_this.data.shopId}&price=${_this.data.grouponPrice}&orderId=${_this.data.orderId}`,
            imageUrl: _this.data.shareImg
        }
    },

    /**
     * 判断商品六种状态
     */
    buyBarState: function() {
        var hasGrouped = this.data.hasGrouped
        var info = this.data.info
        var groupInfo = this.data.groupInfo
        var timeList = this.data.timeList
        /*
        测试
        */
        // var hasGrouped = hasGrouped; //true,false
        // var info = {
        //     on_sale: on_sale //1,-1
        // }
        // var groupInfo = {
        //     type: type, //1,2,3,4,5
        //     groupon_goods_type: groupon_goods_type, //-1,0,1
        // }


        if (info.on_sale === -1) {
            return '该商品已下架';
        }

        if (groupInfo.type === 5) {
            return '该拼团已完成';
        }

        if (groupInfo.type === 3) {
            if (groupInfo.groupon_goods_type === -1) {
                return '团购活动已结束';
            } else if (groupInfo.groupon_goods_type === 1) {
                if (hasGrouped) {
                    return '你已参与该拼团';
                } else {
                    return '该拼团已超时';
                }
            } else {
                return '未开始';
            }
        }

        if (hasGrouped) {
            return '你已参与该拼团';
        }

        if (groupInfo.type === 2) {
            return timeList[0].timeStr + '已结束';
        }

        return '';



    },

    buyBtnState() {
        var hasGrouped = this.data.hasGrouped
        var info = this.data.info
        var groupInfo = this.data.groupInfo


        if (info.on_sale === -1) {
            return 6;
        }
        if (groupInfo.type === 5) {
            return 3;
        }
        if (groupInfo.type === 3) {
            if (groupInfo.groupon_goods_type === -1) {
                return 2;
            } else if (groupInfo.groupon_goods_type === 1) {
                if (hasGrouped) {
                    return 5; //已参与的发起拼团
                } else {
                    return 4;
                }
            } else {
                return '未开始';
            }

        }
        if (hasGrouped) {
            return 5;
        }
        if (groupInfo.type === 2) {
            return 1;
        }
        return '';

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
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
        _this.getgrouponsInfo()
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

    bindPhoneCbFn: () => {

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
            console.log('shopInfo', _this.data.shopInfo)
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
            //推广的情况
            if (res.user_id_tow) {
                console.log('res.user_id_tow', res.user_id_tow)
                _this.data.commanderList = res
                _this.data.commanderList.portrait_url = utils.inspectPic(res.portrait_src)
                _this.data.groupUser = res.groupUserList
                if (res.groupUserList) { //有参与者的情况：判断团长或者参与者是否参与过此团
                    _this.data.groupUser.forEach((items, index) => {
                        if (items.user_id === app.globalData.userId || _this.data.commanderList.user_id_tow === app.globalData.userId) {
                            _this.setData({
                                hasGrouped: true,
                            })
                        }
                    })
                } else { //无参与者的情况：判断团长是否参与过此团即刻
                    if (_this.data.commanderList.user_id_tow === app.globalData.userId) {
                        _this.setData({
                            hasGrouped: true,
                        })
                    }
                }

            } else { //正常发起拼团
                res.groupUserList.forEach((item, index) => {
                    item.portrait_url = utils.inspectPic(item.portrait_url)
                    if (item.is_head === 1) {
                        //判断是否已经拼过团
                        _this.data.commanderList = item
                        if (_this.data.commanderList.user_id === app.globalData.userId) {
                            _this.setData({
                                hasGrouped: true,
                            })
                        }
                    } else {
                        _this.data.groupUser.push(item)
                        _this.data.groupUser.forEach((items, index) => {
                            if (items.user_id === app.globalData.userId) {
                                console.log('参与进来')
                                _this.setData({
                                    hasGrouped: true,
                                })
                            }
                        })

                    }
                })
            }
            // res.groupUserList.forEach((item, index) => {
            //     // item.portrait_url = utils.getDefaultImg(item.portrait_url, '')
            //     // if (item.portrait_url){
            //     //     item.portrait_url = utils.inspectPic(item.portrait_url)
            //     // }else{
            //     //     item.portrait_url = utils.inspectPic(item.portrait_src)
            //     // }

            //     if (item.portrait_src) {
            //         item.portrait_url = utils.inspectPic(item.portrait_src)
            //         _this.data.commanderList = item
            //         //判断是否已经拼过团
            //         if (_this.data.commanderList.user_id === app.globalData.userId) {
            //             _this.setData({
            //                 hasGrouped: true,
            //             })
            //         }
            //     } else {
            //         item.portrait_url = utils.inspectPic(item.portrait_url)
            //         _this.data.groupUser.push(item)
            //         _this.data.groupUser.forEach((items, index) => {
            //             if (items.user_id === app.globalData.userId) {
            //                 _this.setData({
            //                     hasGrouped: true,
            //                 })
            //             }
            //         })

            //     }
            // })

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
                _this.setData({
                    buyState: _this.buyBarState(),
                    buyButton: _this.buyBtnState(),
                })
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