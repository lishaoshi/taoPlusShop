import shopMng from '../../api/shopMng.js'
import { showToast } from '../../utils/util.js'
let shopMngModel = new shopMng()
let app = getApp()
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'KFHBZ-75CK6-DQOSG-MO5DY-LW7T2-6YBKJ' // 必填
});  
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
    address: '',
    addressInfo: {},
    projectIndex: [0, 0],
    projectArr: [],
    shopData:[],
    startTime: '',
    endTime: '',
    content: '',
    shopName: '',
    shopMobile: '',
    tjMobile:'',
    productTypeId: '',
    provinceName: '',
    cityName: '',
    isIn: false,
    areaName: '',
    provinceId: '',
    cityId:'',
    areaId: '',
    latitude: '',
    longitude:'',
    natureStatus: 1,
    mapsInfo:''
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
        shopMobile: shopData.mobile,
        address: shopData.address,
        natureStatus: shopData.nature_status,
        productTypeId: shopData.product_type_id,
        latitude: shopData.latitude,
        longitude: shopData.longitude,
        provinceName: shopData.province_name,
        provinceId: shopData.province_id,
        cityName: shopData.city_name,
        cityId: shopData.city_id,
        areaName: shopData.area_name,
        areaId: shopData.area_id,
      })
    } else {
      let key = `radio[1].checked`
      this.setData({
        [key]: false,
        isMap: false,
        shopData: shopData,
        startTime: shopData.start_time,
        endTime: shopData.end_time,
        shopMobile: shopData.mobile,
        address: shopData.address,
        natureStatus: shopData.nature_status,
        productTypeId: shopData.product_type_id,
        content: shopData.content
      })
    }
    console.log(this.data)
  },

  // 点击打开选择地图
  chooseMap() {
    console.log('chooseMap')
    // 这是选择地图页
      // 地图选择
      wx.chooseLocation({
        success:(res)=> {
          let data = res.address
          let index = data.indexOf('省')
          let provinceName = data.substring(0, index+1)
          let cityName = data.substring(index+1, data.indexOf('市')+1)
          let address = res.name
          let latitude = res.latitude
          let longitude = res.longitude
          let areaName
          let areaId
          qqmapsdk.reverseGeocoder(
            {
              location: {
                latitude: res.latitude,
                longitude: res.longitude
              },
              coord_type: 4,
              success: (res)=>{
                console.log(res)
                areaName = res.result.address_component.district
                areaId = res.result.ad_info.adcode
                this.setData({
                  addressInfo: res,
                  address: res.name,
                  provinceName: provinceName,
                  cityName: cityName,
                  areaName: areaName,
                  areaId: areaId,
                  address: address,
                  latitude: latitude,
                  longitude: longitude,
                  mapsInfo: res.result.address
                })
                this._gazetteBillRegion()
              }
            }
          )
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      })
  },

  // 获取省市区
  _gazetteBillRegion(regionId='') {
    let data = {
      regionId: regionId
    }
    shopMngModel.gazetteBillRegion(data).then(res=>{
      let data = [...res.result]
      let info = data.find((item, index, arr)=>{
        return item.name == this.data.provinceName || item.name == this.data.cityName
      })
      if (info.level == 1) {
        this.setData({
          provinceId: info.region_id
        })
      } else if (info.level == 2) {
        this.setData({
          cityId: info.region_id
        })
      }
      if (info.level!=2) {
        this._gazetteBillRegion(info.region_id)
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
  },

  // 选择店铺地址 线上or线下
  radioChange(e) {
    let type = e.detail.value
    if (type==1) {
      this.setData({
        isMap: false,
        
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
    let value = e.detail.value
    console.log(value, e)
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
        key = 'shopName'
        break;
      case 'mobile':
        key = 'shopMobile'
        break;
      case 'tjMobile':
        key = 'shopMobile'
        break;
    }
    this.setData({
      [key]: value
    })
  },

  // 选择项目触发
  handleChangProject(e) {
    let targetArr = e.detail.value
    this.setData({
      projectIndex: [...e.detail.value],
      productTypeId: this.data.projectArr[1][targetArr[1]].product_type_id
    })
  },

  // 保存修改
  save() {
    if(this.data.isIn) {
      this._addShop()
      return
    } else {
      this._editShopInfo()
    }
  },

  // 入驻
  _addShop() {
    let PHONEEXP = /^((0\d{2,3}-\d{7,8})|(1[1234567890]\d{9}))$/;
    if (!this.data.shopName) {
      showToast('请填写商店名称');
      return;
    }
    if (!this.data.shopMobile) {
      showToast('请填写联系电话');
      return;
    }
    if (PHONEEXP.test(this.data.shopMobile) == false) {
      showToast('联系电话不正确');
      return;
    }
    if (!this.data.tjMobile) {
      showToast('请填写推荐人电话');
      return;
    }
    if (PHONEEXP.test(this.data.tjMobile) == false) {
      showToast('推荐人电话不正确');
      return;
    }
    if (!this.data.productTypeId) {
      showToast('请选择经营项目');
      return;
    }
    if (!this.data.startTime) {
      showToast('请选择经营开始时间');
      return;
    }
    if (!this.data.endTime) {
      showToast('请选择经营结束时间');
      return;
    }
    let data = {
      userId: app.globalData.userId,
      shopId: app.globaal.shopId,
      productTypeId: this.data.productTypeId || '',
      provinceId: this.data.provinceId,
      provinceName: this.data.provinceName,
      cityId: this.data.cityId || '',
      cityName: this.data.cityName,
      areaId: this.data.areaId || '',
      areaName: this.data.areaName,
      address: this.data.address,
      shopName: this.data.shopName,
      mobile: this.data.shopMobile,
      longitude: this.data.longitude || '',
      latitude: this.data.latitude || '',
      natureStatus: this.data.natureStatus,
      mapFlag: this.data.mapsInfo,
      endTime: this.data.endTime,
      startTime: this.data.startTime
    }
    shopMngModel.addShop(data).then(res => {
      let data = JSON.parse(res);
      if (data.code == 0) {
        showToast(res.message)
        let shopInfo = wx.getStorageSync('shopLoginInfo')
        shopInfo.shop_id = data.result
        wx.setStorageSync('shopLoginInfo', shopInfo)
        setTimeout(()=>{
          wx.reLaunch({
            url: '/pages/index/index',
          })
        }, 1000)
      } else if(data.code==167) {
        showToast(res.message)
      } else {
        showToast(res.message)
      }
    })
  },
  // 修改商家信息
  _editShopInfo() {
    let PHONEEXP = /^((0\d{2,3}-\d{7,8})|(1[1234567890]\d{9}))$/;
    if (!this.data.shopName) {
      showToast('请填写商店名称1');
      return;
    }
    if (!this.data.shopMobile) {
      console.log(this.data)
      showToast('请填写联系电话1');
      return;
    }
    if (PHONEEXP.test(this.data.shopMobile) == false) {
      showToast('联系电话不正确');
      return;
    }
    if (!this.data.productTypeId) {
      showToast('请选择经营项目');
      return;
    }
    if (!this.data.startTime) {
      showToast('请选择经营开始时间');
      return;
    }
    if (!this.data.endTime) {
      showToast('请选择经营结束时间');
      return;
    }
    if (!this.data.content) {
      showToast('请填写店铺信息');
      return;
    }
    let data = {
      userId: app.globalData.userId,
      shopId: app.globalData.shopId,
      productTypeId: this.data.productTypeId || '',
      provinceId: this.data.provinceId,
      provinceName: this.data.provinceName,
      cityId: this.data.cityId || '',
      cityName: this.data.cityName,
      areaId: this.data.areaId || '',
      areaName: this.data.areaName,
      address: this.data.address,
      shopName: this.data.shopName,
      mobile: this.data.shopMobile,
      longitude: this.data.longitude || '',
      longitude: this.data.longitude || '',
      latitude: this.data.latitude || '',
      natureStatus: this.data.natureStatus,
      mapFlag: this.data.mapsInfo,
      startTime: this.data.startTime,
      endTime: this.data.endTime,
      content: this.data.content
    }
    shopMngModel.updataShopInfo(data).then(res=>{
      if(res.code==0) {
        wx.navigateBack()
      }
    })
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
    let pages = getCurrentPages()
    let perpage = pages[pages.length-2]
    perpage._getShopInfo()
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