<template>
    <mine :uid="uid">
        <div>
            <div class="title-main"><span class="title" @click="categoryWall">分类</span><span class="category"> - {{category}}</span></div>
        </div>
        <show-article :uid="uid" :articleList="articleList"></show-article>
        <el-pagination
            layout="prev, pager, next"
            :page-size="size"
            :current-page="index"
            :total="total" class="pageCut" @current-change="changePage">
        </el-pagination>
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
            category: this.$route.params.category,
            articleList: [],
            total: 0,
            index: 1,
            size: 5
        }
    },
    mounted () {
        this.getArticles(0, this.size)
    },
    methods: {
        getArticles (index, size) {
            this.$api.articles.getArticlesByCategory(this.uid, this.category, index, size)
            .then(res => {
                if (res.code === 1) {
                    this.articleList = res.data.content
                    this.total = res.data.totalElements
                    this.articleList.forEach(function (article) {
                        article.articleTime = moment(article.articleTime).format('YYYY-MM-DD')
                    })
                } else if (res.code === 50001) {
                    this.$message.error('没有数据哦')
                }
            })
        },
        categoryWall () {
            this.$router.go(-1)
        },
        changePage (index) {
            this.index = index
            this.getArticles(index - 1, this.size)
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
.pageCut{
  position: absolute;
  width: 100%;
  margin-top: 100px;
  text-align: center;
}
</style>
