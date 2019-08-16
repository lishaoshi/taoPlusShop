import shopMng from '../../api/shopMng.js'
let shopMngModel = new shopMng()
let app = getApp()
// pages/shopDetailInfo/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radio: [
      {
        value: '线下',
        type: 2,
        checked: false
      },
      {
        value: '线上',
        type: 1,
        checked: true
      }
    ],
    isMap: false,
    address: '请选择地址',
    addressInfo: {},
    projectIndex: [0, 0],
    projectArr: [],
    shopData:[],
    startTime: '',
    endTime: '',
    content: '',
    shopName: '',
    shopMobile: '',
    productTypeId: '',
    provinceName: '',
    cityName: '',
    isIn: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let isIn = options.isIn
    if(isIn) {
      this.setData({
        isIn: true,

      })
    }
    this._getProjectData().then(res=>{
      let obj = {
        product_type_id: '',
        type_name: '请选择'
      }
      res.result.unshift(obj)
      this.setData({
        projectArr: [[...res.result], []]
      })
    })
    if(!isIn) {
      this.getShopData()
    }
  },

  // 获取店铺信息
  getShopData() {
    let shopData = wx.getStorageSync('shopData')
    if (shopData.nature_status==2) {
      let key = `radio[0].checked`
      this.setData({
        [key] : true,
        isMap: true,
        shopData: shopData,
        startTime: shopData.start_time,
        endTime: shopData.end_time,
        content: shopData.content,
        shopName: shopData.shop_name,
        shopMobile: shopData. mobile
      })
    } else {
      let key = `radio[1].checked`
      this.setData({
        [key]: false,
        isMap: false,
        shopData: shopData,
        startTime: shopData.start_time,
        endTime: shopData.end_time,
        provinceName: shopData.province_name,
        cityName: shopData.city_name
      })
    }
  },

  // 点击打开选择地图
  chooseMap() {
    // 这是选择地图页
      // 地图选择
      wx.chooseLocation({
        success:(res)=> {
          console.log(res)
          let data = res.address
          let index = data.indexOf('省')
          let provinceName = data.substring(0, index)
          let cityName = data.substring(index+1, data.indexOf('市'))
          console.log(provinceName, cityName)
          this.setData({
            addressInfo:res,
            address: res.name,
            provinceName: provinceName,
            cityName: cityName
          })
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      })
  },

  // 营业结束时间
  handleTime(e) {
    let flag = e.currentTarget.dataset.flag
    let value = e.detail.value
    if(flag=='start') {
      this.setData({
        startTime: value
      })
      return
    }
    this.setData({
      endTime: value
    })
    // console.log(e)
  },

  // 选择店铺地址 线上or线下
  radioChange(e) {
    // console.log(e)
    let type = e.detail.value
    if (type==1) {
      this.setData({
        isMap: false
      })
    } else {
      this.setData({
        isMap: true
      })
    }
  },

  // 获取项目数据
  _getProjectData(data) {
    return new Promise((resolve, reject) => {
      shopMngModel.getProjectData(data).then(res => {
        if (res.code == 0) {
          resolve(res)
        } else {
          reject(err)
        }
      })
    })
  },

// 项目列选择时触发
  handleColumnProject(e) {
    let value = e.detail.value
    let column = e.detail.column
    // this.setData({
    //   projectIndex: [0, value]
    // })
    if (!column) {
      let data = {
        productTypeId: this.data.projectArr[0][value].product_type_id
      }
      if (!data.productTypeId) {
        // console.log()
        let key = `projectArr[1]`
        this.setData({
          [key]:[]
        })
        return false
      }
      this._getProjectData(data).then(res => {
        let key = `projectArr[1]`
        this.setData({
          [key]: [...res.result]
        })
      })
    }
  },

  //获取店铺信息
  bindTextAreaBlur(e) {
    console.log(e)
    let value = e.detail.value
    this.setData({
      content: value
    })
  },

  // 获取输入框的内容
  handleInput(e) {
    let value = e.detail.value
    let flag = e.currentTarget.dataset.flag
    let key = ''
    switch(flag) {
      case 'name':
        key = 'goodsName'
        break;
      case 'mobile':
        key = 'shopMobile'
        break;
    }
    this.setData({
      [key]: value
    })
    console.log(this.data)
  },

  // 选择项目触发
  handleChangProject(e) {
    // console.log(e)
    let targetArr = e.detail.value
    // console.log(this.data.projectArr[1][targetArr[1]].product_type_id, targetArr)
    this.setData({
      projectIndex: [...e.detail.value],
      productTypeId: this.data.projectArr[1][targetArr[1]].product_type_id
    })
  },

  // 保存修改
  save() {
    let data = {
      shopId: app.global.shopId,
      productTypeId: this.data.productTypeId || '',
      provinceId:  '',
      provinceName: provinceName,
      cityId: cityId || '',
      cityName: cityName,
      areaId: areaId || '',
      areaName: areaName,
      address: nature_status == 2 ? ($address.val() || '') : '',
      shopName: $shopName.val(),
      mobile: $contactMobile.val(),
      longitude: longitude || '',
      latitude: latitude || '',
      natureStatus: nature_status,
      mapFlag: mapsInfo || "",
      endTime: endTime,
      startTime: startTime
    }
  },

  // 前往修改店铺
  goEditImg() {
    wx.navigateTo({
      url: '/pages/shopImg/index',
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