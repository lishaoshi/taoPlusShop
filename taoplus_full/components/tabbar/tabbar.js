// component/tabBar.js
const app = getApp();
Component({
  /**
 1. 组件的属性列表
   */
  properties: {
    tabbar: {
      type: Object
    }
  },
  methods: {
    
    onTap: function(e){
      app.swichNav(e);
      console.log('tabNum:'+app.tabBarData.tabBar.currentTab);
    }
  }
})