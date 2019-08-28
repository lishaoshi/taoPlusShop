// pages/user_detail/user_detail.js
//获取应用实例
const app = getApp();
const api = require("../../utils/api.js").api;
const utils = require("../../utils/util.js");
import Validator from "../../utils/validator.js";
let _this;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        name: '',
        phoneShow: '',
        phone: '',
        portraitUrl: 'http',
        IMG: app.globalData.IMG,
        array: ['男', '女'],
        index: 0,
        sex: "1", //1 、男 2、女
        userInfo: {},
        isShow: true,
        mobile1: '', //用户授权获取的手机号
        nickName1: null,
        portraitUrl1: null, //用户授权获取的默认头像
        showButton: false, //显示获取用户按钮
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        _this = this;
        _this.getUserFn();
        _this.setData({
            showButton: false,
            portraitUrl1: null,
            nickName1: null,
        })

        // 查看是否授权
        _this.lookAccredit()

    },



    /**
     * 查看是否授权
     */
    lookAccredit: (e) => {
        wx.getSetting({
            success: function(res) {
                if (app.globalData.nickName == null) {
                    if (res.authSetting['scope.userInfo']) {
                        // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                        wx.getUserInfo({
                            success: function(res) {
                                _this.setData({
                                    userInfo: res.userInfo,
                                })
                                _this.updateUserInfoFn();
                            }
                        })
                    } else {
                        _this.setData({
                            showButton: true,
                        })
                    }
                } else {
                    app.globalData.portraitUrl =utils.inspectPic(app.globalData.portraitUrl)
                    console.log(app.globalData.portraitUrl)
                    _this.setData({
                        portraitUrl1: app.globalData.portraitUrl,
                        nickName1: app.globalData.nickName,
                    })
                }

            }
        })
    },

    /**
     * 授权获取用户信息
     */
    bindGetUserInfoFn: (e) => {
        // let userInfo = _this.data.userInfo;
        wx.getUserInfo({
            success: function (res) {
                _this.setData({
                    userInfo: res.userInfo,
                })
                _this.updateUserInfoFn();
            }
        })
        // userInfo.avatarUrl = e.detail.userInfo.avatarUrl;
        // userInfo.nickName = e.detail.userInfo.nickName;
        // _this.setData({
        //     userInfo: userInfo,
        // })
        // _this.updateUserInfoFn();
    },

    /**
     * 电话号码***
     */
    phoneNumFn: function(e) {
        let newPhone = utils.phoneStar(_this.data.phoneShow);
        _this.setData({
            phoneShow: newPhone
        })

    },

    /**
     * 性别选择
     */
    bindPickerChange: function(e) {
        let val = e.detail.value;
        let num = 1;
        let total = Number(val) + Number(num);
        _this.setData({
            sex: total,
            index: e.detail.value,
        })
    },
    /**
     * 输入框--名称
     */
    nameFn: function(e) {
        let _this = this;
        let val = e.detail.value;
        _this.setData({
            name: val
        })
    },
    /**
     * 输入框--手机
     */
    mobileFn: function(e) {
        let _this = this;
        let val = e.detail.value;
        _this.setData({
            phone: val
        })
    },


    /**
     * 替换头像
     */
    uploadFn: function() {
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片       
                let tempFilePaths = res.tempFilePaths;
                _this.setData({
                    headUrl: tempFilePaths[0]
                })

                //上传文件
                wx.uploadFile({
                    url: api.upload,
                    filePath: tempFilePaths[0],
                    name: 'file',
                    success: function(res) {
                        let data = JSON.parse(res.data);
                        _this.setData({
                            portraitUrl: data.result.path
                        });
                    }
                })

            }
        })
    },

    /**
     * 修改用户
     */
    userSaveFn: function() {
        let userId = app.globalData.userId;
        let nickname = _this.data.name;
        let mobile = _this.data.phone;
        let portrait_url = _this.data.portraitUrl;
        let sex = _this.data.sex;
        let validator = new Validator();
        let valiData = [{
                value: nickname,
                rules: [{
                    strategy: 'NotEmpty',
                    errorMsg: '收货人名称不能为空'
                }]
            },
            {
                value: mobile,
                rules: [{
                    strategy: 'NotEmpty',
                    errorMsg: '联系电话不能为空'
                }, {
                    strategy: 'isMobile',
                    errorMsg: '联系电话格式不对'
                }]
            },
        ];

        validator.init(valiData);
        let errorMsg = validator.start();
        if (errorMsg) return;

        let data = {
            user_id: app.globalData.userId,
            nickname: nickname,
            mobile: mobile,
            portrait_url: portrait_url,
            sex: sex
        }

        utils.uPost(`${api.HOST}/api/user/${app.globalData.userId}/update`, data).then((res) => {
            utils.successShow('修改成功').then(() => {
                utils.back()
            })

        })

    },
    /**
     * 更新微信用户信息
     */
    updateUserInfoFn: () => {
        utils.uGet(`${api.HOST}/api/user/updateUserMsg`, {
            userId: app.globalData.userId,
            portraitUrl: _this.data.userInfo.avatarUrl,
            nickname: _this.data.userInfo.nickName,
        }).then((res) => {
            _this.lookAccredit()
        })
    },
    /**
     * 修改前的查询用户
     */
    getUserFn: () => {

        utils.uGet(`${api.HOST}/api/user/${app.globalData.userId}`).then((res) => {

            let newPhone = utils.phoneStar(res.mobile);
            let sex = res.sex || 1;
            _this.setData({
                name: res.nickname,
                phoneShow: newPhone,
                phone: res.mobile,
                portraitUrl: res.portrait_url,
                index: sex - 1,
                sex: sex
            })

        })

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        _this = this;
        _this.phoneNumFn();

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        _this.getUserFn();

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