<template>
    <div class="box">
    <section :key="index" v-for="(article,index) in articleList">
      <!--有封面图的展示-->
      <div v-if="article.coverPath">
        <h1 @click="toDetails(article.uid, article.id)">{{article.title}}</h1>
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
      <!--没有封面图的展示-->
      <div v-if="!article.coverPath">
        <h1 @click="toDetails(article.uid, article.id)">{{article.title}}</h1>
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
</template>
<script>
export default {
  props: [
    'uid',
    'articleList'
  ],
  methods: {
    toDetails (uid, aid) {
        this.$router.push(`/users/${uid}/articles/${aid}`)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../style/mixin.scss';
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
        width: 95%;
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
          text-decoration: underline;
          cursor: pointer;
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
    }
</style>
