<template>
    <div>
        <nav-top ref="navTop"></nav-top>
        <div class="container">
            <section>
                <img v-if="!progressFlag" class="head-img" :src="info.imageUrl" />
                <div v-show="progressFlag" class="head-img">
                    <el-progress type="circle" :percentage="progressPercent"></el-progress>
                </div>
                <el-upload class="img-btn" action="#"
    :show-file-list="false" :before-upload="beforeAvatarUpload" :http-request="uploadImg">
    <el-button type="success" plain round size="mini">更改头像</el-button></el-upload>
            </section>
            <section class="nickname">
                <span class="left-span">昵称</span>
                <el-input class="nickText" @blur="checkNickname" placeholder="请输入昵称" v-model="info.nickname"></el-input>
                <el-divider></el-divider>
            </section>
            <section>
                <span class="left-span">电子邮件</span>
                <el-button v-if="info.email === '' ? true : false" type="success" plain round size="mini" @click="showEmail=true" style="margin-left:80px">点击绑定</el-button>
                <el-dialog title="绑定邮箱" :visible.sync="showEmail" width="400px">
                    <el-form>
                        <el-input v-model="info.email" placeholder="你的常用邮箱" class="email" prefix-icon="icon-vue-email"></el-input>
                        <el-input v-model="code" @blur="checkEmailCaptcha" placeholder="验证码" style="width: 200px;" prefix-icon="icon-vue-CAPTCHA"></el-input>
                        <el-button type="info" @click="sendSmsCaptcha" :disabled="disabled" round class="times-text">{{timesText}}</el-button>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="bindEmail">确 定</el-button>
                    </div>
                </el-dialog>
                <span class="show_email" v-if="info.email === '' ? false : true">{{emailNumber}}<i class="icon iconfont icon-vue-dui"></i></span>
                <el-divider></el-divider>
            </section>
            <section>
                <span class="left-span">手机</span>
                <span class="phone">{{phoneNumber}}</span><i class="icon iconfont icon-vue-dui"></i>
                <el-divider></el-divider>
            </section>
            <section>
                <span class="left-span">博客描述</span>
                <el-input type="textarea" class="introduction" :rows="4" placeholder="你的博客描述" v-model="info.introduction"></el-input>
                <el-divider></el-divider>
            </section>
            <el-button type="success" style="width:80px;" @click="saveInfo" round size="small">保存</el-button>
        </div>
    </div>
