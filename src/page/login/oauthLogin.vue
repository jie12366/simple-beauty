<template>
  <div style="background-color: #CCCCCC;">
  </div>
</template>
<script>
import {
  RECORD_TOKEN,
  SAVE_HEAD_IMG,
  SAVE_UID,
  SAVE_ACCOUNT
} from '@/store/mutation-types'
export default {
  data () {
    return {
      res: this.$route.query.result
    }
  },
  mounted () {
    const loading = this.$loading({
      lock: true,
      text: '登陆中',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    this.saveInfo()
    loading.close()
  },
  methods: {
    saveInfo () {
      let info = JSON.parse(this.res)
      // 跳转到登录前的页面或主页
      this.$router.push('/')
      // 记录用户账号
      this.$store.commit(SAVE_ACCOUNT, info.username)
      // 记录token
      this.$store.commit(RECORD_TOKEN, info.token)
      // 将uid记录到state
      this.$store.commit(SAVE_UID, info.uid)
      // 将头像路径记录到state
      this.$store.commit(SAVE_HEAD_IMG, info.avatar)
    }
  }
}
</script>
<style scoped>
</style>
