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
        <el-menu-item index="/manage/articles-list" class="item">
          <i class="icon iconfont icon-vue-post"></i>
          <span>文章管理</span>
        </el-menu-item>
        <el-menu-item index="/manage/photos" class="item">
          <i class="icon iconfont icon-vue-photos"></i>
          <span>照片管理</span>
        </el-menu-item>
        <el-menu-item index="/manage/themes" class="item">
          <i class="icon iconfont icon-vue-theme"></i>
          <span>主题设置</span>
        </el-menu-item>
        <el-menu-item index="/manage/about-me" class="item">
          <i class="icon iconfont icon-vue-aboutMe"></i>
          <span>个人简介</span>
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
    .icon-vue-theme{
      color: #9933FF !important;
    }.icon-vue-aboutMe{
      color:#339966 !important;
    }.icon-vue-photos{
      color:#6699CC !important;
    }.icon-vue-post{
      color:#FF6666 !important;
    }
  }
}
</style>
