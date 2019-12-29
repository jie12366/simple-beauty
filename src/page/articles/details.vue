<template>
    <div>
        <sidebar :name="userInfo.nickName" :headUrl="userInfo.headPath" :articles="userInfo.articles"
            :likes="userInfo.likes" :fans="userInfo.fans" :attentions="userInfo.attentions" :uid="userInfo.uid" sideImage="http://cdn.jie12366.xyz/sky.png">
        </sidebar>
        <div class="top" @click="changeImg">
            <el-image class="top-img" :src="bgList[index]" fit="cover"></el-image>
        </div>
        <div class="main" id="main">
            <!--文章标题和标签-->
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
                        <span style="padding-right:10px;">{{item.tag}}</span>
                    </span>
                </div>
            </div>
            <!--文章内容-->
            <div class="content-main">
                <div class="content" v-html="articleDetail.contentHtml"></div>
                <div class="content-bottom">
                    <span class="like">
                        <i @click="toLike" v-if="!isLike" class="icon iconfont icon-vue-like"></i>
                        <i @click="toLike" v-if="isLike" class="icon iconfont icon-vue-like islike"></i>
                        <span>{{article.likes}}</span>
                    </span>
                </div>
            </div>
            <!--目录-->
            <div class="directory" :style="{top:dirTop, height:dirHeight}" v-if="!hideDirectory">
                <div style="font-size:18px;padding-bottom:10px;">
                    <span class="text">文章目录</span>
                    <span class="close" @click="closeDirectory">x</span>
                </div>
                <div class="content" :key="index" v-for="(item,index) in directory">
                    <div class="title" @click="toTitle(item.id, index)" :class="{active : index === isActive}" v-if="item.h2">{{item.h2}}</div>
                    <div class="title" @click="toTitle(item.id, index)" :class="{active : index === isActive}" v-if="item.h3" style="padding-left:25px">{{item.h3}}</div>
                </div>
            </div>
            <div>
                <i class="icon-vue-mulu" :style="{top:dirTop}" v-if="hideDirectory" @click="showDirectory"></i>
            </div>
            <!--评论-->
            <comment id="comment" :width="width" :aid="aid" :toUid="uid" class="comment"></comment>
        </div>
    </div>
</template>
<script>
import sidebar from '@components/common/sidebar'
import comment from '@components/common/comment'
import moment from 'moment'
import Prism from 'prismjs'
import 'prismjs/themes/prism.css'
Prism.highlightAll()

