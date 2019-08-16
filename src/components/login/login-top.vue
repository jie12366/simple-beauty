<template>
    <div class="wrap">
        <div class="form">
            <section class="form-top">
                <router-link to="/sign-in">
                    <span style="margin-right:20px">登录</span>
                </router-link><em style="font-size:23px">·</em>
                <router-link to="/sign-up">
                    <span style="margin-left:20px">注册</span>
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
        margin-top:-40px;
        margin-bottom: 40px;
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
</style>
