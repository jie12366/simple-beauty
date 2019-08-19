<template>
    <div>
        <login-top>
            <div class="form-data">
            <form>
                <section>
                    <el-input v-model="phone" @blur="checkPhone" prefix-icon="el-icon-mobile" placeholder="手机号" clearable></el-input>
                    <span class="common_register" v-bind:class="[{hide:hideTip},{is_register:isRegister},{no_register:!isRegister}]">{{registerTip}}</span><br/>
                    <alert-span v-bind:msg="phoneMsg" :is-show="!phoneAlert"></alert-span>
                </section>
                <section>
                    <el-input v-model="pwd" @blur="checkPwd" show-password prefix-icon="el-icon-lock" placeholder="密码" clearable></el-input>
                    <span class="pwd_right" v-bind:class="[{hide:!pwdRight}]">可使用</span><br/>
                    <alert-span v-bind:msg="pwdMsg" :is-show="!pwdAlert"></alert-span>
                </section>
                <section>
                    <el-input v-model="code" class="code" prefix-icon="el-icon-key" placeholder="验证码" clearable></el-input>
                    <el-button type="info" @click="sendSmsCaptcha" :disabled="disabled" round class="times-text">{{timesText}}</el-button>
                    <span class="send_success" v-bind:class="[{hide:!isSuccess}]">发送成功</span>
                    <alert-span v-bind:msg="codeMsg" :is-show="!codeAlert"></alert-span>
                </section>
                <section>
                    <el-button type="success" @click.once="signUp" class="btn-size" round>注册</el-button>
                </section>
            </form>
            <div class="login-bottom">
                <el-divider>社交方式注册</el-divider>
                <router-link to=""><font-awesome-icon :icon="['fab','qq']" class="qq"></font-awesome-icon></router-link>
                <router-link to=""><font-awesome-icon :icon="['fab','weixin']" class="weixin"></font-awesome-icon></router-link>
                <router-link to=""><font-awesome-icon :icon="['fab','github']" class="github"></font-awesome-icon></router-link>
            </div>
        </div>
        </login-top>
    </div>
</template>

<script>
    import loginTop from '@components/login/login-top'
    import alertSpan from '@components/login/alert-span'
    import { setInterval, clearInterval } from 'timers'
    export default {
        data () {
            return {
                phoneMsg: null, // 账号框出错的提示信息
                phoneAlert: true, // 账号的提示信息是否隐藏
                pwdMsg: null, // 密码框出错的提示信息
                pwdAlert: true, // 密码框的提示信息是否隐藏
                pwdRight: false, // 密码是否可使用
                codeMsg: null, // 验证码出错的提示信息
                codeAlert: true, // 验证码错误提示是否隐藏
                phone: null, // 账号
                pwd: null, // 密码
                code: null, // 验证码
                times: '0', // 倒计时(这里用字符串表示是为了区分开始发送和重新发送)
                disabled: false, // 是否禁用发送验证码的按钮
                isRegister: true, // 账号是否被注册
                hideTip: true, // 是否隐藏是否注册的提示
                registerTip: null, // 提示信息
                isSuccess: false // 是否隐藏成功发送验证码的提示
            }
        },
        components: {
            loginTop,
            alertSpan
        },
        computed: {
            // 发送验证码的按钮文字
            timesText: function () {
                // 如果计时数大于0,说明正在计时
                if (this.times > 0) {
                    return this.times + 's后重新发送'
                } else if (this.times === 0) {
                    return '重新发送'
                } else {
                    return '发送验证码'
                }
            }
        },
        methods: {
            checkPhone () {
                // 检查手机号是否合法
                if (!/^1[34578]\d{9}$/gi.test(this.phone)) {
                    this.phoneMsg = '手机号格式不合法'
                    this.phoneAlert = false
                } else {
                    this.$api.login.checkAccount(this.phone)
                    .then(data => {
                        if (data.code === 20005) {
                            this.isRegister = true
                            this.registerTip = '已注册'
                            this.hideTip = false
                        } else if (data.code === 20004) {
                            this.isRegister = false
                            this.registerTip = '可注册'
                            this.hideTip = false
                            this.phoneAlert = true
                        }
                    })
                }
            },
            // 检查输入的密码是否合法
            checkPwd () {
                if (!/^\w{6,20}$/.test(this.pwd)) {
                    this.pwdMsg = '只能是6-20位的字母/数字/下划线'
                    this.pwdAlert = false
                    return false
                } else {
                    this.pwdAlert = true
                    this.pwdRight = true
                    return true
                }
            },
            // 发送短信验证码
            sendSmsCaptcha () {
                // 先判断手机号是否合法或是否被注册
                this.checkPhone()
                if (!this.isRegister) {
                    this.times = 60 // 置计时器初始值为60s
                    this.disabled = true // 开始计时后禁用按钮
                    // 调用计时器
                    this.timer = setInterval(() => {
                        this.times--
                        // 当计时数到0了,终止计时器,恢复按钮
                        if (this.times === 0) {
                            clearInterval(this.timer)
                            this.disabled = false
                            this.isSuccess = false
                        }
                    }, 1000)
                    // 发送短信验证码
                    this.$api.login.sendSmsCaptcha(this.phone)
                        .then(data => {
                            if (data.code === 1) {
                                this.isSuccess = true
                                this.codeAlert = true
                                return true
                            } else {
                                this.codeAlert = false
                                this.codeMsg = '请发送验证码'
                                return false
                            }
                        })
                }
            },
            // 检查短信验证码是否正确或过期
            checkSmsCaptcha () {
                this.$api.login.checkSmsCaptcha(this.code)
                    .then(res => {
                        if (res.code === 50004 || res.code === 50005) {
                            this.codeMsg = res.msg
                            this.codeAlert = false
                        } else if (res.code === 1) {
                            this.codeAlert = true
                        }
                    })
                return true
            },
            // 注册
            signUp () {
                if (this.checkPwd()) {
                    if (this.checkSmsCaptcha() && this.codeAlert) {
                        let data = {
                            'uaccount': this.phone,
                            'upwd': this.pwd
                        }
                        this.$api.login.signUp(data)
                            .then(res => {
                                if (res.code === 1) {
                                    this.$message({
                                        message: '注册成功',
                                        type: 'success'
                                    })
                                }
                            })
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../style/login.scss';
    @import '../../style/mixin.scss';
    .common_register{
        position: absolute;
        right: 30px;
        top: 190px;
    }
    .is_register{
        @include sc(32px,red);
    }
    .no_register{
        @include sc(32px,#00bb29);
    }
    .pwd_right{
        @include sc(32px,#00bb29);
        position: absolute;
        right: 30px;
        top: 320px;
    }
    .send_success{
        @include sc(32px,#00bb29);
        position: absolute;
        right: 30px;
        top: 435px;
    }
    .times-text{
        margin-left:30px;
        width:240px;
        text-align: center
    }
</style>
