// pages/withdraw/withdraw.js
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
        balance: '',
        bankCardList: [],
        bankcardId: '',
        sum: '',
        index: 0,
        isShow: true
    },


    /**
     * 选择--银行
     */
    bankCarFn: function(e) {
        utils.uGet(`${api.HOST}/api/user/${app.globalData.userId}/bankcards`, {}, true, true).then((res) => {
            console.log(res)
            let bankList = res.records;


            if (bankList.length > 0) {
                let bankcardId = bankList[0].bankcard_id;
                bankList.forEach((item, i) => {
                    let num = item.bankcard_num;
                    let last = num.slice(-4);
                    item.bankcard_num = last
                })
                _this.setData({
                    bankCardList: bankList,
                    bankcardId: bankcardId,
                    isShow: true
                })
            } else {
                _this.setData({
                    isShow: false
                })

            }



        })
    },
    /**
     * 选择银行卡
     */
    bindPickerChangeFn: function(e) {
        let index = e.detail.value;
        let bankCardList = _this.data.bankCardList;
        let bankcardId = bankCardList[index].bankcard_id;
        console.log(bankcardId)
        // console.log('picker发送选择改变，携带值为', e.detail)
        this.setData({
            index: e.detail.value,
            bankcardId: bankcardId

        })
    },

    /**
     * 输入框--余额
     */
    balanceFn: function(e) {
        let value = e.detail.value;
        _this.setData({
            sum: value
        })

    },

    /**
     * 查询余额
     */
    getBalanceFn: function() {
        utils.uGet(`${api.HOST}/api/user/${app.globalData.userId}/account/balance`, {
            userId: app.globalData.userId
        }, true, true).then((res) => {
            console.log(res);
            let balance = res.balance

            _this.setData({
                balance: balance

            })
        })

    },
    /**
     * 全部提现
     */
    allWithdrawFn: function() {
        let allSum = _this.data.balance;
        _this.setData({
            sum: allSum
        })
    },


    /**
     * 按钮--提现
     */
    submitFn: function() {
        let bankcardId = _this.data.bankcardId;
        let money = _this.data.sum;
        let validator = new Validator();
        let valiData = [{
                value: money,
                rules: [{
                    strategy: 'NotEmpty',
                    errorMsg: '请输入提现金额'
                }]
            },

        ];
        validator.init(valiData);
        let errorMsg = validator.start();
        if (errorMsg) return;
        if (money < 10) {
            wx.showToast({
                title: '输入的金额要大于10元',
                icon: 'none',
            });
            return;
        }
        console.log('银行卡', this.data.bankCardList)
        if (this.data.bankCardList.length === 0) {
            wx.showToast({
                title: '请绑定银行卡',
                icon: 'none',
            });
            return;
        }
        let data = {
            bankcardId: bankcardId,
            money: money
        }

        utils.uPost(`${api.HOST}/api/user/${app.globalData.userId}/withdrawals`, data).then((res) => {
            wx.showToast({
                title: '添加成功',
                complete: () => {
                    wx.redirectTo({
                        url: '../withdraw_success/withdraw_success'
                    })
                }
            });

        })


    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        _this = this;
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
        _this.bankCarFn();
        _this.getBalanceFn()

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

    // submitFn: () => {
    //     wx.navigateTo({
    //         url: '../withdraw_success/withdraw_success',
    //     })
    // }

})