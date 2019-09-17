<template>
    <div>
        <side-bar>
            <div>
                <el-upload action="#"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove" :http-request="uploadImg">
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="imageUrl" alt="">
                </el-dialog>
            </div>
            <div>
                <div style="padding:30px;font-size:25px;">我的照片</div>
                <div class="hovereffect" :key="index" v-for="(item,index) in imgList">
                    <el-image class="img" :src="item.url" :alt="item.alt" lazy></el-image>
                        <div class="overlay">
                            <h2>
                                <i @click="deleteImg(item.url)" class="icon iconfont icon-vue-delete"></i>
                            </h2>
                        </div>
                </div>
            </div>
        </side-bar>
    </div>
</template>
<script>
import axios from '@/service/http'
import baseURL from '@/service/base-url'
import sideBar from '@/components/navbar/manage-side-bar'
export default {
    data () {
        return {
            imageUrl: '',
            imgList: [],
            dialogVisible: false,
            uid: this.$store.state.uid,
            method: 'post'
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
                    // 如果没有数据则用post保存
                    this.method = 'post'
                } else if (res.code === 1) {
                    // 如果有数据则用put更新
                    this.method = 'put'
                    this.imgList = res.data.photos
                    // 将照片按时间倒序排序
                    this.imgList.sort(function (a, b) {
                        return new Date(b.uploadTime) - new Date(a.uploadTime)
                    })
                }
            })
        },
        // 重写上传图片的方法
        uploadImg (f) {
            this.$prompt('请输入照片描述', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
            inputErrorMessage: '照片描述不合法',
            center: true
        }).then(({ value }) => {
            let formdata = new FormData()
            formdata.append('img', f.file)
            formdata.append('alt', value)
            formdata.append('uid', this.uid)
            axios({
                url: baseURL + '/photos',
                method: this.method,
                data: formdata,
                headers: {'Content-Type': 'multipart/form-data'}
                }).then(res => {
                    console.log(res.data)
                    if (res.data.code === 30002 || res.data.code === 30003) {
                        this.$message({
                            message: '数据错误',
                            type: 'error',
                            duration: 1000
                        })
                    } else if (res.data.code === 1) {
                        this.getPhotos()
                    }
                }).then(error => {
                    console.log(error)
            })
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '取消上传',
                duration: 1000
            })
        })
        },
        // 删除照片
        deleteImg (url) {
            let key = url.substring(24)
            this.$confirm('此操作将永久删除该照片, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$api.manage.deletePhoto(key, this.uid)
                .then(res => {
                    console.log(res)
                    if (res.code === 1) {
                        this.$message({
                            type: 'success',
                            message: '删除成功',
                            duration: 1000
                        })
                        this.getPhotos()
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除',
                    duration: 1000
                })
            })
        },
        handleRemove (file, fileList) {
            console.log(file, fileList)
        },
        handlePictureCardPreview (file) {
            this.imageUrl = file.url
            this.dialogVisible = true
        }
    },
    components: {
        sideBar
    }
}
</script>
<style lang="scss" scoped>
.img{
    width: 300px;
    height: 300px;
    padding: 3px;
    @media screen and(max-width: 600px) {
        width: 250px;
        height: 250px;
    }
}
.hovereffect {
  float: left;
  overflow: hidden;
  position: relative;
  text-align: center;
  cursor: default;
}

.hovereffect .overlay {
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
  top: 0;
  left: 0;
  opacity: 0;
  filter: alpha(opacity=0);
  background-color: rgba(0,0,0,0.3);
  -webkit-transition: all 0.4s cubic-bezier(0.88,-0.99, 0, 1.81);
  transition: all 0.4s cubic-bezier(0.88,-0.99, 0, 1.81);
}

.hovereffect img {
  display: block;
  position: relative;
  -webkit-transition: all 0.4s cubic-bezier(0.88,-0.99, 0, 1.81);
  transition: all 0.4s cubic-bezier(0.88,-0.99, 0, 1.81);
}

.hovereffect h2 {
  text-transform: uppercase;
  color: #fff;
  text-align: center;
  position: relative;
  font-size: 30px;
  background: rgba(0,0,0,0.6);
  -webkit-transform: translatey(-100px);
  -ms-transform: translatey(-100px);
  transform: translatey(-100px);
  -webkit-transition: all 0.4s cubic-bezier(0.88,-0.99, 0, 1.81);
  transition: all 0.4s cubic-bezier(0.88,-0.99, 0, 1.81);
  padding: 10px;
  .icon-vue-delete{
      font-size: 40px;
      &:hover{
          cursor: pointer;
      }
  }
}

.hovereffect:hover img {
  -ms-transform: scale(1.2);
  -webkit-transform: scale(1.2);
  transform: scale(1.2);
}

.hovereffect:hover .overlay {
  opacity: 1;
  filter: alpha(opacity=100);
}

.hovereffect:hover h2,.hovereffect:hover a.info {
  opacity: 1;
  filter: alpha(opacity=100);
  -ms-transform: translatey(0);
  -webkit-transform: translatey(0);
  transform: translatey(0);
}
</style>
