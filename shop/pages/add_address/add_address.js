// pages/add_address/add_address.js
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
    address: "", //收货地址
    longitude: "",
    latitude: "",
    sex: 1, 
    userName:"",
    mobile: "",
    doorNumber: "", //门牌号
    isDefault: 2, //	是否默认 1 是 2否,
    phoneShow: false,
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
    if (!app.globalData.userId || app.globalData.userId == '') {
      _this.setData({
        phoneShow: true
      });
    }else{
      _this.bindPhoneCbFn()
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let address_obj = wx.getStorageSync('addAddress');
    address_obj = address_obj ? JSON.parse(address_obj): "";
    console.log(address_obj);
    _this.setData({
        address: address_obj.address || "请填写地址",
        longitude: address_obj.longitude || "",
        latitude: address_obj.latitude || ""
    });
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
    /**
     * 根据id来修改各自的值
     */
    changeInputFn: function (e) {
        let id = e.target.id;
        let val = e.detail.value;
        _this.setData({
            [id]: val
        });
    },
  /**
   * 单选框选择
   */
  radioChangeFn: function(e){
    let val = e.detail.value;
    console.log(val);
    _this.setData({
        sex: val
    });
  },
    /**
     * 输入框--手机
     */
  mobileFn: function(e){
      
      let val = e.detail.value;
     _this.setData({
         mobile: val
     });
  },
  /**
   * 输入框--名称
   */
  nameFn: function (e) {
      
      let val = e.detail.value;
      _this.setData({
          userName: val
      });
  },
  /**
   * 输入框--	门牌号
   */
  doorNumberFn: function (e) {
      
      let val = e.detail.value;
      _this.setData({
          doorNumber: val
      });
  },
  /**
   * 新增地址
   */
  submitFn: function(){
      let userName = _this.data.userName;
      let mobile = _this.data.mobile;
      let address = _this.data.address;
      let doorNumber = _this.data.doorNumber;
      if (!userName){
          utils.errorShow('姓名不能为空');
          return;
      }
      if (!mobile) {
          utils. errorShow('手机不能为空');
          return;
      }

      if (mobile.length != 11) {
          utils.errorShow("手机格式不正确");
          return;
      }
      if (!address) {
          utils.errorShow('地址不能为空');
          return;
      }
      if (!doorNumber) {
          utils.errorShow('门牌号不能为空');
          return;
      }

      utils.uPost(`${api.HOST}/api/user/${app.globalData.userId}/address/add`,{
          user_id: app.globalData.userId,
          sex: _this.data.sex,
          mobile: mobile,
          address: address,
          longitude: _this.data.longitude,
          latitude: _this.data.latitude,
          door_number: doorNumber,
          user_name: userName,
          is_default: _this.data.isDefault
      }).then((res)=>{
          wx.showToast({
              title: '添加成功',
              complete: ()=>{
                  wx.navigateBack();
              }
          });

      })
      
  },

    bindPhoneCbFn: () => {
    },
})