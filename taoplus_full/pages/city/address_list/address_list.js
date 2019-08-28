// pages/address_list/address_list.js
//获取应用实例
const app = getApp();
const api = require("../../../utils/api.js").api;
const utils = require("../../../utils/util.js");
let _this;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        addressList: [],
        checked: app.globalData.checked,
        noMore: false,
        source:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        _this = this;
        this.setData({
            checked: app.globalData.checked,
            source: options.source || ''
        })

    },
    /**
     * 获取地址列表
     */
    getAddressListFn: () => {
        let noMore = _this.data.noMore;
        utils.uGet(`${api.HOST}/api/user/${app.globalData.userId}/address`, {}, true, true).then((res) => {
            console.log(res);
            let addressList = res;
            if (res.length == 0) {
                noMore = true;
            } else {
                noMore = false;

                addressList.forEach((item, i) => {
                    item.mobile = utils.phoneStar(item.mobile);
                });
            }

            _this.setData({
                addressList: addressList,
                noMore: noMore
            })
        })

    },

    //是否改变默认地址

    radioChangeFn: function(e) {
        let addressList = _this.data.addressList;
        let index = utils.dataSet(e, 'index');
        addressList.forEach((item, i) => {
            item.checked = false;
        })
        addressList[index].checked = true;
        _this.setData({
            addressList: addressList
        })
    },

    //是否删除地址
    modalcntFn: function(e) {
        let _this = this;
        let useAddressId = e.currentTarget.dataset.id;
        console.log(useAddressId);

        utils.showTip('删除', '是否删除此地址？').then(() => {
            utils.uPost(`${api.HOST}/api/user/${app.globalData.userId}/address/${useAddressId}/delete`, {}).then((res) => {
                utils.successShow('删除成功').then(() => {
                    _this.getAddressListFn();
                })
            })
        })
    },
    /**
     * 选择地址
     */

    choiceFn: function(e) {
        let _this = this;
        let index = e.currentTarget.dataset.index;
        let addressList = _this.data.addressList;
        app.globalData.shippingAddress = addressList[index].address + addressList[index].door_number;
        app.globalData.shippingName = addressList[index].user_name;
        app.globalData.shippingPhone = addressList[index].mobile;
        app.globalData.userAddressId = addressList[index].user_address_id;
        app.globalData.checked = index;
        wx.setStorage({
            key: 'olb_checked_address',
            data: {
                shippingAddress: addressList[index].address + addressList[index].door_number,
                shippingName: addressList[index].user_name,
                shippingPhone: addressList[index].mobile,
                userAddressId: addressList[index].user_address_id,
                checked: index
            }
        })
        _this.setData({
            checked: index
        });
        console.log('pp.globalData.shippingAddress', app.globalData.shippingAddress)
        if (_this.data.source) {
            wx.navigateBack();
        }
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
        _this.getAddressListFn();
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

})