// pages/submit_orders/submit_orders.js
//获取应用实例
const app = getApp();
const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;
let _this;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        num: '1',
        price: '', //单价
        sum: '', //总额
        grouponPrice: '', //团购价
        phoneNum: app.globalData.mobile,
        phoneShow: '',
        goodsId: '',
        grouponsId: '', //团购id
        shopId: '',
        info: {},
        shopInfo: {},
        IMG: api.IMG,
        type: '',
        showPhone: false,
        grouponDetail: '',
        groupon: '',
        // Types: ['在线配送', '到店自取'],
        Types: ['到店自取'],
        tIndex: 0,
        shippingAddress: "", //收货地址
        shippingName: "", //收货人名称
        shippingPhone: "", //收货人号码
        positionName: '',
        payMoney: '', //实付价格
        returnMoney: '', //返现多少
        content: '', //备注
        positionName:'',   
        seatName:'', 
        },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        _this = this;
        utils.wxLogin().then(() => {
            _this.setData({
                goodsId: options.goodsId,
                shopId: options.shopId,
                phoneNum: app.globalData.mobile,
                type: options.type || '',
                grouponPrice: options.price || '',
                grouponsId: options.grouponsId || '',
            });
            _this.phoneNumFn();
            _this.getGoodsDetailFn();
            _this.getShopInfoFn();

            if (!app.globalData.userId || app.globalData.mobile == 'undefined') {
                _this.setData({
                    showPhone: true
                })
            }
            if (_this.data.grouponsId) {
                _this.getGrouponsDetailFn();
            }
          if (_this.data.type == 'groupons' || _this.data.type  == 'order') {
            _this.checkGroupFn();
          }
        })
    },
    onShow: function() {
        this.setData({
            shippingAddress: app.globalData.shippingAddress,
            shippingName: app.globalData.shippingName,
            shippingPhone: app.globalData.shippingPhone,
            positionName: app.globalData.positionName,
            seatName: app.globalData.seatName,
            content: app.globalData.content
        });

    },

    /**
     * 绑定手机
     */
    bindPhoneCbFn: () => {
        _this.setData({
            phoneNum: app.globalData.mobile
        });
        _this.phoneNumFn()
    },

    /**
     *添加或者减少商品数量 + -
     */
    delNumFn: function(e) {
        let numNew = _this.data.num;
        let priceNew = _this.data.price;
        if (numNew > 1) {
            numNew = parseInt(numNew);
            priceNew = parseFloat(priceNew);
            numNew--;
            priceNew = priceNew * numNew;
            _this.setData({
                num: numNew,
                sum: utils.round(priceNew, 2)
            })
            let returnMoney = utils.round((_this.data.price - _this.data.grouponPrice) * _this.data.num, 2)
            _this.setData({
                returnMoney: returnMoney
            })

        }
    },
    addNumFn: function(e) {
        let numNew = _this.data.num;
        let priceNew = _this.data.price;
        numNew = parseInt(numNew);
        priceNew = parseFloat(priceNew);
        numNew++;
        priceNew = numNew * priceNew;
        _this.setData({
            num: numNew,
            sum: utils.round(priceNew, 2)
        })
        let returnMoney = utils.round((_this.data.price - _this.data.grouponPrice) * _this.data.num, 2)
        _this.setData({
            returnMoney: returnMoney
        })

    },

    phoneNumFn: function(e) {
        let newPhone = utils.phoneStar(_this.data.phoneNum);
        _this.setData({
            phoneShow: newPhone
        })

    },
    /**
     * 选择
     */
    bindPickerChange: function(e) {
        this.setData({
            tIndex: e.detail.value
        })
    },



    /**
     * 生命周期函数--监听页面初次渲染完成 
     */
    onReady: function() {
        _this = this;
        _this.phoneNumFn();
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
        app.globalData.content = '';
    },

    /**
     * 获取商品详情
     */
    getGoodsDetailFn: () => {
        utils.uGet(`${api.HOST}/api/shop/item/${_this.data.goodsId}`, {
            goodsId: _this.data.goodsId,
            userId: app.globalData.userId,
            type: 0 //类型:1-商家 0-商品
        }).then((res) => {
            if (res) {
                res.path = utils.getDefaultImg(res.path.split(',')[0], '');
                if (res.path.indexOf('.th') === -1) {
                    res.path = res.path + '.th'
                }
                res.shop_price = parseFloat(res.shop_price).toFixed(2)
                _this.setData({
                    info: res,
                    price: parseFloat(res.shop_price).toFixed(2),
                  sum: utils.round(res.shop_price, 2)
                })
                let returnMoney = utils.round((_this.data.price - _this.data.grouponPrice) * _this.data.num, 2)
                _this.setData({
                    returnMoney: returnMoney
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
    getGrouponsDetailFn: () => {
        utils.uGet(`${api.HOST}/api/groupons/${_this.data.grouponsId}`, {}).then((res) => {
            if (res) {
                _this.setData({
                    grouponDetail: res
                })
            }
        })
    },

    /**
     * 查询商店商品是否有参加团购
     */
    checkGroupFn: () => {
        utils.uGet(`${api.HOST}/api/shop/${_this.data.shopId}/items/${_this.data.goodsId}/has-groupon`, {}, false).then((res) => {
            if (res) {
                _this.setData({
                    groupon: res,
                })
              console.log('55555555555groupon_goods_type' + res.groupon_goods_type)
              setTimeout(function(){
                if (res.groupon_goods_type == 2) {
                  //线上拼团支付价格
                  _this.setData({
                    sum: res.groupon_price,
                    price:res.groupon_price
                  })

                }
              },50)
             
            }
        })
    },
    submitFn: () => {
        let url;
        let formData;
        let type = '';
        // if (!app.globalData.userAddressId && !positionName && _this.data.tIndex == 0) {
        //     utils.errorShow('请选择地址');
        //     return;
        // }
        // if (!app.globalData.userAddressId && _this.data.tIndex == 0) {
        //     utils.errorShow('请选择地址');
        //     return;
        // }
        switch (_this.data.type) {
            case "normal": //正常下单
                type = 'normal';
                url = `${api.HOST}/api/order/${app.globalData.userId}/order/addOneOrder`;
                formData = {
                    shop_id: _this.data.shopId,
                    goods_id: _this.data.goodsId,
                    original_price: _this.data.sum,
                    user_mobile: _this.data.phoneNum,
                    position_name: _this.data.positionName,
                    seat_name: _this.data.positionName,
                    goodsJSON: JSON.stringify([{
                        goodsId: _this.data.goodsId,
                        sum: _this.data.num,
                        sunMoney: _this.data.sum,
                        money: _this.data.sum,
                        goodsName: _this.data.info.goods_name,
                        path: _this.data.info.path,
                        goods_sku_id: ""
                    }])
                };
                break;
            case "groupons": //团长下单
                type = 'order';
                url = `${api.HOST}/api/shop/${_this.data.shopId}/items/${_this.data.goodsId}/groupons`;
                formData = {
                    userId: app.globalData.userId,
                    original_price: _this.data.sum,
                    mobile: _this.data.phoneNum,
                    accquireGoodType: 1, //配送方式：1、到店自取 2、选择配送
                    groupPrice: _this.data.grouponPrice,
                    // position_name: _this.data.positionName,
                    // seat_name: _this.data.positionName,
                    goodJson: JSON.stringify([{
                        goodsId: _this.data.goodsId,
                        sum: _this.data.num,
                        sunMoney: _this.data.sum,
                        money: _this.data.sum,
                        goodsName: _this.data.info.goods_name,
                        path: _this.data.info.path,
                        goods_sku_id: ""
                    }])
                };
                break;

            case "order": //参团者下单
                type = 'order';
                url = `${api.HOST}/api/groupons/${_this.data.grouponsId}/order`;
                formData = {
                    userId: app.globalData.userId,
                    shopId: _this.data.shopId,
                    original_price: _this.data.sum,
                    mobile: _this.data.phoneNum,
                    accquireGoodType: 1, //配送方式：1、到店自取 2、选择配送
                    groupPrice: _this.data.grouponPrice,
                    // position_name: _this.data.positionName,
                    // seat_name: _this.data.positionName,
                    goodJson: JSON.stringify([{
                        goodsId: _this.data.goodsId,
                        sum: _this.data.num,
                        sunMoney: _this.data.sum,
                        money: _this.data.sum,
                        goodsName: _this.data.info.goods_name,
                        path: _this.data.info.path,
                        goods_sku_id: ""
                    }])
                };
                break;

        }
        if (_this.data.info.on_sale != 1) {
            console.log('_this.data.info.on_sale', _this.data.info.on_sale)
            utils.errorShow('该商品已下架');
            return;
        }
        if (_this.data.groupon) {
            let data = new Date().getTime();
            let endTime = _this.data.groupon.endTime.replace(/-/g, '/')
            if (data > new Date(endTime).getTime()) {
                utils.errorShow('该商品团购已过期');
                return;
            }
        }
        if (_this.data.grouponsId) {
            let data = new Date().getTime();
            let endTime = _this.data.grouponDetail.end_time.replace(/-/g, '/')
            if (data > new Date(endTime).getTime()) {
                utils.errorShow(`${_this.data.grouponDetail.groupons_name}已过期`);
                return;
            }
        }

        utils.uPost(url, formData).then((res) => {
            app.globalData.remind = '';
            app.globalData.receipt = '';
            app.globalData.tax = '';
            let grouponJson = JSON.stringify({
                goodsId: _this.data.goodsId,
                shopId: _this.data.shopId,
                type: type,
                grouponPrice: _this.data.grouponPrice,
                grouponsId: _this.data.grouponsId || res.groupons_id
            });
            app.globalData.content = '';
            wx.navigateTo({
                url: `../pay/pay?money=${_this.data.sum}&goodsName=${_this.data.info.goods_name}&orderId=${res.order_id}&shopId=${_this.data.shopId}&grouponJson=${grouponJson}&type=${_this.data.type}&shopName=${_this.data.shopInfo.shop_name}`
            })
        })
    }
})