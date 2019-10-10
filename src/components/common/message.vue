<template>
    <div>
        <side-bar>
            <div>
                <section :key="index" v-for="(item, index) in messageList" @click="clearMessage(item.id, item.uid, item.hasRead)">
                    <el-row class="title-bottom">
                        <el-col :xs="18" :sm="20" :md="18" :lg="22">
                            <span @click="toUser(item.nickname, item.uid)" class="nickname">{{item.nickname}}</span><el-badge :is-dot="!item.hasRead"><span>{{item.message}}&nbsp;</span></el-badge>
                        </el-col>
                        <el-col :xs="6" :sm="4" :md="6" :lg="2">
                            <span></span>
                            <span class="delete" @click="toDelete(item.id)"> 删除</span>
                        </el-col>
                    </el-row>
                    <el-row class="title-bottom">
                        <el-col :xs="18" :sm="20" :md="18" :lg="22">
                            <span @click="toDetails(item.uid, item.aid)" class="title">
                                {{item.title}}
                            </span>
                        </el-col>
                        <el-col :xs="6" :sm="4" :md="6" :lg="2" style="padding-top:7px;">
                            <span class="time">{{item.mtime}}</span>
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
import sideBar from '@/components/navbar/message-side-bar'
import moment from 'moment'
export default {
    data () {
        return {
            messageList: [],
            uid: this.$store.state.uid,
            index: 0,
            size: 10,
            total: 0
        }
    },
    props: [
        'type'
    ],
    mounted () {
        this.getMessageList(0, this.size)
    },
    methods: {
        // 获取消息列表
        getMessageList (index, size) {
            this.$api.message.getMessageList(this.uid, this.type, index, size)
            .then(res => {
                console.log(res.data)
                if (res.code === 1) {
                    this.messageList = res.data.content
                    this.total = res.data.totalElements
                    this.messageList.forEach(function (message) {
                        message.mtime = moment(message.mtime).fromNow()
                    })
                }
            })
        },
        changePage (index) {
            this.index = index
            this.getArticles(index - 1, this.size)
        },
        // 已读消息
        clearMessage (id, uid, hasRead) {
            if (!hasRead) {
                this.$api.message.changeState(id, uid)
                .then(res => {
                    console.log(res)
                    if (res.code === 1) {
                        this.getMessageList(0, this.size)
                    }
                })
            }
        },
        // 跳转到用户
        toUser (nickName, uid) {
            this.$router.push(`/${nickName}/${uid}/index?`)
        },
        // 跳转到文章详情
        toDetails (uid, aid) {
            this.$router.push(`/users/${uid}/articles/${aid}`)
        },
        // 删除消息
        toDelete (id) {
            this.$confirm('你确认删除该消息吗?', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$api.message.deleteMessage(id)
                .then(res => {
                    if (res.code === 1) {
                        this.getMessageList(0, this.size)
                        this.$message({
                            message: '删除成功',
                            type: 'success',
                            duration: 1000
                        })
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消删除'
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
    padding-top: 15px;
    @include sc(30px,#333333);
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
    padding-left: 30px;
    text-align: left;
    @include sc(25px,#666666);
    i{
        @include sc(25px,#CCCCCC);
        padding-right:10px;
        padding-left:15px;
    }
    .nickname{
        color:#6666CC;
        padding-right:10px;
        &:hover{
            cursor: pointer;
            color: #ea705b;
            text-decoration: underline;
        }
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
