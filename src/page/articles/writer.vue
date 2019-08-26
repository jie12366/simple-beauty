<template>
    <div>
        <div class="top">
            <el-input type="text" class="title" placeholder="输入文章标题" v-model="title" maxlength="100" show-word-limit></el-input>
            <span class="btn">
                <el-button type="primary" class="publish" @click="publish" plain>发表文章</el-button>
                <el-dropdown placement="bottom-start" @command="handleCommand">
                    <img class="head_img" :src="imgUrl" />
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item icon="icon-vue-mine" command='/mine'>我的主页</el-dropdown-item>
                        <el-dropdown-item icon="icon-vue-index" command='/home'>首页</el-dropdown-item>
                        <el-dropdown-item icon="icon-vue-exit1" style="margin-left:2px;" command="exit">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </span>
        </div>
        <el-dialog title="发布文章" :visible.sync="showDialog">
            <el-form>
                <el-form-item>
                    <span class="input-span">文章标签：</span>
                    <el-tag :key="tag" v-for="tag in tags" closable @close="closeTag(tag)">{{tag}}</el-tag>
                    <el-input class="input-new-tag" v-if="tagInputVisible" v-model="tagValue" @keyup.native="fitTagWidth" v-bind:style="{width:tagLen + 'px'}" ref="saveTagInput" size="small" @keyup.enter.native="handleTagConfirm" @blur="handleTagConfirm"></el-input>
                    <el-button v-else class="button-new-tag" icon="icon-vue-add" size="small" plain @click="showInputTag"><span style="color:#666666;font-size:14px;">添加标签</span></el-button>
                </el-form-item>
                <el-form-item>
                    <span class="input-span">个人分类：</span>
                    <el-tag :key="category" v-for="category in categorys" closable @close="closeCategory(category)">{{category}}</el-tag>
                    <el-input class="input-new-tag" v-if="categoryInputVisible" v-model="categoryValue" @keyup.native="fitCategoryWidth" v-bind:style="{width:categoryLen + 'px'}" ref="saveTagInput" size="small" @keyup.enter.native="handleCategoryConfirm" @blur="handleCategoryConfirm"></el-input>
                    <el-button v-else class="button-new-tag" icon="icon-vue-add" size="small" plain @click="showInputCategory"><span style="color:#666666;font-size:14px;">添加个人分类</span></el-button>
                    <section class="infinite-list category" style="overflow:auto">
                        <el-checkbox-group v-model="checkedList" style="margin-left:10px">
                            <el-checkbox :key="index" v-for="(category, index) in categoryList" :label="category">{{category}}</el-checkbox>
                        </el-checkbox-group>
                    </section>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showDialog = false" size="small">取 消</el-button>
                <el-button type="success" @click="finshPublish">发布文章</el-button>
            </div>
        </el-dialog>
        <mavon-editor v-model="content" ref=md @imgAdd="$imgAdd" :codeStyle="codeStyle" @imgDel="$imgDel" class="content" :scrollStyle="scrollStyle"></mavon-editor>
    </div>
