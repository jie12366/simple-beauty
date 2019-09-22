<template>
    <login-top>
        <section class="form-top">
            <span style="font-size:18px">重置密码</span>
        </section>
        <div>
            <drag-verify class="verify" :width="width"
                :height="height"
                :text="text"
                :success-text="successText"
                :background="background"
                :progress-bar-bg="progressBarBg"
                :completed-bg="completedBg"
                :handler-bg="handlerBg"
                :handler-icon="handlerIcon"
                :text-size="textSize"
                :success-icon="successIcon"
                @passcallback= "passcallback"
                ref="Verify" v-show="!verify"></drag-verify>
        </div>
        <div class="form-data" style="height:222px;" v-show="verify">
            <form>
                <section>
                    <el-input v-model="email" @blur="checkEmail" prefix-icon="icon-vue-email2" placeholder="邮箱" clearable></el-input><br/>
                    <alert-span v-bind:msg="emailMsg" :is-show="!emailRight"></alert-span>
                </section>
                <section>
                    <el-input v-model="pwd" @blur="checkPwd" show-password prefix-icon="icon-vue-pwd" placeholder="密码" clearable></el-input><br/>
                    <alert-span v-bind:msg="pwdMsg" :is-show="!pwdRight"></alert-span>
                </section>
                <section>
                    <el-input v-model="confirmPwd" @blur="checkConfirmPwd" show-password prefix-icon="icon-vue-pwd" placeholder="确认密码" clearable></el-input><br/>
                    <alert-span v-bind:msg="confirmPwdMsg" :is-show="!confirmPwdRight"></alert-span>
                </section>
                <section>
                    <el-input v-model="code" class="code" prefix-icon="el-icon-key" placeholder="验证码" clearable></el-input>
                    <el-button type="info" @click="sendEmailCaptcha" :disabled="disabled" round class="times-text">{{timesText}}</el-button>
                    <alert-span v-bind:msg="codeMsg" :is-show="!codeRight"></alert-span>
                </section>
                <p style="font-size:16px;">
                    <router-link to="/sign-in">马上登录</router-link>
                </p>
                <section>
                    <el-button type="primary" @click="resetPwd" class="btn-size" round>确定</el-button>
                </section>
            </form>
        </div>
    </login-top>
</template>
<script>
import loginTop from '@components/login/login-top'
import alertSpan from '@components/login/alert-span'
import dragVerify from 'vue-drag-verify'
import { setInterval, clearInterval } from 'timers'
export default {
    data () {
        return {
            handlerIcon: 'icon-vue-tuozhuai',
            successIcon: 'icon-vue-success',
            background: '#cccccc',
            progressBarBg: '#4b0',
            completedBg: '#66cc66',
            handlerBg: '#fff',
            text: '请将滑块拖动到右侧验证',
            successText: '验证成功',
            width: 320,
            height: 42,
            textSize: '18px',
            verify: false, // 是否通过滑块验证
            email: null, // 邮箱
            emailMsg: null,
            emailRight: true,
            pwd: null, // 密码
            pwdMsg: null,
            pwdRight: true,
            confirmPwd: null, // 确认密码
            confirmPwdMsg: null,
            confirmPwdRight: true,
            code: null, // 验证码
            codeMsg: null,
            codeRight: true,
            times: '0', // 倒计时(这里用字符串表示是为了区分开始发送和重新发送)
            disabled: false // 是否禁用发送验证码的按钮
        }
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
        // 验证通过后触发
        passcallback () {
            this.verify = true
        },
        checkEmail () {
                // 检查手机号是否合法
                if (!/^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/.test(this.email)) {
                    this.emailMsg = '邮箱格式不合法'
                    this.emailRight = false
                    return false
                } else {
                    this.emailRight = true
                    return true
                }
            },
            // 检查输入的密码是否合法
            checkPwd () {
                if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,16}$/.test(this.pwd)) {
                    this.pwdMsg = '必须是6-16位且包含大小写字母以及数字'
                    this.pwdRight = false
                    return false
                } else {
                    this.pwdAlert = true
                    this.pwdRight = true
                    return true
                }
            },
            // 检查两次密码是否一致
            checkConfirmPwd () {
                if (this.pwd === this.confirmPwd) {
                    this.confirmPwdRight = true
                    return true
                } else {
                    this.confirmPwdMsg = '两次输入的密码不一致'
                    this.confirmPwdRight = false
                    return false
                }
            },
            // 发送邮箱验证码
            sendEmailCaptcha () {
                // 先判断邮箱是否合法
                if (this.checkEmail()) {
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
                    this.$api.user.sendEmailCaptcha(this.email)
                    .then(res => {
                        if (res.code === 1) {
                            this.$message({
                                    message: '发送成功',
                                    type: 'success'
                                })
                        }
                    })
                }
            },
        // 检查邮件验证码是否正确或过期
            async checkEmailCaptcha () {
                let res = await this.$api.user.checkEmailCaptcha(this.code)
                    .then(res => {
                        if (res.code === 50004 || res.code === 50005) {
                            this.$message.error(res.msg)
                            return false
                        } else if (res.code === 1) {
                            return true
                        }
                    })
                return res
            },
        // 重置密码
        async resetPwd () {
            let checkEmailCaptcha = await this.checkEmailCaptcha()
            if (checkEmailCaptcha && this.checkEmail() && this.checkPwd() && this.checkConfirmPwd()) {
                this.$api.user.resetPwd(this.email, this.pwd)
                .then(res => {
                    if (res.code === 1) {
                        this.$message({
                            message: '重置密码成功',
                            type: 'success',
                            duration: 1000
                        })
                        this.$router.go(-1)
                    }
                })
            }
        }
    },
    components: {
        loginTop,
        alertSpan,
        dragVerify
    }
}
</script>
<style lang="scss" scoped>
    @import '../../style/login.scss';
    @import '../../style/mixin.scss';
    .verify{
        margin: auto;
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
