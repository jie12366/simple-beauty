<template>
    <div>
        <login-top>
            <div class="form-data">
            <form>
                <section>
                    <el-input v-model="phone" @blur="checkPhone" prefix-icon="el-icon-mobile" placeholder="手机号" clearable></el-input><br/>
                    <alert-span v-bind:msg="phoneMsg" :is-hide="phoneAlert"></alert-span>
                </section>
                <section>
                    <el-input v-model="pwd" @blur="checkPwd" show-password prefix-icon="el-icon-lock" placeholder="密码" clearable></el-input><br/>
                    <alert-span v-bind:msg="pwdMsg" :is-hide="pwdAlert"></alert-span>
                </section>
                <section>
                    <el-input v-model="code" class="code" prefix-icon="el-icon-key" placeholder="验证码" clearable></el-input>
                    <el-button type="info" @click="getVerifyCode" :disabled="disabled" round class="times-text">{{timesText}}</el-button>
                    <alert-span v-bind:msg="codeMsg" :is-hide="codeAlert"></alert-span>
                </section>
                <section>
                    <el-button type="success" @click="signUp" class="btn-size" round>注册</el-button>
                </section>
            </form>
            <div class="login-bottom">
                <el-divider>社交方式注册</el-divider>
                <router-link to=""><font-awesome-icon :icon="['fab','qq']" style="color:#498ad5;padding-right:20px"></font-awesome-icon></router-link>
                <router-link to=""><font-awesome-icon :icon="['fab','weixin']" style="color:#00bb29;padding-right:20px"></font-awesome-icon></router-link>
                <router-link to=""><font-awesome-icon :icon="['fab','github']" style="color:#666666"></font-awesome-icon></router-link>
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
                codeMsg: null, // 验证码出错的提示信息
                codeAlert: true, // 验证码错误提示是否隐藏
                phone: null, // 账号
                pwd: null, // 密码
                code: null, // 验证码
                times: '0', // 倒计时(这里用字符串表示是为了区分开始发送和重新发送)
                disabled: false // 是否禁用发送验证码的按钮
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
            // 检查手机号是否合法
            checkPhone () {
                if (!/^1[34578]\d{9}$/gi.test(this.phone)) {
                    this.phoneMsg = '手机号格式不合法'
                    this.phoneAlert = false
                    return false
                } else {
                    this.phoneAlert = true
                    return true
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
                    return true
                }
            },
            // 获取短信验证码
            getVerifyCode () {
                // 先判断手机号是否合法
                if (this.checkPhone()) {
                    this.times = 60 // 置计时器初始值为60s
                    this.disabled = true // 开始计时后禁用按钮
                    // 调用计时器
                    this.timer = setInterval(() => {
                        this.times--
                        // 当计时数到0了,终止计时器,恢复按钮
                        if (this.times === 0) {
                            clearInterval(this.timer)
                            this.disabled = false
                        }
                    }, 1000)
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../style/login.scss';
    @import '../../style/mixin.scss';
    .times-text{
        margin-left:30px;
        width:120px;
        text-align: center
    }
</style>
