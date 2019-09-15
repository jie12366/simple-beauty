<template>
<div>
  <nav-top ref="navTop"></nav-top>
  <el-row class="main">
    <el-col :span="4">
      <el-menu
        class="el-menu-vertical-demo aside"
        :default-active="$route.path"
        active-text-color="#ea705b"
        background-color="#ffffff"
        :collapse="isCollapse"
        router
      >
        <el-menu-item index="/message/like" class="item">
          <i class="icon iconfont icon-vue-like"></i>
          <span>点赞</span>
        </el-menu-item>
        <el-menu-item index="/message/comment" class="item">
          <i class="icon iconfont icon-vue-comment"></i>
          <span>评论</span>
        </el-menu-item>
        <el-menu-item index="/message/attention" class="item">
          <i class="icon iconfont icon-vue-guanzhu"></i>
          <span>关注</span>
        </el-menu-item>
        <el-menu-item index="/message/tongzhi" class="item">
          <i class="icon iconfont icon-vue-tongzhi"></i>
          <span>通知</span>
        </el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="20">
      <slot></slot>
    </el-col>
  </el-row>
</div>
</template>
<script>
import navTop from '@/components/navbar/nav-top'
export default {
  data () {
    return {
      isCollapse: false, // 是否折叠菜单
      width: document.documentElement.clientWidth
    }
  },
  mounted () {
        const that = this
        this.fitScreen()
        window.onresize = () => {
            return (() => {
                that.width = document.documentElement.clientWidth
            })()
        }
    },
  watch: {
    // 监听屏幕宽度
        width (val) {
            this.width = val
            if (this.width < 600) {
                this.isCollapse = true
            } else {
                this.isCollapse = false
            }
        }
  },
  methods: {
    // 自适应屏幕
        fitScreen () {
            if (this.width < 600) {
                this.isCollapse = true
            } else {
                this.isCollapse = false
            }
        }
  },
  components: {
    navTop
  }
}
</script>
<style lang="scss" scoped>
.main {
  width: 80%;
  text-align: center;
  margin: auto;
  position: relative;
  top: 160px;
  margin-bottom: 100px;
  @media screen and(max-width: 600px) {
    width: 100%;
  }
  .aside {
    .item{
      font-size:35px;
    }
    i{
      font-size:36px;
    }
    .icon-vue-guanzhu{
      font-size:40px;
      color: #9933FF !important;
    }.icon-vue-tongzhi{
      color:#339966 !important;
    }.icon-vue-comment{
      color:#6699CC !important;
    }.icon-vue-like{
      color:#FF6666 !important;
    }
  }
}
</style>
