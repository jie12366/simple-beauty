<template>
    <el-menu :default-active="activeIndex" text-color="#666666"
active-text-color="#ea705b" background-color="#ffffff" class="el-menu-demo" mode="horizontal" @select="handleSelect">
    <i class="icon iconfont icon-vue-jian"></i>
    <el-menu-item index="1" style="margin-left: 20%;font-size:18px;"><font-awesome-icon icon="home" style="margin-top:-3px;margin-right:3px"></font-awesome-icon>首页</el-menu-item>
    <el-menu-item index="2" style="font-size:18px;"><font-awesome-icon :icon="['far','bell']" style="margin-top:-3px;margin-right:3px"></font-awesome-icon>消息</el-menu-item>
    <el-menu-item index="3" style="font-size:18px;"><font-awesome-icon icon="heart" style="margin-top:-3px;margin-right:3px"></font-awesome-icon>关注</el-menu-item>
    <el-autocomplete class="inline-input search" :fetch-suggestions="querySearchAsync"
    v-model="state" placeholder="搜索" suffix-icon="el-icon-search" :class="{focus_search:searchFocus}"
    @focus="changeStyle" @blur="resumeStyle" @select="handleSelect" />
    <el-submenu index="4" class="mine">
        <template slot="title"><img class="head_img" src="@/images/head-boy.png"/></template>
        <el-menu-item index="4-1">我的主页</el-menu-item>
        <el-menu-item index="4-2">收藏的文章</el-menu-item>
        <el-menu-item index="4-3">喜欢的文章</el-menu-item>
        <el-menu-item index="4-4">设置</el-menu-item>
        <el-menu-item index="4-5">注销</el-menu-item>
    </el-submenu>
    <el-button icon="icon-vue-xiezuo" class="writer">&nbsp;写文章</el-button>
</el-menu>
</template>

<script>
export default {
    data () {
        return {
            activeIndex: '1',
            searchFocus: false
        }
    },
    methods: {
        changeStyle () {
            this.searchFocus = true
        },
        resumeStyle () {
            this.searchFocus = false
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '../../style/mixin.scss';
    .search{
        padding-top: 20px;
        margin-left: 100px;
        width: 15vw;
    }
    .focus_search{
        width: 20vw;
    }
    .icon-vue-jian{
        position: absolute;
        left:10vw;
        top: 1vh;
        @include sc(70px,#ea705b);
    }
    .writer{
        position: absolute;
        right:5vw;
        top:1vh;
        background-color: #f1967f;
        border-radius: 50px;
        @include sc(30px,azure);
        &:hover{
            background-color:#ea705b;
        }
    }
    .mine{
        position: absolute;
        right: 15vw;
        top:0vh;
        .head_img{
            width: 80px;
            height: 80px;
        }
    }
</style>
