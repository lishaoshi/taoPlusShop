import { http } from '../utils/http.js'

class spellGroup extends http {
  constructor() {
    super()
  }

  // 获取团购列表
  getGroupList(data, shopId) {
    let url = `/api/shop/${shopId}/groupons/refund/details`
    let params = {
      url,
      data,
      method: 'get'
    }
    return this.request(params)
  }

  // 查看拼团商品详情
  getGroupGoodDetail(data, shopId, grouponGoodId) {
    let url = `/api/shop/${shopId}/groupon-goods/${grouponGoodId}`
    let params = {
      url,
      data,
      method: 'get'
    }
    return this.request(params)
  }

  // 查看拼团用户拼团列表
  queryGroupUser(data, grouponsId) {
    let url = `/api/groupons/all-user/${grouponsId}/invite`
    let params = {
      url,
      data,
      method: 'get'
    }
    return this.request(params)
  }

  // 进行取消团购操作
  cancelGroupGoods(data, goodsId) {
    let url = `/api/shop/groupon-goods/${goodsId}/cancel`
    let params = {
      url,
      data, 
    }
    return this.request(params)
  }

  //添加团购商品
  addGroupGoods(data) {
    let url = `/api/shop/groupon-goods/add`
    let params = {
      url,
      data
    }
    return this.request(params)
  }

  // 获取商品类型列表
  queryGoodsTypeList(data) {
    let url = `/admin/goods/goodsClassifyList`
    let params = {
      url,
      data
    }
    return this.request(params)
  }

}

export default spellGroup