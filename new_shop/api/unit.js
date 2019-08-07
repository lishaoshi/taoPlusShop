import {http} from '../utils/http.js'

class unit extends http {
  constructor() {
    super()
  }

// 获取商品单位列表
  getUnitList(data) {
    let url = `/admin/goodsType/goodsUnitList`
    let params = {
      url,
      data
    }
    return this.request(params)
  }
// 添加商品单位
  addUnit(data) {
    let url = `/admin/goodsType/operationGoodsUnit`
    let params = {
      url, 
      data
    }
    return this.request(params)
  }
}

export default unit