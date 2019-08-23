// 优惠券模块
import { http } from '../utils/http.js'
const app = getApp()
class coupons extends http {
  constructor() {
    super()
  }

  // 查询优惠券规则
  queryCouponRule(data) {
    let url = `/api/coupon/rule/shop/${app.globalData.shopId}`
    let params = {
      url, 
      data,
      method: 'get'
    }
    return this.request(params)
  }

  // 创建普通优惠券
  addCoupon(data) {
    let url = `/api/coupon/rule/normal-coupon/create`
    let params = {
      url,
      data
    }
    return this.request(params)
  }

  // 修改普通优惠券
  updateCoupon(data, id) {
    let url = `/api/coupon/rule/normal-coupon/${id}/update`
    let params = {
      url,
      data
    }
    return this.request(params)
  } 
}

export default coupons