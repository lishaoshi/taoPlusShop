// pages/address_list/address_list.js
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
    address_list : [],
      checked: app.globalData.checked,
      source: '', //记录来源,
      phoneShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      _this = this;
      this.setData({
          checked: app.globalData.checked,
          source: options.source || ''
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (!app.globalData.userId || app.globalData.userId == '') {
      _this.setData({
        phoneShow: true
      });
    } else {
      _this.bindPhoneCbFn()
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      if(app.globalData.userId){
          _this.getAddress();
      }
      
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

  getAddress: function(){
      let _this = this;
      utils.uGet(`${api.HOST}/api/user/${app.globalData.userId}/address`,{
          userId: app.globalData.userId
      }).then((res)=>{
         let result = res;
         _this.setData({
             address_list: result
         });
      })
  },
    /**
     * 删除地址
     */
  delFn: function(e){
    let _this = this;
    wx.showModal({
        title: '提示',
        content: '确定删除此地址?',
        success: function (res) {
            if (res.confirm) {
                let id = e.currentTarget.dataset.id;
                utils.uPost(`${api.HOST}/api/user/${app.globalData.userId}/address/${id}/delete`, {
                    userId: app.globalData.userId,
                    userAddressId: id
                }).then((res) => {
                    if (id == app.globalData.userAddressId){
                        wx.removeStorage({
                            key: 'olb_checked_address'
                        });
                        app.globalData.shippingAddress = '';
                        app.globalData.shippingName = '';
                        app.globalData.shippingPhone = '';
                        app.globalData.userAddressId = '';

                    }
                    wx.showToast({
                        title: '删除成功',
                        complete: () => {
                            _this.getAddress();
                        }
                    })
                })
            } 
        }
    })
    
  },

  choiceFn: function(e){
    let _this = this;
    let index = e.currentTarget.dataset.index;
    let address_list = _this.data.address_list;
    app.globalData.shippingAddress = address_list[index].address + address_list[index].door_number;
    app.globalData.shippingName = address_list[index].user_name;
    app.globalData.shippingPhone = address_list[index].mobile;
    app.globalData.userAddressId = address_list[index].user_address_id;
    app.globalData.checked = index;
    console.log('index'+index);
    wx.setStorage({
        key: 'olb_checked_address',
        data: {
            shippingAddress: address_list[index].address + address_list[index].door_number,
            shippingName: address_list[index].user_name,
            shippingPhone: address_list[index].mobile,
            userAddressId: address_list[index].user_address_id,
            checked: index
        }
    })
    _this.setData({
        checked: index
    });
    if(_this.data.source){
        wx.navigateBack();
    }
    
  },

    bindPhoneCbFn: () => {
        _this.getAddress();
    },

})