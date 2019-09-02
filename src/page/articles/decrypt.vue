<template>
    <div class="container">
        <div class="text">请输入密码继续阅读</div>
        <div class="input">
            <el-input v-model="confirmPwd" @keyup.enter.native="comfirm"></el-input>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            pwd: this.$route.params.pwd,
            path: this.$route.query.redirect,
            confirmPwd: ''
        }
    },
    methods: {
        comfirm () {
            if (this.pwd === this.confirmPwd) {
                this.$router.replace(`${this.path}?pwd=${this.confirmPwd}`)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.container{
    width: 30%;
    margin:auto;
    @media screen and(max-width: 900px) {
        width: 50%;
    }
    .text{
        text-align: center;
        padding-top: 200px;
        font-size: 45px;
        color: #333366;
    }
    .input{
        padding-top: 200px;
    }
}
</style>
