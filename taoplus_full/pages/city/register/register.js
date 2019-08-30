// pages/register/register.js
const app = getApp();
const api = require("../../../utils/api.js").api;
const utils = require("../../../utils/util.js");
import Validator from "../../../utils/validator.js";

let _this;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isColor:false,
    flag: false,
    codeDis: false,
    phoneCode: "获取验证码",
    mobileValidationCode: '',
    telephone: "",
    disabled: false,
    codeTime: 60
   
  },
  //获取手机号
  phoneInputFn: function (e) {
    let value = e.detail.value;
    let isColor = value? true: false;
    _this.setData({
      isColor: isColor,
      telephone: value
    })

  },
// 获取验证码
  codeInputFn: function (e){
    let value = e.detail.value;
    _this.setData({
      mobileValidationCode: value
    })

  },

//点击获取验证码
  changeCodeFn() {
    let validator = new Validator();
    let valiData = [{
        value: _this.data.telephone,
        rules: [
            { strategy: 'NotEmpty', errorMsg: '手机号不能为空' },
            { strategy: 'isMobile',errorMsg: '手机号格式不对'}
        ]
    }];

    validator.init(valiData);

    let errorMsg = validator.start();
      
    if(errorMsg) return; 

      utils.uPost(api.vlidateCode, { mobile: _this.data.telephone}).then(()=>{
          utils.successShow('验证码发送成功');
        _this.setData({
          disabled: true
        })
      })
    
    utils.Interval(_this, 60, 'codeDis','codeTime');
   

  },

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this;

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

    registerFn: ()=>{
        let validator = new Validator();
        let valiData = [{
            value: _this.data.telephone,
            rules: [
                { strategy: 'NotEmpty', errorMsg: '手机号不能为空' },
                { strategy: 'isMobile', errorMsg: '手机号格式不对' }
            ]
        }, {
                value: _this.data.mobileValidationCode,
                rules: [
                    { strategy: 'NotEmpty', errorMsg: '验证码不能为空' }
                ]
            }];

        validator.init(valiData);

        let errorMsg = validator.start();

        if (errorMsg) return; 
        utils.uPost(api.register,{
            agencyId: app.globalData.agencyId,
            thirdPartId: app.globalData.openid,
            mobile: _this.data.telephone,
            mobileValidationCode: _this.data.mobileValidationCode
        }).then((res)=>{
            console.log(res);
            utils.successShow('注册成功').then(()=>{
                wx.navigateBack();
            })
        })
    }
})