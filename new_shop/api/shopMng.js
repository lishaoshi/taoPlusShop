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

  // 获取经营项目数据
  getProjectData(data) {
    let url = `/user/index/getProductType`
    let params = {
      url,
      data
    }
    return this.request(params)
  }

  // 获取店铺图片
  getShopImg(data) {
    let url =`/shop/getShopPhotoList`
    let params = {
      url,
      data
    }
    return this.request(params)
  }

  // 获取省市区列表
  // /sys/getRegion
  gazetteBillRegion(data) {
    let url = `/sys/getRegion`
    let params = {
      url,
      data
    }
    return this.request(params)
  }

  // 商家入驻
  addShop(data) {
    let url = `/shop/addShopV3-1`
    let params = {
      url,
      data
    }
    return this.request(params)
  }

  // 编辑商家信息
  updataShopInfo(data) {
    let url = `/shop/updateShopV3-1`
    let params = {
      url,
      data
    }
    return this.request(params)
  }

  // 添加图片
  addShopPhoto(data) {
    let url = `/shop/addShopPhoto`
    let params = {
      url,
      data
    }
    return this.request(params)
  }

  // 删除图片
  delShoopImg(data) {
    let url = `/shop/deleteShopPhoto` 
    let params = {
      url,
      data
    }
    return this.request(params)
  }
}

export default shopMng