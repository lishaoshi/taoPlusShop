// pages/order_detail/order_detail.js
const app = getApp();
const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;

let _this;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderId: '',
        shopId: '',
        goodsId: '',
        orderInfo: {},
        goodsInfo: {},
        shopInfo: {},
        couponInfo: {},
        groupons: undefined,
        grouponPrice: '',
        show_button: false, //判断是否显示团购按钮
        orderStatus: '',
        groupUser: '',
        info: '',
        commanderList: '',
        timeList:'',
        IMG: app.globalData.IMG,
        phoneShow: false,
        sum:'',
        orderShopList:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        _this = this;
        _this.setData({
            orderId: options.orderId,
            shopId: options.shopId,
            goodsId: options.goodsId,
            orderStatus: options.orderStatus
        });
    },
    onShow: function (){
      if (!app.globalData.userId || app.globalData.userId == '') {
        _this.setData({
          phoneShow: true
        });
      } else {
        _this.bindPhoneCbFn()
      }
    },
    /**
        * 生命周期函数--监听页面卸载
        */
    onUnload: function () {
        clearInterval(_this.data.timeList.Interval);
        _this.data.timeList.Interval = null;
    },
    bindPhoneCbFn: () => {
        _this.show_button = false;
        _this.getOrderDetailFn();
        _this.getShopInfoFn();
        _this.getGoodsDetailFn();
        _this.getGrouponsDetailFn();
        _this.getCouponFn();
    },

    /**
     * 用户点击分享
     */
    onShareAppMessage: function() {
        return {
            title: '我发起了拼团购买' + _this.data.goodsInfo.goods_name,
          path: `/pages/shop/page/share_detail/share_detail?goodsId=${_this.data.goodsId}&grouponsId=${_this.data.groupons.groupons_id}&shopId=${_this.data.shopId}&type=order&price=${_this.data.grouponPrice}`,
            imageUrl: _this.data.goodsInfo.path
        }
    },

    /**
     * 查询商店商品是否有参加团购
     */
    checkGroupFn: () => {
        utils.uGet(`${api.HOST}/api/shop/${_this.data.shopId}/items/${_this.data.goodsId}/has-groupon`, {}, false).then((res) => {
            if (res) {
                _this.setData({
                    grouponPrice: res.groupon_price,
                })
            }
        })
    },
    /**
     * 获取订单详情
     */
    getOrderDetailFn: () => {
        utils.uGet(`${api.HOST}/api/user/${app.globalData.userId}/order/${_this.data.orderId}/detail-v2`, {
            orderId: _this.data.orderId
        }).then((res) => {
            let sum = 0;
            res.mallOrderDetails.forEach((item,i)=>{
                let rep = /^(http|https)/g;
                let matches = rep.exec(item.path);
                let IMG = _this.data.IMG;
                let price = 0;
                if (matches) {
                    item.path = item.path;
                } else {
                    item.path = IMG + item.path;
                }  
                sum += parseInt(item.num)
               
                
            })
            _this.setData({
                sum:sum,
                orderShopList:res.mallOrderDetails
            })
            res.order.mobile = utils.phoneStar(res.order.mobile);           
            _this.setData({
                orderInfo: res.order,
            })
            _this.getOrderGrouponsInfoFn();
        })
    },
    //跳转t退款详情
    refundDetailFn: () => {
        wx.redirectTo({
            url: '../after_sales_detail/after_sales_detail?orderId=' + _this.data.orderId
        })

    },
    /**
     * 获取订单团购信息
     */
    getOrderGrouponsInfoFn: () => {
        utils.uGet(`${api.HOST}/api/groupons/info-with-order/${_this.data.orderId}`, {}).then((res) => {
            if (res) {
                _this.setData({
                    groupons: res,
                    type: res.type,
                })
            }

        })
    },
    //获取团购信息
    getGrouponsDetailFn: () => {
        utils.uGet(`${api.HOST}/api/groupons/${_this.data.orderId}/invite`, {}, true, true).then((res) => {
            _this.data.groupUser = [];
            _this.data.commanderList = {};

          if (res.groupOrderInfo == null) {
            console.log('当前商品并非团购');
            return;
          }

            if (!res.groupOrderInfo.described) {
                res.groupOrderInfo.described = '好'
            }
            res.groupOrderInfo.path = utils.getDefaultImg(res.groupOrderInfo.path, '')
            if (res.groupUserList) {
              
                res.groupUserList.portrait_url = utils.inspectPic(res.groupUserList.portrait_src)
              
                _this.data.commanderList = res.groupUserList
                res.groupUser.forEach((item, index) => {
                    item.portrait_url = utils.inspectPic(item.portrait_url)
                    _this.data.groupUser.push(item)
                })
            } else {
                res.groupUser.forEach((item, index) => {
                    item.portrait_url = utils.inspectPic(item.portrait_url)
                    if (item.is_head === 1) {
                        _this.data.commanderList = item
                    } else {
                        if (res.groupUserList) {
                            _this.data.groupUser = res.groupUserList
                        } else {
                            _this.data.groupUser.push(item)
                        }
                    }
                })
            }
            if (res) {
                _this.setData({
                    shareImg: res.groupOrderInfo.path
                })
            }
            let endTime = utils.parserDate(res.groupOrderInfo.endTime).getTime();
            let date = new Date();
            let nowTime = date.getTime();
            _this.setData({
                info: res.groupOrderInfo,
                groupUser: _this.data.groupUser,
                // leaveMoney: leaveMoney,
                commanderList: _this.data.commanderList,
                endTime: endTime,
                nowTime: nowTime,
            })
            _this.startIntervalFn(res.groupOrderInfo);
        })
    },
    //拼团倒计时
    startIntervalFn: (arr) => {
        // arr.endTime = arr.endTime.replace(/-/g, '/');
      clearInterval(arr.Interval);
        arr.endTime = arr.endTime.replace(/-/g, '/');
        let endTime = new Date(arr.endTime).getTime();
        // let endTime = utils.parserDate(arr.endTime).getTime();
        let timeStr = '';
        arr.Interval = setInterval(() => {
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
                arr.timeStr = timeStr;
                _this.setData({
                    timeList: arr
                })
            } else {
                clearInterval(arr.Interval);
                arr.Interval = null;
                arr.timeStr = '00:00:00';
                arr.over = true;
                _this.setData({
                    timeList: arr
                })
            }

        }, 1000);
    },
    /**
     * 商家详情
     */
    getShopInfoFn: () => {
        utils.uGet(`${api.HOST}/api/shop/${_this.data.shopId}/shop`).then((res) => {
            if ((!res.address || res.address == 'undefined') && (!res.map_flag || res.map_flag == 'undefined')) {
                res.address = "该商家暂未提供地址";
            } else {
                res.address = res.address == null ? '' : res.province_name + res.city_name + res.area_name + res.address;
                res.map_flag = res.map_flag == null ? '' : res.map_flag;
                res.map_flag += res.address;
            }
            _this.setData({
                shopInfo: res
            })
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
            if (res) {
                res.path = api.IMG + res.path.split(',')[0];
                if (res.path.indexOf('.th' === -1)) {
                    res.path = res.path + '.th'
                }
                _this.setData({
                    goodsInfo: res
                })
            }
        })
    },

    imgErrorFn: (e) => {
        utils.imgErrorFn(_this, e);
    },
    /**
     * 获取卷码
     */
    getCouponFn: () => {
        utils.uGet(`${api.HOST}/api/user/${app.globalData.userId}/order/${_this.data.orderId}/succeed`, {}).then((res) => {
            console.log(111111111111111111111111+"进来了")
          res.coupon_code = res.coupon_code?utils.bankCardStr(res.coupon_code) :'';
            res = utils.getDefaultImg(res, 'coupon_code_url');
            console.log('res.order_type'+res.order_type)
            _this.setData({
                couponInfo: res
            })
        })
    },

    callPhoneFn: () => {
        if (_this.data.shopInfo.mobile) {
            wx.makePhoneCall({
              phoneNumber: _this.data.shopInfo.mobile
            })
        } else {
            utils.errorShow('该商家没有电话');
        }
    },

    showPicFn: () => {
        wx.previewImage({
            urls: [_this.data.couponInfo.coupon_code_url]
        })
    },
  openLocation: () => {
    if (_this.data.shopInfo.latitude) {
      utils.uGet(`${api.HOST}/api/user/third/geo-converter`, {
        lng: _this.data.shopInfo.longitude,
        lat: _this.data.shopInfo.latitude
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