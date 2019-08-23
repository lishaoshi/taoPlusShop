// 红包模块

import { http } from '../utils/http.js'

class redBag extends http {
  constructor() {
    super()
  }
  //  创建红包
  addRedBag(data) {
    let url = `/api/coupon/rule/red-paper/create`
    let params = {
      url,
      data
    }
    return this.request(params)
  }

  // 修改红包规则
  uploadRedBag(data, id) {
    let url = `/api/coupon/rule/red-paper/${id}/update`
    let params = {
      url,
      data
    }
    return this.request(params)
  }
}

export default redBag