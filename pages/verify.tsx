import * as React from 'react'
import jsonp from '../lib/jsonp'
import Head from 'next/head'
import Cookies from 'js-cookie'

const baseUrl = 'https://xluser-ssl.xunlei.com/certification/v1/'
const reportUrl = 'https://analysis-acc-ssl.xunlei.com/'
const captchaUrl = 'https://captcha-ssl.xunlei.com/'

const ErrCodes = {
    "ERROR": "身份信息已过期，请重新登录",
    "SERVICEERR": "服务出错，请稍后重试",
    "OK": "请求成功",
    "LOSEPARAS": "参数出错，请稍后重试",
    "UNKNOWN": "未知错误，请稍后重试",
    "OPTFREQUENT": "您的操作过于频繁，请稍后再试",
    "ISAUTH": "帐号已认证",
    "NOAUTH": "帐号未认证",
    "CODEERROR": "验证码错误，请重新输入",
    "CODEEXPIRE": "验证码失效，请重新获取",
    "INCORRECTID": "身份证号码不符合规则",
    "SENDCODDERR": "验证码发送失败，请重新获取",
    "USERNOEXISTS": "该帐号已存在绑定关系",
    "INCORRECTPHONE": "手机号不符合规则",
    "PHONEINBLACK": "该手机无法用于认证，请更换手机",
    "SHOWCAPTCHA": "安全提示出图形验证码",
    "ERRCAPTCHA": "图形验证码错误，请重新输入"
}

let  needShowCm = false, phoneNumInvalid = false, realNameCerTitle = '', realNameCerDesc = '', realNameCerButton = '完成';
let AppInfo: any = {
    "platformVersion":"10",
    "protocolVersion":"301",
    "deviceModel":"MI 6",
    "deviceName":"Xiaomi Mi 6",
    "OSVersion":"8.0.0",
    "devicesign":"div101.1d837ed91d9d5c973476c97040f8925b0d9f4fb84a176929fe177bd4bbd45bbc",
    "netWorkType":"WIFI",
    "providerName":"CMCC",
    "appid":"69",
    "appName":"ANDROID-com.xunlei.xlkdemo",
    "clientVersion":"3.2.1",
    "sdkVersion":"0",
    "packageName":"com.xunlei.xlkdemo",
    "session":"",
    "userid":"736713194",
    "appKey":"88899b863b9dbe3b3f83b5f99eed840d",
    "signature":"d1a1b9446199f9cb3a6585371f5594ab",
    "creditkey":"",
    "reviewurl":"https://i.xunlei.com/xlcaptcha/workload.html?event=login3&appName=ANDROID-com.xunlei.xlkdemo&appid=69&clientVersion=3.2.1&platformVersion=10"
};

const getUrlParams = function(url, data = {}) {
    let params = '?';
    for(let v in data) {
        params += v + '=' + data[v] + '&'
    }
    params += 'apiVersion=v1.2&auth.userid='+AppInfo.userid+'&auth.sessionid='+AppInfo.sessionid+'&auth.deviceid='+AppInfo.deviceid+'&auth.appid='+AppInfo.appid+'&auth.platformVersion='+AppInfo.platformVersion+'&auth.appName='+AppInfo.appName+'&auth.clientVersion='+AppInfo.clientVersion;
    return (url+params)
}

const Report = function(data: any = {}, cb?: Function) {
    let list = ['protocolVersion', 'platformVersion', 'sdkVersion', 'clientVersion', 'appName', 'devicesign', 'deviceModel', 'OSVersion', 'netWorkType', 'providerName', 'userid'];
    let param: any = {}
    for(let i = 0, l = list.length; i < l; i++) {
        let p = list[i];
        let u = AppInfo[p] || 'NONE';
        param[p] = u
    }
    param.auth_type = 'message';
    param.APPID = AppInfo.appid;
    for(let v in data) {
        // param = param + v + '=' + data[v];
        param[v] = data[v]
    }
    let extdata = JSON.stringify(param);
    let flowid = AppInfo.flowid || ''
    let reqid = (+new Date()) + Math.floor(Math.random()*1000) + '-1'
    let url = reportUrl + 'xluserstat?category=certification_phone&action=' + data.action + '&createtime=' + new Date().getTime() + '&flowid=' + flowid + '&reqid='+ reqid + '&extdata=' + extdata;
    let image: any = document.createElement('img');
    image.onload = image.onerror = function () {
        // console.log('onload')
        image = image.onload = image.onerror = null;
        cb && cb();
    };
    image.src = url;
}

const PopTT = ({title}) => <p className="pop_tt">{title}</p>

const TxtPop = ({desc}) => <p className="txt_pop">{desc}</p>

const PopTip = () => <p className="pop_tip">手机认证符合国家法规要求，并且受到信息安全保障</p>

