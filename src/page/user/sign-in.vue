<template>
    <div>
        <login-top>
            <div class="form-data">
            <form>
                <section>
                    <el-input v-model="account" prefix-icon="el-icon-user" placeholder="手机号" clearable></el-input><br/>
                    <alert-span v-bind:msg="msg" :is-hide="accountAlert"></alert-span>
                </section>
                <section>
                    <el-input v-model="pwd" show-password :prefix-icon="pwdIcon" @focus="changePwdUnlock" @blur="changePwdLock" placeholder="密码" clearable></el-input><br/>
                    <alert-span v-bind:msg="msg" :is-hide="pwdAlert"></alert-span>
                </section>
                <section>
                    <el-input v-model="code" class="code" prefix-icon="el-icon-key" placeholder="验证码" clearable></el-input>
                    <img class="image-code" src="@/images/code.png"/>
                    <div class="change-code" @click="getCaptcha">看不清<br/>换一张</div>
                    <br/><alert-span v-bind:msg="msg" :is-hide="codeAlert"></alert-span>
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
    export default {
        data () {
            return {
                msg: '测试', // 出错的提示信息
                accountAlert: true, // 账号的提示信息是否隐藏
                pwdAlert: true, // 密码框的提示信息是否隐藏
                codeAlert: true, // 验证码错误提示是否隐藏
                account: null, // 账号
                pwd: null, // 密码
                code: null, // 验证码
                imageSrc: '@/images/code.png', // 图形验证码路径
                pwdIcon: 'el-icon-lock', // 密码框的icon
                remeberMe: false // 是否记住我
            }
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
            getCaptcha () {

            },
            signIn () {
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../style/login.scss';
    @import '../../style/mixin.scss';
    .image-code{
        width: 100px;
        height: 40px;
    }
    .change-code{
        @include sc(12px,#666666);
        line-height: 20px;
        margin-left: 12px;
        cursor: pointer;
        border-right: #e7e9ee solid 2px;
        &:hover{
            color:cornflowerblue;
        }
    }
    .remeber-me{
        @include sc(14px,#666666);
        margin-top:-2px;
    }
    .login-bottom{
        width: 250px;
        text-align: center;
        margin-left: 25px;
        .icon{
            padding-right: 20px;
        }
    }
</style>
