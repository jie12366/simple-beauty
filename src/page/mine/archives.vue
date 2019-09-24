<template>
    <mine :uid="uid">
        <div>
            <span class="title">归档</span>
            <ul class="archives">
                <li :key="index" v-for="(item, name, index) in archives">
                    <span class="archive" @click="toNote(name)">{{name}}</span><span> - {{item}}篇</span>
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
            archives: [] // 标签集合
        }
    },
    created () {
        this.getArchives()
    },
    methods: {
        getArchives () {
            this.$api.articles.getArchives(this.uid)
            .then(res => {
                console.log(res)
                if (res.code === 1) {
                    this.archives = res.data
                }
            })
        },
        toNote (archive) {
            this.$router.push(`archive/${archive}`)
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
.archives{
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
        .archive{
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
