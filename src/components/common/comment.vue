<template>
  <div class="comment" id="comment">
    <span>评论</span>
    <el-input
      @focus="showDialog"
      placeholder="对作者说两句吧"
      style="margin-top:20px;"
    ></el-input>
    <div class="comments">
      <section :key="index" v-for="(item,index) in comments">
        <!--评论展示-->
        <div v-if="item.ruid === 0">
          <div class="comment-top">
            <img class="head-img" :src="item.headUrl"/>
            <div>
              <span class="nickname">{{item.nickname}}:</span>
              <span class="content" v-html="item.content"></span>
            </div>
          </div>
          <div class="comment-bottom">
            <div class="time">{{item.ctime}}</div>
          </div>
          <div @click="reply(item.uid, item.content)" class="reply">回复</div>
        </div>
        <!--评论回复展示-->
        <div class="reply-comment" v-if="item.ruid != 0">
          <div class="comment-top">
            <img class="head-img" :src="item.headUrl"/>
            <div>
              <span class="nickname">{{item.nickname}}:</span>
              <span class="content" v-html="item.content"></span>
            </div>
          </div>
          <div class="reply-content-main">
            <span class="reply-nickname">@{{item.rNickname}}:</span>
            <div class="reply-content" v-html="item.rcontent"></div>
          </div>
          <div class="comment-bottom">
            <div class="time">{{item.ctime}}</div>
          </div>
          <div @click="reply(item.uid, item.content)" class="reply">回复</div>
        </div>
      </section>
      <!--加载更多-->
      <div class="show_more" v-show="show" @click="showMore">show more</div>
      <!--编辑器对话框-->
        <el-dialog :visible.sync="showInput" :width="width">
          <mavon-editor v-model="comment" class="input" ref=md @imgAdd="$imgAdd" :codeStyle="codeStyle"
          @imgDel="$imgDel" :scrollStyle="scrollStyle" :toolbars="toolbars" :defaultOpen="defaultOpen"></mavon-editor>
          <div slot="footer" class="dialog-footer">
            <el-button @click="showInput = false" size="mini">取 消</el-button>
            <el-button type="success" v-if="!showReply" @click="publishComment" size="mini">发表评论</el-button>
            <el-button type="success" v-if="showReply" @click="replyComment" size="mini">回复评论</el-button>
          </div>
        </el-dialog>
    </div>
  </div>
