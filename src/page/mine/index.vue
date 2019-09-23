<template>
  <div>
    <mineCommon :uid="uid">
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
        uid: parseInt(this.$route.params.uid),
        articleList: [], // 我的文章列表
        total: 0,
        index: 1, // 当前页
        size: 10 // 每页大小
    }
  },
  mounted () {
      this.getArticles(0, this.size)
  },
  methods: {
    // 获取我的文章
    getArticles (index, size) {
      this.$api.articles.getArticlesByUid(this.uid, index, size).then(res => {
        if (res.code === 1) {
              this.articleList = res.data.content
              this.total = res.data.totalElements
              this.articleList.forEach(function (article) {
                  article.articleTime = moment(article.articleTime).format('YYYY-MM-DD')
              })
          } else if (res.code === 50001) {
              this.$message.warning('还没写文章哦')
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
.pageCut{
  position: absolute;
  width: 100%;
  margin-top: 100px;
  text-align: center;
}
</style>
