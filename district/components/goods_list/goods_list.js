const app = getApp();

const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;
let _this;
Component({
    properties: {
        // 这里定义了innerText属性，属性值可以在组件使用时指定
        goodsList: {
            type: Array,
            observer: function (newVal, oldVal, changedPath) {
            }
        },
    },
    created: function () {
        _this = this;
    },
    /**
   *组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息
   */
    ready: function (options) {
       
    },
   
    methods: {
     
    }
})