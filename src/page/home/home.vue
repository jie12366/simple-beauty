<template>
    <div>
        <nav-top></nav-top>
        <div class="container">
            <el-carousel class="carousel" height="300px">
                <el-carousel-item :key="index" v-for="(url, index) in imgUrls">
                    <el-image class="img" fit="cover" :src="url"/>
                </el-carousel-item>
            </el-carousel>
            <section class="box"  :key="index" v-for="(article,index) in articles">
                <div v-if="article.coverPath">
                    <h1 @click="toDetails(article.uid, article.id)">{{article.title}}</h1>
                    <el-row :gutter="20">
                        <el-col :md="17" :sm="15" :xs="12">
                            <div>
                                <p>{{article.summary}}</p>
                                <span><router-link to="">{{article.nickName}}</router-link>
                                    <i class="icon iconfont icon-vue-comment"><span style="font-size:12px;margin-left:3px;">{{article.comments}}</span></i>
                                    <i class="icon iconfont icon-vue-like"><span style="font-size:12px;margin-left:3px;">{{article.likes}}</span></i>
                                    <i class="icon iconfont icon-vue-read"><span style="font-size:12px;margin-left:3px;">{{article.reads}}</span></i>
                                    <span class="time">{{article.articleTime}}</span>
                                </span>
                            </div>
                        </el-col>
                        <el-col :md="7" :sm="9" :xs="12">
                            <el-image fit="cover" class="img" :src="article.coverPath" />
                        </el-col>
                    </el-row>
                    <el-divider></el-divider>
                </div>
                <div  v-if="!article.coverPath">
                    <h1 @click="toDetails(article.uid, article.id)">{{article.title}}</h1>
                    <div>
                        <p>{{article.summary}}</p>
                        <span><router-link to="">{{article.nickName}}</router-link>
                            <i class="icon iconfont icon-vue-comment"><span style="font-size:12px;margin-left:3px;">{{article.comments}}</span></i>
                            <i class="icon iconfont icon-vue-like"><span style="font-size:12px;margin-left:3px;">{{article.likes}}</span></i>
                            <i class="icon iconfont icon-vue-read"><span style="font-size:12px;margin-left:3px;">{{article.reads}}</span></i>
                            <span class="time">{{article.articleTime}}</span>
                        </span>
                    </div>
                    <el-divider></el-divider>
                </div>
            </section>
            <loading v-if="showLoading"></loading>
        </div>
    </div>
</template>
<script>
import navTop from '@/components/navbar/nav-top'
import loading from '@/components/common/loading'
import handleTime from '@/utils/show-time'
import api from '@/api'
export default {
    data () {
        return {
            imgUrls: [
                '../../../static/house.png',
                '../../../static/firefly.png',
                '../../../static/keyword.jpg',
                '../../../static/outdoor.png'
            ],
            index: 0, // 当前页开始序列号
            size: 10, // 每页大小
            articles: [], // 文章列表
            showLoading: true
        }
    },
    created () {
        this.getArticles(this.index, this.size)
    },
    methods: {
        // 获取文章列表
        async getArticles (index, size) {
            await this.$api.articles.getArticles(index, size)
            .then(res => {
                if (res.code === 1) {
                    this.articles = res.data.content
                    // 遍历文章集合，处理时间，获取昵称
                    for (let i = 0; i < this.articles.length; i++) {
                        // 获取用户昵称
                        api.user.getUsersInfo(this.articles[i].uid)
                        .then(res => {
                            this.articles[i].nickName = res.data.nickName
                            // 强制刷新数组
                            this.articles.splice(i, 1, this.articles[i])
                        })
                        // 处理时间
                        this.articles[i].articleTime = handleTime(this.articles[i].articleTime)
                    }
                    this.showLoading = false
                }
            })
        },
        toDetails (uid, aid) {
            this.$router.push(`/users/${uid}/articles/${aid}`)
        }
    },
    components: {
        navTop,
        loading
    }
}
</script>

<style lang="scss" scoped>
    @import '../../style/mixin';
    .container{
        width:35vw;
        margin-left: 32%;
        position: relative;
        top: 80px;
        @media screen and (max-width: 1300px) {
            width:50vw;
            margin-left: 25%;
        }
        @media screen and (max-width:800px) {
            width:67vw;
            margin-left: 17%;
        }
        @media screen and (max-width: 500px) {
            width:95%;
            margin: auto;
        }
        .carousel{
            .img{
                width:35vw;
                height:40vh;
                top: 80px;
                @media screen and (max-width: 1300px) {
                    width:50vw;
                }
                @media screen and (max-width: 800px) {
                    width:67vw;
                }
                @media screen and (max-width: 500px) {
                    width:100%;
                }
            }
        }
        .box{
            position: relative;
            top:5px;
            h1{
                font-size: 38px;
                width: 95%;
                -webkit-transition: all 0.5s linear;
                -moz-transition: all 0.5s linear;
                -ms-transition: all 0.5s linear;
                -o-transition: all 0.5s linear;
                transition: all 0.5s linear;
                &:hover{
                    padding-left: 30px;
                    text-decoration: underline;
                    cursor: pointer;
                }
            }p{
                @include sc(28px,#aaaaaa);
            }span{
                @include sc(25px,#aaaaaa);
                a{
                    color: #aaaaaa;
                    text-decoration: none;
                    &:hover{
                        text-decoration: underline;
                    }
                }
            }.img{
                @include wh(343px,220px);
                @include ct;
                @media screen and (max-width: 800px) {
                    @include wh(358px,220px);
                }
                @media screen and (max-width: 500px) {
                    @include wh(300px,220px);
                }
            }
            .icon-vue-comment{
                position: relative;
                @include sc(28px,#aaaaaa);
                top: 3px;
                left: 18px;
            }
            .icon-vue-like{
                position: relative;
                @include sc(28px,#aaaaaa);
                top: 3px;
                left: 40px;
            }
            .icon-vue-read{
                position: relative;
                @include sc(28px,#aaaaaa);
                top: 3px;
                left: 60px;
            }
            .time{
                position: relative;
                @include sc(24px,#aaaaaa);
                top: 1px;
                left: 80px;
            }
            a{
                color: #000000;
                text-decoration: none;
                &:hover{
                    text-decoration: underline;
                }
            }
        }
    }
</style>
