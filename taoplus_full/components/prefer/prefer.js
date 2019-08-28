const app = getApp();

const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;

let _this;
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    // phoneShow: {
    //   type: Boolean,
    //   observer: function (newVal, oldVal, changedPath) {
    //     if (newVal) {
    //       //_this.getUserInfoFn();
    //     }
    //   }
    // },
    sum:{
      type:Number
    },
    num:{
      type:Number
    },
    alias:{
      type:String
    },
    reGet:{
      type:Boolean
    },
    pagehtml:{
      type:String
    }
  },
  pageLifetimes: {
    show: function () {
      console.log(1111111111111111111111111111111);
      this.getData();
      // 选择红包和代金券的钱数
      this.setData({
        // bagMoney: wx.getStorageSync('bagMoney'),
        couponMoney: wx.getStorageSync('couponMoney'),
      });
      // 页面被展示
      // 显示所选择代金券钱数
      if (wx.getStorageSync('couponMoney')) {
        this.setData({
          isSelectCoupon: true
        })
      }else{
        this.setData({
          isSelectCoupon: false
        })
      }
    },
    hide: function () {
      // 页面被隐藏
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  },
  created: function() {
    _this = this;
  },
  /**
   *组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息
   */
  ready: function(options) {
    console.log(222222222222222222222222222222222);
    console.log('alias:::' + this.data.alias);
    console.log('reGet::' + this.data.reGet);
    
    this.getData();
    // 选择红包和代金券的钱数
    this.setData({
      // bagMoney: wx.getStorageSync('bagMoney'),
      couponMoney: wx.getStorageSync('couponMoney'),
    });
    // 显示所选择红包钱数
    // if (wx.getStorageSync('bagMoney')) {
    //   this.setData({
    //     isSelectBag: true
    //   })
    // }
    // 显示所选择代金券钱数
    if (wx.getStorageSync('couponMoney')) {
      this.setData({
        isSelectCoupon: true
      })
    } else {
      this.setData({
        isSelectCoupon: false
      })
    }
    // console.log('bagMoney:' + wx.getStorageSync('bagMoney'));
    console.log('couponMoney:' + wx.getStorageSync('couponMoney').amount);
    console.log('isSelectCoupon:' + this.data.isSelectCoupon);
  },

  data: {
    redBagData: [],
    couponData: [],

    bagNum: 0, // 红包可用数量
    couponNum: 0, // 代金券可用数量

    // bagMoney: 0,
    couponMoney: 0,

    isSelectBag: false, // 有红包的情况下 是否 选择了
    isSelectCoupon: false, // 有代金券的情况下 是否 选择了
  },
  methods: {
    // 跳转页面：红包 或 代金券 页面
    gotoBagCoupon: (event) => {
      console.log(event.currentTarget);
      console.log(event.currentTarget.dataset.type);

      // if(!_this.data.sum){
      //   wx.showToast({
      //     title: '请输入金额',
      //     icon: 'none'
      //   })
      //   return false;
      // }

      let selectType = event.currentTarget.dataset.type; // 'bag' || 'coupon'
      let useName = selectType+'Num';
      let useNum = _this.data[`${useName}`]; 

      if (useNum != 0) {
        wx.navigateTo({
          url: `/components/bag_coupon/bag_coupon?type=${selectType}&sum=${_this.data.sum}&num=${_this.data.num}&alias=${_this.data.alias}&pagehtml=${_this.data.pagehtml}`,
          // events: {
          //   // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
          //   acceptDataFromOpenedPage: function(data) {
          //     console.log(data)
          //   }
          // },
          // success: function(res) {
          //   // 通过eventChannel向被打开页面传送数据
          //   res.eventChannel.emit('acceptDataFromOpenerPage', {
          //     data: selectType
          //   })
          // }
        })
      }else{
        // let showTip = '';
        // switch (selectType) {
        //   case 'bag':
        //     showTip = '无可用红包';
        //     break;
        //   case 'coupon':
        //     showTip = '无可用代金券';
        //     break;
        //   default:
        //     showTip = '无可用优惠券';
        //     break;
        // }
        wx.showToast({
          title: '无可用优惠券',
          icon: 'none',
          duration: 1200
        })
      }

    },

    getData: function() {
      let redbagRes = [];
      // let couponRes = [];
      console.log(app.globalData.userId+':'+app.globalData.shopId);

      let alias = '';
      if (this.data.alias == 'redbags'){
        alias = 'RED_PAPER_COUPON';
      }else if(this.data.alias == 'coupons'){
        alias = 'NORMAL_COUPON';
      }else{  
        alias = '';
      }

      utils.uGet(`${api.HOST}/api/coupon/mine`, { userId: app.globalData.userId, shopId: app.globalData.shopId, status: 1, alias: alias}).then((res) => {
        console.log(res);
        let couponRes = res.records;

        this.setData({
          redBagData: redbagRes,
          bagNum: redbagRes.length,
          couponData: couponRes,
          couponNum: res.total
        });

        wx.setStorage({
          key: 'bag',
          data: redbagRes
        })
        wx.setStorage({
          key: 'coupon',
          data: couponRes
        })
      
      })

     
    },

  }
})