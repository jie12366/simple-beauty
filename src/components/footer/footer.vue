<template>
    <div class="footer">
        <div>总访问量：{{reads}}次</div>
        <span>copyright ©️{{nickname}}</span>
        <span>powered by jie</span>
    </div>
</template>
<script>
export default {
    props: [
        'reads',
        'nickname'
    ]
}
</script>
<style lang="scss" scoped>
    .footer{
        position: relative;
        top: 10px;
    }
</style>
