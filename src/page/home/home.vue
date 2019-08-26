<template>
    <div>
        <nav-top></nav-top>
        <div class="container">
            <el-carousel class="carousel" height="300px">
                <el-carousel-item :key="index" v-for="(url, index) in imgUrls">
                    <el-image class="img" fit="cover" :src="url"/>
                </el-carousel-item>
            </el-carousel>
            <section>
                
            </section>
        </div>
    </div>
</template>
<script>
import navTop from '@/components/top/nav-top'
export default {
    data () {
        return {
            imgUrls: [
                '../../../static/house.png',
                '../../../static/firefly.png',
                '../../../static/keyword.jpg',
                '../../../static/outdoor.png'
            ],
            articles: [], // 文章列表
        }
    },
    created () {
        this.getArticles()
    },
    methods: {
        // 获取文章列表
        getArticles () {
            
        }
    },
    components: {
        navTop
    }
}
</script>

<style lang="scss" scoped>
    @import '../../style/mixin';
    .container{
        width:35vw;
        margin-left: 32%;
        position: relative;
        top: 80px;
        @media screen and (max-width: 1200px) {
            width:50vw;
            margin-left: 25%;
        }
        @media screen and (max-width: 500px) {
            width:75vw;
            margin-left: 10%;
        }
    }
    .carousel{
        .img{
            width:35vw;
            height:40vh;
            top: 80px;
            @media screen and (max-width: 1200px) {
                width:50vw;
            }
            @media screen and (max-width: 500px) {
                width:75vw;
            }
        }
    }
</style>
