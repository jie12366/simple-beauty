<template>
    <div ref="container" id= "inner">
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
            showLoading: true,
            nomore: false
        }
    },
    created () {
        this.getArticles(this.index, this.size)
    },
    mounted () {
        this.getArticles(this.index, this.size)
        // 监听滚动
        window.addEventListener('scroll', this.initScroll)
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
                        // 处理时间
                        this.articles[i].articleTime = handleTime(this.articles[i].articleTime)
                    }
                    this.showLoading = false
                }
            })
        },
        // 获取更多文章
        getMoreArticles (index, size) {
            this.$api.articles.getArticles(index, size)
            .then(res => {
                if (res.code === 1) {
                    // 没有数据了
                    if (res.data.content.length === 0) {
                        this.nomore = true
                    }
                    let articles = res.data.content
                    // 遍历文章集合，处理时间，获取昵称
                    for (let i = 0; i < articles.length; i++) {
                        // 处理时间
                        articles[i].articleTime = handleTime(articles[i].articleTime)
                    }
                    // 将新获取的数组与原数组连接
                    this.articles = this.articles.concat(articles)
                    this.showLoading = false
                }
            })
        },
        initScroll (e) {
            // 如果正在加载或没有更多数据，就直接返回
            if (this.showLoading || this.nomore) return
            // 滚动条距顶部距离
            let scrollTop = document.documentElement.scrollTop
            // 浏览器窗口高度
            let height = window.screen.height
            // 元素高度
            let innerHeight = document.getElementById('inner').offsetHeight
            if (scrollTop + height >= innerHeight) {
                console.log('-----------------触底了-------------')
                // 计算当前偏移量
                this.index = this.index + this.size
                this.showLoading = true
                this.getMoreArticles(this.index, this.size)
            }
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
