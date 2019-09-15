<template>
    <div>
        <side-bar>
            <el-row>
                <el-col :span="6" class="left-span">
                    <div><i class="icon iconfont icon-vue-name"></i>name：</div>
                    <div><i class="icon iconfont icon-vue-email1"></i>email：</div>
                    <div><i class="icon iconfont icon-vue-github"></i>github：</div>
                    <div><i class="icon iconfont icon-vue-qq"></i>qq：</div>
                    <div><i class="icon iconfont icon-vue-introduce">introduction</i></div>
                </el-col>
                <el-col :span="18" class="right-text">
                    <el-input class="input" size="mini" v-model="name"></el-input>
                    <el-input class="input" size="mini" v-model="email"></el-input>
                    <el-input class="input" size="mini" v-model="github"></el-input>
                    <el-input class="input" size="mini" v-model="qq"></el-input>
                    <el-input type="textarea" size="mini" :autosize="{ minRows: 3, maxRows: 8}" class="textarea" v-model="introduction"></el-input>
                </el-col>
            </el-row>
            <el-button class="btn" size="mini" @click="save" round type="success">保存</el-button>
        </side-bar>
    </div>
</template>
<script>
import sideBar from '@/components/navbar/manage-side-bar'
export default {
    data () {
        return {
            name: '',
            email: '',
            github: '',
            qq: '',
            introduction: '',
            uid: this.$store.state.uid,
            method: 'post'
        }
    },
    created () {
        this.get()
    },
    methods: {
        get () {
            this.$api.manage.getIntroduce(this.uid)
            .then(res => {
                console.log(res)
                if (res.code === 1) {
                    let info = res.data
                    this.name = info.name
                    this.email = info.email
                    this.github = info.github
                    this.qq = info.qq
                    this.introduction = info.introduction
                    this.method = 'put'
                } else if (res.code === 50001) {
                    this.method = 'post'
                }
            })
        },
        save () {
            if (this.email !== '' && !/^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/.test(this.email)) {
                this.$message({
                    message: '邮箱格式不合法',
                    type: 'error',
                    duration: 1000
                })
            } else {
                let data = {
                    'uid': this.uid,
                    'name': this.name,
                    'email': this.email,
                    'github': this.github,
                    'qq': this.qq,
                    'introduction': this.introduction
                }
                if (this.method === 'post') {
                    this.$api.manage.saveIntroduce(data)
                    .then(res => {
                        console.log(res.data)
                        if (res.code === 1) {
                            this.$message({
                                message: '保存成功',
                                type: 'success',
                                duration: 1000
                            })
                        }
                    })
                } else if (this.method === 'put') {
                    this.$api.manage.updateIntroduce(data)
                    .then(res => {
                        console.log(res.data)
                        if (res.code === 1) {
                            this.$message({
                                message: '更新成功',
                                type: 'success',
                                duration: 1000
                            })
                        }
                    })
                }
            }
        }
    },
    components: {
        sideBar
    }
}
</script>
<style lang="scss" scoped>
@import '../../style/mixin.scss';
.left-span{
    @include sc(35px, #000);
    text-align: left;
    padding-left: 10%;
    div{
        padding-top:30px;
        padding-bottom:30px;
        i{
            margin-right: 10px;
        }
        .icon-vue-github{
            font-size: 40px;
            margin-right: 0px;
        }
        .icon-vue-qq{
            font-size: 35px;
            margin-right: 5px;
        }
        .icon-vue-introduce{
            margin-right: 0px;
        }
    }
}
.right-text{
    width: 50%;
    @media screen and(max-width: 1000px){
        padding-left: 20%;
        width: 70%;
    }
    .input{
        height: 30px;
        margin-top: 30px;
        margin-bottom: 50px;
    }
    .textarea{
        margin-top: 80px;
    }
}
.btn{
    margin-top: 80px;
    width: 150px;
}
</style>
