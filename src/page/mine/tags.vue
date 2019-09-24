<template>
    <mine :uid="uid">
        <div>
            <span class="title">标签墙</span>
            <ul class="tags">
                <li :key="index" v-for="(item, name, index) in tags">
                    <span class="tag" @click="toNote(name)">{{name}}</span><span> - {{item}}篇</span>
                </li>
            </ul>
        </div>
    </mine>
</template>
<script>
import mine from '@components/common/mine'
export default {
    data () {
        return {
            uid: this.$route.params.uid,
            tags: [] // 标签集合
        }
    },
    created () {
        this.getTags()
    },
    methods: {
        getTags () {
            console.log(this.uid)
            this.$api.articles.getTags(this.uid)
            .then(res => {
                if (res.code === 1) {
                    this.tags = res.data
                }
            })
        },
        toNote (tag) {
            this.$router.push(`tag/${tag}`)
        }
    },
    components: {
        mine
    }
}
</script>
<style lang="scss" scoped>
@import '../../style/mixin.scss';
.title{
    position: relative;
    left: 45%;
    text-align: center;
    @include sc(50px,#303133)
}
.tags{
    position: relative;
    top: 80px;
    padding: 50px;
    background-color: #f8fbfd;
    width: 70%;
    margin: auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    @media screen and (max-width: 500px) {
        width: 90%;
    }
    li{
        position: relative;
        list-style-type: none;
        padding: 20px;
        @include sc(28px,#606266);
        .tag{
            color:#9933FF;
            &:hover{
                color: #303133;
                text-decoration: underline;
                cursor: pointer;
            }
        }
    }
}
</style>
