<template>
    <el-menu text-color="#666666" :default-active="$route.path"
active-text-color="#ea705b" background-color="#ffffff" class="el-menu-demo top" router mode="horizontal" @select="handleSelect">
    <router-link to="/home"><span class="logo">Canary</span></router-link>
    <el-menu-item index="/home" v-if="!smallScreen" class="home"><font-awesome-icon icon="home" style="margin-top:3px;margin-right:3px"></font-awesome-icon><span class="hide">首页</span></el-menu-item>
    <el-badge :is-dot="tip"><el-menu-item index="/message/like" v-if="!smallScreen" style="font-size:18px;"><font-awesome-icon :icon="['far','bell']" style="margin-top:2px;margin-right:3px"></font-awesome-icon><span class="hide">消息</span></el-menu-item></el-badge>
    <el-menu-item index="/attention" v-if="!smallScreen" style="font-size:18px;"><font-awesome-icon :icon="['far','heart']" style="margin-top:3px;margin-right:3px;color:#666666;font-weight:bold"></font-awesome-icon><span class="hide">关注</span></el-menu-item>
    <el-autocomplete class="inline-input search" :fetch-suggestions="querySearchAsync"
    v-model="searchQuery" placeholder="搜索" suffix-icon="el-icon-search" :class="{focus_search:searchFocus}"
    @focus="changeStyle" @blur="resumeStyle"/>
    <el-submenu class="mine" v-if="isLogin && !smallScreen" trigger="click">
        <template slot="title"><img class="head_img" :src="imgUrl"/></template>
        <el-menu-item :index="`/${this.account}/${this.uid}/index?`" style="height:40px;font-size:14px;"><i class="icon iconfont icon-vue-mine" style="margin-right:15px;color:#ea705b;font-size:20px;"></i>我的主页</el-menu-item>
        <el-menu-item index="4-2" style="height:40px;font-size:14px;"><i class="icon iconfont icon-vue-collection" style="margin-right:14px;color:#ea705b;font-size:21px;"></i>喜欢的文章</el-menu-item>
        <el-menu-item index="/manage/articles-list" style="height:40px;font-size:14px;"><i class="icon iconfont icon-vue-setting" style="margin-right:15px;color:#ea705b;font-size:20px;"></i>管理博客</el-menu-item>
        <el-menu-item :index="`/${this.account}/information`" style="height:40px;font-size:14px;"><i class="icon iconfont icon-vue-setting" style="margin-right:15px;color:#ea705b;font-size:20px;"></i>设置</el-menu-item>
        <el-menu-item @click="logout" style="height:40px;font-size:14px;"><i class="icon iconfont icon-vue-exit" style="margin-right:15px;color:#ea705b;font-size:20px;"></i>注销</el-menu-item>
    </el-submenu>
    <!--移动端导航栏-->
    <el-dropdown v-if="smallScreen && isLogin"  class="small_mine" placement="bottom-end" @command="handleCommand" trigger="click">
        <img class="head_img" :src="imgUrl" />
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="/home"><i class="icon iconfont icon-vue-index" style="margin-right:12px;color:#ea705b;font-size:20px;"></i>首页</el-dropdown-item>
                <el-dropdown-item command="/message/like"><i class="icon iconfont icon-vue-message" style="margin-right:14px;color:#ea705b;font-size:21px;"></i><el-badge :value="num">消息</el-badge></el-dropdown-item>
                <el-dropdown-item command="/attention"><i class="icon iconfont icon-vue-attention" style="margin-right:15px;color:#ea705b;font-size:20px;"></i>关注</el-dropdown-item>
                <el-dropdown-item :command="`/${this.account}/${this.uid}/index?`"><i class="icon iconfont icon-vue-mine" style="margin-right:15px;color:#ea705b;font-size:20px;"></i>我的主页</el-dropdown-item>
                <el-dropdown-item command="4-2"><i class="icon iconfont icon-vue-collection" style="margin-right:14px;color:#ea705b;font-size:21px;"></i>喜欢的文章</el-dropdown-item>
                <el-dropdown-item command="/manage/articles-list" style="height:40px;font-size:14px;"><i class="icon iconfont icon-vue-setting" style="margin-right:15px;color:#ea705b;font-size:20px;"></i>管理博客</el-dropdown-item>
                <el-dropdown-item :command="`/${this.account}/information`"><i class="icon iconfont icon-vue-setting" style="margin-right:15px;color:#ea705b;font-size:20px;"></i>设置</el-dropdown-item>
                <el-dropdown-item @click="logout" command="logout"><i class="icon iconfont icon-vue-exit" style="margin-right:15px;color:#ea705b;font-size:20px;"></i>注销</el-dropdown-item>
            </el-dropdown-menu>
    </el-dropdown>
    <!--未登录时显示-->
    <span v-if="!isLogin" class="login-contaniner">
        <div class="login">
            <router-link to="/sign-in"><span class="sign_in">登录</span></router-link>
        <router-link to="/sign-up"><el-button round plain type="success" size="small" style="width:80px">注册</el-button></router-link>
        </div>
    </span>
    <router-link to="/writer"><el-button icon="icon-vue-xiezuo" class="writer">&nbsp;<span class="writer_font">写文章</span></el-button></router-link>