</template>
<script>
import navTop from '@/components/navbar/nav-top'
import axios from '@/service/http'
import baseURL from '@/service/base-url'
import { SAVE_HEAD_IMG } from '@/store/mutation-types'
export default {
    data () {
        return {
            info: {
                imageUrl: this.$store.state.imgUrl, // 头像地址
                nickname: null, // 昵称
                phone: '', // 手机号
                uid: 0, // 登录用户的id
                introduction: '', // 个人简介
                email: '' // 待绑定的邮箱
            },
            showEmail: false, // 绑定邮箱的弹框
            code: '', // 邮箱验证码
            times: '0', // 倒计时
            progressFlag: false,
            progressPercent: 0,
            percentage: 0,
            disabled: false
        }
    },
    computed: {
        emailNumber: function () {
            if (this.info.email) {
                return this.info.email.substr(0, 2) + '******' + this.info.email.substring(8)
            }
        },
        phoneNumber: function () {
            if (this.info.phone) {
                return this.info.phone.substr(0, 3) + '****' + this.info.phone.substr(7, 4)
            }
        },
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
    mounted () {
        this.getUsersInfo()
    },
    methods: {
        // 获取用户信息
        getUsersInfo () {
            let uid = this.$store.state.uid
            this.$api.user.getUsersInfo(uid)
            .then(res => {
                this.copyinfo(this.info, res.data)
            })
        },
        // 把返回的数据赋值给对象
        copyinfo (info, data) {
            info.nickname = data.nickName
            info.email = data.email ? data.email : ''
            info.phone = data.phone
            info.introduction = data.introduction
            info.uid = data.uid
        },
        // 重写上传图片的方法
        uploadImg (f) {
            this.progressFlag = true
            let formdata = new FormData()
            formdata.append('image', f.file)
            formdata.append('uid', this.info.uid)
            console.log(formdata.get('uid'))
            axios({
            url: baseURL + '/headPath',
            method: 'put',
            data: formdata,
            headers: {'Content-Type': 'multipart/form-data'},
            onUploadProgress: progressEvent => {
                // progressEvent.loaded:已上传文件大小
                // progressEvent.total:被上传文件的总大小
                this.progressPercent = (progressEvent.loaded / progressEvent.total * 100)
            }
        }).then(res => {
            this.info.imageUrl = res.data.data
            this.$store.commit(SAVE_HEAD_IMG, res.data.data)
            this.$refs.navTop.setImgUrl()
            if (this.progressPercent === 100) {
                this.progressFlag = false
                this.progressPercent = 0
            }
        }).then(error => {
            console.log(error)
        })
        },
        // 上传图片前的过滤
        beforeAvatarUpload (file) {
            const isJPG = file.type === 'image/jpeg'
            const isLt2M = (file.size / 1024 / 1024) < 2

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!')
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!')
            }
            return isJPG && isLt2M
        },
        checkEmail () {
            if (!/^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/.test(this.info.email)) {
                this.$message.error('邮箱格式不合法')
                return false
            }
            return true
        },
        // 发送邮箱验证码
            sendSmsCaptcha () {
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
                    this.$api.user.sendEmailCaptcha(this.info.email)
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
        // 绑定邮箱
        async bindEmail () {
            let checkEmailCaptcha = await this.checkEmailCaptcha()
            if (checkEmailCaptcha && this.checkEmail()) {
                this.$api.user.bindEmail(this.info.email, this.info.uid)
                .then(res => {
                    this.info.email = res.data
                    this.showEmail = false
                })
            }
        },
        // 检查昵称是否被用过
        async checkNickname () {
            let res = await this.$api.user.checkNickName(this.info.nickname)
            .then(res => {
                if (res.code === 50003) {
                    this.$message.error('昵称已被使用')
                    return false
                } else if (res.code === 1) {
                    return true
                }
            })
            return res
        },
        // 保存资料
        async saveInfo () {
            let checkNickname = await this.checkNickname()
            if (checkNickname) {
                this.$api.user.updateInfo(this.info.nickname, this.info.introduction, this.info.uid)
                .then(res => {
                    if (res.code === 1) {
                        this.$message.success('保存成功')
                    }
                })
            }
        }
    },
    components: {
        navTop
    }
}
</script>

<style lang="scss" scoped>
    @import '../../style/mixin';
    .container{
        width: 1100px;
        margin: auto;
        padding-top: 150px;
        @media screen and (max-width: 800px) {
            width: 100%;
        }
        .head-img{
            width: 200px;
            height:200px;
            border-radius: 50%;
            &:hover {
                transform: rotate(666turn);
                transition-duration: 59s;
                transition-timing-function: cubic-bezier(.34, 0, .84, 1)
            }
            @media screen and (max-width: 500px) {
                width: 150px;
                height:150px;
            }
        }
        .img-btn{
            margin-top:-150px;
            margin-left: 320px;
            @media screen and (max-width: 500px) {
                margin-top:-100px;
                margin-left: 300px;
            }
        }
        .nickname{
            margin-top:150px;
        }
        .nickText{
            width: 600px;
            margin-left:240px;
            @media screen and (max-width: 1300px) {
                width: 500px;
            }
            @media screen and (max-width: 500px) {
                width: 400px;
            }
        }
        .left-span{
            @include sc(40px,#afafaf);
            @media screen and (max-width: 500px) {
                @include sc(30px,#afafaf);
            }
        }
        .phone{
            @include sc(40px,#afafaf);
            margin-left: 250px;
            @media screen and (max-width: 500px) {
                @include sc(30px,#afafaf);
                margin-left: 230px;
            }
        }
        .show_email{
            @include sc(40px,#afafaf);
            margin-left: 170px;
            @media screen and (max-width: 500px) {
                @include sc(30px,#afafaf);
            }
        }
        .icon-vue-dui{
            margin-left: 50px;
            color:#67C23A;
        }
        .email{
            @include sc(28px,#666666);
            margin-bottom: 50px;
            width: 650px;
        }
        .introduction{
            width: 600px;
            margin-left:170px;
            @media screen and (max-width: 1300px) {
                width: 500px;
                margin-left:180px;
            }
            @media screen and (max-width: 500px) {
                width: 400px;
                margin-left:180px;
            }
        }
    }
</style>
