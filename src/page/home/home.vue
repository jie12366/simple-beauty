<template>
    <div>
        <nav-top></nav-top>
        <article-list :articles="articles">
            <el-carousel class="carousel" height="300px">
                <el-carousel-item :key="index" v-for="(url, index) in imgUrls">
                    <el-image class="img" fit="cover" :src="url"/>
                </el-carousel-item>
            </el-carousel>
        </article-list>
        <loading v-if="showLoading"></loading>
    </div>
</template>
<script>
import navTop from '@/components/navbar/nav-top'
import loading from '@/components/common/loading'
import articleList from '@components/common/article-list'
import handleTime from '@/utils/show-time'
import api from '@/api'
export default {
    data () {
        return {
            imgUrls: [
                'http://cdn.jie12366.xyz/house.png',
                'http://cdn.jie12366.xyz/firefly.png',
                'http://cdn.jie12366.xyz/keyword.jpg',
                'http://cdn.jie12366.xyz/outdoor.png'
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
        getArticles (index, size) {
            this.$api.articles.getArticles(index, size)
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
        }
    },
    components: {
        navTop,
        loading,
        articleList
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
                top: 40px;
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
    }
</style>
