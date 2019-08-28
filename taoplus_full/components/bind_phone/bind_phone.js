const app = getApp();

const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;
let _this;
Component({
    properties: {
        // 这里定义了innerText属性，属性值可以在组件使用时指定
        phoneShow: {
            type: Boolean,
            observer: function (newVal, oldVal, changedPath) {
                if (newVal) {
                    //_this.getUserInfoFn();
                }
            }
        },
    },
    created: function () {
        _this = this;
    },
    /**
   *组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息
   */
    ready: function (options) {
        // console.log(this.properties.phoneShow)
        // if (!_this.properties.phoneShow) {
        //     console.log("进来11", app.globalData.userId)
        //     setTimeout(function () {
        //         if (app.globalData.userId == "") {
        //             _this.data.phoneShow = true;
                   
        //         }
        //         _this.getUserInfoFn()
        //     }, 1500);
        // }else{
        //     _this.getUserInfoFn()
        // }
    },
    data: {
        isShow: false
    },
    methods: {
        getPhoneNumber: (e)=>{
            if (e.detail.encryptedData){
                _this.bindPhoneFn(e.detail);
            }else{
                utils.showTip('拒绝授权!','可通过重新启动小程序再次授权', false).then(()=>{
                    _this.setData({
                        isShow: false
                    })
                })
            }  
        },
        getUserInfoFn: ()=>{
            if(app.globalData.userId&&app.globalData.mobile!='undefined'){
                _this.bindEventFn();
                return;
            }
            // console.log(_this.data.phoneShow, app.globalData.userId)
            // if (_this.data.phoneShow && app.globalData.userId == '') {
            //     _this.setData({
            //         isShow: true
            //     })
            // }
            if (_this.data.phoneShow) {
                _this.setData({
                    isShow: true
                })
            }
           
        },

        bindPhoneFn: (data)=>{
          _this.setData({
            isShow: false
          })
            utils.uPost(api.decrypt,{
                encryptedData:data.encryptedData,
                iv: data.iv
            },false).then((res)=>{
                if (res.phoneNumber === 'undefined'){
                    wx.errorShow('未能获取手机号');
                    return;
                }
                return utils.uPost(api.register, {
                    agencyId: app.globalData.agencyId,
                    thirdPartId: app.globalData.openid,
                    mobile: res.phoneNumber,
                    mobileValidationCode: ''
                },false);
                }).then((res) => {
                    return utils.uGet(api.getUser)
                }).then((res) => {
                    console.log('进来', res)
                  if (res) {
                    console.log('用户信息', res)
                    wx.setStorage({
                      key: 'userId',
                      data: res.user_id,
                    })
                    app.globalData.userId = res.user_id;
                    app.globalData.mobile = res.mobile;
                    app.globalData.nickName = res.nickname;
                    app.globalData.portraitUrl = res.portrait_url;
                    // app.globalData.username = res.username;
                    console.log('登录授权')
                  }
                    _this.bindEventFn();
                });
            
        },

        bindEventFn:()=>{
            _this.triggerEvent('bindphonecb', {});
        }
    }
})