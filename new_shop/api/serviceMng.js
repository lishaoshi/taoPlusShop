// 服务管理
import { http } from '../utils/http.js'

class serviceMng extends http {
  constructor() {
    super()
  }

  // 获取桌台列表
  selectFloor(data) {
    let url = `/bcdshop/selectFloor`
    let params = {
      url,
      data,
    }
    return this.request(params)
  }

  // 获取桌台区域列表
  selectSeatList(data) {
    let url = `/bcdshop/selectSeatList`
    let params = {
      url,
      data,
    }
    return this.request(params)
  }

  // 删除座台
  // /bcdshop/delSeat
  delSeat(data) {
    let url = `/bcdshop/delSeat`
    let params = {
      url,
      data
    }
    return this.request(params)
  }
}

export default serviceMng