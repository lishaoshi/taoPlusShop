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
  // 添加座台
  // /bcdshop/delSeat
  addSeat(data) {
    let url = `/bcdshop/addSeat`
    let params = {
      url,
      data
    }
    return this.request(params)
  }

  // 修改座台
  editSeat(data) {
    let url = `/bcdshop/updateSeat`
    let params = {
      url,
      data
    }
    return this.request(params)
  }

  // 添加区域
  addArea(data) {
    let url = `/bcdshop/addFloor`

    let params = {
      url,
      data
    }
    return this.request(params)
  }

  // 删除区域
  // /bcdshop/delFloor
  delArea(data) {
    let url = `/bcdshop/delFloor`
    let params = {
      url,
      data
    }
    return this.request(params)
  }

  // 修改区域
  // /bcdshop/updateFloor
  editArea(data) {
    let url = `/bcdshop/updateFloor`
    let params = {
      url,
      data
    }
    return this.request(params)
  }

 
}

export default serviceMng