<template>
    <div>
        <div>
            <el-input type="text" class="title" placeholder="输入文章标题" v-model="title" maxlength="100" show-word-limit></el-input>
            <el-button class="publish-btn">发表文章</el-button>
        </div>
        <mavon-editor v-model="content" ref=md @imgAdd="$imgAdd" class="content" :scrollStyle="scrollStyle"></mavon-editor>
    </div>
</template>
<script>
export default {
    data () {
        return {
            content: '', // 文章内容
            title: '', // 文章标题
            scrollStyle: true
        }
    },
    methods: {
        $imgAdd (pos, $file) {
            // 首先将图片上传到服务器
            this.$api.articles.uploadImage($file)
            .then(res => {
                // 将返回的图片地址替换到文本中
                this.$refs.md.$img2Url(pos, res.data)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '../../style/mixin.scss';
    .title{
        width: 80vw;
        margin-top: 10px;
        margin-bottom: 20px;
        margin-left: 40px;
        position: relative;
    }
    .content{
        height: 92vh;
    }
    .publish-btn{
        margin-left: 2vw;
    }
</style>
