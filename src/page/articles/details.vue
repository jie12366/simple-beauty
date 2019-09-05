<template>
    <div>
        <sidebar :name="userInfo.nickName" :headUrl="userInfo.headPath" :articles="userInfo.articles"
            :likes="userInfo.likes" :fans="userInfo.fans" :attentions="userInfo.attentions" :uid="userInfo.uid">
        </sidebar>
        <div class="top" @click="changeImg">
            <el-image class="top-img" :src="bgList[index]" fit="cover"></el-image>
        </div>
        <div class="main" id="main">
            <vue-canvas-nest :config="{color:'161,102,220',opacity:0.8}" :el="'#main'"></vue-canvas-nest>
            <div class="main-top">
                <span class="title">{{article.title}}</span>
                <div style="margin-top:20px;">
                    <span class="date"><i class="icon iconfont icon-vue-date"></i><router-link to="">{{articleTime}}</router-link></span>
                    <span class="category"><i class="icon iconfont icon-vue-category1"></i><router-link :to="`/${this.userInfo.nickName}/${this.uid}/category/${article.category}`">{{article.category}}</router-link></span>
                    <i class="icon iconfont icon-vue-read"></i><span class="reads">{{article.reads}}</span>
                </div>
                <div class="tag">
                    <i class="icon iconfont icon-vue-tag1"></i>
                    <span @click="toTagNotes(item.tag)" :key="index" v-for="(item,index) in article.tags">
                        <span>{{item.tag}}</span>
                    </span>
                </div>
            </div>
            <div class="content-main">
                <div class="content" v-html="articleDetail.contentHtml"></div>
                <div class="content-bottom">
                    <span class="like">
                        <i class="icon iconfont icon-vue-like"></i><span>{{article.likes}}</span>
                    </span>
                    <span class="collect">
                        <i class="icon iconfont icon-vue-shoucang"></i><span>{{article.comments}}</span>
                    </span>
                </div>
            </div>
            <div class="directory" :style="{top:dirTop}" v-if="!hideDirectory">
                <div :key="index" v-for="(item,index) in directory">
                    <div class="title" @click="toTitle(item.id, index)" :class="{active : index === isActive}" v-if="item.h2">{{item.h2}}</div>
                    <div class="title" @click="toTitle(item.id, index)" :class="{active : index === isActive}" v-if="item.h3" style="margin-left:15px;">{{item.h3}}</div>
                </div>
            </div>
            <comment id="comment" :width="width" :defaultOpen="defaultOpen" :aid="aid" :uid="article.uid" class="comment"></comment>
        </div>
    </div>
