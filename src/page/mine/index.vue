<template>
  <div>
    <mineCommon :uid="uid">
      <show-article :uid="uid" :articleList="articleList"></show-article>
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
        index: 0, // 当前页
        size: 10 // 每页大小
    }
  },
  mounted () {
      this.getArticles(this.uid, this.index, this.size)
  },
  methods: {
    // 获取我的文章
    getArticles (uid, index, size) {
      this.$api.articles.getArticlesByUid(uid, index, size).then(res => {
        this.articleList = res.data
        this.articleList.forEach(function (article) {
          article.articleTime = moment(article.articleTime).format('YYYY-MM-DD')
        })
      })
    }
  },
  components: {
    mineCommon,
    showArticle
  }
}
</script>
