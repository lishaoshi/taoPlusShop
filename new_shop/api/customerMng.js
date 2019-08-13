// /shop/getShopCustomerList
// 客户管理
import { http } from '../utils/http.js'

class customeMng extends http {
  constructor() {
    super()
  }

  //获取客户列表
  getShopCustomerList(data) {
    let url = `/api/menber/group/redate/all`
    let params = {
      url,
      data,
      method: 'get'
    }
    return this.request(params)
  }

  // 获取分组列表
  getGroupList(data, shopId) {
    let url = `/api/member/group/${shopId}/get-all`
    let params = {
      url,
      data,
      method: 'get'
    }
    return this.request(params)
  }

  //新增分组
  addGroup(data, shopId) {
    let url = `/api/member/group/${shopId}/add-one`
    let params = {
      url,
      data
    }
    return this.request(params)
  }

  // 修改分组
  editGroup(data, shopId) {
    let url = `/api/member/group/${shopId}/update-one`
    let params = {
      url,
      data
    }
    return this.request(params)
  }
}

export default customeMng