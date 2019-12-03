<template>
    <div>
        <div class="top">
            <el-input type="text" class="title" placeholder="输入文章标题" v-model="title" maxlength="100" show-word-limit></el-input>
            <span class="btn">
                <el-button type="primary" class="publish" @click="publish" plain>发表文章</el-button>
                <el-dropdown placement="bottom-start" @command="handleCommand">
                    <img class="head_img" :src="imgUrl" />
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item icon="icon-vue-mine" :command="`/${this.account}/${this.uid}/index?`">我的主页</el-dropdown-item>
                        <el-dropdown-item icon="icon-vue-index" command='/home'>首页</el-dropdown-item>
                        <el-dropdown-item icon="icon-vue-exit1" style="margin-left:2px;" command="exit">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </span>
        </div>
        <el-dialog title="发布文章" :visible.sync="showDialog" :width="width">
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
                <section>
                    <span class="input-span">发布形式：</span>
                    <el-radio v-model="type" label="public">公开</el-radio>
                    <el-radio v-model="type" label="encrypt">加密</el-radio>
                </section>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showDialog = false" size="small">取 消</el-button>
                <el-button type="success" @click="finshPublish">发布文章</el-button>
            </div>
        </el-dialog>
        <textarea id="content"></textarea>
    </div>
</template>
<script>
import prism from 'markdown-it-prism'
// 引入需要高亮的语言：java、kotlin、c、cpp、python、bash、lua、vim、yaml、docker、git、json
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-kotlin'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-lua'
import 'prismjs/components/prism-vim'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-docker'
import 'prismjs/components/prism-git'
import 'prismjs/components/prism-json'