export default {
    data () {
        return {
            articleDetail: '', // 文章内容
            article: '', // 文章数据
            directory: [], // 目录集合
            hideDirectory: false, // 是否隐藏目录
            isActive: 0, // 当前激活项
            bgList: [
                'http://cdn.jie12366.xyz/scenery1.jpg',
                'http://cdn.jie12366.xyz/long-bg2.jpg',
                'http://cdn.jie12366.xyz/scenery3.jpg',
                'http://cdn.jie12366.xyz/scenery4.jpg',
                'http://cdn.jie12366.xyz/scenery5.jpg',
                'http://cdn.jie12366.xyz/scenery6.jpg',
                'http://cdn.jie12366.xyz/scenery7.jpg',
                'http://cdn.jie12366.xyz/scenery8.jpg',
                'http://cdn.jie12366.xyz/scenery9.jpg',
                'http://cdn.jie12366.xyz/scenery10.jpg',
                'http://cdn.jie12366.xyz/scenery11.jpg',
                'http://cdn.jie12366.xyz/scenery12.jpg',
                'http://cdn.jie12366.xyz/scenery13.jpg',
                'http://cdn.jie12366.xyz/scenery14.jpg',
                'http://cdn.jie12366.xyz/scenery15.jpg'
            ],
            index: Math.round(Math.random() * 14), // 默认背景图片索引
            userInfo: '', // 用户信息
            dirTop: '500px', // 目录到顶部距离
            screenWidth: document.body.clientWidth, // 屏幕宽度
            screenHeight: window.screen.height, // 屏幕高度
            dirHeight: '',
            width: '50%',
            confirmPwd: this.$route.query.pwd,
            myUid: this.$store.state.uid, // 登录账号
            isLike: false,
            showCanvas: true,
            sideImage: '' // 侧边背景
        }
    },
    props: [
        'uid', // 用户id
        'aid' // 文章id
    ],
    created () {
        this.getArticle()
        this.getLike()
    },
    mounted () {
        this.getArticle()
        // 监听滚动
        window.addEventListener('scroll', () => {
            this.scrollTop = document.documentElement.scrollTop ||
                window.pageYOffset || document.body.scrollTop
            if (this.scrollTop > 300) {
                this.dirTop = '50px'
            } else {
                this.dirTop = '500px'
            }
            // 监听目录跟随
            for (let i = 0; i < this.directory.length; i++) {
                // 这里要得到top的距离和元素自身的高度
                let offsetTop = document.getElementById(this.directory[i].id).offsetTop
                let offsetHeight = document.getElementById(this.directory[i].id).offsetHeight
                // 判断页面滚动的距离是否大于当前目录的位置
                if (this.scrollTop > (offsetTop - offsetHeight * 2 + 280)) {
                    // 设置激活项
                    this.isActive = i
                }
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
            this.showCanvas = false
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
                this.showCanvas = false
            } else {
                this.width = '50%'
            }
        }
    },
    methods: {
        // 判断是否已点赞
        getLike () {
            this.$api.message.isLike(this.uid, this.aid)
            .then(res => {
                if (res.code === 1) {
                    this.isLike = true
                } else if (res.code === 50001) {
                    this.isLike = false
                }
            })
        },
        // 获取文章内容
        getArticleDetail (articleDetail) {
            this.articleDetail = articleDetail
            this.directory = articleDetail.directory
            if (this.directory.length === 0) {
                this.hideDirectory = true
            }
            if (this.directory.length > 15) {
                this.dirHeight = '500px'
            }
        },
        // 获取文章数据
        getArticle () {
            this.$api.articles.getArticle(this.aid)
            .then(res => {
                let data = res.data
                this.article = res.data
                // 设置标题
                document.title = this.article.title + ' - Canary'
                if (this.article.pwd !== '') {
                    // 如果不是我的账号且密码错误
                    if (this.article.pwd !== this.confirmPwd && this.uid !== this.myUid) {
                        this.$router.replace({name: 'articlesPwd', params: {pwd: this.article.pwd}, query: {redirect: this.$route.fullPath}})
                    }
                }
                // 设置文章内容
                this.getArticleDetail(data.articleDetail)
                // 设置用户信息
                this.userInfo = data.usersInfo
                // 设置侧边栏背景
                this.sideImage = null
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
            element.scrollIntoView({block: 'start', behavior: 'instant'})
        },
        toTagNotes (tag) {
            this.$router.push(`/${this.userInfo.nickName}/${this.uid}/tag/${tag}`)
        },
        // 点赞/取消点赞
        toLike () {
            this.$api.message.likeArticle(this.uid, this.aid)
            .then(res => {
                if (res.code === 1) {
                    this.article.likes = res.data
                    this.getLike()
                }
            })
        },
        // 关闭目录
        closeDirectory () {
            this.hideDirectory = true
        },
        // 显示目录
        showDirectory () {
            this.hideDirectory = false
        }
    },
    components: {
        sidebar,
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
        background-size: 99vw 100vh;
        @include wh(99vw, 900px);
        overflow: hidden;
        @media screen and (max-width: 1300px) {
            @include wh(98.6vw, 600px);
        }
        &:hover{
            cursor: pointer;
        }
    }
}
.main{
    position: relative;
    top: 900px;
    width: 99vw;
    margin-left: -0.5vw;
    background-color: rgba(248, 251, 253, 0.9);
    @media screen and(max-width: 1100px){
        background-color: #f8fbfd;
    }
    .main-top{
        width: 100%;
        height:320px;
        margin: auto;
        padding-top: 30px;
        text-align:center;
        .title{
            @include sc(45px,#000);
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
                color: #21a675;
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
            color: #21a675;
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
        @include sc(28px,#000);
        @media screen and (max-width: 1300px) {
            width: 65%;
            margin-right: 400px;
        }
        @media screen and (max-width: 1100px) {
            margin-left: 100px;
            width: 80%;
        }
        @media screen and (max-width: 900px) {
            margin-left: 100px;
            width: 84%;
        }
        @media screen and (max-width: 500px) {
            margin:auto;
            width: 100%;
        }
        .content{
            padding-left: 80px;
            padding-right: 80px;
            padding-top: 30px;
            padding-bottom: 50px;
            overflow: auto;
            background-color: #fff;
            @media screen and (max-width: 1100px) {
                background-color: #fff;
            }
            @media screen and (max-width: 500px) {
                padding-left: 20px;
                padding-right: 20px;
            }
            /*改变渲染的html内容中的样式*/
                /deep/ h2{
                    color: #c93756;
                    border-bottom: 1.5px solid #c2ccd0;
                }
                /deep/ h3{
                    color:#000;
                    font-size: 35px;
                }
                /deep/ h4{
                    color:#000;
                    font-size: 30px;
                }
                /deep/ p{
                    line-height:2;
                }
                /deep/ blockquote{
                    background-color: #f5f2f0;
                    margin-left: 0px;
                    margin-right: 0px;
                    padding-left: 50px;
                    padding-right: 50px;
                    border-left: #21a675 8px solid;
                }
                /deep/ code{
                    background-color: #F5F2F0;
                    font-size: 33px;
                }
                /deep/ pre code{
                    width:100%;
                    font-size: 25px;
                    background-color: transparent;
                    line-height: 40px;
                    @media screen and (max-width: 900px) {
                        line-height: 40px;
                        font-size: 25px;
                    }
                }
                /deep/ a{
                    color: #666699;
                }
            /deep/ img{
                max-width:100%;
                padding-top: 20px;
                padding-bottom: 20px;
            }
            /deep/ li{
                line-height:2;
                margin-left: -30px;
            }
            /deep/ table{
                width: 100%; /*表格宽度*/
                font-size: 25px;
                border-collapse: collapse; /*使用单一线条的边框*/
                empty-cells: show; /*单元格无内容依旧绘制边框*/
                th,td {
                    min-width: 8em;
                    line-height:1.5;
                    border: 5px solid #fff; /*内部边框样式*/
                    padding: 20px 10px; /*内边距*/
                }
                th {
                    font-weight: bold; /*加粗*/
                    text-align: center !important; /*内容居中，加上 !important 避免被 Markdown 样式覆盖*/
                    background: #f6f6f6; /*背景色*/
                }
                tbody tr:nth-child(2n) { background: rgba(252,252,252,0.9); }
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
                    .islike{
                        color:rgb(234, 112, 91);
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
    /* 滚动槽 */
    ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }
    ::-webkit-scrollbar-track {
        border-radius: 3px;
        background: rgba(0,0,0,0.06);
    }
    /* 滚动条滑块 */
    ::-webkit-scrollbar-thumb {
        border-radius: 3px;
        background: rgba(0,0,0,0.12);
    }
    .directory{
        position: fixed;
        left: 10px;
        width: 400px;
        background-color: #fff;
        overflow:auto;
        padding-left: 15px;
        padding-bottom: 50px;
        overflow-x: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        box-shadow: 10px 10px 5px #888888;
        .text{
            padding-left: 20px;
            color: #333 !important;
            &:hover{
                text-decoration: none;
            }
        }
        .close{
            position: absolute;
            right: 20px;
            color: #333;
            font-weight: 300;
            &:hover{
                color:#21a675;
                cursor: pointer;
            }
        }
        .title{
            margin-top: 5px;
            line-height: 50px;
            padding-left: 20px;
        }
        .active{
            color:#21a675 !important;
            background-color: #e9f1f6;
            font-weight: bold;
        }
        .content{
            @include sc(25px,#333);
            &:hover{
                color:#21a675;
                cursor: pointer;
            }
        }
        @media screen and(max-width: 1100px) {
            display: none;
        }
    }
    .icon-vue-mulu{
        position: fixed;
        left: 100px;
        font-size: 35px;
        &:hover{
            color:#21a675;
            cursor: pointer;
        }
    }
    .comment{
        overflow:hidden;
    }
}
</style>