const PopClose = ({close}) => <a href="javascript:void(0);" onClick={close} className="pop_close"></a>

const ErrTxt = ({show, errtxt}) => <p className="txt_error" style={{display: show ? 'block' : 'none'}}>{errtxt}</p>

export default class extends React.Component {
    codeTimer: any = null

    state = {
        type: 0,      // 认证的类型
        // name: '',     // 用户名
        // idcard: '',   // 身份证号
        phone: '1888888888',   // 手机号
        showErr: false,   // 手机号码错误提示
        phoneOk: false,  // 校验 手机号
        code: '',    // 验证码
        codeOk: false, // 校验 验证码
        errtxt: '', // 提示语
        seconds: 60,
        btnCode: '获取验证码',
        phoneNumInvalid: false,
        isGotCode: false,
        onceGetCode: false,
        needCode: false,
        codeImg: '',
        VERIFY_KEY: '',
        newCode: '',
        key: '',
        cerTitle: '', 
        cerDesc: '', 
        cerBtn: '',
        needShowCm: ''
    }

    componentWillMount(){
        this.setState({
            needShowCm: needShowCm,  
            showErr: phoneNumInvalid,
            errtxt: phoneNumInvalid ? '本机号码无法用于认证，请更换手机' : '',
            cerTitle: realNameCerTitle,
            cerDesc: realNameCerDesc,
            cerBtn: realNameCerButton
        })
    }
    componentDidMount() {
        Report({action: 'certification_phone_show'})
    }

    onType(e) {
        Report({action: 'certification_phone_click', clickid: 'change_to_this'}, function() {
            console.log('onType= ' + e)
        })
    }

    close() {
        Report({action: 'certification_phone_click', clickid: 'close'})
    }
    
    onPhone(e) {
        // 手机号码输入, 需要验证手机长度
        const val = e.target.value
        if(/^[1][0-9]{10}$/.test(val)) {
            Report({action: 'certification_phone_click', step: 'input_phone'})
            this.setState({
                phone: val,
                phoneOk: true,
                showErr: false
            })
        } else {
            this.setState({
                phoneOk: false,
                showErr: false,
                phone: val
            })
        }
    }


    getCode() {
        // 请求验证码
        const { phone, phoneOk, isGotCode, VERIFY_KEY, newCode } = this.state
        const that = this
        Report({action: 'certification_phone_click', clickid: 'get_message'})
        if(!phoneOk) return false
        if(isGotCode) return false
        this.setState({
            showErr: false,
            errtxt: ''
        })
        jsonp({
            url: getUrlParams(baseUrl + 'sendcode', {phone, VERIFY_KEY, VERIFY_TYPE: 'MDA',  VERIFY_CODE: newCode}),
            success: function(res){
                console.log(res)
                if(res.result != 'OK') {
                    // that.onErrorToApp(res.result);
                    Report({action: 'certification_phone_getcode', result: 'fail', errorcode: res.result})
                    if(res.result == 'SHOWCAPTCHA') {
                        that.setState({
                            codeImg: captchaUrl + 'image?t=MDA&rand='+Math.random(),
                            needCode: true,
                            showErr: false,
                            errtxt: '',
                            isGotCode: false,
                            newCode: ''
                        })
                        Report({action: 'certification_phone_pop'})
                    } else if(res.result == 'ERRCAPTCHA') {
                        that.setState({
                            codeImg: captchaUrl + 'image?t=MDA&rand='+Math.random(),
                            errtxt: ErrCodes[res.result],
                            showErr: true,
                            newCode: ''
                        })
                        Report({action: 'certification_phone_popresult', result: 'fail', errorcode: 'ERRCAPTCHA'})
                    } else {
                        console.log(111)
                        that.setState({
                            showErr: true,
                            errtxt: ErrCodes[res.result],
                            isGotCode: false,
                        })
                    }
                } else {
                    that.setState({
                        showErr: false,
                        key: res.key,
                        isGotCode: true,
                        needCode: false,
                        code: '',
                        onceGetCode: true
                    })
                    Report({action: 'certification_phone_getcode', result: 'success'})
                    if(VERIFY_KEY != '') {
                        Report({action: 'certification_phone_popresult', result: 'success'})
                    }
                    that.codeTimer = setInterval(() => {
                        that.codeTimerTxt();
                    }, 1000);
                }
            }
        })
    }

