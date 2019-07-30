// pages/edit_address/edit_address.js
//获取应用实例
const app = getApp();
const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;
import Validator from "../../utils/validator.js";
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    phoneShow: '',
    address: '',
    addressDetail: '',
    imgPath: '../../images/ic-click.png',
    longitude: '',
    latitude: '',
    useAddressId: '',
    isDefault:'2',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _this = this;


    _this.setData({
      useAddressId: options.userAddressId,
    })
  },
  /**
     * 输入框--手机
     */
  mobileFn: function (e) {
    let _this = this;
    let val = e.detail.value;
    _this.setData({
      phoneShow: val
    });
  },
  /**
   * 输入框--名称
   */
  nameFn: function (e) {
    let _this = this;
    let val = e.detail.value;
    _this.setData({
      name: val
    });
  },
  /**
   * 输入框--	门牌号
   */
  doorNumberFn: function (e) {
    let _this = this;
    let val = e.detail.value;
    _this.setData({
      addressDetail: val
    });
  },


  //是否选中
  radioChangeFn: function() {
    let isDefault = _this.data.isDefault;
    let imgPath = _this.data.imgPath;
    if (isDefault == 1) {
      isDefault = 2;
        imgPath = '../../images/ic_choose.png';
    } else {
      isDefault = 1;
      imgPath = '../../images/ic-click.png';
      
    }
    _this.setData({
      imgPath: imgPath,
      isDefault: isDefault
    })
    console.log(isDefault);

  },

  /**
       * 新增地址
       */
  submitFn: function () {
    let name = _this.data.name;
    let phoneShow = _this.data.phoneShow;
    let address = _this.data.address;
    let addressDetail = _this.data.addressDetail;
    let useAddressId = _this.data.useAddressId;
    let isDefault = _this.data.isDefault;
    
    let validator = new Validator();
    let valiData = [
        { value: name, rules: [{ strategy: 'NotEmpty', errorMsg: '收货人名称不能为空' }] },
        { value: phoneShow, rules: [{ strategy: 'NotEmpty', errorMsg: '联系电话不能为空' }, { strategy: 'isMobile', errorMsg: '联系电话格式不对' }]},
        { value: address, rules: [{ strategy: 'NotEmpty', errorMsg: '所在地区不能为空' }] },
        { value: addressDetail, rules: [{ strategy: 'NotEmpty', errorMsg: '所在街道不能为空' }] },
    ];

    validator.init(valiData);
    let errorMsg = validator.start();
    if(errorMsg) return;

    let data = {
      user_id: app.globalData.userId,
      user_address_id: useAddressId,
      user_name: name,
      mobile: phoneShow,
      address: address,
      longitude: _this.data.longitude,
      latitude: _this.data.latitude,
      door_number: addressDetail,
      is_default: isDefault,
    }
      
    utils.uPost(`${api.HOST}/api/user/${app.globalData.userId}/address/${useAddressId}/update`, data).then((res) => {
        utils.successShow('修改成功').then(()=>{
            wx.navigateBack();
        })
    })


  },


 /**
     * 获取地址，修改前获取
     */
  updateAddressFn: function() {
    let useAddressId = _this.data.useAddressId;
    utils.uGet(`${api.HOST}/api/user/${app.globalData.userId}/address/${useAddressId}`,{

    }).then((res) => {
      console.log(res);
      let imgPath;
        if (res.is_default == 1){
            
            imgPath = '../../images/ic-click.png';
        }else{
            imgPath = '../../images/ic_choose.png';
            
        }
      _this.setData({
        name: res.user_name,
        phoneShow: res.mobile,
        addressDetail: res.door_number,
        address: res.address,
        isDefault: res.is_default,
        longitude: res.longitude,
        latitude: res.latitude,
        imgPath: imgPath


      })

    })

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
    let address_obj = wx.getStorageSync('addAddress');
    address_obj = address_obj ? JSON.parse(address_obj) : "";
    console.log(address_obj);
    _this.setData({
      address: address_obj.address || "请填写地址",
      longitude: address_obj.longitude || "",
      latitude: address_obj.latitude || ""
    });
    
    _this.updateAddressFn();

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