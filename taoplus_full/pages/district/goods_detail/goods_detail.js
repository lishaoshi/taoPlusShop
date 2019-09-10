// pages/goods_detail/goods_detail.js
const app = getApp();
const utils = require("../../../utils/util.js");
const api = require("../../../utils/api.js").api;

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
        bindPhone: false,
        isGroup: false,
        grouponPrice: '',
        grouponGoodsId: '',
        grouponList: [],
        timeList: [],
        isShow: false,
        groupingNum: '',
        endTime: '',
        groupsNum: '', //已拼团次数
        isIphoneX: '', //识别iphonex以上手机
        groupUser:[],
        commanderList:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
      
        _this = this;
        if (options.agencyId) {
            wx.setStorage({
                key: 'plus_agencyId',
                data: options.agencyId,
            })
        }
        app.globalData.agencyId = options.agencyId || app.globalData.agencyId;
        
        
        _this.setData({
            goodsId: options.goodsId,
            shopId: options.shopId
        });
        app.globalData.shopId = options.shopId;
       
        let scrollHeight = utils.getSystemInfo().windowHeight;
        // let isIphoneX = app.globalData.isIphoneX;
        _this.setData({
            scrollHeight: scrollHeight,
            // isIphoneX: isIphoneX
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        _this.getGoodsDetailFn();
        _this.getShopInfoFn();
        _this.checkGroupFn();
        _this.getGroupsFn();
        _this.getGroupsNum();
        _this.getGrouponNumFn();
        _this.getBanner();
      _this.addAgengcySeeCount();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

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
        _this.setData({
            grouponList: grouponList
        })
    },
  //增加访问量
  addAgengcySeeCount:()=>{
    utils.uPost(`${api.HOST}/api/shop/shop/${_this.data.shopId}/addAgengcySeeCount`,{
      goodsId: _this.data.goodsId,
      shopId: _this.data.shopId
    },true,true).then((res)=>{
      console.log(JSON.stringify(res))
    })
  },
    /**
     * 获取团购组信息
     */
    getgrouponsInfo: (grouponsId) => {
        utils.uGet(`${api.HOST}/api/groupons/${grouponsId}`, {
            grouponId: _this.data.grouponsId,
        }, true, true).then((res) => {
            res.groupUserList.forEach((item, index) => {
                item.portrait_url = utils.inspectPic(item.portrait_url)
                if (item.is_head === 1) {
                    //判断是否已经拼过团
                    _this.data.commanderList = item
                    if (_this.data.commanderList.user_id === app.globalData.userId) {
                        wx.showToast({
                            title: '你已参与该拼团',
                            duration: 2000
                        })
                    } else {
                        wx.navigateTo({
                            url: `../submit_orders/submit_orders?goodsId=${_this.data.info.goods_id}&grouponsId=${grouponsId}&shopId=${_this.data.info.shop_id}&type=order&price=${_this.data.grouponPrice}`
                        })
                    }
                } else {
                    _this.data.groupUser.push(item)
                    _this.data.groupUser.forEach((items, index) => {
                        if (items.user_id === app.globalData.userId) {
                            wx.showToast({
                                title: '你已参与该拼团',
                                duration: 2000
                            })
                        } else {
                            wx.navigateTo({
                                url: `../submit_orders/submit_orders?goodsId=${_this.data.info.goods_id}&grouponsId=${grouponsId}&shopId=${_this.data.info.shop_id}&type=order&price=${_this.data.grouponPrice}`
                            })
                        }
                    })

                }
            })

        })
    },
    /**
     * 去拼单
     */
    goToCrowdordering: function(e) {
        let index = e.currentTarget.dataset.index
        _this.getgrouponsInfo(_this.data.grouponList[index].groupons_id)
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    bindPhoneCbFn: () => {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function(res) {
        wx.showShareMenu({
            withShareTicket: false
        });
        return {
            title: _this.data.info.goods_name,
          path: `/pages/district/goods_detail/goods_detail?goodsId=${_this.data.goodsId}&shopId=${_this.data.shopId}&agencyId=${app.globalData.agencyId}`
        }
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

                _this.setData({
                    info: res
                })
              utils.uPost(`${api.HOST}/api/counts/increase`,
                {
                  key: "goods",
                  value: _this.data.goodsId
                }, false, false
              )
            }
        })
    },
  /**
   * 获取商品轮播图
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
     * 商家详情
     */
    getShopInfoFn: () => {
        utils.uGet(`${api.HOST}/api/shop/${_this.data.shopId}/shop`).then((res) => {
            let result = utils.getDefaultImg(res, 'portrait_url');

            if (result.portrait_url.indexOf('.th') === -1) {
                result.portrait_url = result.portrait_url + '.th'
            }

            _this.setData({
                shopInfo: result
            })
        })
    },

    /**
     * 收藏
     */
    collectFn: () => {
        if (!app.globalData.userId) {
            _this.setData({
                bindPhone: true
            });
            return;
        }
        utils.uPost(`${api.HOST}/api/user/${app.globalData.userId}/favorites/${_this.data.info.goods_id}/add`, {
            type: 2 //类型:1.商家 2.商品
        }, true, true).then((res) => {
            utils.successShow('收藏成功').then(() => {
                let info = _this.data.info;
                info.is_collect = 1;
                _this.setData({
                    info: info
                })
            });
        })
    },
    /**
     * 取消收藏
     */
    removeCollectFn: () => {
        utils.uPost(`${api.HOST}/api/user/${app.globalData.userId}/favorites/${_this.data.info.goods_id}/delete`, {}, true, true).then((res) => {
            utils.successShow('取消收藏成功').then(() => {
                let info = _this.data.info;
                info.is_collect = 0;
                _this.setData({
                    info: info
                })
            });
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
                    grouponSum: res.groupon_sum,
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
            console.log('res', res)
            if (res.records.length > 0) {
                res.records.forEach((item, index) => {
                    item.portrait_url = utils.inspectPic(item.portrait_url)
                })
                _this.setData({
                    grouponList: res.records
                });
                _this.startIntervalFn(res.records);
            }
        })
    },

    /**
     * 查询已拼团次数
     */
    getGroupsNum: () => {
        utils.uGet(`${api.HOST}/api/shop/${_this.data.goodsId}/count`, {}, false).then((res) => {
            _this.setData({
                groupsNum: res.sum
            })
        })
    },
    /**
     * 拼团倒计时
     */
    startIntervalFn: (arr) => {
        let timeList = _this.data.timeList;
        arr.forEach((item, i) => {
            item.end_time = item.end_time.replace(/-/g, '/');
            let endTime = new Date(item.end_time).getTime();

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
                        grouponList: arr
                    })
                } else {
                    clearInterval(item.Interval);
                    item.Interval = null;
                    item.timeStr = '00:00:00';
                    item.over = true;
                    _this.setData({
                        grouponList: arr
                    })
                }

            }, 1000);

        })
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
    /**
     * 显示规则
     */
    goToGroupRules: () => {
        wx.navigateTo({
            url: '../group_rules/group_rules'
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