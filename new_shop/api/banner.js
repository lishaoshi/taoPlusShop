//店铺轮播图
import { http } from '../utils/http.js'

class banner extends http {
  constructor() {
    super()
  }

  // 获取店铺轮播图
  getBannerList(data) {
    let url = `/shop/selectShopGoodsPicById`
    let params = {
      url,
      data
    }
    return this.request(params)
  }

  //添加轮播图
  // /shop/addShopGoodsPic
  addShopGoodsPic(data) {
    let url = `/shop/addShopGoodsPic`
    let params = {
      url,
      data
    }
    return this.request(params)
  }

  // 获取轮播图详情
  // /shop/getShopGoodsPic
  getShopGoodsPic(data) {
    let url = `/shop/getShopGoodsPic`
    let params = {
      url,
      data
    }
    return this.request(params)
  }

  //修改banner信息
  updateBanner(data) {
    let url = `/shop/updateShopGoodsPicById`
    let params = {
      url,
      data
    }
    return this.request(params)
  }

  // 删除轮播图
  delBanner(data) {
    let url = `/shop/delectShopGoodsPic`
    let params = {
      url,
      data
    }
  }
}

export default banner