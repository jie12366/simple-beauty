<template>
    <mine :uid="uid">
        <div class="photo">
            <section>
                <div :key="index" v-for="(img,index) in imgList" :style="{width:img.width + 'px',flexGrow:img.flex}">
                    <i :style="{paddingBottom:img.padding + '%'}"></i>
                    <img :src="img.url" :alt="img.alt">
                </div>
            </section>
        </div>
    </mine>
</template>
<script>
import mine from '@components/common/mine'
export default {
    data () {
        return {
            uid: parseInt(this.$route.params.uid),
            imgList: []
        }
    },
    created () {
        this.getPhotos()
    },
    methods: {
        // 获取照片集
        getPhotos () {
            this.$api.manage.getPhotos(this.uid)
            .then(res => {
                console.log(res)
                if (res.code === 50001) {
                    this.$message.error('没有数据')
                } else if (res.code === 1) {
                    this.imgList = res.data.photos
                    for (let i = 0; i < this.imgList.length; i++) {
                        let img = new Image()
                        img.src = this.imgList[i].url
                        const vm = this
                        img.onload = function () {
                            console.log(img.width)
                            vm.imgList[i].width = img.width * 200 / img.height
                            vm.imgList[i].flex = img.width * 200 / img.height
                            vm.imgList[i].padding = img.height / img.width * 100
                            vm.imgList.splice(i, 1, vm.imgList[i])
                        }
                        console.log(this.imgList)
                    }
                }
            })
        }
    },
    components: {
        mine
    }
}
</script>
<style lang="scss" scoped>
.photo{
    position: relative;
    padding-top: 150px;
    padding-bottom: 300px;
    section {
        display: flex;
        flex-wrap: wrap;
        }
        section::after {
        content: '';
        flex-grow: 999999999;
        }
        div {
        margin: 2px;
        position: relative;
        }
        i{
        display: block;
        }
        img {
        position: absolute;
        top: 0;
        width: 100%;
        vertical-align: bottom;
    }
}
</style>
