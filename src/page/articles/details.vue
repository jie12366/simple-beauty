<template>
    <div>
        <sidebar :name="userInfo.nickName"></sidebar>
        <div class="top" @click="changeImg">
            <el-image class="top-img" :src="bgList[index]" fit="cover"></el-image>
        </div>
        <div class="main" id="main">
            <vue-canvas-nest :config="{color:'161,102,220',opacity:0.8}" :el="'#main'"></vue-canvas-nest>
            <div class="content">
                <span v-html="articleDetail.contentHtml"></span>
            </div>
        </div>
    </div>
</template>
<script>
import vueCanvasNest from 'vue-canvas-nest'
import sidebar from '@components/common/sidebar'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
const highlightCode = () => {
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
            userInfo: ''
        }
    },
    props: [
        'uid', // 用户id
        'aid' // 文章id
    ],
    mounted () {
        this.getArticle()
        this.getArticleDetail()
        this.getUsersInfo()
        highlightCode()
    },
    updated () {
        highlightCode()
    },
    methods: {
        // 获取文章内容
        getArticleDetail () {
            this.$api.articles.getArticleByAid(this.aid)
            .then(res => {
                this.articleDetail = res.data
            })
        },
        getArticle () {
            this.$api.articles.getArticle(this.aid)
            .then(res => {
                this.article = res.data
                document.title = this.article.title
            })
        },
        getUsersInfo () {
            this.$api.user.getUsersInfo(this.uid)
            .then(res => {
                this.userInfo = res.data
            })
        },
        changeImg () {
            // 获取0-14的随机数，随机切换图片
            this.index = Math.round(Math.random() * 14)
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
            width: 75%;
            @include sc(25px,#666);
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
            /deep/ h5{
                font-weight:bold;
                background-color: #f6f6f6;
                margin:20px 0;
                border-bottom: 0px solid #12b4f0;
                padding: 5px 12px;
                border-left: 5px solid #24b4f0;
                margin:12px 0px;
            }
        }
    }
    @media screen and (max-width: 1300px) {
            top: 600px;
        }
}
</style>
