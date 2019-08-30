// common/component/modal.js
const app = getApp();

const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;
const con = require("../../utils/getUserInfo.js");

Component({

  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    couponData: {
      type: Object
    },

    backdrop: {
      type: Boolean,
      value: true
    },

    animated: {
      type: Boolean,
      value: true
    },

    modalSize: {
      type: String,
      value: "md"
    },

    animationOption: {
      type: Object,
      value: {
        duration: 300
      }
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: false,
    animation: ''
  },


  ready: function() {

    this.animation = wx.createAnimation({
      duration: this.data.animationOption.duration,
      timingFunction: "linear",
      delay: 0
    });
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 领取代金券-领取优惠券 /coupon/rule/{couponRuleId}/receive
    saveCoupon: function(e) {
      console.log('e.target.dataset.id'+e.target.dataset.id);
      console.log('userId' + app.globalData.userId);

      console.log(this.data.couponData);

      let _this = this;
      let couponData = this.data.couponData;
      let couponRuleId = e.currentTarget.dataset.id;
      utils.uPost(`${api.HOST}/api/coupon/rule/${couponRuleId}/receive`, { userId: app.globalData.userId }).then((res) => {
        console.log(res);

        couponData.forEach(function(item, index) {
          console.log(item + ':' + index);
          if (item.id == couponRuleId) {
            couponData.splice(index, 1);

            _this.setData({
              couponData: couponData
            });

          }
        })

        console.log('_this.data.couponData.length:' + _this.data.couponData.length);
        if (_this.data.couponData.length == 0){
          _this.hideModal();
        }
        let num = 0;
        _this.data.couponData.forEach(function (item, index) {
          if (item.isGet) {
            num++;
          }
          if (num > 0) {
            _this.showModal();
          } else {
            _this.hideModal();
          }
        })

        

      })
    },



    hideModal: function(e) {
      if (e) {
        let type = e.currentTarget.dataset.type;
        if (type == 'mask' && !this.data.backdrop) {
          return;
        }
      }
      if (this.data.isShow) this._toggleModal();
    },

    showModal: function() {
      if (!this.data.isShow) {
        this._toggleModal();
      }
    },

    _toggleModal: function() {
      if (!this.data.animated) {
        this.setData({
          isShow: !this.data.isShow
        })
      } else {
        let isShow = !this.data.isShow;
        this._executeAnimation(isShow);
      }


    },

    _executeAnimation: function(isShow) {
      let animation = this.animation;

      if (isShow) {

        animation.opacity(0).step();

        this.setData({
          animationData: animation.export(),
          isShow: true
        })

        setTimeout(function() {
          animation.opacity(1).step()
          this.setData({
            animationData: animation.export()
          })
        }.bind(this), 50)
      } else {
        animation.opacity(0).step()
        this.setData({
          animationData: animation.export()
        })

        setTimeout(function() {
          this.setData({
            isShow: isShow
          })
        }.bind(this), this.data.animationOption.duration)

      }


    }

  }
})