// pages/add_bank_card/add_bank_card.js
//获取应用实例
const app = getApp();
const api = require("../../utils/api.js").api;
const utils = require("../../utils/util.js");
import Validator from "../../utils/validator.js";
let _this;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bankCardList: [],
        showBank: true,
        codeDis: false,
        phoneCode: '获取验证码',
        cardLen: 0, //银行卡长度
        isColor: false,
        bankName: '',
        bankCardNum: '',
        userName: '',
        idCard: '',
        mobile: '',
        code: '',
        codeTime: 60,
        bankNo: '',
        bankCode: '',
        type: '1',
        isShow: true,
        disabled: false,
        isShowArray: [{
                isShow: true
            },
            {
                isShow: true
            },
            {
                isShow: true
            },
            {
                isShow: true
            }
        ],

    },
    /**
     * 根据id来修改各自的值
     */
    changeInputFn: function(e) {
        let id = e.target.id;
        let value = e.detail.value;
        let index = utils.dataSet(e, 'index');
        if (id == 'mobile') {
            let isColor = value ? true : false;
            _this.setData({
                isColor: isColor
            })
        }
      
        let isShow = value ? false : true;
        let isShowArray = _this.data.isShowArray;
        isShowArray[index].isShow = isShow;
        _this.setData({
            [id]: value,
            isShowArray: isShowArray,
        });
    },

    /**
     * 清空输入框
     */
    delBankNumFn: function(e) {
        let field = utils.dataSet(e, 'field');
        let index = utils.dataSet(e, 'index');
        let isShowArray = _this.data.isShowArray;
        isShowArray[index].isShow = true;
        _this.setData({
            [field]: "",
            isShowArray: isShowArray
        })

    },
    /**
     * 选择--银行
     */
    bankCarFn: function(e) {
        utils.uGet(api.bankCard).then((res) => {
            let bankList = res;
            _this.setData({
                bankCardList: bankList
            })
        })
    },
    /**
     * 选择银行卡
     */
    bindPickerChangeFn: function(e) {
        let index = e.detail.value;
        let bankCardList = _this.data.bankCardList;
        let bankNo = bankCardList[index].bank_no;
        let bankCode = bankCardList[index].bank_code;
        let bankName = bankCardList[index].bank_name;
        // console.log('picker发送选择改变，携带值为', e.detail)
        console.log(bankNo);
        console.log(bankCode)
        this.setData({
            index: e.detail.value,
            bankNo: bankNo,
            bankCode: bankCode,
            bankName: bankName,
            showBank: false
        })
    },

    /**
     * 卡类型
     */
    changeRadioFn: function(e) {
        let val = e.detail.value;
        // console.log(val)
        _this.setData({
            type: val
        })

    },

    /**
     * 输入框--验证码
     */
    codeFn: function(e) {
        let _this = this;
        let val = e.detail.value;
        _this.setData({
            code: val
        });
    },

    //点击获取验证码
    changeCodeFn() {
      let regMobeil = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
        let validator = new Validator();
      console.log('手机号码',this.data.mobile)
        let valiData = [{
            value: _this.data.mobile,
            rules: [{
                    strategy: 'NotEmpty',
                    errorMsg: '手机号不能为空'
                }
            ]
        }];
      if (!regMobeil.test(this.data.mobile)){
        wx.showToast({
          title:'手机号格式不正确'
        });
        return;
      }
        validator.init(valiData);

        let errorMsg = validator.start();

        if (errorMsg) return;

        utils.uPost(api.vlidateCode, {
            mobile: _this.data.mobile
        }).then((res) => {
             utils.successShow('验证码发送成功');       
          _this.setData({
            disabled:true
          })
        })

      utils.Interval(_this, 60, 'codeDis', 'codeTime');

        

    },

    /**
     * 保存添加银行卡
     */
    saveCardFn: function() {
        let regMobeil = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
        let regIdCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        let regName = /^[\u4E00-\u9FA5]{2,4}$/;
        let regBankNum = /^([1-9]{1})(\d{15}|\d{18})$/;
        let bankcardName = _this.data.bankName;
        let bankcardNum = _this.data.bankCardNum.replace(/(\s+)/g, '');

        let username = _this.data.userName;
        let identity = _this.data.idCard;
        let mobile = _this.data.mobile;
        let type = _this.data.type;
        let bankNo = _this.data.bankNo;
        let bankCode = _this.data.bankCode;
        let vCode = _this.data.code;
        let validator = new Validator();
        let valiData = [{
                value: bankcardName,
                rules: [{
                    strategy: 'NotEmpty',
                    errorMsg: '请选择银行名称'
                }]
            },
            {
                value: bankcardNum,
                rules: [{
                    strategy: 'NotEmpty',
                    errorMsg: '请输入银行卡号'
                }]
            },
            {
                value: username,
                rules: [{
                    strategy: 'NotEmpty',
                    errorMsg: '请输入姓名'
                }]
            },
            {
                value: identity,
                rules: [{
                    strategy: 'NotEmpty',
                    errorMsg: '请输入身份证号'
                }]
            },
            {
                value: mobile,
                rules: [{
                    strategy: 'NotEmpty',
                    errorMsg: '联系电话不能为空'
                }, {
                    strategy: 'isMobile',
                    errorMsg: '联系电话格式不对'
                }]
            },
            {
                value: vCode,
                rules: [{
                    strategy: 'NotEmpty',
                    errorMsg: '验证码不能为空'
                }]
            },

        ];
        validator.init(valiData);
        let errorMsg = validator.start();
        if (errorMsg) return;
      if (!regBankNum.test(bankcardNum)) {
        wx.showToast({
          title: '请输入正确的银行卡号',
          icon: 'none'
        });
        return false;
      }
      if (!regName.test(username)){
        wx.showToast({
          title: '请输入正确的持卡人姓名',
          icon: 'none'
        });
        return false;
      }
      if (!regIdCard.test(identity)){
        wx.showToast({
          title: '请输入正确的身份证号码',
          icon: 'none'
        });
        return false;
      }
      if (!regMobeil.test(mobile)){
        wx.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        });
        return false;
      } 
        let data = {
            user_id: app.globalData.userId,
            bankcardName: bankcardName,
            username: username,
            bankcardNum: bankcardNum,
            type: type,
            mobile: mobile,
            bankNo: bankNo,
            bankCode: bankCode,
            identity: identity,
            bankCode: bankCode,
            vCode: vCode
        }
        utils.uPost(`${api.HOST}/api/user/${app.globalData.userId}/bankcards`, data).then((res) => {
         
            wx.showToast({
                title: '添加成功',
                complete: () => {
                    wx.navigateBack({})
                }
            });

        })
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        _this = this;
        _this.bankCarFn()
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})