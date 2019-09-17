<template>
  <div class="container">
    <sidebar :name="usersInfo.nickName" :headUrl="usersInfo.headPath" :articles="usersInfo.articles" :attentions="usersInfo.attentions"
    :likes="usersInfo.likes" :fans="usersInfo.fans" :uid="uid">
    </sidebar>
    <div class="top" id="top">
      <el-image class="bg_img" fit="cover" :src="url"></el-image>
      <div class="title">{{usersInfo.nickName}}的技术博客</div>
      <p class="des">活在当下，别在怀念过去或者憧憬未来中浪费掉你现在的生活</p>
      <div class="arrow" @click="scroolBottom">
        <i class="el-icon-arrow-down"></i>
      </div>
    </div>
    <div class="main" id="main">
      <vue-canvas-nest v-if="showCanvas" :config="{color:'161,102,220',opacity:0.8}" :el="'#main'"></vue-canvas-nest>
      <slot></slot>
      <div class="footer">
          <div>总访问量：{{usersInfo.reads}}次</div>
          <div>copyright ©️<span class="nick" @click="toCopyright">{{usersInfo.nickName}}</span>All Rights Reserved</div>
          <span style="margin-left:10px;">powered by <a href="https://github.com/jie12366/simple-beauty">simple-beauty</a></span>
      </div>
    </div>
  </div>
</template>
<script>
import vueCanvasNest from 'vue-canvas-nest'
import sidebar from '@components/common/sidebar'
export default {
  data () {
    return {
      usersInfo: '',
      url: 'http://cdn.jie12366.xyz/dog.jpg', // 背景图片
      showCanvas: true, // 是否显示背景动画
      screenWidth: document.body.clientWidth // 屏幕宽度
    }
  },
  props: [
    'uid'
  ],
  created () {
    this.getUsersInfo()
  },
  mounted () {
    const that = this
        // 监听屏幕宽度变化
        window.onresize = () => {
            return (() => {
                that.screenWidth = document.documentElement.clientWidth
            })()
        }
        if (this.screenWidth < 1100) {
            this.showCanvas = false
        }
  },
  watch: {
        // 监听屏幕宽度
        screenWidth (val) {
            this.screenWidth = val
            if (this.screenWidth < 1100) {
                this.showCanvas = false
            } else {
                this.showCanvas = true
            }
        }
    },
  methods: {
    // 获取用户信息
        getUsersInfo () {
            this.$api.user.getUsersInfo(this.uid)
            .then(res => {
                this.usersInfo = res.data
                document.title = this.usersInfo.nickName + '的技术博客'
            })
        },
    // 设置锚点
    scroolBottom () {
      var element = document.getElementById('main')
      element.scrollIntoView({block: 'start', behavior: 'smooth'})
    },
    toCopyright () {
      var element = document.getElementById('top')
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
    width: 100vw;
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
      width: 100%;
      text-align: center;
      top: 55vh;
      @include sc(80px, #fff);
      @media screen and(max-width: 1300px) {
        @include sc(70px, #fff);
      }
      @media screen and(max-width: 800px) {
        @include sc(60px, #fff);
      }
      @media screen and(max-width: 500px) {
        @include sc(50px, #fff);
      }
    }
    .des {
      position: absolute;
      top: 65vh;
      width: 95%;
      text-align: center;
      @include sc(45px, #eee);
      @media screen and(max-width: 500px) {
        top: 60vh;
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
    padding: 50px;
  }
  .footer{
    background-color: #444444;
    width: 100vw;
    height: 200px;
    line-height: 60px;
      position: absolute;
      left: -20px;
      margin-top: 250px;
      margin-bottom: 0px;
      text-align: center;
      @include sc(24px, #909399);
      .nick{
        margin-right: 20px;
        color:#fff;
        &:hover{
          color:#ea705b;
          cursor: pointer;
        }
      }
      a{
        color:#fff;
        text-decoration: none;
        &:hover{
          color:#ea705b;
        }
      }
    }
}
</style>
