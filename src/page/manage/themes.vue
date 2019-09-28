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
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </section>
            <el-divider></el-divider>
            <section>
                <h2>侧边背景</h2>
                <el-upload
                    class="avatar-uploader"
                    action="#"
                    :show-file-list="false"
                    :http-request="uploadImg">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </section>
            <el-divider></el-divider>
            <div>
                <h2>代码样式</h2>
                <el-select v-model="value" @change="changeStyle" placeholder="请选择">
                <el-option
                    v-for="item in styles"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <pre>
                    <code class="java">
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
        </side-bar>
    </div>
</template>
<script>
import axios from '@/service/http'
import baseURL from '@/service/base-url'
import sideBar from '@/components/navbar/manage-side-bar'
import hljs from 'highlight.js'

// 动态加载highlight样式
function highlight (props) {
    require('highlight.js/styles/' + props + '.css')
}
const highlightCode = () => {
    // 使用highlightjs高亮代码(pre标签)
    const preEl = document.querySelectorAll('pre')
    preEl.forEach((el) => {
        hljs.highlightBlock(el)
    })
}
export default {
    data () {
        return {
            uid: this.$store.state.uid,
            indexBackground: '',
            dialogVisible: false,
            showUpload: true,
            imageUrl: '',
            styles: [{
                value: 'atelier-cave-dark',
                label: 'atelier-cave-dark'
            }, {
                value: 'atelier-cave-light',
                label: 'atelier-cave-light'
            }, {
                value: 'atelier-lakeside-dark',
                label: 'atelier-lakeside-dark'
            }, {
                value: 'github',
                label: 'github'
            }, {
                value: 'ir-black',
                label: 'ir-black'
            }, {
                value: 'mono-blue',
                label: 'mono-blue'
            }, {
                value: 'nord',
                label: 'nord'
            }, {
                value: 'paraiso-dark',
                label: 'paraiso-dark'
            }, {
                value: 'paraiso-light',
                label: 'paraiso-light'
            }, {
                value: 'shades-of-purple',
                label: 'shades-of-purple'
            }, {
                value: 'sunburst',
                label: 'sunburst'
            }, {
                value: 'vs-2015',
                label: 'vs-2015'
            }, {
                value: 'vs',
                label: 'vs'
            }],
            value: ''
        }
    },
    created () {
        this.getTheme()
    },
    mounted () {
        highlight(this.value)
        highlightCode()
    },
    updated () {
        highlight(this.value)
        highlightCode()
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
                        this.imageUrl = res.data.data.indexBackground
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
                    this.imageUrl = res.data.indexBackground
                    this.value = res.data.style
                }
            })
        },
        // 修改样式
        changeStyle (value) {
            this.$api.theme.updateStyle(value, this.uid)
            .then(res => {
                if (res.code === 1) {
                    highlight(value)
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
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
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
