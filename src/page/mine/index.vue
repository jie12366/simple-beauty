<template>
  <div class="container">
    <sidebar></sidebar>
    <div class="top">
      <el-image class="bg_img" fit="cover" :src="url"></el-image>
      <div class="title">Monkey_jie的技术博客</div>
      <p class="des">活在当下，别在怀念过去或者憧憬未来中浪费掉你现在的生活</p>
      <div class="arrow" @click="scroolBottom">
        <i class="el-icon-arrow-down"></i>
      </div>
    </div>
    <div class="main" id="main">
      <vue-canvas-nest :config="{color:'161,102,220',opacity:0.8}" :el="'#main'"></vue-canvas-nest>
      <div class="box">
        <section :key="index" v-for="(article,index) in articles">
          <div v-if="article.coverPath">
            <router-link to>
              <h1>{{article.title}}</h1>
            </router-link>
            <el-row :gutter="20">
              <el-col :md="17" :sm="15" :xs="12">
                <div>
                  <p>{{article.summary}}</p>
                  <span>
                    <span class="time">{{article.articleTime}}</span>
                    <i class="icon iconfont icon-vue-comment">
                      <span style="font-size:12px;margin-left:3px;">{{article.comments}}</span>
                    </i>
                    <i class="icon iconfont icon-vue-like">
                      <span style="font-size:12px;margin-left:3px;">{{article.likes}}</span>
                    </i>
                    <i class="icon iconfont icon-vue-read">
                      <span style="font-size:12px;margin-left:3px;">{{article.reads}}</span>
                    </i>
                  </span>
                </div>
              </el-col>
              <el-col :md="7" :sm="9" :xs="12">
                <el-image fit="cover" class="img" :src="article.coverPath" />
              </el-col>
            </el-row>
            <el-divider></el-divider>
          </div>
          <div v-if="!article.coverPath">
            <router-link to>
              <h1>{{article.title}}</h1>
            </router-link>
            <div>
              <p>{{article.summary}}</p>
              <span>
                <span class="time">{{article.articleTime}}</span>
                <i class="icon iconfont icon-vue-comment">
                  <span style="font-size:12px;margin-left:3px;">{{article.comments}}</span>
                </i>
                <i class="icon iconfont icon-vue-like">
                  <span style="font-size:12px;margin-left:3px;">{{article.likes}}</span>
                </i>
                <i class="icon iconfont icon-vue-read">
                  <span style="font-size:12px;margin-left:3px;">{{article.reads}}</span>
                </i>
              </span>
            </div>
            <el-divider></el-divider>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
<script>
import vueCanvasNest from 'vue-canvas-nest'
import sidebar from '@components/common/sidebar'
import moment from 'moment'
export default {
  data () {
    return {
      url: 'static/dog.jpg', // 背景图片
      uid: this.$store.state.uid,
      index: 0, // 当前页
      size: 10, // 每页大小
      articles: [] // 我的文章列表
    }
  },
  created () {
    this.getArticles(this.uid, this.index, this.size)
  },
  methods: {
    // 获取我的文章
    getArticles (uid, index, size) {
      this.$api.articles.getArticlesByUid(uid, index, size).then(res => {
        this.articles = res.data
        this.articles.forEach(function (article) {
          article.articleTime = moment(article.articleTime).format('YYYY-MM-DD')
        })
      })
    },
    // 设置锚点
    scroolBottom () {
      var element = document.getElementById('main')
      element.scrollIntoView({block: 'start', behavior: 'smooth'})
    }
  },
  components: {
    vueCanvasNest,
    sidebar
  }
}
</script>

<style lang="scss" scoped>
@import "../../style/mixin";
.container {
  .top {
    width: 100%;
    height: 98vh;
    object-fit: cover;
    .bg_img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 98vh;
      @media screen and (min-width: 1300px) {
        width: 100vw;
      }
    }
    .title {
      position: absolute;
      @include cl;
      top: 55vh;
      @include sc(80px, #fff);
      @media screen and(max-width: 800px) {
        left: 40%;
      }
      @media screen and(max-width: 500px) {
        @include sc(40px, #eee);
      }
    }
    .des {
      position: absolute;
      top: 65vh;
      margin-left: 30vw;
      @include sc(45px, #eee);
      @media screen and(max-width: 1300px) {
        margin-left: 5vw;
        right: 20%;
      }
      @media screen and(max-width: 800px) {
        left: 10%;
        right: 10%;
      }
      @media screen and(max-width: 500px) {
        top: 60vh;
        left: 10%;
        right: 10%;
        @include sc(30px, #eee);
      }
    }
    .arrow {
      position: absolute;
      top: 89vh;
      @include cl;
      .el-icon-arrow-down {
        @include sc(50px, #fff);
        -webkit-transition: all 0.5s linear;
        -moz-transition: all 0.5s linear;
        -ms-transition: all 0.5s linear;
        -o-transition: all 0.5s linear;
        transition: all 0.5s linear;
        &:hover {
          margin-top: 13px;
          cursor: pointer;
        }
      }
    }
  }
  .main {
    .box {
      background-color: #f8fbfd;
      padding-top: 30px;
      padding-left: 30px;
      padding-right: 30px;
      width: 50%;
      @include cl;
      position: relative;
      top: 100px;
      @media screen and(max-width: 1300px) {
        width: 60%;
      }
      @media screen and(max-width: 800px) {
        width: 70%;
      }
      @media screen and(max-width: 500px) {
        width: 90%;
      }
      h1 {
        font-size: 38px;
        width: 95%;
        -webkit-transition: all 0.5s linear;
        -moz-transition: all 0.5s linear;
        -ms-transition: all 0.5s linear;
        -o-transition: all 0.5s linear;
        transition: all 0.5s linear;
        &:hover {
          padding-left: 30px;
        }
      }
      p {
        @include sc(28px, #666);
      }
      span {
        @include sc(25px, #666);
        a {
          color: #666;
          text-decoration: none;
          &:hover {
            text-decoration: underline;
          }
        }
      }
      .img {
        @include wh(343px, 220px);
        @include ct;
        @media screen and (max-width: 800px) {
          @include wh(358px, 220px);
        }
        @media screen and (max-width: 500px) {
          @include wh(300px, 220px);
        }
      }
      .icon-vue-comment {
        position: relative;
        @include sc(28px, #aaaaaa);
        top: 3px;
        left: 18px;
      }
      .icon-vue-like {
        position: relative;
        @include sc(28px, #aaaaaa);
        top: 3px;
        left: 40px;
      }
      .icon-vue-read {
        position: relative;
        @include sc(32px, #aaaaaa);
        top: 3px;
        left: 60px;
      }
      .time {
        position: relative;
        @include sc(24px, #666);
        top: 1px;
        left: 3px;
      }
      a {
        color: #000000;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
