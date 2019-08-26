<template>
    <el-menu text-color="#666666" :default-active="$route.path"
active-text-color="#ea705b" background-color="#ffffff" class="el-menu-demo top" router="true" mode="horizontal" @select="handleSelect">
    <i class="icon iconfont icon-vue-jian"></i>
    <el-menu-item index="/home" class="home"><font-awesome-icon icon="home" style="margin-top:3px;margin-right:3px"></font-awesome-icon><span class="hide">首页</span></el-menu-item>
    <el-menu-item index="/message" style="font-size:18px;"><font-awesome-icon :icon="['far','bell']" style="margin-top:2px;margin-right:3px"></font-awesome-icon><span class="hide">消息</span></el-menu-item>
    <el-menu-item index="/attention" style="font-size:18px;"><font-awesome-icon :icon="['far','heart']" style="margin-top:3px;margin-right:3px;color:#666666;font-weight:bold"></font-awesome-icon><span class="hide">关注</span></el-menu-item>
    <el-autocomplete class="inline-input search" :fetch-suggestions="querySearchAsync"
    v-model="searchQuery" placeholder="搜索" suffix-icon="el-icon-search" :class="{focus_search:searchFocus}"
    @focus="changeStyle" @blur="resumeStyle"/>
    <el-submenu index="/mine" class="mine" v-if="isLogin">
        <template slot="title"><img class="head_img" :src="imgUrl"/></template>
        <el-menu-item index="4-1" style="height:40px;font-size:14px;"><i class="icon iconfont icon-vue-mine" style="margin-right:15px;color:#ea705b;font-size:20px;"></i>我的主页</el-menu-item>
        <el-menu-item index="4-2" style="height:40px;font-size:14px;"><i class="icon iconfont icon-vue-collection" style="margin-right:14px;color:#ea705b;font-size:21px;"></i>收藏的文章</el-menu-item>
        <el-menu-item index="4-3" style="height:40px;font-size:14px;"><i class="icon iconfont icon-vue-love" style="margin-right:15px;color:#ea705b;font-size:20px;"></i>喜欢的文章</el-menu-item>
        <el-menu-item index="/settings/information" style="height:40px;font-size:14px;"><i class="icon iconfont icon-vue-setting" style="margin-right:15px;color:#ea705b;font-size:20px;"></i>设置</el-menu-item>
        <el-menu-item index="4-5" @click="logout" style="height:40px;font-size:14px;"><i class="icon iconfont icon-vue-exit" style="margin-right:15px;color:#ea705b;font-size:20px;"></i>注销</el-menu-item>
    </el-submenu>
    <span v-if="!isLogin" class="login">
        <router-link to="sign-in"><el-button round plain type="info" size="small">登录</el-button></router-link>
        <router-link to="sign-up"><el-button round plain type="success" size="small" style="width:80px">注册</el-button></router-link>
    </span>
    <router-link to="/writer"><el-button icon="icon-vue-xiezuo" class="writer">&nbsp;<span class="writer_font">写文章</span></el-button></router-link>
</el-menu>
</template>

<script>
import { RECORD_TOKEN } from '@/store/mutation-types'
export default {
    data () {
        return {
            activeIndex: null,
            searchFocus: false, // 搜索框是否获取焦点
            searchQuery: '', // 搜索框内容
            restaurants: [], // 动态列表
            timeout: null, // 超时时间
            imgUrl: this.$store.state.imgUrl // 头像地址
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
    watch: {
        $route () {
            this.handleSelect(this.activeIndex)
        }
    },
    methods: {
        handleSelect (index) {
            this.activeIndex = index
        },
        setImgUrl () {
            this.imgUrl = this.$store.state.imgUrl
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
    .top{
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 5;
    }
    .search{
        padding-top: 20px;
        margin-left: 100px;
        width: 15vw;
        @media screen and(max-width:1000px) {
            margin-left: 30px;
            width: 15vw;
        }
        @media screen and(max-width:500px) {
            display: none;
        }
    }
    .focus_search{
        width: 20vw;
    }
    .icon-vue-jian{
        position: absolute;
        left:10vw;
        top: 1vh;
        @include sc(70px,#ea705b);
        @media screen and(max-width:1000px) {
            left:0;
            top: 1vh;
        }
    }
    .home{
        margin-left: 20%;
        font-size: 36px;
        @media screen and(max-width:1000px) {
            margin-left: 70px;
        }
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
        @media screen and(max-width:500px) {
            width: 100px;
            height: 80px;
            margin-top: 10px;
        }
        .writer_font{
            color: #ffffff;
            @media screen and(max-width:500px) {
                display: none;
            }
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
        @media screen and(max-width:1000px) {
            right: 25vw;
        }
        @media screen and(max-width:500px) {
            right: 18vw;
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
        &:hover{
            color: #ea705b;
        }
    }
    @media screen and(max-width: 1000px) {
        .hide{
            display: none;
        }
    }
</style>
