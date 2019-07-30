// pages/add_address/add_address.js
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
        region: '',
        longitude: '',
        latitude: '',
        address: '',
        checked: 'true',
        imgPath: '../../images/ic_choose.png',
        name: "",
        addressDetail: '',
        mobilePhone: '',
        isDefault: '2', // 1、是 2、 否


    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        _this = this;
    },

    bindInputChangeFn: (e) => {
        let name = e.target.id;
        let value = e.detail.value;
        _this.setData({
            [name]: value
        })
    },

    bindRegionChangeFn: function(e) {
        this.setData({
            region: e.detail.value
        })
    },

    mapSearchFn: function() {
        wx.redirectTo({
            url: '../map_search/map_search'
        })

    },

    //是否选中
    isCheckedFn: function() {
        let isDefault = _this.data.isDefault;
        let imgPath = _this.data.imgPath;
        if (isDefault == 2) {
            isDefault = 1;
            imgPath = '../../images/ic-click.png';
        } else {
            isDefault = 2;
            imgPath = '../../images/ic_choose.png';

        }
        _this.setData({
            imgPath: imgPath,
            isDefault: isDefault
        })
        console.log(isDefault);

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

        // _this.saveFn();
    },

    /**
     * 保存添加地址
     */
    saveFn: function() {
        let name = _this.data.name;
        let mobilePhone = _this.data.mobilePhone;
        let address = _this.data.address;
        let addressDetail = _this.data.addressDetail;

        let validator = new Validator();
        let valiData = [{
                value: name,
                rules: [{
                    strategy: 'NotEmpty',
                    errorMsg: '收货人名称不能为空'
                }]
            },
            {
                value: mobilePhone,
                rules: [{
                    strategy: 'NotEmpty',
                    errorMsg: '联系电话不能为空'
                }, {
                    strategy: 'isMobile',
                    errorMsg: '联系电话格式不对'
                }]
            },
            {
                value: address,
                rules: [{
                    strategy: 'NotEmpty',
                    errorMsg: '所在地区不能为空'
                }]
            },
            {
                value: addressDetail,
                rules: [{
                    strategy: 'NotEmpty',
                    errorMsg: '所在街道不能为空'
                }]
            },
        ];
        validator.init(valiData);
        let errorMsg = validator.start();
        if (errorMsg) return;

        let data = {
            user_id: app.globalData.userId,
            user_name: name,
            mobile: mobilePhone,
            address: address,
            door_number: addressDetail,
            longitude: _this.data.longitude,
            latitude: _this.data.latitude,
            is_default: _this.data.isDefault
        }

        utils.uPost(`${api.HOST}/api/user/${app.globalData.userId}/address/add`, data).then((res) => {
            utils.successShow('添加成功').then(() => {
                wx.navigateBack();
            })

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