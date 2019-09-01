<template>
    <mine :uid="uid">
        <div>
            <div class="title-main"><span class="title" @click="tagWall">标签墙</span><span class="tag"> - {{tag}}</span></div>
        </div>
        <show-article :uid="uid" :articleList="articleList"></show-article>
    </mine>
</template>
<script>
import moment from 'moment'
import mine from '@components/common/mine'
import showArticle from '@components/common/show-article'
export default {
    data () {
        return {
            uid: parseInt(this.$route.params.uid),
            tag: this.$route.params.tag,
            articleList: [],
            index: 0,
            size: 5
        }
    },
    mounted () {
        this.getArticles(this.index, this.size)
    },
    methods: {
        getArticles (index, size) {
            this.$api.articles.getArticlesByTag(this.uid, this.tag, index, size)
            .then(res => {
                this.articleList = res.data
                this.articleList.forEach(function (article) {
                    article.articleTime = moment(article.articleTime).format('YYYY-MM-DD')
                })
            })
        },
        tagWall () {
            this.$router.go(-1)
        }
    },
    components: {
        mine,
        showArticle
    }
}
</script>
<style lang="scss" scoped>
@import '../../style/mixin.scss';
.title-main{
    width: 100%;
    text-align: center;
    display: inline-block;
    font-size: 60px;
    .title{
        color: #606266;
        &:hover{
            color: #303133;
            text-decoration: underline;
            cursor: pointer;
        }
    }
}
</style>
