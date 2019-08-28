
const app = getApp();

const HOST = app.globalData.HOST;
const IMG = app.globalData.IMG;  


const api = {
    HOST: HOST,
    IMG: IMG,
    wxLogin: `${HOST}/oauth/token`, //微信授权登录
    saveUserInfo: `${HOST}/api/user/wx/user-info`, //微信授权登陆保存用户信息
    userAddOrder: HOST +"/api/pay/payment",//支付
    shopAddOrder: HOST + "/api/pay/scancode",//商家买单支付
    goodsClassifyList: HOST + "/admin/goods/goodsClassifyList", //分类列表
    goodsList: HOST + "/goods/goodsList", //商品列表
    addCartGoods: HOST + "/goods/addCartGoods",//添加商品到购物车
    cartList: HOST + "/goods/cartList", //购物车列表
    getShopDetail: HOST + "/wx/shop/getShopDetail", //商家详情
    getShopPic: HOST + "/shop/getShopPhotoList", //查看商家图片
    delCartGoods: HOST + "/goods/delCartGoods", //删除购物车
    goodsDetails: HOST + "/admin/goods/goodsDetails", //商品详情
    getAddress: HOST + "/user/address/getAddress", //获取地址列表
    addAddress: HOST + "/user/address/addAddress", //添加地址
    updateAddress: HOST + "/user/address/updateAddress", //修改地址
    deleteAddress: HOST + "/user/address/deleteAddress", //删除收货地址
    addOrderGoods: HOST + "/wx/order/addOrderGoods", //商品下单
    orderList: HOST + "/api/order/wxOrderList", //订单列表
    wxGetUserInfo: HOST + "/wx/user/wxGetUserInfo", //获取用户信息
    upload: HOST +"/file/upload",//上传文件
    updateUserInfo: HOST + "/wx/user/updateUserInfo", //设置用户信息
    selectFloor: HOST + "/bcdshop/selectFloor", //桌台区域列表
    selectReserveSeat: HOST + "/bcdshop/selectReserveSeat", //桌台列表
    takeNumber: HOST + "/bcdshop/takeNumber", //取号
    takeNumberInfo: HOST + "/bcdshop/takeNumberInfo", //取号详情
    editTakeNumber: HOST + "/bcdshop/editTakeNumber", //编辑取号状态
    reservations: HOST + "/bcdshop/reservations", //订座
    selectTimeIntervalList: HOST + "/bcdshop/selectTimeIntervalList", //时段列表
    reservationsInfo: HOST + "/bcdshop/reservationsInfo", //订座详情
    addEvaluate: HOST + "/evaluate/addEvaluate", //添加评论
    addCollection: HOST + "/bcdshop/addCollection", //添加收藏
    collectionList: HOST + "/bcdshop/collectionList", //我的收藏列表
    userTakeNumberList: HOST + "/bcdshop/userTakeNumberList", //用户取号列表
    userReserveTablesList: HOST + "/bcdshop/userReserveTablesList", //用户订桌列表
    userReserveTablesList: HOST + "/bcdshop/userReserveTablesList", //用户订桌列表
    selectShopGoodsPicById: HOST + '/shop/selectShopGoodsPicById', //查询商家轮播图(小程序)
    bankCard: `${HOST}/api/bankcard/names`, //查询银行卡
    vlidateCode: `${HOST}/api/basic/mobile/vlidate-code`,//获取验证码
    register: `${HOST}/api/user/third/register-form-weixin`, //注册
    decrypt: `${HOST}/api/user/third/dc`, //解密
    getUser: `${HOST}/api/user/current`, //获取用户信息
}

module.exports = {
    api: api
}