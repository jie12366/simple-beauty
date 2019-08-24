<template>
    <div>
        <login-top>
            <div class="form-data">
            <form>
                <section>
                    <el-input v-model="account" @blur="checkAccount" prefix-icon="el-icon-user" placeholder="手机号" clearable></el-input><br/>
                    <alert-span v-bind:msg="accountMsg" :is-show="!accountRight"></alert-span>
                </section>
                <section>
                    <el-input v-model="pwd" show-password :prefix-icon="pwdIcon" @focus="changePwdUnlock" @blur="changePwdLock" placeholder="密码" clearable></el-input><br/>
                    <alert-span v-bind:msg="pwdMsg" :is-show="!pwdRight"></alert-span>
                </section>
                <section>
                    <el-input v-model="code" class="code" @blur="checkImageCaptcha" prefix-icon="el-icon-key" placeholder="验证码" clearable></el-input>
                    <img class="image-code" :src="imageSrc"/>
                    <div class="change-code" @click="getCaptcha">看不清<br/>换一张</div>
                    <br/><alert-span v-bind:msg="codeMsg" :is-show="!codeRight"></alert-span>
                </section>
                <section>
                    <input v-model="remeberMe" type="checkbox"/><span class="remeber-me">记住我</span>
                    <router-link to="/forget">忘记密码</router-link>
                </section>
                <section>
                    <el-button type="primary" @click="signIn" class="btn-size" round>登录</el-button>
                </section>
            </form>
            <div class="login-bottom">
                <el-divider>社交方式登录</el-divider>
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
    import { RECORD_TOKEN } from '@/store/mutation-types'
    export default {
        data () {
            return {
                accountMsg: null, // 账号出错的提示信息
                accountRight: true, // 账号是否正确
                pwdMsg: null, // 密码出错的提示信息
                pwdRight: true, // 密码是否正确
                codeMsg: null, // 验证码出错的提示信息
                codeRight: true, // 验证码是否正确
                account: null, // 账号
                pwd: null, // 密码
                code: null, // 验证码
                imageSrc: null, // 图形验证码路径
                pwdIcon: 'el-icon-lock', // 密码框的icon
                remeberMe: false // 是否记住我
            }
        },
        mounted () {
            this.getCaptcha()
        },
        components: {
            loginTop,
            alertSpan
        },
        methods: {
            // 获取焦点后改变密码框的icon
            changePwdUnlock () {
                this.pwdIcon = 'el-icon-unlock'
            },
            changePwdLock () {
                this.pwdIcon = 'el-icon-lock'
            },
            // 获取图片验证码
            async getCaptcha () {
                await this.$api.login.getCaptcha()
                .then(data => { // 从Promise对象中读取图片路径并赋值
                    this.imageSrc = data
                })
            },
            // 检查图片验证码是否过期或是否错误
            async checkImageCaptcha () {
                let result = this.$api.login.checkImageCaptcha(this.code)
                .then(res => {
                    if (res.code === 50004 || res.code === 50005) {
                            this.codeMsg = res.msg
                            this.codeRight = false
                            return false
                        } else if (res.code === 1) {
                            this.codeRight = true
                            return true
                        }
                })
                return result
            },
            // 检查账号是否存在
            async checkAccount () {
                let result = await this.$api.login.checkAccount(this.account)
                .then(data => {
                    if (data.code === 1) {
                        this.accountRight = true
                        return true
                    } else if (data.code === 20004) {
                        this.accountMsg = data.msg
                        this.accountRight = false
                        return false
                    }
                })
                return result
            },
            // 登录
            async signIn () {
                // 如果账号存在且验证码正确
                let checkAccount = await this.checkAccount()
                let checkImageCaptcha = await this.checkImageCaptcha()
                if (checkAccount && checkImageCaptcha) {
                    let data = {
                        'uaccount': this.account,
                        'upwd': this.pwd
                    }
                    this.$api.login.signIn(data)
                    .then(res => {
                        if (res.code === 20002) {
                            this.pwdMsg = res.msg
                            this.pwdRight = false
                        } else if (res.code === 1) {
                            this.pwdRight = true
                            this.$store.commit(RECORD_TOKEN, res.data)
                            this.$message({
                                    message: '登录成功',
                                    type: 'success',
                                    duration: 1000
                                })
                            this.$router.push(this.$route.query.redirect || '/')
                        }
                    })
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../style/login.scss';
    @import '../../style/mixin.scss';
    .image-code{
        width: 180px;
        height: 80px;
    }
    .change-code{
        @include sc(18px,#666666);
        line-height: 40px;
        margin-left: 12px;
        cursor: pointer;
        border-right: #e7e9ee solid 2px;
        &:hover{
            color:cornflowerblue;
        }
    }
    .remeber-me{
        @include sc(28px,#666666);
    }
    .login-bottom{
        width: 500px;
        text-align: center;
        .icon{
            padding-right: 20px;
        }
    }
</style>
