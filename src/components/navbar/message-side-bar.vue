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
          <el-badge :is-dot="likeNoRead" :style="{display:hideText}">点赞</el-badge>
        </el-menu-item>
        <el-menu-item index="/message/comment" class="item">
          <i class="icon iconfont icon-vue-comment"></i>
          <el-badge :is-dot="commentNoRead" :style="{display:hideText}">评论</el-badge>
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
import baseURL from '../../service/base-url'
export default {
  data () {
    return {
      isCollapse: false, // 是否折叠菜单
      hideText: '',
      width: document.documentElement.clientWidth,
      uid: this.$store.state.uid,
      websock: null, // websocket
      likeNoRead: false, // 点赞未读
      commentNoRead: false // 评论未读
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
        this.initWebSocket()
        this.getNoReads()
    },
  watch: {
    // 监听屏幕宽度
        width (val) {
            this.width = val
            if (this.width < 600) {
                this.isCollapse = true
                this.hideText = 'none'
            } else {
                this.isCollapse = false
                this.hideText = ''
            }
        }
  },
  methods: {
    initWebSocket () { // 初始化weosocket
            let hostUrl = baseURL.substring(7) // 取出ip地址，去除http://
            const wsuri = 'ws://' + hostUrl + `/webSocket/${this.uid}`
            this.websock = new WebSocket(wsuri)
            this.websock.onmessage = this.websocketonmessage
        },
        websocketonmessage (e) { // 数据接收
            console.log(e.data)
            if (e.data === 'hasRead' || e.data === 'like' || e.data === 'unLike' || e.data === 'comment') {
                this.getNoReads()
            }
        },
    // 自适应屏幕
        fitScreen () {
            if (this.width < 600) {
                this.isCollapse = true
                this.hideText = 'none'
            } else {
                this.isCollapse = false
                this.hideText = ''
            }
        },
        // 获取某类型的未读消息数
        getNoReadsByType (type) {
            this.$api.message.getNoReadsByType(type, this.uid)
            .then(res => {
                if (res.code === 1) {
                    if (res.data > 0) {
                      if (type === 'like') {
                        this.likeNoRead = true
                      } else if (type === 'comment') {
                        this.commentNoRead = true
                      }
                    } else {
                        if (type === 'like') {
                        this.likeNoRead = false
                      } else if (type === 'comment') {
                        this.commentNoRead = false
                      }
                    }
                }
            })
        },
        // 获取所有的未读消息
        getNoReads () {
          this.getNoReadsByType('like')
          this.getNoReadsByType('comment')
          this.getNoReadsByType('attention')
          this.getNoReadsByType('tongzhi')
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
