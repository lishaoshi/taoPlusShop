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

  // 删除商品
  delGoods(data) {
    let url =  `/admin/goods/deleteGoods`
    let params = {
      url,
      data
    }
    return this.request(params)
  }

  // 设置商品上架
  goodsOnSale(data) {
    let url = `/admin/goods/goodsOnSale`
    let params = {
      url,
      data
    }
    return this.request(params)
  }
  // 设置商品下架
  goodsOffSale(data) {
    let url = `/admin/goods/goodsOffSale`
    let params = {
      url,
      data
    }
    return this.request(params)
  }

  // 上传图片
  uploadImg(data) {
    let url = `/file/upload`
    let params = {
      url,
      data,
      header: {
        'content-type': 'multipart/form-data'
      }
    }
    return this.request(params)
  }

  // 添加上批婆娘
  addGoods(data) {
    let url = `/admin/goods/addGoods`
    let params = {
      url,
      data
    }
    return this.request(params)
  }

  // 查看商品详情
  queryGoodsDetail(data) {
    let url = `/admin/goods/goodsDetails`
    let params = {
      url,
      data
    }
    return this.request(params)
  }

  // 修改商品
  editGoods(data) {
    let url = `/admin/goods/updateGoods`
    let params = {
      url,
      data
    }
    return this.request(params)
  }

}

export default goodsMng
