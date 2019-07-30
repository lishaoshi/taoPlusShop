/**
 * 表单数据验证
 * @author 我贼帅
 * eg: 
 * let validator = new Validator();
 * let valiData = [
 *          { value: '你好', rules: [{ strategy: 'NotEmpty', errorMsg: '用户名不能为空' }] },
 *          { value: '1231231231', rules: [{ strategy:'minLength:6',errorMsg:'密码不能超过6位数'}]}
 *          ];
 * validator.init(valiData);
 * let msg = validator.start();
 */
import utils from './util.js';
const strategies = {
    NotEmpty: (value, errorMsg) => {
        if(value === ''){
            return errorMsg;
        }
    },
    minLength: (value, length, errorMsg) => {
        if(value.length > length){
            return errorMsg;
        }
    },
    isMobile: (value,errorMsg) => {
        if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
            return errorMsg;
        }
    }
};
class Validator {
    constructor(){
        this.cache = [];
    }
    /**
     * 统一添加数据
     */
    init(valiData){
        let _this = this;
        valiData.forEach((data, i) => {
            let value = data.value;
            let rules = data.rules;
            this.addRules(value, rules);
        })
    }

    /**
     * 逐一添加数据
     */
    add(value, rules){
        this.addRules(value, rules);
    }

    addRules(value, rules){
        let _this = this;
        rules.forEach((rule, r) => {
            _this.cache.push(() => {
                let strategyAry = rule.strategy.split(':');
                let errorMsg = rule.errorMsg || '';
                let startegy = strategyAry.shift();
                strategyAry.unshift(value);
                strategyAry.push(errorMsg);
                return strategies[startegy].apply(_this, strategyAry);
            })
        })
    }

    start(){
        for (let i = 0, validatorFunc; validatorFunc = this.cache[i++];) {
            let errorMsg = validatorFunc();
            if (errorMsg) {
                utils.errorShow(errorMsg);
                return errorMsg;
            }
        }
    }
}

export default Validator;