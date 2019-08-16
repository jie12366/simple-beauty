<template>
    <span class="warn" v-bind:class="{hide: isHide}">
        <em>{{msg}}</em>&nbsp;
        <font-awesome-icon icon="exclamation-circle"></font-awesome-icon>
    </span>
</template>

<script>
export default {
    props: [
        'msg',
        'isHide'
    ]
}
</script>
