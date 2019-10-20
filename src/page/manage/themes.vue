<template>
    <div>
        <side-bar>
            <section>
                <h2>主页背景</h2>
                <el-upload
                    class="avatar-uploader"
                    action="#"
                    :show-file-list="false"
                    :http-request="uploadImg">
                    <img v-if="indexImage" :src="indexImage" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </section>
            <el-divider></el-divider>
            <section style="height:180px">
                <h2>侧边背景</h2>
                <el-upload
                    class="avatar-uploader"
                    action="#"
                    :show-file-list="false"
                    :http-request="uploadSide">
                    <img v-if="sideImage" :src="sideImage" class="avatar2">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </section>
            <el-divider></el-divider>
            <div>
                <h2>代码样式(暂时还不支持自定义)</h2>
                <el-select v-model="value" placeholder="请选择">
                <el-option
                    v-for="item in styles"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <pre class="line-numbers">
                    <code class="language-java">
/**
 * @author monJay
*/
package l2f.gameserver.model;

public abstract class L2Char extends L2Object {
  public static final Short ERROR = 0x0001;

  public void moveTo(int x, int y, int z) {
    _ai = null;
    log("Should not be called");
    if (1 > 5) { // wtf!?
      return;
    }
  }
}
                    </code>
                </pre>
            </div>
            <div>
                <el-button @click="revertSetting" type="success" size="small">还原设置</el-button>
            </div>
        </side-bar>
    </div>
</template>
<script>
import axios from '@/service/http'
import baseURL from '@/service/base-url'
import sideBar from '@/components/navbar/manage-side-bar'
import Prism from 'prismjs'
import 'prismjs/themes/prism.css'
import 'prismjs/components/prism-java'
Prism.highlightAll()

export default {
    data () {
        return {
            uid: this.$store.state.uid,
            indexBackground: '',
            dialogVisible: false,
            showUpload: true,
            indexImage: '',
            sideImage: '',
            styles: [{
                value: 'default',
                label: 'default'
            }],
            value: ''
        }
    },
    created () {
        this.getTheme()
    },
    mounted () {
        Prism.highlightAll()
    },
    methods: {
        // 重写上传图片的方法
        uploadImg (f) {
            let formdata = new FormData()
            formdata.append('img', f.file)
            formdata.append('uid', this.uid)
            axios({
                url: baseURL + '/indexBackground',
                method: 'put',
                data: formdata,
                headers: {'Content-Type': 'multipart/form-data'}
                }).then(res => {
                    if (res.data.code === 30003) {
                        this.$message({
                            message: '数据错误',
                            type: 'error',
                            duration: 1000
                        })
                    } else if (res.data.code === 1) {
                        console.log(res.data)
                        this.indexImage = res.data.data.indexBackground
                    }
                }).then(error => {
                    console.log(error)
            })
        },
        uploadSide (f) {
            let formdata = new FormData()
            formdata.append('img', f.file)
            formdata.append('uid', this.uid)
            axios({
                url: baseURL + '/sideBackground',
                method: 'put',
                data: formdata,
                headers: {'Content-Type': 'multipart/form-data'}
                }).then(res => {
                    if (res.data.code === 30003) {
                        this.$message({
                            message: '数据错误',
                            type: 'error',
                            duration: 1000
                        })
                    } else if (res.data.code === 1) {
                        console.log(res.data)
                        this.sideImage = res.data.data.sideBackground
                    }
                }).then(error => {
                    console.log(error)
            })
        },
        // 获取主题
        getTheme () {
            this.$api.theme.getTheme(this.uid)
            .then(res => {
                if (res.code === 1) {
                    console.log(res.data)
                    this.indexImage = res.data.indexBackground
                    this.sideImage = res.data.sideBackground
                    this.value = res.data.style
                }
            })
        },
        // 还原设置
        revertSetting () {
            this.$api.theme.revert(this.uid)
            .then(res => {
                if (res.code === 1) {
                    this.getTheme()
                    this.$message({
                        message: '还原成功',
                        type: 'success',
                        duration: 1000
                    })
                }
            })
        }
    },
    components: {
        sideBar
    }
}
</script>
<style lang="scss" scoped>
@import '../../style/mixin.scss';
section{
    height: 200px;
    display: flex;
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 300px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 300px;
        height: 178px;
        display: block;
    }
    .avatar2{
        width: 200px;
        height: 350px;
        display: block;
    }
}
h2{
    font-size: 32px;
    margin-left: 100px;
    margin-right: 100px;
}
div{
    text-align: left;
    font-size: 34px;
}
</style>
