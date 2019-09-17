<template>
    <div class="wrap">
        <router-link to="/home"><span class="title">Canary</span></router-link>
        <div class="form">
            <section class="form-top">
                <router-link to="/sign-in">
                    <span style="margin-right:20px;font-size:20px">登录</span>
                </router-link><em style="font-size:23px">·</em>
                <router-link to="/sign-up">
                    <span style="margin-left:20px;font-size:20px">注册</span>
                </router-link>
            </section>
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import '../../style/login';
    @import '../../style/mixin';
    .form-top{
        margin-top:-30px;
        margin-bottom: 80px;
    }
    a{
        @include sc(20px,#a49f9e);
        text-decoration: none;
        &:hover{
            color:#ea705b !important;
        }
        &:visited,&:active{
            color:#a49f9e;
        }
    }
    .router-link-active{
        color:#ea705b !important;
        font-weight: 700;
    }
    .title{
        position: absolute;
        left: 10vw;
        top:150px;
        @include sc(60px,#1f1d1a);
        font: {
            weight:400;
            family:'calgary';
        }
        &:hover{
            color:#ea705b;
        }
        @media screen and(max-width: 900px) {
            left: 2vw;
            @include sc(50px,#1f1d1a);
        }
    }
</style>
