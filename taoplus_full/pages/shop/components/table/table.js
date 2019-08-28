const app = getApp();

const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;
let _this;
Component({
    properties: {
        // 这里定义了innerText属性，属性值可以在组件使用时指定
        tableShow: {
            type: Boolean,
            observer: function (newVal, oldVal, changedPath){
                utils.showFn(_this, newVal, 'tableShowClass','animationData');
                if(newVal){
                    _this.selectFloorFn();
                }
                
            }
        },
        arriveTime: {
            type: String
        },
        intervalId: {
            type: String
        }
    },
    created: function(){
        _this = this;
    },
    /**
   *组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息
   */
    ready: function (options) {
        // _this.animation.opacity(0).step(); 
        // _this.setData({
        //     animationData: _this.animation.export()
        // })
        // setTimeout(()=>{
            
        //     _this.setData({
        //         tableShowClass : 'hide'
        //     })
        // },400)
        // _this.selectFloorFn();
    },
    data: {
        // 这里是一些组件内部数据
        table_floor: [],
        table_list: [],
        select_floor:{},
        select_table: [], //选中的餐桌
        animationData: {},
        tableShowClass: 'hide'
    },
    methods: {
        // 这里是一个自定义方法,用于组件间的通讯, 事件名称不能用驼峰命名
        changeDataFn: function(){
            console.log('tap');
            let table_list = _this.data.table_list;
            let select_table = [];
            table_list.forEach((item, i) => {
                if (item.checked) {
                    select_table.push(item);
                }

            });
            _this.setData({
                select_table: select_table
            })
            _this.triggerEvent('changetabledata',{
                tableShow: false,
                select_floor: _this.data.select_floor,
                select_table: _this.data.select_table
            });
        },
        hideTableFn: function(){
            this.setData({
                tableShow: false
            })
        },
        /**
         * 切换楼层
         */
        changeFloorFn: function(e){
            let _this = this;
            let floor_id = e.currentTarget.dataset.floorid;
            let table_floor = _this.data.table_floor;
            let select_floor = _this.data.select_floor;
            table_floor.forEach((item)=>{
                if(item.floor_id == floor_id){
                    item.current = true;
                    select_floor = item;
                }else{
                    item.current = false;
                }
            });
            

            _this.setData({
                table_floor: table_floor,
                floor_id: floor_id,
                select_floor: select_floor,
                select_table: []
            });

            _this.selectSeatListFn();
        },
        /**
         * 获取楼层
         */
        selectFloorFn: function(){
            let _this = this;
            utils.uGet(`${api.HOST}/api/shop/${app.globalData.shopId}/booking/floor`,{shopId: app.globalData.shopId}).then((res)=>{
                let result = res;
                result.forEach((item,i)=>{
                    if(i==0){
                        item.current = true;
                    }else{
                        item.current = false;
                    }
                });
                _this.setData({
                    table_floor: result,
                    select_floor: result[0]
                });
                _this.selectSeatListFn();
            })
        },
        /**
         * 获取楼层餐桌
         */
        selectSeatListFn: function(){
            let _this = this;
            utils.uGet(`${api.HOST}/api/shop/${app.globalData.shopId}/booking/floor/${_this.data.select_floor.floor_id}`,{
                shopId: app.globalData.shopId,
                floorId: _this.data.select_floor.floor_id,
                intervalId: _this.data.intervalId,
                arriveTime: _this.data.arriveTime
            }).then((res)=>{
                console.log(res);
                let result = res;
                let table_list = [];
                result.forEach((item, i)=>{
                    item.checked = false;
                    table_list.push(item);
                });
                _this.setData({
                    table_list: table_list
                })
            })
        },
        /**
         * 选择餐桌
         */
        choiseSeatFn: function(e){
            console.log(e);
            let _this= this;
            let seat_id = e.currentTarget.dataset.seatid;
            let index = e.currentTarget.dataset.index;
            let table_list = _this.data.table_list;
            let select_table = _this.data.select_table;
            // table_list.forEach((item, i)=>{
            //     if (!item.checked && item.floor_seat_id == seat_id && item.booking_seats == 2){
            //         item.checked = true;
            //     }else{
            //         item.checked = false;
            //     }
            // });
            if (!table_list[index].checked && table_list[index].floor_seat_id == seat_id && table_list[index].booking_seats == 2) {
                table_list[index].checked = true;
            } else {
                table_list[index].checked = false;
            }
            
            
            _this.setData({
                table_list: table_list
            });
        }
    }
})