</template>
<script>
import handleTime from '@/utils/show-time'
import api from '@/api'
export default {
  data () {
    return {
      comment: '', // 评论内容
      comments: [], // 评论集合
      rUid: '',
      rComment: '',
      index: 0,
      size: 5,
      showInput: false, // 展示输入的编辑器
      showReply: false,
      scrollStyle: true,
      imgList: [],
      codeStyle: 'atelier-lakeside-dark',
      toolbars: { // 工具栏对象
        header: true, // 标题
        ol: true, // 有序列表
        ul: true, // 无序列表
        quote: true, // 引用
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true // code
      },
      show: true
    }
  },
  props: [
    'width',
    'defaultOpen',
    'aid',
    'uid'
  ],
  created () {
    this.getComments(this.aid, this.index, this.size)
  },
  methods: {
    showDialog () {
      // 发个请求看是否登录
      this.$api.login.getToken()
      this.showInput = true
    },
    // 上传图片
        $imgAdd (pos, $file) {
            // 首先将图片上传到服务器
            this.$api.articles.uploadImage($file)
            .then(res => {
                // 将返回的图片地址替换到文本中
                this.$refs.md.$img2Url(pos, res.data)
                this.imgList.push(res.data)
            })
        },
        // 删除图片
        $imgDel (pos) {
            this.imgList.splice(this.imgList.indexOf(pos[0]), 1)
        },
    getComments (aid, index, size) {
      this.$api.comments.getComments(aid, index, size)
      .then(res => {
        if (res.code === 1) {
          this.comments = res.data
          for (let i = 0; i < this.comments.length; i++) {
            this.$api.user.getUsersInfo(this.comments[i].uid)
            .then(res => {
              if (res.code === 1) {
                // 将用户的头像和昵称加进数组中，并刷新数组
                this.comments[i].headUrl = res.data.headPath
                this.comments[i].nickname = res.data.nickName
                this.comments[i].ctime = handleTime(this.comments[i].ctime)
                this.comments.splice(i, 1, this.comments[i])
                // 如果评论回复存在，则获取回复对象的昵称，并刷新数组
                if (this.comments[i].ruid !== 0) {
                  console.log(this.comments[i].ruid)
                  api.user.getUsersInfo(this.comments[i].ruid)
                  .then(res => {
                    this.comments[i].rNickname = res.data.nickName
                    this.comments.splice(i, 1, this.comments[i])
                  })
                }
              }
            })
          }
        }
      })
    },
    // 提示
    tip (message, type) {
      this.$message({
          message: message,
          type: type,
          duration: 1000
      })
    },
    reply (rUid, rComment) {
      this.rUid = rUid
      this.rComment = rComment
      this.showInput = true
      this.showReply = true
    },
    // 回复评论
    replyComment () {
      if (this.comment.length < 2 || this.comment.length > 200) {
        this.tip('回复内容必须是2-200个字符', 'warning')
      } else {
        let content
        if (this.$refs.md === Array) {
          content = this.$refs.md[0].d_render
        } else {
          content = this.$refs.md.d_render
        }
        this.$api.comments.saveReplyComment(this.aid, this.uid, this.rUid, content, this.rComment)
        .then(res => {
          console.log(res)
          if (res.code === 1) {
            this.tip('回复成功', 'success')
            this.comment = ''
            this.getComments(this.aid, 0, this.size)
            this.showInput = false
          }
        })
      }
    },
    // 发表评论
    publishComment () {
      if (this.comment.length < 2 || this.comment.length > 200) {
        this.tip('评论内容必须是2-200个字符', 'warning')
      } else {
        let content
        // 获取html格式内容(先判断是个数组还是对象)
        if (this.$refs.md === Array) {
          content = this.$refs.md[0].d_render
        } else {
          content = this.$refs.md.d_render
        }
        this.$api.comments.saveComment(this.aid, this.uid, content)
        .then(res => {
          console.log(res)
          if (res.code === 1) {
            this.tip('发表成功', 'success')
            this.comment = ''
            this.getComments(this.aid, 0, this.size)
            this.showInput = false
          }
        })
      }
    },
    // 加载更多
    showMore () {
      // 当前页数+1
      this.index = this.index + 1
      this.$api.comments.getComments(this.aid, this.index, this.size)
      .then(res => {
        if (res.code === 1) {
          this.show = true
          let comments = res.data
          for (let i = 0; i < comments.length; i++) {
            this.$api.user.getUsersInfo(comments[i].uid)
            .then(res => {
              if (res.code === 1) {
                // 将用户的头像和昵称加进数组中，并刷新数组
                comments[i].headUrl = res.data.headPath
                comments[i].nickname = res.data.nickName
                comments[i].ctime = handleTime(comments[i].ctime)
                comments.splice(i, 1, comments[i])
              }
            })
            // 如果评论回复存在，则获取回复对象的昵称，并刷新数组
            if (comments[i].ruid !== 0) {
              api.user.getUsersInfo(comments[i].ruid)
              .then(res => {
                comments[i].rNickname = res.data.nickName
                comments.splice(i, 1, comments[i])
              })
            }
          }
          // 将评论集合拼接到一起
          this.comments = this.comments.concat(comments)
        } else if (res.code === 50001) {
          this.tip('没有更多数据了', 'info')
          this.index = this.index - 1
          this.show = false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../style/mixin.scss";
.comment {
  width: 59%;
  margin: auto;
  margin-top: 100px;
  margin-bottom: 200px;
  @media screen and (max-width: 1300px) {
    width: 65%;
    margin-right: 300px;
    margin-top: 150px;
  }
  @media screen and (max-width: 1100px) {
    margin-left: 100px;
    width: 80%;
  }
  @media screen and (max-width: 900px) {
    margin-left: 100px;
    width: 84%;
  }
  @media screen and (max-width: 500px) {
    position: relative;
    top: 100px;
    padding-bottom: 100px;
    margin:auto;
    width: 90%;
  }
  span {
    position: relative;
    margin-left: 50%;
    @include sc(30px, #606266);
  }
  .btn-container {
    position: relative;
    top: 20px;
    .btn {
      width: 150px;
    }
  }
  .comments{
    position: relative;
    top: 20px;
    section{
      background-color: #f8fbfd;
      margin-bottom: 50px;
      margin-top: 50px;
      .comment-top{
        display: flex;
        display: -webkit-flex;
        align-items:center;
        .head-img{
          width: 80px;
          height:80px;
          padding: 20px;
          border-radius: 50%;
          display: inline-block;
        }
        .nickname{
          display: inline-block;
          left: -45%;
          top: 0px;
          @include sc(25px,#6699CC);
        }
        .content{
          position: relative;
          left: -45%;
          display: inline-block;
          @include sc(28px,#333333);
          /deep/ p{
            width: 1700px;
            @media screen and (max-width: 1300px){
              width: 1300px;
            }
            @media screen and (max-width: 900px){
              width: 1050px;
            }
            @media screen and (max-width: 600px){
              @include sc(25px,#333333);
              width: 550px;
            }
            @media screen and (max-width: 400px){
              width: 480px;
            }
          }
          /deep/ img{
            width: 100%;
            height: auto;
          }
        }
      }
      .comment-bottom{
        position: relative;
        display: inline;
        top: 0px;
        .time{
          padding-left: 25px;
          padding-top: 20px;
          @include sc(25px,#C0C4CC);
        }
      }
      .reply{
        position: relative;
        top: -30px;
        left: 90%;
        @include sc(25px,#C0C4CC);
        &:hover{
          color:#ea705b;
          text-decoration: underline;
          cursor: pointer;
        }
      }
      .reply-comment{
        .reply-content-main{
          background-color: #f1f1f4;
          width: 100%;
          .reply-nickname{
            left: -49%;
            @include sc(25px,#909399);
          }
          .reply-content{
            position: relative;
            left: 20px;
            display: inline-block;
            @include sc(25px,#606266);
            /deep/ p{
            width: 1600px;
            @media screen and (max-width: 1300px){
              width: 1200px;
            }
            @media screen and (max-width: 900px){
              width: 950px;
            }
            @media screen and (max-width: 600px){
              width: 420px;
            }
            @media screen and (max-width: 400px){
              width: 450px;
            }
          }
            /deep/ img{
              width: 600px;
              height: auto;
              @media screen and (max-width: 1300px){
                width: 500px;
              }
              @media screen and (max-width: 1100px){
                width: 400px;
              }
              @media screen and (max-width: 900px){
                width: 300px;
              }
              @media screen and (max-width: 600px){
                width: 150px;
              }
            }
          }
        }
      }
    }
    .show_more{
      position: relative;
      margin-bottom: 50px;
      margin-top: 50px;
      left: 45%;
      @include sc(30px,#C0C4CC);
      &:hover{
        color:#ea705b;
        cursor: pointer;
      }
    }
  }
}
</style>
