// 商品管理
import { http } from '../utils/http.js'

class goodsMng extends http {
  constructor() {
    super()
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

  // 添加商品分类
  addGoodsType(data) {
    let url = `/admin/goods/addGoodsClassify`
    let params = {
      url,
      data
    }
    return this.request(params)
  }
  // 删除商品分类
  delGoodsType(data) {
    let url = `/admin/goods/delGoodsClassify`
    let params = {
      url,
      data
    }
    return this.request(params)
  }
  // 编辑商品分类
  updataGoodsType(data) {
    let url = `/admin/goods/updateGoodsClassify`
    let params = {
      url,
      data
    }
    return this.request(params)
  }
  // 获取商品列表
  queryGoodsList(data) {
    let url = `/goods/goodsList`
    let params = {
      url,
      data,
    }
    return this.request(params)
  }
}

export default goodsMng
