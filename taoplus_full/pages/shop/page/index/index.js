//index.js
//获取应用实例
const app = getApp();

const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;
const con = require("../../utils/getUserInfo.js");

let _this;

let seat_name = '';

let position_name = '';

Page({
  data: {
    isBackShow: true, //是否显示左上角的返回按钮
    latitude: '', //纬度
    longitude: '', //经度
    isShow: false, //是否显示活动专区
    isShowTap: false,
    barIndex: 0,
    shopId: '',
    shareShopId: '',
    classId: '',
    classIds: '',
    IMG: '',
    shopInfo: {}, //商店详情
    scrollHeight: 0,
    pageNum: 1,
    pageSize: 1000,
    showMask: false, //显示遮罩
    showFormat: false, //显示规格
    showCar: false, //显示购物车详情
    currentTaste: '不吃辣', //当前的味道
    currentSize: '小份', //当前的份额
    currentGoods: {}, //当前选择的商品
    carList: [], //购物车列表
    activitList: [], //活动列表
    carNum: 0, //购物车数量
    carMoney: 9, //购物车金额
    // toView: 0,//滚动条滚动的位置
    cateList: [], //分类列表
    taste: [{
      name: '不吃辣',
      check: true
    }, {
      name: '少放辣',
      check: false
    }, {
      name: '多放辣',
      check: false
    }],
    size: [{
      name: '小份',
      check: true
    }, {
      name: '大份',
      check: false
    }],
    goodsList: [], //商品列表
    loadMore: true, //是否可以加载更多
    noMore: false,
    scrollTop: 0,
    sHeight: 226,
    bgColor: 'transparent',
    opacity: '0.35',
    startY: 0,
    banner: [],
    phoneShow: false,
    skeletonShow: true,
    selectGoodsId: '',
    selectShopId: '',
    positionName: '',
    seatName: '',
    scrollTitle: '',
    currentCategory: 0,
    // 每个分类距离顶部的高度的数组
    productsTop: [],
    categoryTop: 10000,
    // 用于存储每次滚动结束之后的距离, 可用来判断滚动的方向
    moveStartPos: 0,
    // 点击分类的名称, 用于点击跳转
    scrollInTo: '',
    height: '',
    marginBottom: 400,

    isShowTap: {
      0: true
    },
    userButton: false,
    headHeight: 360,
    modeValue: 'scaleToFill',
    toMiniProgramEnvVersion: app.globalData.toMiniProgramEnvVersion,
    couponData: [], // 代金券数据-用户获取该商家可以领取的优惠券

  },
  onLoad: function(options) {
    wx.clearStorageSync();

    let currentPage = getCurrentPages();
    // console.log('currentPage.length:' + currentPage.length);
    if (currentPage.length == 1) {
      this.setData({
        isBackShow: false
      });
    } else {
      this.setData({
        isBackShow: true
      });
    }

    _this = this;
    let rpx = 1;
    let systemInfo = wx.getSystemInfoSync();
    let px = rpx / 750 * systemInfo.windowWidth;
    let scrollHeight = systemInfo.windowHeight - 200 * px;
    //获取二维码内容

    if (options.q) {
      console.log(JSON.stringify(options.q))
      let q = decodeURIComponent(options.q);
      let type = '';
      app.globalData.shopId = utils.getQueryString(q, 'shopId');
      type = utils.getQueryString(q, 'type')
      console.log(type)
      app.globalData.seatName = utils.getQueryString(q, 'seatName') || '';
      app.globalData.positionName = utils.getQueryString(q, 'positionName') || '';
      wx.setStorage({
        key: 'olb_shopId',
        data: app.globalData.shopId,
      })
      if (type == 1) {
        wx.navigateTo({
          url: '/pages/shop/page/shop_pay/shop_pay',
        })
      }

    } else {
      if (options.shopId) {
        wx.setStorage({
          key: 'olb_shopId',
          data: options.shopId,
        })
      }
      let shareShopId = options.shopId
      let shopId = app.globalData.shopId;
      console.log(app.globalData.shopId)
      app.globalData.shopId = shareShopId || shopId || wx.getStorageSync('olb_shopId');
    }
    wx.getSystemInfo({
      success: function(res) {
        _this.setData({
          height: res.windowHeight - (res.windowWidth / 750) * 94
        })
        console.log('height', _this.data.height)
      }

    })

    /**
     * 测试扫桌台 
     */
    // app.globalData.positionName = '测试区域';
    // app.globalData.shopId ='a5ff12c1e6634bb69a786160d59d8979';
    // app.globalData.seatName = 'c001';

    _this.setData({
      scrollHeight: scrollHeight,
      shopId: app.globalData.shopId,
      IMG: api.IMG,
      positionName: app.globalData.positionName,
      seatName: app.globalData.seatName
    });

    //   微信授权登录
    console.log(utils);

    //获取本地存储的地址
    let address = wx.getStorageSync('olb_checked_address');
    if (address) {
      app.globalData.shippingAddress = address.shippingAddress;
      app.globalData.shippingName = address.shippingName;
      app.globalData.shippingPhone = address.shippingPhone;
      app.globalData.userAddressId = address.userAddressId;
      app.globalData.checked = address.checked;
    }
    //获取经纬度
    // wx.getLocation({
    //     type: 'wgs84',
    //     success: function (res) {
    //         let latitude = res.latitude
    //         let longitude = res.longitude
    //         _this.setData({
    //             latitude: latitude,
    //             longitude: longitude
    //         })
    //     }
    // })

  },

  goback: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 滚动商品的时候
   */
  scroll: function(e) {
    if (!this.data.scrollByClick) {
      this.setData({
        isShowTap: null,
      })
    }
    this.onScrollViewScroll({
      scrollTop: e.detail.scrollTop
    })
  },
  getUserInfo: (e) => {
    con.getUserInfo(app, _this);
  },
  // 点击分类跳转
  clickScrollInTo(e) {
    clearTimeout(this.data.scrollByClickTimeout);
    let idx = e.currentTarget.dataset.index
    if (this.data.isShow) {
      this.setData({
        isShow: !this.data.isShow,
      })
    }
    this.data.scrollByClick = true;

    this.setData({
      scrollInTo: e.currentTarget.dataset.name,
      isShowTap: {
        [idx]: true
      },
    })

    this.data.scrollByClickTimeout = setTimeout(function() {
      _this.data.scrollByClick = false;
    }, 500);

  },
  onScrollViewScroll(e) {
    // 当前滚动的距离
    let scrollTop = e.scrollTop
    // moveStartPos记录着上一次滚动完成时的位置, 用于判断滚动方向
    //如果现在的滚动距离大于moveStartPos说明正在往下滚动
    if (scrollTop > this.data.moveStartPos) {
      this.setData({
        moveStartPos: scrollTop
      })
      // 遍历每个商品距离顶部的距离
      this.data.productsTop.forEach((item, index) => {
        // 如果滚动的距离大于某个商品到顶部的距离说明该商品到了顶部, 减10是为了减少触发距离
        if (scrollTop > item.top - 10) {
          // 当前分类的索引小于满足条件的商品索引就赋值, 跳到下一个分类
          if (this.data.currentCategory < index) {
            this.setData({
              currentCategory: index,
            })
            if (this.data.currentCategory % 5 == 0) {
              this.setData({
                scrollTitle: 'i' + index
              })
            }
          }
        }
      })
      // 如果现在的滚动距离小于moveStartPos说明正在往上滚动    
    } else if (scrollTop < this.data.moveStartPos) {
      this.data.moveStartPos = scrollTop
      this.data.productsTop.forEach((item, index) => {
        if (scrollTop < item.top - 10) {
          if (this.data.currentCategory >= index) {
            this.setData({
              currentCategory: index ? index - 1 : index
            })
            if (this.data.currentCategory % 4 == 0) {
              this.setData({
                scrollTitle: 'i' + ((index - 4) <= 0 ? 0 : (index - 4))
              })
            }
          }
        }
      })
    }
  },
  touchstartFn: function(e) {
    _this = this;
    _this.setData({
      startY: e.touches[0].clientY
    });
  },

  touchmoveFn: function(e) {
    _this = this;
    let bgColor = _this.data.bgColor;
    let headHeight = _this.data.headHeight;
    if (bgColor == 'transparent') {
      _this.setData({
        bgColor: '#fff'
      })
    }
    let startY = _this.data.startY;
    let clientY = e.touches[0].clientY;
    let range = clientY - startY;
    if (range < 0) {
      if (headHeight == 360) {
        _this.setData({
          headHeight: 134,
          modeValue: 'top',
        })
      }

    } else {
      if (headHeight == 134) {
        _this.setData({
          headHeight: 360,
          modeValue: 'scaleToFill',
        })
      }
    }
    let scrollTop = _this.data.scrollTop;
    scrollTop += range;
    if (scrollTop >= 0 && scrollTop <= _this.data.sHeight) {
      _this.setData({
        scrollTop: scrollTop
      })
    }
  },
  touchendFn: function(e) {
    _this = this;
    let scrollTop = _this.data.scrollTop;
    let scrollHeight;
    let modeValue;
    scrollTop = scrollTop > _this.data.sHeight / 2 ? _this.data.sHeight : 0;
    let bgColor;
    // let opacity;
    let headHeight;
    if (scrollTop == _this.data.sHeight) {
      bgColor = 'transparent';
      // opacity = '0.35';
      modeValue = 'scaleToFill';

    } else {
      bgColor = '#fff';
      // opacity = '1';
      headHeight = 134;
      modeValue = 'center';
    }
    _this.setData({
      scrollTop: scrollTop,
    })
    setTimeout(() => {
      _this.setData({
        bgColor: bgColor,
        // opacity: opacity,
        headHeight: headHeight,
        modeValue: modeValue,
      })
    }, 500)
  },
  /**
   * 查询是否是推广人
   */
  checkGeneralizer: () => {
    utils.uGet(`${api.HOST}/api/promoter/${_this.data.shopId}/selectOne`, {
      userId: app.globalData.userId,
    }, true, true).then((res) => {
      _this.setData({
        isGeneralizer: res === 1,
      })
      app.globalData.isGeneralizer = _this.data.isGeneralizer
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作 
   */
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },
  onReady: function() {
    utils.wxLogin().then(() => {
      if (!app.globalData.userId || app.globalData.userId == '') {
        con.getUserInfoFn(_this, utils, app)
        // _this.setData({
        //   phoneShow: true
        // });
      }
      // 获取显示代金券模态框数据 getCoupon
      _this.getCoupon();
      
      _this.goodsClassifyList();
      _this.getShopDetail();
      _this.getBannerFn();
      _this.checkGeneralizer();
      _this.getActivityGoodFn();
    });
  },
  onShow: function() {
    console.log(app.globalData)
    _this = this;
    if (app.globalData.userId) {
      _this.getCarList();
      _this.checkGeneralizer();
    }

  },

  // 获取代金券模态框数据 getCoupon
  getCoupon: function() {
    _this = this;

    console.log('userId::' + app.globalData.userId);

    utils.uGet(`${api.HOST}/api/user/${app.globalData.userId}/coupon/${_this.data.shopId}`).then((res) => {
      
      // console.log(_this.thridModal)
      if(res.length == 0){
        _this.thridModal.hideModal();
        return;
      }

      res.forEach(function(item, index) {
        if (item.isOnlyOne == 1) {
          if (!item.couponId) {
            item.isGet = true;
          } else {
            item.isGet = false;
          }
        } else {
          item.isGet = true;
        }
      })

      _this.setData({
        couponData: res
      });

      // 显示页面时显示领取代金券模态框
      this.thridModal = this.selectComponent("#thridModal");
      let num=0;
      res.forEach(function (item, index) {
        if (item.isGet){
          num++;
        }
        if(num > 0){
          _this.thridModal.showModal();
        }else{
          _this.thridModal.hideModal();
        }
      })

    })
  },

  setPhoneShow: function() {
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
  getBannerFn: function() {
    utils.uGet(`${api.HOST}/api/shop/${app.globalData.shopId}/pic/slide`, {
      shopId: app.globalData.shopId
    }, false).then((res) => {
      let result = res;
      if (result.length == 0) {
        result.push({
          path: '/template/15233642765accb1b481d89.png',
          goods_id: ''
        });
      }
      _this.setData({
        banner: result
      });

    })
  },
  /**
   * 点击滚动到特定的位置(废弃)
   * 
   */
  scrollFn: function(e) {
    _this = this;
    let index = e.currentTarget.dataset.index;
    _this.setData({
      toView: index
    })
  },

  /**
   * 获取分类列表
   */
  goodsClassifyList: function() {
    _this = this;
    utils.uGet(`${api.HOST}/api/shop/${_this.data.shopId}/category`, {
      shopId: _this.data.shopId
    }, false).then((res) => {
      let newCateList = res;
      let cateList = _this.data.cateList;
      let ids = '';
      let activiList = {
        class_id: 119,
        class_name: '活动',
        create_time: '',
        modify_time: '',
        shop_id: '',
        status: 1
      }

      cateList = cateList.concat(res);

      cateList.forEach((item, i) => {
        item.num = 0;
        if (i < cateList.length - 1) {
          ids += item.class_id + ','
        } else {
          ids += item.class_id
        }
      });
      cateList.unshift(activiList);
      _this.setData({
        cateList: cateList,
        classId: cateList[0].class_id,
        classIds: ids
      });
      _this.goodsList();
    })
  },
  /**
   * 点击活动专区
   */
  activiChangeFn: function() {

    _this.setData({
      isShow: true,
      activitList: [],
      pageNum: 1
    })
    _this.getActivityGoodFn();
  },

  /**
   * 获取活动专区列表
   */
  getActivityGoodFn: function() {
    _this = this;
    utils.uGet(`${api.HOST}/api/${_this.data.shopId}/activity-goods/item/goods`, {
      pageNum: _this.data.pageNum,
      pageSize: _this.data.pageSize,
      // longitude: _this.data.longitude,
      // latitude: _this.data.latitude,
    }, false).then((res) => {
      let noMore;
      let activitList = _this.data.activitList;
      activitList = activitList.concat(res);
      let arr = [{
        data: [],
        type: 119
      }];

      res.forEach((item) => {
        arr[0].data.push(item)
      })
      _this.setData({
        activitList: arr
      })
    })



  },



  /**
   * 获取商品列表
   */
  goodsList: function(append = false) {
    _this = this;
    utils.uGet(`${api.HOST}/api/shop/${_this.data.shopId}/slide/item`, {
      classIds: _this.data.classIds,
    }, false).then((res) => {

      let activitGoods = _this.data.activitList;
      let arr = _this.data.cateList;
      let allData = activitGoods.concat(res)

      allData.forEach((item, index) => {
        //加上分类名称
        if (item.type == _this.data.cateList[index].class_id) {
          item.name = _this.data.cateList[index].class_name
        }
        //判断图片是否为缩略图
        for (let i in item.data) {
          item.data[i].num = 0;
          item.data[i].class_id = _this.data.cateList[index].class_id;
          if (item.data[i].path != null && item.data[i].path.indexOf('.th') === -1) {
            item.data[i].path = item.data[i].path + '.th'
          }
        }

      })

      for (let i = 0; i < allData.length; i++) {
        if (allData[i].data === undefined || allData[i].data.length < 1) {
          arr.splice(i, 1)
          allData.splice(i--, 1)
        }
      }

      _this.setData({
        goodsList: allData,
        cateList: arr
      });


      //页面准备完成之后获取每个分类距离顶部的高度, 存储在数组productsTop中
      let heightArr = [];
      wx.createSelectorQuery().selectAll('.anchor').boundingClientRect(function(rect) {
        rect.forEach((item, index) => {
          heightArr.push({
            top: item.top - rect[0].top,

          })
        })

        //设置高度数组
        _this.setData({
          productsTop: heightArr,
        })

      }).exec()
      if (app.globalData.userId) {
        _this.getCarList();
        _this.checkGeneralizer();
      }
      if (_this.data.skeletonShow) {
        _this.animationend();
      }

    })

  },
  /**
   * 获取购物车列表
   */
  getCarList: function() {
    _this = this;
    utils.uGet(`${api.HOST}/api/shop/${app.globalData.shopId}/cartList`, {
      userId: app.globalData.userId,
      shopId: app.globalData.shopId
    }, false).then((res) => {
      _this.resizeLeftNum();
      _this.changeGoods(res);
    })
  },
  /**
   * 改变数据
   */
  changeGoods: function(res) {
    let _this = this;
    let carList;
    let goodsList = _this.data.goodsList;
    goodsList.forEach((item, i) => {
      item.data.forEach(item1 => {
        item1.num = 0
      })
    })
    if (res.length == 0) {
      carList = [];

    } else {
      carList = res[0].cartListGoods;
    }
    carList.forEach((item, i) => {
      let num = item.num;
      let class_id = item.class_id;
      let goods_id = item.goods_id;
      _this.changeLeftNum(class_id, num);
      goodsList.forEach(item => {
        item.data.forEach(item1 => {
          if (item1.goods_id == goods_id) {
            item1.num = num;
            return;
          }
        })
      })

    })

    _this.setData({
      carList: carList,
      goodsList: goodsList
    });

    _this.carNumFn();

  },

  /**
   * 点击遮罩隐藏
   */
  triggerMaskFn: function(e) {
    let _this = this;
    _this.setData({
      showFormat: false,
      showCar: false,
      showMask: false
    });
  },
  /**
   * 显示购物车详情
   */
  showCarFn: function(e) {
    let _this = this;
    _this.getCarList();
    _this.setData({
      showCar: true,
      showMask: true
    });
  },

  /**
   * 修改左侧菜单的显示数量
   */
  changeLeftNum: function(id, op) {
    let _this = this;
    let index;
    let cateList = _this.data.cateList;
    cateList.forEach((item, i) => {
      if (item.class_id == id) {
        index = i;
        return;
      }
    });
    if (cateList[index]) {
      cateList[index].num += parseInt(op);
      if (cateList[index].num <= 0) {
        cateList[index].num = 0;
      }
      _this.setData({
        cateList: cateList
      })
    }

  },
  /**
   * 左侧菜单数量还原
   */
  resizeLeftNum: function() {
    let _this = this;
    let cateList = _this.data.cateList;
    cateList.forEach((item, i) => {
      item.num = 0;
    });
    _this.setData({
      cateList: cateList
    })
  },
  /**
   * 购物车添加或者减少商品数量 + -
   */
  changeCarNumFn: function(e) {
    let _this = this;
    _this.setPhoneShow();
    let id = e.currentTarget.dataset.id;
    let shopid = e.currentTarget.dataset.shopid
    _this.setData({
      selectGoodsId: id,
      selectShopId: shopid
    })
    let op = e.currentTarget.dataset.op;
    let currentGoods;
    let goodsList = _this.data.goodsList;
    let carList = _this.data.carList;

    goodsList.forEach((item, index) => {
      for (let i = 0; i < item.data.length; i++) {
        if (item.data[i].goods_id == id) {
          currentGoods = item.data[i];
        }
      }

    });
    if (!currentGoods) {
      carList.forEach((item, i) => {
        if (item.goods_id == id) {
          currentGoods = item;
        }
      });
    }

    let num = currentGoods.num + parseInt(op);
    num = num > 0 ? num : 0;
    utils.uPost(`${api.HOST}/api/shop/${app.globalData.shopId}/cart-goods`, {
      businessId: currentGoods.goods_id,
      userId: app.globalData.userId,
      shopId: app.globalData.shopId,
      num: num
    }, false).then((res) => {
      _this.getCarList();

    })

  },

  /**
   * 修改购物车显示的商品数量和金额
   */
  carNumFn: function() {
    let _this = this;
    // _this.setPhoneShow();
    let carList = _this.data.carList;
    let carNum = 0;
    let carMoney = 0;
    carList.forEach(function(item, i) {
      carNum += parseInt(item.num);
      carMoney += parseInt(item.num) * parseFloat(item.goods_shop_price);
    });
    _this.setData({
      carNum: carNum,
      carMoney: carMoney.toFixed(2)
    });
  },

  /**
   * 清空购物车
   */
  clearFn: function() {
    let _this = this;
    _this.setPhoneShow();
    let goodsList = _this.data.goodsList;
    let carList = _this.data.carList;
    let cateList = _this.data.cateList;
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
      goodsList.forEach(function(item, i) {
        item.data.forEach(item1 => {
          item1.num = 0;
        })

      });
      cateList.forEach(function(item, i) {
        item.num = 0;
      });
      _this.setData({
        carList: [],
        carNum: 0,
        carMoney: 0,
        goodsList: goodsList,
        cateList: cateList
      })
    })

  },
  jumpToFn: function() {
    let _this = this;
    let carList = _this.data.carList;
    let shopInfo = _this.data.shopInfo;
    if (shopInfo.work_status == 2) {
      wx.showToast({
        title: '该商家休息中，暂不接单',
        icon: 'none',
        duration: 1000
      });
      return;
    }
    if (carList.length == 0) {
      wx.showToast({
        title: '请选择商品',
        icon: 'none',
        duration: 1000
      });
      return;
    }
    wx.navigateTo({
      url: `../sublimt_order/sublimt_order`,
    });
  },

  /**
   * 跳转到详情页
   */
  JumpToInfoFn: function() {
    wx.navigateTo({
      url: '../shop_info/shop_info?shopId=' + this.data.shopId,
    });
  },
  /**
   * 获取商家详情
   */
  getShopDetail: function() {
    let _this = this;
    utils.uGet(`${api.HOST}/api/shop/${_this.data.shopId}/shop`, {
      shopId: _this.data.shopId
    }, false).then((res) => {
      let result = res;
      app.globalData.shopName = result.shop_name;
      app.globalData.shopImg = result.portrait_url;

      if (result.portrait_url.indexOf('.th') === -1) {
        result.portrait_url = result.portrait_url + '.th'
      }
      wx.setNavigationBarTitle({
        title: result.shop_name,
      });
      _this.setData({
        shopInfo: result
      });
      utils.uPost(`${api.HOST}/api/counts/increase`, {
        key: "shop",
        value: _this.data.shopId
      }, false, false)
    });


  },

  loadMoreFn: function(e) {
    if (this.data.isShow) {
      let _this = this;
      let pageNum = _this.data.pageNum;
      let pageSize = _this.data.pageSize;
      let loadMore = _this.data.loadMore;

      if (loadMore) {
        _this.setData({
          pageNum: pageNum + 1
        });
        _this.getActivityGoodFn();
      }
    }
  },

  bindPhoneCbFn: () => {
    _this.getCarList();
    _this.checkGeneralizer();

  },
  animationend: () => {
    app.show(_this, 'skeleton', 0)
    setTimeout(() => {
      _this.setData({
        skeletonShow: false
      })
    }, 500)
  },
  //点击首页轮播图
  goShopDetail: function(e) {
    let goodsId = e.currentTarget.dataset.goodsid
    if (goodsId) {
      wx.navigateTo({
        url: `../shop_detail/shop_detail?goodsId=${goodsId}`,
      })
    } else {
      return;
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let _this = this;
    let shopId = app.globalData.shopId;
    console.log(app.globalData.shopId)
    return {
      path: '/pages/shop/page/index/index?shopId=' + shopId
      // path: `/pages/index/index`
    }
  },
  bindPhoneCbFn: () => {
    //con.getUserInfoFn(_this, utils, app)
  },
})