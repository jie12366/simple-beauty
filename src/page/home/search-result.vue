<template>
    <div>
        <nav-top></nav-top>
        <div style="margin-top:50px">
            <article-list :articles="articles">
            </article-list>
            <loading v-if="showLoading"></loading>
        </div>
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
            index: 0, // 当前页开始序列号
            size: 10, // 每页大小
            articles: [], // 文章列表
            showLoading: true,
            regex: this.$route.query.queryString
        }
    },
    created () {
        this.getArticles(this.index, this.size)
    },
    methods: {
        // 获取文章列表
        getArticles (index, size) {
            console.log(this.$route.query.queryString)
            this.$api.articles.getArticleByRegex(this.regex, index, size)
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
