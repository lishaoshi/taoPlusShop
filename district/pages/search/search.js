// pages/search/search.js
//获取应用实例
const app = getApp();
const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;
let _this;
let pageNum = 1;
let pageSize = 6;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      history: [],
      latitude:'',
      longitude:'',
      showList: false,
      searchKey: "",
      goodsList: [],
      noMore: false,
      type:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      _this = this;

      //获取经纬度
      wx.getLocation({
          type: 'wgs84',
          success: function (res) {
              console.log(res)
              let latitude = res.latitude
              let longitude = res.longitude
              _this.setData({
                  latitude: latitude,
                  longitude: longitude
              })
          }
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
      wx.getStorage({
          key: 'taoplus_search_history',
          success: function (res) {
              console.log(res.data);
              _this.setData({
                  history: res.data
              });
              console.log(_this.data.history)
          }
      })
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
      if(!_this.data.noMore){
          pageNum++;
          _this.searchGoodsFn();
      }
      
  },
  inputChangeFn: (e) => {
      let value = e.detail.value;
      _this.searchFn(value);
  },
    /**
     * 搜索
     */
    searchFn: (value) => {
        let history = _this.data.history;
        let showList;
        if (value){
            if (!history.includes(value)){
                history.push(value);
                wx.setStorage({
                    key: "taoplus_search_history",
                    data: history
                });
                _this.setData({
                    history: history
                })
            }
            showList = true;
            pageNum = 1;
            _this.setData({
                searchKey: value,
                goodsList: [],
                noMore: false
            });
            _this.searchGoodsFn();
            
        }else{
            utils.errorShow('搜索内容不能为空');
            showList = false;
        }
        _this.setData({
            showList: showList
        })
    },

    // searchGoodsFn: ()=>{
    //     utils.uGet(`${api.HOST}/api/shop/${_this.data.searchKey}/goods`,{
    //         keyWord: _this.data.searchKey,
    //         agencyId: app.globalData.agencyId,
    //         pageNum: pageNum,
    //         pageSize: pageSize
    //     }).then((res)=>{
    //         console.log(res);
    //         let noMore = _this.data.noMore;
    //         let result = res;
    //         if(result.length> 0){
    //             result.forEach((item)=>{
    //                 item.path = api.IMG+item.path
                    
    //             })
    //             let goodsList = _this.data.goodsList;
    //             noMore = false;
    //             goodsList = goodsList.concat(result);
    //             for (let i in goodsList){
    //                 if (!goodsList[i].described){
    //                     goodsList[i].described = '好'
    //                 }
    //             }
    //             _this.setData({
    //                 goodsList: goodsList
    //             })
    //         }else{
    //             noMore = true;
    //         }
    //         _this.setData({
    //             noMore: noMore
    //         })
    //     })
    // },
    searchGoodsFn: () => {
        utils.uGet(`${api.HOST}/api/shop/seek/goodsV2`,{
            longitude: _this.data.longitude,
            latitude: _this.data.latitude,  
            agencyId: app.globalData.agencyId,
            keyword: _this.data.searchKey,
            type:_this.data.type,
            pageNum: pageNum,
            pageSize: pageSize
        }).then((res)=>{
            console.log(res);
            let noMore = _this.data.noMore;
            let result = res;
            if(result.length> 0){
                result.forEach((item)=>{
                    item.path = api.IMG+item.path
                    if (item.juli != null) {
                        if (parseFloat(item.juli) > 1000) {
                            item.juli = parseFloat(item.juli * 0.001).toFixed(1) + 'km'
                        } else {
                            item.juli = item.juli + 'm'
                        }
                    }
                    console.log('item.juli', item.juli, item.juli ? true : false)

                })
                let goodsList = _this.data.goodsList;
                noMore = false;
                goodsList = goodsList.concat(result);
                for (let i in goodsList){
                    if (!goodsList[i].described){
                        goodsList[i].described = '好'
                    }
                }
                _this.setData({
                    goodsList: goodsList
                })
            }else{
                noMore = true;
            }
            _this.setData({
                noMore: noMore
            })
        })
    },
    /**
     * 删除搜索记录
     */
    removeHistoryFn: () => {
        wx.removeStorage({
            key: 'taoplus_search_history',
            success: function (res) {
               _this.setData({
                   history: []
               })
            }
        })
    },
    changeSearchFn: (e) => {
        let value = utils.dataSet(e, 'value');
        _this.searchFn(value);
    },
    imgErrorFn: (e)=>{
        utils.imgErrorFn(_this, e);
    }
})