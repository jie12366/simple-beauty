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
            if (this.regex !== '') {
                this.$api.articles.getArticleByRegex(this.regex, index, size)
                .then(res => {
                    if (res.code === 1) {
                        this.articles = res.data
                        // 遍历文章集合，处理时间
                        for (let i = 0; i < this.articles.length; i++) {
                            // 处理时间
                            this.articles[i].article.articleTime = handleTime(this.articles[i].article.articleTime)
                        }
                        this.showLoading = false
                    }
                })
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
