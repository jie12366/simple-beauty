<template>
    <mine :uid="uid">
        <div class="photo">
            <section>
                <viewer :images="imgList" :key="index" v-for="(img,index) in imgList" :style="{width:img.width + 'px',flexGrow:img.flex}">
                    <i :style="{paddingBottom:img.padding + '%'}"></i>
                    <div class="hovereffect">
                        <img class="img-responsive" :src="img.url" :alt="img.alt">
                            <div class="overlay">
                                <section>
                                    <div class="alt">{{img.alt}}</div>
                                    <div class="time" style="float:right">{{img.uploadTime}}</div>
                                </section>
                            </div>
                    </div>
                </viewer>
            </section>
        </div>
    </mine>
</template>
<script>
import mine from '@components/common/mine'
import moment from 'moment'
export default {
    data () {
        return {
            uid: this.$route.params.uid,
            imgList: []
        }
    },
    created () {
        this.getPhotos()
    },
    methods: {
        // 获取照片集
        getPhotos () {
            this.$api.manage.getPhotos(this.uid)
            .then(res => {
                console.log(res)
                if (res.code === 50001) {
                    this.$message.warning('还没有照片哦')
                } else if (res.code === 1) {
                    this.imgList = res.data.photos
                    // 将照片按时间倒序排序
                    this.imgList.sort(function (a, b) {
                        return new Date(b.uploadTime) - new Date(a.uploadTime)
                    })
                    // 处理照片显示时间
                    this.imgList.forEach(function (img) {
                        img.uploadTime = moment(img.uploadTime).format('YYYY-MM-DD')
                    })
                    // 获取图片的宽高，设置宽度和flexgrow
                    for (let i = 0; i < this.imgList.length; i++) {
                        let img = new Image()
                        img.src = this.imgList[i].url
                        const vm = this
                        // 图片加载完再获取宽高
                        img.onload = function () {
                            vm.imgList[i].width = img.width * 200 / img.height
                            vm.imgList[i].flex = img.width * 200 / img.height
                            vm.imgList[i].padding = 0
                            vm.imgList.splice(i, 1, vm.imgList[i])
                        }
                    }
                }
            })
        }
    },
    components: {
        mine
    }
}
</script>
<style lang="scss" scoped>
.photo{
    position: relative;
    padding-top: 200px;
    padding-bottom: 200px;
    section {
        display: flex;
        flex-wrap: wrap;
        }
        section::after {
        content: '';
        flex-grow: 999999999;
        }
        div {
        margin: 2px;
        position: relative;
        }
        i{
        display: block;
        }
        img {
        position: absolute;
        top: 0;
        width: 100%;
        vertical-align: bottom;
    }
}
.hovereffect {
  display: inline-block;
  overflow: hidden;
  position: relative;
  text-align: center;
  cursor: default;
}

.hovereffect .overlay {
  position: absolute;
  overflow: hidden;
  width: 100%;
  height: 20%;
  left: 0%;
  top: 80%;
  border-top: 1px solid #FFF;
  -webkit-transition: opacity 0.35s, -webkit-transform 0.35s;
  transition: opacity 0.35s, transform 0.35s;
  -webkit-transform: scale(0,1);
  -ms-transform: scale(0,1);
  transform: scale(0,1);
}

.hovereffect:hover .overlay {
  opacity: 1;
  filter: alpha(opacity=100);
  -webkit-transform: scale(1);
  -ms-transform: scale(1);
  transform: scale(1);
}

.hovereffect img {
  display: block;
  position: relative;
  -webkit-transition: all 0.35s;
  transition: all 0.35s;
}

.hovereffect:hover img {
  filter: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="filter"><feComponentTransfer color-interpolation-filters="sRGB"><feFuncR type="linear" slope="0.6" /><feFuncG type="linear" slope="0.6" /><feFuncB type="linear" slope="0.6" /></feComponentTransfer></filter></svg>#filter');
  filter: brightness(0.6);
  -webkit-filter: brightness(0.6);
}

.hovereffect section {
  text-transform: uppercase;
  font-size: 30px;
  background-color: transparent;
  color: #FFF;
  opacity: 0;
  filter: alpha(opacity=0);
  -webkit-transition: opacity 0.35s, -webkit-transform 0.35s;
  transition: opacity 0.35s, transform 0.35s;
  -webkit-transform: translate3d(0,-100%,0);
  transform: translate3d(0,-100%,0);
  .alt{
      padding-left: 20px;
  }
  .time{
      position: absolute;
      font-size: 25px;
      right: 20px;
      top: 30px;
      @media screen and(max-width: 600px){
          top: 5px;
      }
  }
}

.hovereffect:hover section {
  opacity: 1;
  filter: alpha(opacity=100);
  -webkit-transform: translate3d(0,0,0);
  transform: translate3d(0,0,0);
}
</style>
