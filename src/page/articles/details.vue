<template>
    <div>
        <sidebar :name="userInfo.nickName"></sidebar>
        <div class="top" @click="changeImg">
            <el-image class="top-img" :src="bgList[index]" fit="cover"></el-image>
        </div>
        <div class="main" id="main">
            <vue-canvas-nest :config="{color:'161,102,220',opacity:0.8}" :el="'#main'"></vue-canvas-nest>
            <div class="main-top">
                <span class="title">{{article.title}}</span>
                <div style="margin-top:20px;">
                    <span class="date"><i class="icon iconfont icon-vue-date"></i><router-link to="">{{articleTime}}</router-link></span>
                    <span class="category"><i class="icon iconfont icon-vue-category1"></i><router-link to="">{{article.category}}</router-link></span>
                </div>
                <div class="tag">
                    <i class="icon iconfont icon-vue-tag1"></i>
                    <router-link to=""><span :key="index" v-for="(item,index) in article.tags">
                        {{item}}
                    </span></router-link>
                </div>
            </div>
            <div class="content">
                <div id="content" v-html="articleDetail.contentHtml"></div>
            </div>
            <div class="directory" :style="{top:top}">
                <span>文章目录</span><br/>
                <div :key="index" v-for="(item,index) in directory">
                    <p @click="toTitle(item.id, index)" :class="{active : index === isActive}" v-if="item.h2">{{item.h2}}</p>
                    <p @click="toTitle(item.id, index)" :class="{active : index === isActive}" v-if="item.h3" style="margin-left:20px;">{{item.h3}}</p>
                </div>
            </div>
            <div class="comment">

            </div>
        </div>
    </div>
</template>
<script>
import vueCanvasNest from 'vue-canvas-nest'
import sidebar from '@components/common/sidebar'
import moment from 'moment'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
const highlightCode = () => {
    // 使用highlightjs高亮代码
    const preEl = document.querySelectorAll('pre')
    preEl.forEach((el) => {
        hljs.highlightBlock(el)
    })
}
export default {
    data () {
        return {
            articleDetail: '',
            article: '',
            directory: [],
            isActive: 0,
            bgList: [
                require('@/images/bg/scenery1.jpg'),
                require('@/images/bg/scenery2.jpg'),
                require('@/images/bg/scenery3.jpg'),
                require('@/images/bg/scenery4.jpg'),
                require('@/images/bg/scenery5.jpg'),
                require('@/images/bg/scenery6.jpg'),
                require('@/images/bg/scenery7.jpg'),
                require('@/images/bg/scenery8.jpg'),
                require('@/images/bg/scenery9.jpg'),
                require('@/images/bg/scenery10.jpg'),
                require('@/images/bg/scenery11.jpg'),
                require('@/images/bg/scenery12.jpg'),
                require('@/images/bg/scenery13.jpg'),
                require('@/images/bg/scenery14.jpg'),
                require('@/images/bg/scenery15.jpg')
            ],
            index: 2,
            userInfo: '',
            top: '400px'
        }
    },
    props: [
        'uid', // 用户id
        'aid' // 文章id
    ],
    created () {
        this.getArticleDetail()
    },
    mounted () {
        this.getArticle()
        this.getUsersInfo()
        highlightCode()
        // 监听滚动
        window.addEventListener('scroll', () => {
            this.scrollTop = document.documentElement.scrollTop ||
                window.pageYOffset || document.body.scrollTop ||
                document.querySelector(this.el).scrollTop
            if (this.scrollTop > 300) {
                this.top = '50px'
            } else {
                this.top = '400px'
            }
        }, true)
    },
    computed: {
        articleTime () {
            return moment(this.article.articleTime).format('YYYY-MM-DD')
        }
    },
    updated () {
        highlightCode()
    },
    methods: {
        // 获取文章内容
        getArticleDetail () {
            this.$api.articles.getArticleByAid(this.aid)
            .then(res => {
                this.articleDetail = res.data.detail
                this.directory = res.data.directory
            })
        },
        // 获取文章数据
        getArticle () {
            this.$api.articles.getArticle(this.aid)
            .then(res => {
                this.article = res.data
                document.title = this.article.title
            })
        },
        // 获取用户信息
        getUsersInfo () {
            this.$api.user.getUsersInfo(this.uid)
            .then(res => {
                this.userInfo = res.data
            })
        },
        changeImg () {
            // 获取0-14的随机数，随机切换图片
            this.index = Math.round(Math.random() * 14)
        },
        // 导航到对应的目录标题
        toTitle (id, index) {
            var element = document.getElementById(id)
            this.isActive = index
            element.scrollIntoView({block: 'start', behavior: 'smooth'})
        }
    },
    components: {
        sidebar,
        vueCanvasNest
    }
}
</script>
<style lang="scss" scoped>
@import '../../style/mixin.scss';
.top{
    position: absolute;
    left: 0;
    top: 0;
    .top-img{
        background-repeat: no-repeat;
        background-size: 100% 100%;
        @include wh(100vw, 900px);
        @media screen and (max-width: 1300px) {
            @include wh(100vw, 600px);
        }
    }
}
.main{
    position: relative;
    top: 900px;
    width: 100%;
    .main-top{
        width: 100%;
        height:300px;
        margin: auto;
        padding-top: 30px;
        text-align:center;
        .title{
            @include sc(50px,#000);
        }.icon-vue-date{
            padding-right: 10px;
            color:#606266;
        }.date{
            @include sc(32px,#666);
        }.icon-vue-category1{
            padding-right: 10px;
            padding-left: 60px;
            color:#606266;
        }.category{
            @include sc(32px,#666);
        }.icon-vue-tag1{
            padding-right: 10px;
            color: #E6A23C;
        }.tag{
            position: relative;
            margin-top: 25px;
            @include sc(30px,#666);
        }
        a{
            color: #409EFF;
            text-decoration: none;
        }
    }
    .content{
        padding-left: 60px;
        padding-right: 60px;
        padding-top: 30px;
        background-color: #f8fbfd;
        width: 55%;
        margin: auto;
        @include sc(35px,#666);
        @media screen and (max-width: 1300px) {
            @include sc(30px,#666);
        }
        @media screen and (max-width: 1300px) {
            width: 60%;
            margin-right: 300px;
            @include sc(35px,#666);
        }
        @media screen and (max-width: 500px) {
            padding-left: 30px;
            padding-right: 30px;
            width: 90%;
            @include sc(24px,#666);
        }
        span{
            /deep/ h4{
                font-weight:bold;
                background-color: #f6f6f6;
                margin:20px 0;
                border-bottom: 0px solid #12b4f0;
                padding: 5px 12px;
                border-left: 5px solid #24b4f0;
                margin:12px 0px;
            }
            /deep/ h2{
                font-weight:bold;
                background-color: #f6f6f6;
                margin:20px 0;
                border-bottom: 0px solid #12b4f0;
                padding: 5px 12px;
                border-left: 5px solid #24b4f0;
                margin:12px 0px;
            }
            /deep/ img{
                width: 100%;
            }
        }
    }
    @media screen and (max-width: 1300px) {
            top: 600px;
        }
    .directory{
        position: fixed;
        left: 40px;
        width: 500px;
        span{
            @include sc(35px,#666);
            margin-bottom:30px;
        }
        div,p{
            @include sc(30px,#84C1FF);
            &:hover{
                color:rgb(234, 112, 91);
                cursor: pointer;
            }
            .active{
                color:rgb(234, 112, 91) !important;
            }
        }
        @media screen and(max-width: 800px) {
            display: none;
        }
    }
    .comment{
        width:100%;
    }
}
</style>
