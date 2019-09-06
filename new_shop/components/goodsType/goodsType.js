// components/goodsType/goodsType.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsTypeList: Array
  },
  externalClasses: ['activi'],
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentIndex: 0
  },
  lifetimes: {
  },
  pageLifetimes: { 
    hide() {
      this.setData({
        goodsTypeList: []
      })
    } 
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tabGoodsType(e) {
      // console.log(e)
      let item = e.currentTarget.dataset.item
      let index = e.currentTarget.dataset.index
      this.setData({
        currentIndex: index
      })
      this.triggerEvent('tabGoodsType',{
        item
      })
    }
  }
})
