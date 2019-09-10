// pages/shop_index/shop_index.js
const app = getApp();
const utils = require("../../../utils/util.js");
const api = require("../../../utils/api.js").api;
let scrollTop = 0;
let pageNum = 1;
let pageSize = 6;
let _this;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bar: ['商品列表', '店铺相册', '商家信息'],
        barIndex: 0,
        barClass: false,
        goodsBar: ['今日特价', '汤类', '快餐'],
        goodsIndex: 0,
        noMore:false,
        shopId: '',
        classId: '', //分类id
        picAry: [{
            type: 2,
            pic: []
        }, {
            type: 3,
            pic: []
        }, {
            type: 4,
            pic: []
        }, {
            type: 5,
            pic: []
        }],
        showPic: [],
        shopInfo: {},
        goodsList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        _this = this;
        _this.setData({
            shopId: options.shopId || '227beeabf558437eb06b2cfdb024f69b'
        });
        _this.getGoodsMenuFn();
        _this.getshopPicFn();
        _this.getShopInfoFn();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

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
        
            pageNum++;
        _this.getGoodsListFn();
        

    },

    /**
     * 页面滚动事件
     */
    onPageScroll: (e) => {
        scrollTop = e.scrollTop;
        if (e.scrollTop > 218 && _this.data.barClass == false && _this.data.barIndex == 0) {
            _this.setData({
                barClass: true
            })
        } else if (e.scrollTop <= 218 && _this.data.barClass == true && _this.data.barIndex == 0) {
            _this.setData({
                barClass: false
            })
        }
    },
    /**
     * 切换导航条
     */
    changeBarFn: (e) => {
        let index = utils.dataSet(e, 'index');
        _this.setData({
            barIndex: index,
            barClass: false
        })
    },
    /**
     * 切换菜单
     */
    changeGoodsBarFn: (e) => {
        let index = utils.dataSet(e, 'index');
        _this.setData({
            goodsIndex: index,
            classId: _this.data.goodsBar[index].class_id,
            goodsList: []
        });
        pageNum = 1;
        _this.getGoodsListFn();
    },
    callFn: () => {
        wx.makePhoneCall({
          phoneNumber: _this.data.shopInfo.mobile,
            success: function() {

            },
            error: function() {

            }
        })
    },

    /**
     * 获取商家菜单
     */
    getGoodsMenuFn: () => {
        utils.uGet(`${api.HOST}/api/shop/${_this.data.shopId}/category`, {
            shopId: _this.data.shopId
        }).then((res) => {
            console.log(res);
            if (res.length) {
                _this.setData({
                    goodsBar: res,
                    classId: res[_this.data.goodsIndex].class_id
                });
                _this.getGoodsListFn();
            }
        })
    },
    /**
     * 获取商家商品列表
     */
    getGoodsListFn: () => {
        utils.uGet(`${api.HOST}/api/shop/${_this.data.shopId}/item`, {
            shopId: _this.data.shopId,
            classId: _this.data.classId,
            onSale: 1, //是否上架：1 是 -1否
            pageNum: pageNum,
            pageSize: pageSize
        }).then((res) => {
            let result = res.mallGoods;
            if (result.length) {
                result = utils.getDefaultImg(result, 'path');
                let goodsList = _this.data.goodsList;
                goodsList = goodsList.concat(result);
                for (let i in goodsList) {
                    //加了'.th'的图片链接都是缩略图
                    if (goodsList[i].path.indexOf('.th') ==-1) {
                        goodsList[i].path = goodsList[i].path + '.th'
                    }
                }
                _this.setData({
                    goodsList: goodsList
                })
            }
        })
    },
    /**
     * 获取商家图片
     */
    getshopPicFn: () => {
        utils.uGet(`${api.HOST}/api/shop/biz-distract/pic/item/${_this.data.shopId}`, {
            pageNum: 1,
            pageSize: 100
        }).then((res) => {
            if (res.length > 0) {
                let picAry = _this.data.picAry;
                res.forEach((item, i) => {
                    picAry.forEach((pic, k) => {
                        if (pic.type == item.type) {
                            pic.pic.push(api.IMG + item.path);
                        }
                    });

                })
                let showPic = [picAry[0].pic[0], picAry[1].pic[0], picAry[2].pic[0], picAry[3].pic[0]];
                showPic = utils.getDefaultImg(showPic, '', false);
                _this.setData({
                    picAry: picAry,
                    showPic: showPic
                })
            }
        })
    },

    /**
     * 商家详情
     */
    getShopInfoFn: () => {
        utils.uGet(`${api.HOST}/api/shop/${_this.data.shopId}/shop`).then((res) => {
            if ((!res.address || res.address == 'undefined' || res.address == 'null') && (!res.map_flag || res.map_flag == 'undefined' || res.map_flag == 'null')) {
                res.address = "";
            } else {
                res.address = res.address == null ? '' : res.address;
                res.map_flag = res.map_flag == null ? '' : res.map_flag;
                res.map_flag += res.address;
            }
            let reg = /^(http|https)/g;
            res.portrait_url = reg.test(res.portrait_url) ? res.portrait_url : api.IMG + res.portrait_url;
            if (res.portrait_url.indexOf('.th') === -1) {
                res.portrait_url = res.portrait_url + '.th'
            }
            _this.setData({
                shopInfo: res
            })
          utils.uPost(`${api.HOST}/api/counts/increase`,
            {
              key: "shop",
              value: _this.data.shopId
            }, false, false
          )
        })
    },

    imgErrorFn: (e) => {
        utils.imgErrorFn(_this, e);
    },

    showPicFn: (e) => {
        let index = utils.dataSet(e, 'index');
        wx.previewImage({
            urls: _this.data.picAry[index].pic,
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

        return {
            title: '淘上品',
            // path: '/pages/shop_index/shop_index ? shopId=${_this.data.shopId} '
          path: `/pages/district/shop_index/shop_index?shopId=${_this.data.shopId}`
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