</template>
<script>
import vueCanvasNest from 'vue-canvas-nest'
import sidebar from '@components/common/sidebar'
import comment from '@components/common/comment'
import moment from 'moment'
import hljs from 'highlight.js'
import 'highlight.js/styles/atelier-lakeside-dark.css'
const highlightCode = () => {
    // 使用highlightjs高亮代码(所有pre和code标签)
    const preEl = document.querySelectorAll('pre')
    preEl.forEach((el) => {
        hljs.highlightBlock(el)
    })
}
export default {
    data () {
        return {
            articleDetail: '', // 文章内容
            article: '', // 文章数据
            directory: [], // 目录集合
            hideDirectory: false, // 是否隐藏目录
            isActive: 0, // 当前激活项
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
            index: 2, // 默认背景图片索引
            userInfo: '', // 用户信息
            dirTop: '500px', // 目录到顶部距离
            screenWidth: document.body.clientWidth, // 屏幕宽度
            screenHeight: window.screen.height, // 屏幕高度
            width: '50%',
            defaultOpen: '',
            confirmPwd: this.$route.query.pwd,
            myUid: this.$store.state.uid // 登录账号
        }
    },
    props: [
        'uid', // 用户id
        'aid' // 文章id
    ],
    created () {
        this.getArticle()
        this.getArticleDetail()
    },
    mounted () {
        this.getUsersInfo()
        highlightCode()
        // 监听滚动
        window.addEventListener('scroll', () => {
            this.scrollTop = document.documentElement.scrollTop ||
                window.pageYOffset || document.body.scrollTop ||
                document.querySelector(this.el).scrollTop
            if (this.scrollTop > 300) {
                this.dirTop = '50px'
            } else {
                this.dirTop = '500px'
            }
        }, true)
        const that = this
        // 监听屏幕宽度变化
        window.onresize = () => {
            return (() => {
                that.screenWidth = document.documentElement.clientWidth
            })()
        }
        if (this.screenWidth < 1100) {
            this.width = '90%'
            this.defaultOpen = 'edit'
        }
    },
    computed: {
        articleTime () {
            return moment(this.article.articleTime).format('YYYY-MM-DD')
        }
    },
    watch: {
        // 监听屏幕宽度
        screenWidth (val) {
            this.screenWidth = val
            if (this.screenWidth < 1300 && this.screenWidth > 900) {
                this.sideTop = '450px'
            } else {
                this.sideTop = '650px'
            }
            if (this.screenWidth < 1100) {
                this.width = '90%'
                this.defaultOpen = 'edit'
            } else {
                this.width = '50%'
                this.defaultOpen = ''
            }
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
                this.articleDetail = res.data
                this.directory = res.data.directory
                console.log(res.data)
                if (this.directory.length === 0) {
                    this.hideDirectory = true
                }
            })
        },
        // 获取文章数据
        getArticle () {
            this.$api.articles.getArticle(this.aid)
            .then(res => {
                this.article = res.data
                document.title = this.article.title
                if (this.article.pwd !== '') {
                    // 如果不是我的账号且密码错误
                    if (this.article.pwd !== this.confirmPwd && this.uid !== this.myUid) {
                        this.$router.replace({name: 'articlesPwd', params: {pwd: this.article.pwd}, query: {redirect: this.$route.fullPath}})
                    }
                }
            })
        },
        // 获取用户信息
        getUsersInfo () {
            this.$api.user.getUsersInfo(this.uid)
            .then(res => {
                console.log(res.data)
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
        },
        toTagNotes (tag) {
            this.$router.push(`/${this.userInfo.nickName}/${this.uid}/tag/${tag}`)
        }
    },
    components: {
        sidebar,
        vueCanvasNest,
        comment
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
            a{
                color:#666;
            }
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
            span{
                color: #409EFF;
                &:hover{
                    cursor: pointer;
                    color: #ea705b;
                }
            }
        }
        .icon-vue-read{
                @include sc(50px,#909399);
                position: relative;
                margin-left: 20px;
                top: 8px;
                margin-right: 3px;
                &:hover{
                    color:rgb(234, 112, 91);
                    cursor: pointer;
                }
            }
        .reads{
            @include sc(27px,#909399);
        }
        a{
            color: #409EFF;
            text-decoration: none;
            &:hover{
                color: #ea705b;
            }
        }
    }
    .content-main{
        width: 59%;
        margin: auto;
        font-weight: 349;
        @include sc(30px,#303133);
        @media screen and (max-width: 1300px) {
            width: 65%;
            margin-right: 300px;
            @include sc(32px,#303133);
        }
        @media screen and (max-width: 1100px) {
            margin-left: 100px;
            width: 80%;
            @include sc(30px,#303133);
        }
        @media screen and (max-width: 900px) {
            margin-left: 100px;
            width: 84%;
            @include sc(25px,#303133);
        }
        @media screen and (max-width: 500px) {
            padding-left: 15px;
            padding-right: 15px;
            margin:auto;
            width: 95%;
            @include sc(25px,#303133);
        }
        .content{
            padding-left: 60px;
            padding-right: 60px;
            padding-top: 30px;
            padding-bottom: 50px;
            background-color: #f8fbfd;
            /*改变渲染的html内容中的样式*/
                /deep/ h2{
                    border-bottom: 2px solid #cccccc;
                }
                /deep/ h3{
                    font-weight:bold;
                    background-color: #f6f6f6;
                    margin:20px 0;
                    border-bottom: 0px solid #12b4f0;
                    padding: 5px 12px;
                    border-left: 5px solid #24b4f0;
                    margin:12px 0px;
                }
                /deep/ code{
                    color: #6666CC;
                    font-size: 40px;
                }
                /deep/ pre code{
                    font-size: 34px;
                    @media screen and (max-width: 900px) {
                        font-size: 25px;
                    }
                }
                /deep/ a{
                    color: #99CCFF;
                }
            /deep/ img{
                max-width:100%;
                padding-top: 20px;
                padding-bottom: 20px;
            }
        }
        .content-bottom{
            width: 100%;
            height:200px;
            span{
                    position: relative;
                    @include sc(30px,#C0C4CC);
                    left:3px;
                    top:-4px;
                }
                .like{
                    position: relative;
                    top:50px;
                    left:5%;
                    .icon-vue-like{
                        @include sc(45px,#909399);
                        position: relative;
                        right: 0;
                        &:hover{
                            color:rgb(234, 112, 91);
                            cursor: pointer;
                        }
                    }
                }
                .collect{
                    position: relative;
                    top:50px;
                    left:90%;
                    @media screen and(max-width: 1100px) {
                        left:80%;
                    }
                    .icon-vue-shoucang{
                        @include sc(40px,#909399);
                        &:hover{
                            color:rgb(234, 112, 91);
                            cursor: pointer;
                        }
                    }
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
        overflow:auto;
        border-left: 1px #909399 solid;
        padding-left: 15px;
        .title{
            margin-top: 10px;
        }
        div,p{
            @include sc(28px,#909399);
            &:hover{
                color:rgb(234, 112, 91);
                cursor: pointer;
            }
            .active{
                color:rgb(234, 112, 91) !important;
            }
        }
        @media screen and(max-width: 1100px) {
            display: none;
        }
    }
    .comment{
        overflow:hidden;
    }
}
</style>