</el-menu>
</template>

<script>
import { RECORD_TOKEN } from '@/store/mutation-types'
import baseURL from '../../service/base-url'
export default {
    data () {
        return {
            activeIndex: null,
            searchFocus: false, // 搜索框是否获取焦点
            searchQuery: '', // 搜索框内容
            restaurants: [], // 动态列表
            timeout: null, // 超时时间
            imgUrl: this.$store.state.imgUrl, // 头像地址
            token: this.$store.state.token,
            uid: this.$store.state.uid,
            screenWidth: document.body.clientWidth, // 屏幕宽度
            smallScreen: false,
            account: this.$store.state.account, // 用户账号
            tip: false,
            num: '',
            websock: null,
            hasConnect: false
        }
    },
    created () {
        this.initWebSocket()
    },
    mounted () {
        const that = this
        this.fitScreen()
        window.onresize = () => {
            return (() => {
                that.screenWidth = document.documentElement.clientWidth
            })()
        }
        this.getNoReads()
    },
    destroyed () {
        this.websock.close()
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
        },
        // 监听屏幕宽度
        screenWidth (val) {
            this.screenWidth = val
            if (this.screenWidth < 600) {
                this.smallScreen = true
            } else {
                this.smallScreen = false
            }
        },
        // 监听token是否存在
        token (newVal) {
            // 如果不存在就改变登录状态
            if (newVal === null) {
                this.isLogin = false
            }
        }
    },
    methods: {
        initWebSocket () { // 初始化weosocket
            let hostUrl = baseURL.substring(7) // 取出host地址，去除http://
            const wsuri = 'ws://' + hostUrl + `/webSocket/${this.uid}`
            this.websock = new WebSocket(wsuri)
            this.websock.onmessage = this.websocketonmessage
            this.websock.onopen = this.websocketonopen
            this.websock.onclose = this.websocketclose
        },
        websocketonopen () { // 连接建立之后执行send方法发送数据
            this.hasConnect = true
        },
        websocketonmessage (e) { // 数据接收
            if (e.data === 'hasRead' || e.data === 'like') {
                this.getNoReads()
            }
        },
        websocketclose (e) { // 关闭
            this.hasConnect = false
        },
        getNoReads () {
            this.$api.message.getNoReads(this.uid)
            .then(res => {
                if (res.code === 1) {
                    if (res.data > 0) {
                        this.tip = true
                        this.num = res.data
                    } else {
                        this.tip = false
                        this.num = ''
                    }
                }
            })
        },
        // 自适应屏幕
        fitScreen () {
            if (this.screenWidth < 600) {
                this.smallScreen = true
            } else {
                this.smallScreen = false
            }
        },
        handleSelect (index) {
            this.activeIndex = index
        },
        // 操作下拉菜单指令
        handleCommand (command) {
            if (command === 'exit') {
                this.$router.go(-1)
            } else if (command === 'logout') {
                // 移除token
                this.$store.commit(RECORD_TOKEN, null)
                window.localStorage.removeItem('token')
                location.reload()
            } else {
                this.$router.push(command)
            }
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
        z-index: 10;
    }
    .search{
        padding-top: 20px;
        margin-left: 100px;
        width: 15vw;
        @media screen and(max-width:800px) {
            margin-left: 30px;
            width: 20vw;
        }
        @media screen and(max-width:500px) {
            display: none;
        }
    }
    .focus_search{
        width: 20vw;
        @media screen and(max-width:800px) {
            width: 25vw;
        }
    }
    .logo{
        position: absolute;
        left:8vw;
        top: 1vh;
        @include sc(70px,#ea705b);
        @media screen and(max-width:800px) {
            left:0;
            top: 1vh;
        }
        @media screen and(max-width:500px) {
            display: none;
        }
    }
    .home{
        margin-left: 20%;
        font-size: 36px;
        @media screen and(max-width:800px) {
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
            left:5px;
            top:1vh;
            width: 220px;
            height: 80px;
        }
        .writer_font{
            color: #ffffff;
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
        @media screen and(max-width:800px) {
            right: 25vw;
        }
        @media screen and(max-width:500px) {
            left: 0vw;
            width: 25vw;
        }
    }
    .small_mine{
        position: absolute;
        right:0px;
        width: 100vw;
        height: 120px;
        background-color: #ffffff;
        .head_img{
            position: absolute;
            top:20px;
            right:30px;
            width: 80px;
            height: 80px;
            border-radius: 50%;
        }
    }
    .login-contaniner{
        @media screen and(max-width: 600px) {
            position: absolute;
            width: 100vw;
            height: 120px;
            background-color: #ffffff;
        }
    }
    .login{
        position: absolute;
        right: 15vw;
        top:30px;
        @media screen and(max-width:500px) {
            right: 8vw;
            top:1vh;
        }
        .sign_in{
            @include sc(30px,#aaaaaa);
            margin-right: 20px;
            &:hover{
                @include sc(30px,#ea705b);
            }
        }
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
    @media screen and(max-width: 800px) {
        .hide{
            display: none;
        }
    }
</style>
