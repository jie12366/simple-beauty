<template>
  <div>
    <div
      @click="openRight"
      v-if="!showRight"
      class="menu"
      :style="{color:color,border: '2.5px ' + color + ' solid',width:width,right:right}"
    >
      <i class="icon iconfont icon-vue-menu"></i>
      <span v-if="show_text">MENU</span>
    </div>
    <div :class="maskClass" @click="closeByMask"></div>
    <div :class="mainClass" :style="mainStyle">
      <div class="drawer-body">
        <div class="right-body">
          <img class="head-img" :src="headUrl">
          <div class="mine-info">
            <div>
              <span>{{articles}}&nbsp;文章</span>
              <span style="margin-left:20px;">{{attentions}}&nbsp;关注</span>
            </div>
            <div>
              <span>{{likes}}&nbsp;喜欢</span>
              <span style="margin-left:20px;">{{fans}}&nbsp;粉丝</span>
            </div>
          </div>
          <span class="divider">
            —————————————
            <i class="icon iconfont icon-vue-love1"></i>——————————
          </span>
          <div class="link" :key="index" v-for="(item, index) in menuList">
            <router-link :to="item.path"><section>
              <i :class="item.icon"></i><span>{{item.name}}</span>
            </section></router-link>
          </div>
        </div>
        <el-image class="right_img" fit="cover" :src="url2"></el-image>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      showRight: false,
      url2: 'http://cdn.jie12366.xyz/sky.png',
      menuList: [
        {
          name: '首页',
          path: '/home',
          icon: 'icon iconfont icon-vue-index'
        }, {
          name: this.name,
          path: `/${this.name}/${this.uid}/index`,
          icon: 'icon iconfont icon-vue-mine'
        }, {
          name: '标签墙',
          path: `/${this.name}/${this.uid}/tags`,
          icon: 'icon iconfont icon-vue-tag'
        }, {
          name: '分类',
          path: `/${this.name}/${this.uid}/categorys`,
          icon: 'icon iconfont icon-vue-category'
        }, {
          name: '归档',
          path: `/${this.name}/${this.uid}/archives`,
          icon: 'icon iconfont icon-vue-archive'
        }, {
          name: '照片墙',
          path: `/${this.name}/${this.uid}/photos-wall`,
          icon: 'icon iconfont icon-vue-photo'
        }, {
          name: '关于我',
          path: `/${this.name}/${this.uid}/about`,
          icon: 'icon iconfont icon-vue-aboutMe'
        }
      ],
      scrollTop: '', // 滚动距离顶部的距离
      color: '#fff', // menu样式
      show_text: true,
      width: '70px',
      right: '30px'
    }
  },
  props: {
    name: {
      type: String
    },
    headUrl: {
      type: String
    },
    articles: {
      type: Number,
      default: 0
    },
    attentions: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    fans: {
      type: Number,
      default: 0
    },
    uid: {
      type: Number,
      default: 0
    }
  },
  mounted () {
    // 监听滚动
    window.addEventListener('scroll', () => {
      this.scrollTop = document.documentElement.scrollTop ||
            window.pageYOffset || document.body.scrollTop ||
            document.querySelector(this.el).scrollTop
        if (this.scrollTop > 300) {
          this.color = '#666666'
          this.show_text = false
          this.width = '25px'
          this.right = '5px'
        } else {
          this.color = '#fff'
          this.show_text = true
          this.width = '70px'
          this.right = '50px'
        }
      }, true)
  },
  watch: {
    // 由于加载比较慢会导致name和headUrl无法正确赋值
    // 需要监听这两个变量以刷新menuList
    name (val) {
      this.menuList[1].name = val
      this.menuList[1].path = `/${val}/${this.uid}/index`
      this.menuList.splice(1, 1, this.menuList[1])
      this.menuList[2].path = `/${val}/${this.uid}/tags`
      this.menuList.splice(2, 1, this.menuList[2])
      this.menuList[3].path = `/${val}/${this.uid}/categorys`
      this.menuList.splice(3, 1, this.menuList[3])
      this.menuList[4].path = `/${val}/${this.uid}/archives`
      this.menuList.splice(4, 1, this.menuList[4])
      this.menuList[5].path = `/${val}/${this.uid}/photos-wall`
      this.menuList.splice(5, 1, this.menuList[5])
      this.menuList[6].path = `/${val}/${this.uid}/about`
      this.menuList.splice(6, 1, this.menuList[6])
    },
    headUrl (val) {
      this.headUrl = val
    }
  },
  computed: {
    maskClass: function () {
      return {
        'mask-show': this.showRight,
        'mask-hide': !this.showRight
      }
    },
    mainClass: function () {
      return {
        'main-show': this.showRight,
        'main-hide': !this.showRight
      }
    },
    mainStyle: function () {
      return {
        width: '300px',
        right: this.showRight ? '0' : `-${'300px'}`,
        borderLeft: this.showRight ? 'none' : '1px solid #eee'
      }
    }
  },
  methods: {
    // 打开侧边栏
    openRight () {
      this.showRight = true
    },
    // 通过遮罩层关闭侧边栏
    closeByMask () {
      this.showRight = false
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../style/mixin";
.menu {
  position: fixed;
  top: 60px;
  width: 135px;
  height: 60px;
  line-height: 60px;
  align-items: center;
  z-index: 5;
  @include sc(25px, #ffffff);
  border: 5px #ffffff solid;
  padding-left: 8px;
  &:hover {
    color: #dddddd;
    border: 5px #dddddd solid;
    cursor: pointer;
  }
}
/* 遮罩 */
.mask-show {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 1;
  transition: opacity 0.5s;
}
.mask-hide {
  opacity: 0;
  transition: opacity 0.5s;
}

/* 滑块 */
.main {
  z-index: 10;
  top: 0;
  height: 100%;
  background: #fff;
  transition: all 0.5s;
}
.main-show {
  opacity: 1;
}
.main-hide {
  opacity: 0;
}
.drawer-body {
  font-size: 30px;
  .right_img {
    position: fixed;
    top: 0;
    right: 0;
    width: 600px;
    height: 100vh;
    opacity: 0.9;
    z-index: 20;
  }
  .right-body {
    z-index: 30;
    position: fixed;
    top: 0;
    right: 0;
    color: #fff;
    .close {
      position: relative;
      margin-left: 550px;
      top: 10px;
      @include sc(42px, #eee);
      &:hover {
        cursor: pointer;
      }
    }
    .head-img {
      position: relative;
      width: 120px;
      height: 120px;
      margin-left: 250px;
      margin-top: 80px;
      border-radius: 50%;
      border: 6px #eee solid;
      &:hover {
        transform: rotate(666turn);
        transition-duration: 59s;
        transition-timing-function: cubic-bezier(0.34, 0, 0.84, 1);
      }
    }
    .mine-info {
      position: relative;
      top: 50px;
      margin-left: 210px;
      span {
        margin-top: 10px;
      }
    }
    .divider {
      position: relative;
      font-size: 20px;
      top: 120px;
      color: #eee;
      .icon-vue-love1 {
        font-size: 35px;
        color: #d4237a;
        margin-left: 30px;
        margin-right: 30px;
      }
    }
    .link {
      position: relative;
      top: 220px;
      section{
        padding-left: 100px;
        height: 80px;
        line-height: 80px;
        &:hover{
          background-color: #667274;
        }
        span{
          margin-left: 30px;
        }
      }
    }
  }
  a {
    color: #aaa;
    text-decoration: none;
    &:hover {
      color: #fff;
    }
  }
}
</style>
