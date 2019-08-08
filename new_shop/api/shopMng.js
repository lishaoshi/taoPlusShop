// 商铺管理
import { http } from '../utils/http.js'

class shopMng extends http {
  constructor() {
    super()
  }

  // 获取店铺详情
  getShopDetail(data) {
    let url = `/bcdshop/getAppShopInfo`
    let params = {
      url, 
      data
    }
    return this.request(params)
  }
}

export default shopMng