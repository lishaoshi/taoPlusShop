const app = getApp();
const utils = require("../../../utils/util.js");
const api = require("../../../utils/api.js").api;
import Validator from '../../../utils/validator.js';

let _this;
let pageNum = 1;
let pageSize = 6;
Page({
  /**

   * 页面的初始数据
   */
  data: {
    bar: ['一起拼团', '满减专区', '一元购'],
    side: [],
    sideArr:[],
    barClass: false,
    barIndex: 0,
    orderStatus: ['1', '0', '2', '5'],
    barIndex: 0,
    sideIndex: 0,
    goodsList: [],
    longitude: '', //经度
    latitude: '', //纬度
    type: 1,
    noMore: false,
    Img: api.HOST,
    ids: '',
    scrollTitle:'',
    currentCategory: 0,
    // 每个分类距离顶部的高度的数组
    productsTop: [],
    categoryTop: 10000,
    // 用于存储每次滚动结束之后的距离, 可用来判断滚动的方向
    moveStartPos: 0,
    // 点击分类的名称, 用于点击跳转
    scrollInTo: '',
    scrollViewHeight: 0,// 商品列表滚动高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _this = this;
    this.setScrollHeight();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    
    //获取经纬度
    // wx.getLocation({
    //   type: 'wgs84',
    //   success: function(res) {
    //     let latitude = res.latitude
    //     let longitude = res.longitude
    //     _this.setData({
    //       latitude: latitude,
    //       longitude: longitude
    //     })
    //   }
    // })
  },
  scroll: function(e) {
    this.onScrollViewScroll({
      scrollTop: e.detail.scrollTop
    })
  },

  getTabBarHeight:function(){
    let systemInfo = wx.getSystemInfoSync()
    // px转换到rpx的比例
    let pxToRpxScale = 750 / systemInfo.windowWidth;
    // 状态栏的高度
    let ktxStatusHeight = systemInfo.statusBarHeight * pxToRpxScale
    // 导航栏的高度
    let navigationHeight = 44 * pxToRpxScale
    // window的宽度
    let ktxWindowWidth = systemInfo.windowWidth * pxToRpxScale
    // window的高度
    let ktxWindowHeight = systemInfo.windowHeight * pxToRpxScale
    // 屏幕的高度
    let ktxScreentHeight = systemInfo.screenHeight * pxToRpxScale
    // 底部tabBar的高度
    let tabBarHeight = (ktxScreentHeight - ktxStatusHeight - navigationHeight - ktxWindowHeight) / 750 * systemInfo.windowWidth
    console.log("tabBarHeight:" + tabBarHeight);
    return tabBarHeight;
  },

  // 动态设置商品滚动高度
  setScrollHeight: function () {
    let _this = this;
    // 先取出页面高度 windowHeight
    wx.getSystemInfo({
      success: function (res) {

        let windowHeight = res.windowHeight;

        // 然后取出navbar和header的高度
        // 根据文档，先创建一个SelectorQuery对象实例
        let query = wx.createSelectorQuery().in(_this);
        // 然后逐个取出navbar和header的节点信息
        // 选择器的语法与jQuery语法相同
        query.select('#navbar').boundingClientRect();
        query.select('#header').boundingClientRect();
        // query.select('#tabbar').boundingClientRect();

        
        // 执行上面所指定的请求，结果会按照顺序存放于一个数组中，在callback的第一个参数中返回
        query.exec((res) => {
          // 分别取出navbar和header的高度
          let navbarHeight = res[0].height;
          let headerHeight = res[1].height;
          let tabbarHeight = _this.getTabBarHeight();

          // 然后就是做个减法
          let scrollViewHeight = windowHeight - navbarHeight - headerHeight + tabbarHeight;
          console.log(scrollViewHeight);
          // 需要注意的是，上面scrollViewHeight计算出来的值，单位是px而不是rpx。

          // 算出来之后存到data对象里面
          _this.setData({
            scrollViewHeight: scrollViewHeight
          });
        });

        console.log('scrollViewHeight', _this.data.scrollViewHeight);


      }
    });


  },
  // 点击分类跳转 
  clickScrollInTo(e) {
    this.setData({
      scrollInTo: e.currentTarget.dataset.name,
      currentCategory: e.currentTarget.dataset.index //点击左侧bar把当前的下标赋予currentCategory
    })
  },
  onScrollViewScroll(e) {
    // 当前滚动的距离
    let scrollTop = e.scrollTop

    // moveStartPos记录着上一次滚动完成时的位置, 用于判断滚动方向
    // 如果现在的滚动距离大于moveStartPos说明正在往下滚动
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
              currentCategory: index
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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    pageNum = 1;
    utils.wxLogin().then(() => {
      _this.getListType();
    });
  },
  onReachBottom: (e) => {
    if (_this.data.noMore) return;
  },
  /**
   * 获取商品列表
   */
  getListFn: () => {
    console.log(app.globalData.latitude)
    utils.uGet(`${api.HOST}/api/1/goods/slide/item`, {
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude,
      province_name: app.globalData.provinceName,
      city_name: app.globalData.cityName, 
      ids: _this.data.ids
    }).then((res) => {
      _this.data.goodsList = [];
      let noMore;
      let goodsList = res;
      if (res.length > 0) {
        goodsList.forEach(((item,index)=>{
          for(let i in item.data){
            if (goodsList[index].data[i].juli != null) {
              if (parseFloat(goodsList[index].data[i].juli) > 1000) {
                goodsList[index].data[i].juli = parseFloat(goodsList[index].data[i].juli * 0.001).toFixed(1) + 'km'
              } else {
                goodsList[index].data[i].juli = goodsList[index].data[i].juli + 'm'
              }
            }
            if (goodsList[index].data[i].described) {
              goodsList[index].data[i].described.substring(0, 16)
            } else {
              goodsList[index].data[i].described = '好';
            }
            if (goodsList[index].data[i].path.indexOf('.th') === -1) {
              goodsList[index].data[i].path = goodsList[index].data[i].path + '.th'
            }

          }
        }))
        noMore = false;
      } else {
        noMore = true;
      }
      let sideArr = _this.data.side;
      _this.data.side.forEach((item, index) => {
        //获取当前分类名称
        if (item.product_type_id == goodsList[index].type) {
          goodsList[index].name = item.type_name
        }
      })
      //删除商品数组为空的
      for (let i = 0;i<goodsList.length;i++){
        if (goodsList[i].data.length<1){
          goodsList.splice(i,1)
          sideArr.splice(i--,1)
        }
      }
      _this.setData({
        goodsList: goodsList,
        sideArr:sideArr
      })
      
      // 页面准备完成之后获取每个分类距离顶部的高度, 存储在数组productsTop中
      let arr = [];
      wx.createSelectorQuery().selectAll('.anchor').boundingClientRect(function(rect) {
        rect.forEach((item, index) => {
          arr.push({
            top: item.top - rect[0].top
          })
        })
        //设置高度数组
        _this.setData({
          productsTop: arr
        })
      }).exec()
      _this.setData({
        noMore: noMore
      });


    })

  },
  /**
   * 获取商品列表分类
   */
  getListType: function() {
    utils.uGet(`${api.HOST}/api/shop/sys/getProdictTypeList/all`, {}).then((res) => {
      _this.setData({
        side: res.reverse(),
      })

      //获取所有的分类id
      let strings = '';
      this.data.side.forEach((item, index) => {
        if (index < this.data.side.length - 1) {
          strings += item.product_type_id + ','
        } else {
          strings += item.product_type_id
        }
      })
      this.setData({
        ids: strings
      })
      this.getListFn()
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})