</template>
<script>
const jwt = require('jsonwebtoken')
export default {
    data () {
        return {
            content: '', // 文章内容
            title: '', // 文章标题
            scrollStyle: true,
            codeStyle: 'atelier-lakeside-dark',
            imgUrl: this.$store.state.imgUrl,
            showDialog: false, // 对话框是否可见
            tags: [], // 标签集合
            categorys: [], // 新增分类集合
            categoryList: ['测试1', '测试2'], // 所有分类集合
            checkedList: [], // 选中的分类
            tagInputVisible: false, // 标签输入框是否可见
            categoryInputVisible: false, // 分类输入框是否可见
            tagValue: null, // 标签输入框的值
            categoryValue: null, // 分类输入框的值
            tagLen: 50, // 标签输入框的长度
            categoryLen: 50, // 分类输入框的长度
            imgList: [], // 上传的图片集合
            uid: jwt.decode(this.$store.state.token).aud
        }
    },
    watch: {
        // 监听checkList，最多添加一个分类
        checkedList: function (newVal, oldVal) {
            if (this.checkedList.length > 1) {
                this.$message.error('最多选择1个分类')
                this.checkedList = oldVal
            }
        }
    },
    methods: {
        // 上传图片
        $imgAdd (pos, $file) {
            // 首先将图片上传到服务器
            this.$api.articles.uploadImage($file)
            .then(res => {
                // 将返回的图片地址替换到文本中
                this.$refs.md.$img2Url(pos, res.data)
                this.imgList.push(res.data)
            })
        },
        // 删除图片
        $imgDel (pos) {
            this.imgList.splice(this.imgList.indexOf(pos[0]), 1)
        },
        // 操作下拉菜单指令
        handleCommand (command) {
            if (command === 'exit') {
                this.$router.go(-1)
            } else {
                this.$router.push(command)
            }
        },
        // 点击发布文章
        publish () {
            if (this.title === '') {
                this.$message.error('标题不能为空')
            } else if (this.content === '') {
                this.$message.error('文章内容不能为空')
            } else {
                this.showDialog = true
            }
        },
        // 关闭标签
        closeTag (tag) {
            this.tags.splice(this.tags.indexOf(tag), 1)
        },
        // 关闭分类
        closeCategory (category) {
            this.categorys.splice(this.categorys.indexOf(category), 1)
            this.categoryList.splice(this.categoryList.indexOf(category), 1)
            this.checkedList.splice(this.checkedList.indexOf(category), 1)
        },
        // 展示输入框
        showInputTag () {
            this.tagInputVisible = true
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus()
            })
            this.tagLen = 50
        },
        showInputCategory () {
            this.categoryInputVisible = true
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus()
            })
            this.categoryLen = 50
        },
        // 标签输入确认
        handleTagConfirm () {
            let tagValue = this.tagValue
            if (tagValue) {
                if (this.tags.length === 5) {
                    this.$message.error('最多添加5个标签')
                } else {
                    this.tags.push(tagValue)
                }
            }
            this.tagInputVisible = false
            this.tagValue = ''
        },
        // 分类输入确认
        handleCategoryConfirm () {
            let categoryValue = this.categoryValue
            if (categoryValue) {
                if (this.checkedList.length === 1) {
                    this.$message.error('最多添加1个分类')
                } else {
                    this.categorys.push(categoryValue)
                    this.categoryList.push(categoryValue)
                    this.checkedList.push(categoryValue)
                }
            }
            this.categoryInputVisible = false
            this.categoryValue = ''
        },
        // 自适应标签输入框宽度
        fitTagWidth () {
            if (this.tagValue.length > 1) {
                this.tagLen = this.tagValue.length * 30
            }
        },
        // 自适应分类输入框宽度
        fitCategoryWidth () {
            if (this.categoryValue.length > 1) {
                this.categoryLen = this.categoryValue.length * 30
            }
        },
        // 完成文章发布
        finshPublish () {
            let data = {
                'title': this.title,
                'contentMd': this.content,
                'contentHtml': this.$refs.md.d_render,
                'tags': this.tags,
                'category': this.checkedList[0],
                'uid': this.uid
            }
            console.log(data)
            this.$api.articles.saveArticles(data)
            .then(res => {
                if (res.code === 1) {
                    this.$message.success('发布成功')
                    this.showDialog = false
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '../../style/mixin.scss';
    .top{
        position: relative;
        top: 0px;
        margin-bottom: 40px;
    }
    .title{
        width: 80%;
        @media screen and (max-width: 1000px){
            width: 60%;
        }
        @media screen and (max-width: 500px){
            width: 50%;
        }
    }
    .content{
        height: 92vh;
    }
    .btn{
        width: 15%;
        position: relative;
        margin-left: 30px;
        @media screen and (max-width: 1000px){
            width: 35%;
        }
        @media screen and (max-width: 500px){
            width: 45%;
        }
        .publish{
            margin-top: -20px;
        }
        .head_img{
            position: relative;
            width: 80px;
            height: 80px;
            top:30px;
            margin-left:40px;
            border-radius: 50%;
        }
    }
    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 45px;
        line-height: 45px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 150px;
        margin-left: 10px;
        vertical-align: bottom;
    }
    .input-span{
        @include sc(32px,#666666)
    }
    .category{
        width:80%;
        height: 350px;
        margin-left:180px;
        background-color: #f5f5f5;
        @media screen and (max-width:800px) {
            width:100%;
            margin-left:0px;
        }
    }
</style>
