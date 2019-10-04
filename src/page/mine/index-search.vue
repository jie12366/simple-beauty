<template>
  <div>
    <mineCommon :uid="uid">
      <div class="title-main"><span class="title">搜索结果</span></div>
      <show-article :uid="uid" :articleList="articleList"></show-article>
      <el-pagination
    layout="prev, pager, next"
    :page-size="size"
    :current-page="index"
    :total="total" class="pageCut" v-bind:current-change="changePage">
  </el-pagination>
    </mineCommon>
  </div>
</template>
<script>
import moment from 'moment'
import mineCommon from '@/components/common/mine'
import showArticle from '@components/common/show-article'
export default {
  data () {
    return {
        uid: this.$route.params.uid,
        regex: this.$route.query.query,
        articleList: [], // 我的文章列表
        total: 0,
        index: 1, // 当前页
        size: 10 // 每页大小
    }
  },
  created () {
    this.getArticles(0, this.size)
  },
  methods: {
    // 获取我的文章
    getArticles (index, size) {
      this.$api.articles.getArticleByRegexByUid(this.regex, this.uid, index, size).then(res => {
        if (res.code === 1) {
              this.articleList = res.data.content
              this.total = res.data.totalElements
              this.articleList.forEach(function (article) {
                article.articleTime = moment(article.articleTime).format('YYYY-MM-DD')
              })
          } else if (res.code === 50001) {
              this.$message.info('没有匹配的文章哦')
          }
      })
    },
    changePage (index) {
            this.index = index
            this.getArticles(index - 1, this.size)
        }
  },
  components: {
    mineCommon,
    showArticle
  }
}
</script>
<style lang="scss" scoped>
.title-main{
    width: 100%;
    text-align: center;
    display: inline-block;
    font-size: 60px;
    color: #606266;
}
.pageCut{
  position: relative;
  width: 100%;
  margin-top: 150px;
  text-align: center;
}
</style>
