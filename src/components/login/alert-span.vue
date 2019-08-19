<template>
    <span class="warn" v-show="isShow">
        <em>{{msg}}</em>&nbsp;
        <font-awesome-icon icon="exclamation-circle"></font-awesome-icon>
    </span>
</template>

<script>
export default {
    props: [
        'msg',
        'isShow'
    ]
}
</script>
