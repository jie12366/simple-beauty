<template>
    <mine :uid="uid">
        <div>
            <span class="title">关于我</span>
            <div class="main">
                <div class="left">
                    <div><i class="icon iconfont icon-vue-name"></i>name：{{name}}</div>
                    <div><i class="icon iconfont icon-vue-email1"></i>email：{{email}}</div>
                    <div><i class="icon iconfont icon-vue-github"></i>github：<a :href="git" class="github">{{github}}</a></div>
                    <div><i class="icon iconfont icon-vue-qq"></i>qq：{{qq}}</div>
                </div>
                <div class="right">
                    <div><i class="icon iconfont icon-vue-introduce">introduction</i>
                    <div class="content">{{introduction}}</div>
                    </div>
                </div>
            </div>
        </div>
    </mine>
</template>
<script>
import mine from '@components/common/mine'
export default {
    data () {
        return {
            name: '',
            email: '',
            github: '',
            git: '',
            qq: '',
            introduction: '',
            uid: parseInt(this.$route.params.uid)
        }
    },
    created () {
        this.get()
    },
    watch: {
        github (val) {
            this.git = `https://github.com/${val}`
        }
    },
    methods: {
        get () {
            this.$api.manage.getIntroduce(this.uid)
            .then(res => {
                console.log(res)
                if (res.code === 1) {
                    let info = res.data
                    this.name = info.name
                    this.email = info.email
                    this.github = info.github
                    this.qq = info.qq
                    this.introduction = info.introduction
                    this.method = 'put'
                } else if (res.code === 50001) {
                    this.method = 'post'
                }
            })
        }
    },
    components: {
        mine
    }
}
</script>
<style lang="scss" scoped>
@import '../../style/mixin.scss';
.title{
    position: relative;
    left: 45%;
    text-align: center;
    @include sc(50px,#303133)
}
.main{
    margin-top:30px;
    background-color: #f8fbfd;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .left{
        width: 35%;
        position: relative;
        left: 20%;
        @media screen and(max-width: 600px) {
            width: 100%;
            left: 0;
        }
        i{
            color: #303133;
            margin-right: 20px;
        }
        .icon-vue-github{
            font-size:50px;
            margin-right: 0px;
        }
        .icon-vue-qq{
            font-size:45px;
            margin-left: -5px;
            margin-right: 10px;
        }
        a{
            color: #666666;
            text-decoration: none;
            &:hover{
                text-decoration:underline;
                color: #FF9900;
            }
        }
        @include sc(40px, #666666);
    }
    .right{
        width: 30%;
        height: auto;
        position: relative;
        left: 25%;
        @media screen and(max-width: 600px) {
            width: 100%;
            top: 50px;
            left: 0;
        }
        .icon-vue-introduce{
            color: #303133;
            font-size:40px;
            margin-right: 0px;
            display: block;
        }
        .content{
            @include sc(32px, #666666);
            position: relative;
            top: 20px;
        }
    }
}
</style>
