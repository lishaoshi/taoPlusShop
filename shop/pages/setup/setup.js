// pages/setup/setup.js
const app = getApp();
const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      portraitUrl: "",
      headUrl: "../../images/user/head.png",
      avatarUrl:"",  //登陆后获得的微信头像
      username: "",
      mobile: "",
      sex: 1,
      IMG: api.IMG
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      avatarUrl: options.avatarUrl,
    })
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
      if(app.globalData.userId){
          this.wxGetUserInfo();
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

/**
 * 替换头像
 */
  uploadFn: function(){
      let _this = this;
      wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              console.log(res);
              let tempFilePaths = res.tempFilePaths;
              _this.setData({
                  headUrl: tempFilePaths[0]
              });
              console.log();
              //上传文件
              wx.uploadFile({
                  url: api.upload, 
                  filePath: tempFilePaths[0],
                  name: 'file',
                  success: function (res) {
                      let data = JSON.parse(res.data);
                      console.log(data);
                      _this.setData({
                          portraitUrl: data.result.path
                      });
                      console.log(_this.data.portraitUrl)
                  }
              })

          }
      })
  },
/**
 * 输入框--名称
 */
  nameFn: function(e){
      let _this = this;
      let val = e.detail.value;
      _this.setData({
          userName: val
      })
  },
/**
 * 输入框--手机
 */
  mobileFn: function (e) {
      let _this = this;
      let val = e.detail.value;
      _this.setData({
          mobile: val
      })
  },

    /**
     * 单选框
     */
  radioChangeFn: function(e){
      let _this = this;
      let val = e.detail.value;
      _this.setData({
          sex: val
      });
      
  },

/**
 * 修改用户信息
 */
  submitFn: function(){
    let _this = this;
    let userName = _this.data.userName;
    let mobile = _this.data.mobile;
      if (!_this.data.portraitUrl) {
          utils.errorShow("头像不能为空");
          return;
      }
    if(!userName){
        utils.errorShow("用户名不能为空");
        return;
    }
    // if (!mobile) {
    //     utils.errorShow("手机不能为空");
    //     return;
    // }
    

      utils.uPost(`${api.HOST}/api/user/wx/user-info/update`,{
        userId: app.globalData.userId,
        portraitUrl: _this.data.portraitUrl ,
        username: _this.data.userName,
        // mobile: _this.data.mobile,
        sex: _this.data.sex,
    }).then((res)=>{
        wx.showToast({
            title: '修改成功',
        });
        utils.back();
    })
  },
  /**
 * 获取用户信息
 */
  wxGetUserInfo: function () {
      let _this = this;
      utils.uGet(`${api.HOST}/api/user/${app.globalData.userId}`, {
          userId: app.globalData.userId
      }).then((res) => {
          let portrait_url;
        //   if (res.portrait_url){
        //       portrait_url = api.IMG + res.portrait_url;
        //   }else{
        //       portrait_url = app.globalData.portraitUrl;
        //   }
          console.log('名字', res.username)
          _this.setData({
              portraitUrl: res.portrait_url,
              userName: res.username,
              mobile: res.mobile,
              sex: res.sex || 1,
          })
      })
  },
    bindPhoneCbFn: () => {
        
    },
})