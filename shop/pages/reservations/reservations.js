// pages/reservations/reservations.js
const app = getApp();

const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      tableShow: false,
      formdata: {
          population: { val: '', tip: '人数不能为空' },
          sex: { val: '2', tip: '性别不能为空' },
          arriveTime: { val: '', tip: '请选择到店日期' },
          intervalId: { val: '', tip:'请选择到店时间'},
          floorId: { val: '', tip: '请选择预定' },
          seatId: { val: '', tip: '请选择预定' },
          username: { val: '', tip: '姓名不能为空' },
          mobile: { val: '', tip: '联系电话不能为空' }, 
          shopId: { val: '', tip: '没有商家id' },
          userId: { val: '', tip: '请先授权登录' }
      },
      select_floor: {},
      select_table: [],
      today: null,
      time_interval_list: [],
      t_index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      _this = this;
      let formdata = _this.data.formdata;
      formdata.userId.val = app.globalData.userId;
      formdata.shopId.val = app.globalData.shopId;
      _this.setData({
          formdata: formdata
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
  
  },
  /**
   * 根据id来修改各自的值
   */
    changeInputFn: function (e) {
        let id = e.target.id;
        let val = e.detail.value;
        let formdata = _this.data.formdata;
        formdata[id].val = val;
        _this.setData({
            formdata: formdata
        });
        console.log(_this.data.formdata[id].val);
    },
  tableShowFn: function(){
      let formdata = _this.data.formdata;
      if (!formdata.arriveTime.val){
          utils.errorShow('请选择到店日期');
          return;
      }
      if (!formdata.intervalId.val) {
          utils.errorShow('请选择到店时间段');
          return;
      }
      _this.setData({
          tableShow: true
      })
    },
    /**
     * 日期选择器
     */
    bindDateChange: function(e){
        let date = new Date(e.detail.value);
        let formdata = _this.data.formdata;
        formdata.arriveTime.val = e.detail.value;
        _this.setData({
            formdata: formdata,
            today: date.getDay()
        });
        _this.selectTimeIntervalList();
    },
    selectTimeIntervalList: function(e){
        console.log(_this.data.today);
        if(_this.data.today==null){
            utils.errorShow('请先选择到店日期');
            return;
        }
        utils.uGet(`${api.HOST}/api/shop/${app.globalData.shopId}/time-interval`,{
            shopId: app.globalData.shopId,
            week: _this.data.today
        }).then((res)=>{
            console.log(res);
            let time_interval_list = res;
            time_interval_list.forEach((item, i)=>{
                item.val = `${item.start_time}-${item.end_time}`;
            });
            let formdata = _this.data.formdata;
            formdata.intervalId.val = time_interval_list[0].interval_id;
            _this.setData({
                time_interval_list: time_interval_list,
                formdata: formdata
            });
        })
    },
    /**
     * 选择到店时间段
     */
    bindTimeChange: function(e){
        let val = e.detail.value;
        let formdata = _this.data.formdata;
        let time_interval_list = _this.data.time_interval_list;
        formdata.intervalId.val = time_interval_list[val].interval_id;
        _this.setData({
            t_index: e.detail.value,
            formdata: formdata
        });
    },
    /**
     * 选择订座位置
     */
    tableChangeDataFn: function(e){
        console.log(e);
        let position = '';
        let select_floor = e.detail.select_floor;
        let select_table = e.detail.select_table;
        let formdata = _this.data.formdata;
        formdata.seatId.val = '';
        position = select_floor.position_name;
        select_table.forEach((item, i)=>{
            position += `, ${item.seat_name}`;
            formdata.seatId.val += `${item.floor_seat_id}`;
        });
        formdata.floorId.val = select_floor.floor_id;
        _this.setData({
            tableShow: e.detail.tableShow,
            position: position,
            select_floor: select_floor,
            select_table: select_table
        })
    },
    /**
     * 提交
     */
    submitFn: function(e){
      let regMobeil = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
        let formdata = _this.data.formdata;
        for(let key in formdata){
            console.log(key);
            if(!formdata[key].val){
                utils.errorShow(formdata[key].tip);
                return;
            } 
           
            
        }
      if (!regMobeil.test(formdata.mobile.val)) {
        wx.showToast({
          title: '请输入正确的手机号码',
          icon: 'none'
        })
        return;
      }
        let data = {};
        for(let key in formdata){
            data[key] = formdata[key].val
        }
        console.log(data);
        utils.uPost(`${api.HOST}/api/shop/${app.globalData.shopId}/floor/${_this.data.formdata.floorId.val}/reservations`,data).then((res)=>{
            wx.navigateTo({
                url: '../reservations_success/reservations_success?reserveTablesId='+res,
            })
        })
        
        
    },
    bindPhoneCbFn: () => {

    },
})