    codeTimerTxt() {
        const { seconds } = this.state;
        // 倒计时
        if( seconds > 1 ) {
            const se = seconds - 1;
            this.setState({
                btnCode: se+'s',
                seconds: se
            })
        } else {
            this.setState({
                seconds: 60,
                isGotCode: false,
                btnCode: '获取验证码',
                newCode: '',
                VERIFY_KEY: ''
            })
            clearInterval(this.codeTimer)
        }
    }
    onCode(e) {
        // 输入 验证码
        const val = e.target.value
        if(/^[0-9]{6}$/.test(val)) {
            Report({action: 'certification_phone_click', step: 'input_message'})
            this.setState({
                code: val,
                codeOk: true,
            })
        } else {
            this.setState({
                code: val,
                codeOk: false
            })
        }
    }
    putCode() {
        // 请求验证
        const { phone, code, key, codeOk, onceGetCode } = this.state
        const that = this;
        Report({action: 'certification_phone_click', clickid: 'done'})
        if(!onceGetCode) {
            that.setState({
                showErr: true,
                errtxt: '请先获取验证码'
            })
            return false
        }
        if(code.length < 1) {
            that.setState({
                showErr: true,
                errtxt: '请先输入验证码'
            })
            return false
        }
        if(!codeOk) return false
        jsonp({
            url: getUrlParams(baseUrl + 'setphone', {phone, key, code }),
            success: function(res) {
                if(res.result == 'OK' || res.result == 'ISAUTH') {
                    that.onSuc(res.result)
                } else {
                    // that.onErrorToApp(res.result);
                    that.setState({
                        code: '',
                        showErr: true,
                        // errtxt: "result: " + res.result +  ", data: " + res.data
                        errtxt: ErrCodes[res.result]
                    })
                    Report({action: 'certification_phone_result', phone, result: 'fail', errorcode: res.result})
                }
            }
        })
    }
    onSuc(result) {
        const { phone } = this.state;
        console.log(result)
        Report({action: 'certification_phone_result', result: 'success', phone})
    }
    // 手机号输入有误，请重新输入
    onNeedCode(e) {
        this.setState({
            newCode: e.target.value
        })
    }
    needCodeBtn() {
        const { newCode } = this.state;
        const verify_key = Cookies.get('VERIFY_KEY');
        if(newCode.length < 1) {
            this.setState({
                showErr: true,
                errtxt: '请输入验证码'
            })
            return false
        }
        this.setState({
            VERIFY_KEY: verify_key
        })
        Report({action: 'certification_phone_popclick', clickid: 'done'})
        this.getCode()
    }
    needCodeBtnClo() {
        this.setState({
            needCode: false,
            showErr: false,
            errtxt: '',
            newCode: '',
            VERIFY_KEY: ''
        })
        Report({action: 'certification_phone_popclick', clickid: 'cancel' })
    }
    chkCode() {
        const url = captchaUrl + 'image?t=MDA&rand='+Math.random();
        this.setState({
            codeImg: url
        })
        Report({action: 'certification_phone_popclick', clickid: 'refresh'})
    }

    render() {
        const { type, showErr, phoneOk, isGotCode, codeOk, needShowCm, errtxt, btnCode, needCode, codeImg, newCode, code, cerTitle, cerDesc, cerBtn } = this.state

        return (
            <div>
                <Head>
                    <title>实名认证</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
                    <link rel="stylesheet" href="/static/css/verify.css" />
                </Head>
                <div className="pop_wp">
                    <div className="pop_area">
                        <div className="mpop_box">
                            <div className="mpop_cont">
                                <PopTT title={cerTitle} />
                                <TxtPop desc={cerDesc} />
                                <div className="input_wp">
                                    <div className={phoneOk ? 'ipt_box2 cur' : 'ipt_box2'}>
                                        <input type="text" maxLength={11} placeholder="输入手机号" onChange={this.onPhone.bind(this)} />
                                        <i className="ic_phone"></i>
                                        <a href="javascript:void(0);" className={phoneOk && !isGotCode ? 'btn_code' : 'btn_code grey'} onClick={this.getCode.bind(this)}>{btnCode}</a>
                                    </div>
                                    <div className={codeOk ? 'ipt_box2 cur' : 'ipt_box2'}>
                                        <input type="text" maxLength={6} value={code} placeholder="输入验证码" onChange={this.onCode.bind(this)} />
                                        <i className="ic_shield"></i>
                                        <ErrTxt show={showErr} errtxt={errtxt} />
                                    </div>
                                </div>
                                <div className="pop_btn">
                                    <a href="javascript:void(0);" className={codeOk ? 'btn_blue' : 'btn_blue grey'} onClick={this.putCode.bind(this)}>{cerBtn}</a>
                                    <p className="txt_link" style={{display: needShowCm ? 'block' : 'none'}}><a href="javascript:void(0);" onClick={() => this.onType(1)} style={{textDecoration: 'underline'}}>使用本机号码</a></p>
                                </div>
                                <PopTip />
                            </div>
                            <PopClose close={this.close.bind(this)} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
