<template>
  <div class="container">
    <slot></slot>
    <section class="box" :key="index" v-for="(article,index) in articles">
      <div v-if="article.coverPath">
        <h1 @click="toDetails(article.uid, article.id)">{{article.title}}</h1>
        <el-row :gutter="20">
          <el-col :md="17" :sm="15" :xs="12">
            <div>
              <p>{{article.summary}}</p>
            </div>
          </el-col>
          <el-col :md="7" :sm="9" :xs="12">
            <el-image fit="cover" class="img" :src="article.coverPath" />
          </el-col>
        </el-row>
        <span>
                <router-link :to="`/${article.nickName}/${article.uid}/index?`">{{article.nickName}}</router-link>
                <i class="icon iconfont icon-vue-comment">
                  <span style="font-size:12px;margin-left:3px;">{{article.comments}}</span>
                </i>
                <i class="icon iconfont icon-vue-like">
                  <span style="font-size:12px;margin-left:3px;">{{article.likes}}</span>
                </i>
                <i class="icon iconfont icon-vue-read">
                  <span style="font-size:12px;margin-left:3px;">{{article.reads}}</span>
                </i>
                <span class="time">{{article.articleTime}}</span>
              </span>
        <el-divider></el-divider>
      </div>
      <div v-if="!article.coverPath">
        <h1 @click="toDetails(article.uid, article.id)">{{article.title}}</h1>
        <div>
          <p>{{article.summary}}</p>
          <span>
            <router-link :to="`/${article.nickName}/${article.uid}/index?`">{{article.nickName}}</router-link>
            <i class="icon iconfont icon-vue-comment">
              <span style="font-size:12px;margin-left:3px;">{{article.comments}}</span>
            </i>
            <i class="icon iconfont icon-vue-like">
              <span style="font-size:12px;margin-left:3px;">{{article.likes}}</span>
            </i>
            <i class="icon iconfont icon-vue-read">
              <span style="font-size:12px;margin-left:3px;">{{article.reads}}</span>
            </i>
            <span class="time">{{article.articleTime}}</span>
          </span>
        </div>
        <el-divider></el-divider>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  props: {
    articles: {
      type: Array
    }
  },
  methods: {
        toDetails (uid, aid) {
            this.$router.push(`/users/${uid}/articles/${aid}`)
        }
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
        .box{
            position: relative;
            top:5px;
            h1{
                font-size: 38px;
                width: 95%;
                -webkit-transition: all 0.5s linear;
                -moz-transition: all 0.5s linear;
                -ms-transition: all 0.5s linear;
                -o-transition: all 0.5s linear;
                transition: all 0.5s linear;
                &:hover{
                    padding-left: 30px;
                    text-decoration: underline;
                    cursor: pointer;
                }
            }p{
                @include sc(28px,#aaaaaa);
            }span{
                @include sc(25px,#aaaaaa);
                a{
                    color: #aaaaaa;
                    text-decoration: none;
                    &:hover{
                        text-decoration: underline;
                    }
                }
            }.img{
                @include wh(343px,220px);
                @include ct;
                @media screen and (max-width: 800px) {
                    @include wh(358px,220px);
                }
                @media screen and (max-width: 500px) {
                    @include wh(300px,220px);
                }
            }
            .icon-vue-comment{
                position: relative;
                @include sc(28px,#aaaaaa);
                left: 18px;
            }
            .icon-vue-like{
                position: relative;
                @include sc(28px,#aaaaaa);
                left: 40px;
            }
            .icon-vue-read{
                position: relative;
                @include sc(28px,#aaaaaa);
                left: 60px;
            }
            .time{
                position: relative;
                @include sc(24px,#aaaaaa);
                left: 80px;
            }
            a{
                color: #000000;
                text-decoration: none;
                &:hover{
                    text-decoration: underline;
                }
            }
        }
    }
</style>
