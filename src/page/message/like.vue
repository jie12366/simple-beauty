<template>
    <div>
        <side-bar>
            <div>
                <section :key="index" v-for="(item, index) in likeList" @click="clearMessage(item.uid, item.aid, item.hasRead)">
                    <el-row class="title-bottom">
                        <el-col :xs="18" :sm="20" :md="18" :lg="22">
                            <span @click="toUser(item.nickname, item.uid)" class="nickname">{{item.nickname}}</span><el-badge :is-dot="!item.hasRead"><span>{{item.message}}&nbsp;</span></el-badge>
                        </el-col>
                        <el-col :xs="6" :sm="4" :md="6" :lg="2">
                            <span></span>
                            <span class="delete" @click="toDelete(item.aid, item.uid)"> 删除</span>
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
                    :total="total" class="pageCut" v-bind:current-change="changePage">
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
            likeList: [],
            uid: this.$store.state.uid,
            index: 0,
            size: 10,
            total: 0
        }
    },
    mounted () {
        this.getLikeList(0, this.size)
    },
    methods: {
        getLikeList (index, size) {
            this.$api.message.getLikeList(this.uid, index, size)
            .then(res => {
                console.log(res.data)
                if (res.code === 1) {
                    this.likeList = res.data.content
                    this.total = res.data.totalElements
                    this.likeList.forEach(function (like) {
                        like.mtime = moment(like.mtime).fromNow()
                    })
                }
            })
        },
        changePage (index) {
            this.index = index
            this.getArticles(index - 1, this.size)
        },
        clearMessage (uid, aid, hasRead) {
            if (!hasRead) {
                this.$api.message.changeState(uid, aid, 'like')
                .then(res => {
                    console.log(res)
                    if (res.code === 1) {
                        this.getLikeList(0, this.size)
                    }
                })
            }
        },
        toUser (nickName, uid) {
            this.$router.push(`/${nickName}/${uid}/index?`)
        },
        toDetails (uid, aid) {
            this.$router.push(`/users/${uid}/articles/${aid}`)
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
