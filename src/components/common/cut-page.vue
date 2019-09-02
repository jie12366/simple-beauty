<template>
    <el-pagination
            layout="prev, pager, next"
            :page-size="size"
            :current-page="index"
            :total="total" class="pageCut" @current-change="changePage">
        </el-pagination>
</template>
<script>
export default {
    props: [
        'size',
        'index',
        'total'
    ],
    methods: {
        changePage (index) {
            this.index = index
            this.$parent.getArticles(index - 1, this.size)
        }
    }
}
</script>
<style lang="scss" scoped>
.pageCut{
    position: absolute;
    width: 100%;
    margin-top: 100px;
    text-align: center;
}
</style>
