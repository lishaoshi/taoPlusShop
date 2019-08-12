import shopMng from '../../api/shopMng.js'
import uploadImg from '../../api/uploadImg.js'
let uploadImgModel = new uploadImg()
let shopMngModel = new shopMng()
let app = getApp()
import  config  from '../../config.js'
// pages/shopImg/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    targetArr: [
      {
        name: 'logo',
        type:1,
        length: 0
      },
      {
        name: '门头',
        type: 2,
        length: 0
      },
      {
        name: '环境',
        type: 3,
        length: 0
      },
      {
        name: '其他',
        type: 5,
        length: 0
      }
    ],
    currentIndex: 0,
    logoImg: [],
    headerImg: [],
    environmentImg: [],
    otherImg: [],
    targetList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getShopImg()
    // this.getNumber()
  },

  // 点击选择图片类型
  choooseType(e) {
    let index = e.currentTarget.dataset.index
    let type = e.currentTarget.dataset.type
    console.log(e)
    switch(type) {
      case 1:
        this.setData({
          targetList: this.data.logoImg,
        })
        break;
      case 2:
        this.setData({
          targetList: this.data.headerImg
        })
        break;
      case 3:
        this.setData({
          targetList: this.data.environmentImg
        })
        console.log(this.data.environmentImg)
        break;
      case 5:
        this.setData({
          targetList: this.data.otherImg
        })
        break;
    }
    this.setData({
      currentIndex: index
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  // 获取店铺图片
  _getShopImg(flag) {
    let type = ''
    flag && (type=flag)
    let data = {
      type: type,
      shopId: app.globalData.shopId
    }
    shopMngModel.getShopImg(data).then(res=>{
      let targetList = res.result
      console.log(targetList, res.result)
      this.setData({
        logoImg: [],
        headerImg: [],
        environmentImg: [],
        otherImg: [],
        targetList: []
      })
      this.getNumber(targetList)
    })
  },

  // 获取全部图片
  getNumber(data) {
    for (var j = 0; j < data.length; j++) {
        if (data[j].type == 1) {
          let key = `targetArr[0].length`
          this.data.logoImg.push(data[j])
          this.setData({
            logoImg: this.data.logoImg,
            [key]: this.data.logoImg.length
          })
        } else if (data[j].type == 2) {
          this.data.headerImg.push(data[j])
          let key = `targetArr[1].length`
          this.setData({
            headerImg: this.data.headerImg,
            [key]: this.data.headerImg.length
          })
        } else if (data[j].type == 3) {
          this.data.environmentImg.push(data[j])
          let key = `targetArr[2].length`
          this.setData({
            environmentImg: this.data.environmentImg.push(data[j]),
            [key]: this.data.environmentImg.length
          })
        } else if (data[j].type == 5) {
          this.data.otherImg.push(data[j])
          let key = `targetArr[3].length`
          this.setData({
            otherImg: this.data.otherImg,
            [key]: this.data.otherImg.length
          })
        }
      }
    this.data.currentIndex == 0 && this.setData({ targetList: this.data.logoImg})
    this.data.currentIndex == 1 && this.setData({ targetList: this.data.headerImg})
    this.data.currentIndex == 2 && this.setData({ targetList: this.data.environmentImg})
    this.data.currentIndex == 3 && this.setData({ targetList: this.data.otherImg})
  },

  //打开选择图片
  addImg() {
    wx.chooseImage({
      success: (res)=> { 
        let tempFilePaths = res.tempFilePaths[0]
        this._uploadFiled(tempFilePaths)
      },
    })
  },

  //封装上传图片函数
  _uploadFiled(data) {
    wx.uploadFile({
      url: `${config.base_url}/file/upload`,
      filePath: data,
      name: 'file',
      formData: {
        token: app.globalData.token
      },
      success:(res)=>{
        let data = JSON.parse(res.data)
        // this._getShopImg()
        var fileId = data.result.file_id;
        var imgPath = data.result.path;
        this._addShopPhoto(fileId, imgPath)
      }
    })
  },

  // 添加图片
  _addShopPhoto(id, path) {
    let data = {
      shopId: app.globalData.shopId,
      fileId: id,
      path: path,
      type: this.data.targetArr[this.data.currentIndex].type
    }
    shopMngModel.addShopPhoto(data).then(res=>{
      this._getShopImg()
    })
  },

  // 删除绑定的图片
  delImg(e) {
    // console.log(e)
    let id = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '确定删除图片吗？',
      success:(res)=>{
        if(res.confirm) {
          let data = {
            shopPicId: id
          }
          shopMngModel.delShoopImg(data).then(res=>{
            if(res.code==0) {
              wx.showToast({
                title: '删除成功',
                icon: 'none'
              })
              this._getShopImg()
            } else {
              wx.showToast({
                title: res.message,
                icon: 'none'
              })
            }
          })
        }
      }
    })
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})