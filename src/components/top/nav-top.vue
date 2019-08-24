<template>
    <el-menu text-color="#666666"
active-text-color="#ea705b" background-color="#ffffff" class="el-menu-demo" mode="horizontal">
    <i class="icon iconfont icon-vue-jian"></i>
    <el-menu-item index="1" style="margin-left: 20%;font-size:18px;"><router-link to="/home"><font-awesome-icon icon="home" style="margin-top:-3px;margin-right:3px"></font-awesome-icon>首页</router-link></el-menu-item>
    <el-menu-item index="2" style="font-size:18px;"><router-link to="/home"><font-awesome-icon :icon="['far','bell']" style="margin-top:-3px;margin-right:3px"></font-awesome-icon>消息</router-link></el-menu-item>
    <el-menu-item index="3" style="font-size:18px;"><router-link to="/home"><i class="icon iconfont icon-vue-attention" style="margin-top:-3px;margin-right:3px;color:#666666;font-weight:bold"></i>关注</router-link></el-menu-item>
    <el-autocomplete class="inline-input search" :fetch-suggestions="querySearchAsync"
    v-model="searchQuery" placeholder="搜索" suffix-icon="el-icon-search" :class="{focus_search:searchFocus}"
    @focus="changeStyle" @blur="resumeStyle"/>
    <el-submenu index="4" class="mine" v-if="isLogin">
        <template slot="title"><img class="head_img" :src="imgUrl"/></template>
        <el-menu-item index="4-1"><router-link to="/mine"><i class="icon iconfont icon-vue-mine" style="margin-right:10px;color:#ea705b;"></i>我的主页</router-link></el-menu-item>
        <el-menu-item index="4-2"><i class="icon iconfont icon-vue-collection" style="margin-right:10px;color:#ea705b;"></i>收藏的文章</el-menu-item>
        <el-menu-item index="4-3"><i class="icon iconfont icon-vue-love" style="margin-right:10px;color:#ea705b;"></i>喜欢的文章</el-menu-item>
        <el-menu-item index="4-4"><router-link to="/settings/information"><i class="icon iconfont icon-vue-setting" style="margin-right:10px;color:#ea705b;"></i>设置</router-link></el-menu-item>
        <el-menu-item index="4-5" @click="logout"><i class="icon iconfont icon-vue-exit" style="margin-right:10px;color:#ea705b;"></i>注销</el-menu-item>
    </el-submenu>
    <span v-if="!isLogin" class="login">
        <el-button round plain type="info" size="small">登录</el-button>
        <el-button round plain type="success" size="small" style="width:80px">注册</el-button>
    </span>
    <el-button icon="icon-vue-xiezuo" class="writer"><router-link to="/writer">&nbsp;<span style="color:#ffffff">写文章</span></router-link></el-button>
</el-menu>
</template>

<script>
import { RECORD_TOKEN } from '@/store/mutation-types'
const jwt = require('jsonwebtoken')
export default {
    data () {
        return {
            searchFocus: false, // 搜索框是否获取焦点
            searchQuery: '', // 搜索框内容
            restaurants: [], // 动态列表
            timeout: null, // 超时时间
            imgUrl: null // 头像地址
        }
    },
    computed: {
        isLogin: function () {
            if (this.$store.state.token) {
                return true
            } else {
                return false
            }
        }
    },
    mounted () {
        this.getUsersInfo()
    },
    methods: {
        getUsersInfo () {
            let token = this.$store.state.token
            let uid = jwt.decode(token).aud
            this.$api.user.getUsersInfo(uid)
            .then(res => {
                this.imgUrl = res.data.headPath
            })
        },
        // 改变搜索框样式
        changeStyle () {
            this.searchFocus = true
        },
        resumeStyle () {
            this.searchFocus = false
        },
        // 异步动态搜索
        querySearchAsync (queryString, cb) {
            var restaurants = this.restaurants
            var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants
            clearTimeout(this.timeout)
            this.timeout = setTimeout(() => {
                cb(results)
            }, 3000 * Math.random())
        },
        // 过滤搜索的结果
        createStateFilter (queryString) {
            return (searchQuery) => {
                return (searchQuery.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
            }
        },
        logout () {
            // 移除token
            this.$store.commit(RECORD_TOKEN, null)
            window.localStorage.removeItem('token')
            location.reload()
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '../../style/mixin.scss';
    .search{
        padding-top: 20px;
        margin-left: 100px;
        width: 15vw;
    }
    .focus_search{
        width: 20vw;
    }
    .icon-vue-jian{
        position: absolute;
        left:10vw;
        top: 1vh;
        @include sc(70px,#ea705b);
    }
    .writer{
        position: absolute;
        right:5vw;
        top:1vh;
        background-color: #f1967f;
        border-radius: 50px;
        @include sc(30px,azure);
        &:hover{
            background-color:#ea705b;
        }
    }
    .mine{
        position: absolute;
        right: 15vw;
        top:0vh;
        .head_img{
            width: 80px;
            height: 80px;
            border-radius: 50%;
        }
    }
    .login{
        position: absolute;
        right: 15vw;
        top:30px;
    }
    a{
        color: #666666;
        text-decoration: none;
        &:visited{
            color:#666666;
        }
    }
</style>
