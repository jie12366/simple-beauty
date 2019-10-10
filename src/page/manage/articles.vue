<template>
    <div>
        <side-bar>
            <div>
                <section :key="index" v-for="(item, index) in postList">
                    <span @click="toDetails(item.uid, item.id)" class="title">
                        {{item.title}}
                    </span>
                    <el-row class="title-bottom">
                        <el-col :span="18">
                            <span><i class="icon iconfont icon-vue-date"></i>{{item.articleTime}}</span>
                        </el-col>
                        <el-col :span="6">
                            <span></span>
                            <span class="edit" @click="toEdit(item.id)">编辑</span>
                            <span class="delete" @click="toDelete(item.id, item.uid)"> 删除</span>
                        </el-col>
                    </el-row>
                    <el-divider></el-divider>
                </section>
                <el-pagination
                    layout="prev, pager, next"
                    :page-size="size"
                    :current-page="index"
                    :total="total" class="pageCut" @current-change="changePage">
                </el-pagination>
            </div>
        </side-bar>
    </div>
</template>
<script>
import sideBar from '@components/navbar/manage-side-bar'
import moment from 'moment'
export default {
    data () {
        return {
            postList: [],
            uid: this.$store.state.uid,
            index: 0,
            size: 10,
            total: 0,
            isEncrypt: false
        }
    },
    created () {
        this.getPosts(this.index, this.size)
    },
    methods: {
        getPosts (index, size) {
            this.$api.articles.getArticlesByUid(this.uid, index, size).then(res => {
                if (res.code === 1) {
                    this.postList = res.data.content
                    this.total = res.data.totalElements
                    this.postList.forEach(function (article) {
                        article.articleTime = moment(article.articleTime).format('YYYY-MM-DD HH:mm:ss')
                    })
                } else if (res.code === 50001) {
                    this.$message.info('还没写文章哦')
                }
            })
        },
        changePage (index) {
            this.index = index
            this.getArticles(index - 1, this.size)
        },
        toDetails (uid, aid) {
            this.$router.push(`/users/${uid}/articles/${aid}`)
        },
        toEdit (aid) {
            this.$router.push(`/writer?aid=${aid}`)
        },
        toDelete (aid, uid) {
            this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                this.$api.articles.deleteArticle(aid, uid)
                .then(res => {
                    if (res.code === 1) {
                        this.getPosts(0, this.size)
                        this.$message({
                            type: 'success',
                            message: '删除成功!',
                            duration: 1000
                        })
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除',
                    duration: 1000
                })
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
.title{
    position: relative;
    float: left;
    text-align: left;
    padding-left: 30px;
    @include sc(36px,#333333);
    -webkit-transition: all 0.5s linear;
    -moz-transition: all 0.5s linear;
    -ms-transition: all 0.5s linear;
    -o-transition: all 0.5s linear;
    transition: all 0.5s linear;
    &:hover{
        padding-left: 50px;
        text-decoration: underline;
        cursor: pointer;
    }
    @media screen and(max-width: 500px){
        @include sc(30px,#333333);
    }
}
.title-bottom{
    clear: both;
    padding-top: 15px;
    padding-left: 30px;
    text-align: left;
    @include sc(25px,#666666);
    i{
        @include sc(25px,#CCCCCC);
        padding-right:10px;
        padding-left:15px;
    }
    .edit,.delete{
        @include sc(22px,#99CCFF);
        &:hover{
            cursor: pointer;
            color: #ea705b;
            text-decoration: underline;
        }
    }
}
</style>
