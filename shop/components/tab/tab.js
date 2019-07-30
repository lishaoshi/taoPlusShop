const app = getApp();

const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;

let systemInfo = wx.getSystemInfoSync();

let rpx = 1;

let px = rpx / 750 * systemInfo.windowWidth;

let scrollTop;
let scrollLeft;
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    innerText: {
      type: String,
      value: 'default value',
    },
    top: {
        type: Number,
        value: systemInfo.windowHeight - 150,
    },
    left: {
        type: Number,
        value: 0
    }
  },
  data: {
    // 这里是一些组件内部数据
    close: true,
    show_bool: 'show',
    hide_bool: 'hide',
    scrollTop: systemInfo.windowHeight-100,
    scrollLeft:0,
    startY: 0,
    startX: 0,
    animationData: {},
    animationData2: {},
    flag:true
  },
    created: function () {
       
    },
    ready: function () {
        let close = this.data.close;
        utils.showFn(this, close, 'show_bool', 'animationData');
        utils.showFn(this, !close, 'hide_bool', 'animationData2');
    },
  methods: {
    // 这里是一个自定义方法
    customMethod: function () { },
    
     changeTrigger: function(e){
       // flag 用来防止连续点击
      let flag = this.data.flag;
      if (flag){
        this.setData({
          flag: false
        });
        let  close = this.data.close;
        close = !close;
        
        utils.showFn(this, close, 'show_bool', 'animationData');
        utils.showFn(this, !close, 'hide_bool', 'animationData2');
        this.setData({
          close: close,
        });
        let _this = this;
        setTimeout(function(){
          _this.setData({
            flag: true
          })
        },500)
      }
        
     
       
    },

      touchstartFn: function(e){
          console.log(e);
          let _this = this;
          ping = 1;
          startY = e.touches[0].clientY;
          startX = e.touches[0].clientX;
      },
      touchmoveFn: function (e) {
          let _this = this;
          let pageX = e.touches[0].pageX;
          let pageY = e.touches[0].pageY;

          if(pageX < 50 ){
              pageX = 50;
              
          }

          if (pageY < 50){
              pageY = 50;
          }

          if (pageX > systemInfo.windowWidth - 20) {
              pageX = systemInfo.windowWidth - 20
          }

          if (pageY > systemInfo.windowHeight - 20) {
              pageY = systemInfo.windowHeight - 20
          }

            this.setData({
                left: pageX - 50,
                top: pageY - 50
            })
          
      },
      touchendFn: function (e) {
          let _this = this;
        //   let scrollTop = _this.data.scrollTop;
        //   scrollTop = scrollTop > 325 / 2 ? 325 : 0;
        //   _this.setData({
        //       scrollTop: scrollTop
        //   })
      },
     
  }
})