export default {
    data () {
        return {
            content: null, // 文章内容,md格式
            contentHtml: null, // 文章内容,html格式
            title: '', // 文章标题
            scrollStyle: true,
            imgUrl: this.$store.state.imgUrl,
            showDialog: false, // 对话框是否可见
            tags: [], // 标签集合
            categorys: [], // 新增分类集合
            categoryList: [], // 所有分类集合
            checkedList: [], // 选中的分类
            tagInputVisible: false, // 标签输入框是否可见
            categoryInputVisible: false, // 分类输入框是否可见
            tagValue: null, // 标签输入框的值
            categoryValue: null, // 分类输入框的值
            tagLen: 50, // 标签输入框的长度
            categoryLen: 50, // 分类输入框的长度
            type: 'public', // 发布形式
            pwd: '', // 文章加密密码
            imgList: [], // 上传的图片集合
            uid: this.$store.state.uid,
            account: this.$store.state.account,
            aid: parseInt(this.$route.query.aid) || 0,
            width: '50%',
            screenWidth: document.body.clientWidth // 屏幕宽度
        }
    },
    created () {
        this.getCategorys(this.uid)
        // 如果存在本地存储，则读取数据
        this.content = window.localStorage.getItem(this.uid) || ''
        console.log(this.aid)
        if (this.aid > 0) {
            this.getArticle()
            this.getArticleContent()
        }
    },
    mounted () {
        if (this.aid === 0) {
            this.initEditor()
        }
        const that = this
        // 监听屏幕宽度变化
        window.onresize = () => {
            return (() => {
                that.screenWidth = document.documentElement.clientWidth
            })()
        }
        if (this.screenWidth < 600) {
            this.width = '90%'
            this.defaultOpen = 'edit'
            this.toolbars = this.toolbars1
        } else {
            this.width = '50%'
            this.defaultOpen = ''
            this.toolbars = this.toolbars2
        }
    },
    watch: {
        // 监听屏幕宽度
        screenWidth (val) {
            this.screenWidth = val
            if (this.screenWidth < 600) {
                this.width = '90%'
                this.defaultOpen = 'edit'
                this.toolbars = this.toolbars1
            } else {
                this.width = '50%'
                this.defaultOpen = ''
                this.toolbars = this.toolbars2
            }
        },
        // 监听checkList，最多添加一个分类
        checkedList: function (newVal, oldVal) {
            if (this.checkedList.length > 1) {
                this.tip('最多添加1个分类', 'warning')
                this.checkedList = oldVal
            }
        },
        // 监听文章类型，如果是加密类型，则显示弹框，提示输入密码
        type (newVal) {
            if (newVal === 'encrypt' && this.pwd === '') {
                this.$prompt('请输入密码', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^[0-9a-zA-Z]{6,20}$/,
                    inputErrorMessage: '密码格式不正确'
                }).then(({value}) => {
                    this.pwd = value
                    this.$message({
                        message: '您的密码是' + value,
                        type: 'success',
                        duration: 1000
                    })
                }).catch(() => {
                    this.type = 'public'
                })
            }
        },
        // 监听文章内容，如果变化则存入localStorage
        content (val) {
            window.localStorage.setItem(this.uid, val)
        }
    },
    methods: {
        initEditor () {
            var that = this
            var HyperMD = require('hypermd')
            // 加载需要高亮的模式
            require('codemirror/mode/haml/haml.js')
            require('codemirror/mode/javascript/javascript.js')
            require('codemirror/mode/python/python.js')
            require('codemirror/mode/go/go.js')
            require('codemirror/mode/lua/lua.js')
            require('codemirror/mode/sql/sql.js')
            require('codemirror/mode/clike/clike.js') // clike包含了c、c++、java等
            require('hypermd/powerpack/fold-emoji-with-emojione') // 引入表情
            require('hypermd/powerpack/insert-file-with-smms') // 引入sm.sm，用于上传图片
            require('hypermd/powerpack/paste-with-turndown')
            var content = document.getElementById('content')
            var myEditor = HyperMD.fromTextArea(content, {
                mode: {
                    name: 'hypermd', // 编辑器加载模式 'hypermd'或者'codemirror'
                    strikethrough: true, // 删除线语法 ~~xx~~
                    front_matter: false, // 内容块变量 不需要该功能
                    orgModeMarkup: false, // 标记模式 同上
                    hashtag: false, // 标签语法 同上
                    table: true, // 表格
                    toc: true, // 文章目录
                    emoji: true // 表情符号
                },
                hmdFold: {
                    image: true,
                    link: true,
                    math: true,
                    html: false,
                    emoji: true
                },
                // 在粘贴之前将粘贴板的内容转换为Markdown
                hmdPaste: true,
                /* 自动加载代码高亮模式 */
                hmdModeLoader: '~codemirror/'
                // markdown解析的真实内容
            })
            myEditor.setSize(null, '85vh')
            myEditor.focus()
            // 如果内容不为空，就把编辑器内容初始化为改内容
            if (that.content !== null) {
                myEditor.setValue(that.content)
            }
            // 监听内容，如果变化则更新content
            myEditor.on('change', function (editor) {
                that.content = editor.getValue()
            })
        },
        // 获取文章内容
        getArticleContent () {
            this.$api.articles.getArticleByAid(this.aid)
            .then(res => {
                this.content = res.data.contentMd
                this.initEditor()
                console.log(res.data)
            })
        },
        // 获取文章数据
        getArticle () {
            this.$api.articles.getArticle(this.aid)
            .then(res => {
                console.log(res.data)
                this.title = res.data.title
                for (let i = 0; i < res.data.tags.length; i++) {
                    this.tags.push(res.data.tags[i].tag)
                }
                this.checkedList.push(res.data.category)
                this.pwd = res.data.pwd
                if (this.pwd === '') {
                    this.type = 'public'
                } else {
                    this.type = 'encrypt'
                }
            })
        },
        // 成功或错误提示
        tip (msg, type) {
            this.$message({
                message: msg,
                type: type,
                duration: 1000
            })
        },
        // 获取所有个人分类
        getCategorys (uid) {
            this.$api.articles.getCategorys(uid)
            .then(res => {
                if (res.data != null) {
                    // 获取键值对中的键的集合
                    var keys = Object.keys(res.data)
                    this.categoryList = keys
                }
            })
        },
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
                this.tip('标题不能为空', 'warning')
            } else if (this.content.length < 70) {
                this.tip('文章内容不能少于70字', 'warning')
            } else {
                this.getHtml()
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
                    this.tip('最多添加5个标签', 'warning')
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
                    this.tip('最多添加1个分类', 'warning')
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
                // 如果输入的是中文
                if (new RegExp('[\u4E00-\u9FA5]+').test(this.tagValue)) {
                    this.tagLen = this.tagValue.length * 30
                } else {
                    if (this.tagValue.length * 15 > 80) {
                        this.tagLen = this.tagValue.length * 10
                    } else {
                        this.tagLen = 80
                    }
                }
            }
        },
        // 自适应分类输入框宽度
        fitCategoryWidth () {
            if (this.categoryValue.length > 1) {
                if (new RegExp('[\u4E00-\u9FA5]+').test(this.categoryValue)) {
                    this.categoryLen = this.categoryValue.length * 30
                } else {
                    if (this.categoryValue.length * 15 > 80) {
                        this.categoryLen = this.categoryValue.length * 10
                    } else {
                        this.categoryLen = 80
                    }
                }
            }
        },
        // 将markdown解析为html，并使用prism高亮代码
        getHtml () {
            var md = require('markdown-it')({
                linkify: true // 使类似URL的字符串链接化
            })
            var emoji = require('markdown-it-emoji') // 解析表情符号
            var anchor = require('markdown-it-anchor').default // 给标题添加id
            md.use(prism, {
                defaultLanguage: 'bash' // 如果没有指定语言，就默认为bash
            })
            md.use(anchor)
            md.use(emoji)
            this.contentHtml = md.render(this.content)
        },
        // 完成文章发布
        finshPublish () {
            const loading = this.$loading({
                lock: true,
                text: '发布中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            let data = {
                'title': this.title,
                'contentMd': this.content,
                'contentHtml': this.contentHtml,
                'tags': this.tags,
                'category': this.checkedList[0],
                'pwd': this.pwd,
                'uid': this.uid,
                'aid': this.aid
            }
            this.$api.articles.saveArticles(data)
            .then(res => {
                loading.close()
                console.log(data)
                if (res.code === 1) {
                    // 发布成功，删除本地存储
                    window.localStorage.removeItem(this.uid)
                    this.tip('发布成功', 'success')
                    this.showDialog = false
                    this.$router.push(`/${this.account}/${this.uid}/index`)
                } else {
                    this.tip('发布失败', 'error')
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
        font-size: 38px;
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
