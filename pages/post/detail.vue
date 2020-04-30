<template>
  <div class="main-container">
    <el-row>
      <el-col :span="17">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/post' }">旅游攻略</el-breadcrumb-item>
          <el-breadcrumb-item>攻略详情</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 文章详细内容 -->
        <h2>塞班贵？一定是你的打开方式不对！6000块玩转</h2>
        <div class="read">
          <span>攻略: 2020-20-20</span>
          <span>阅读: 154564</span>
        </div>
        <div class="post-info" v-html="postInfo[0].content" v-if="postInfo.length>0"></div>

        <!-- 评论与分享 -->
        <div class="commentAndShare">
          <div>
            <i class="el-icon-edit"></i>
            <span>写评论</span>
          </div>
          <div>
            <i class="el-icon-share"></i>
            <span>分享</span>
          </div>
        </div>

        <!-- 评论区域 -->
        <div class="comment-wrapll">
          <p>评论</p>
          <el-input type="textarea" v-model="form.value" class="textarea" placeholder="说点什么..."></el-input>
          <!-- 上传图片 -->
          <div class="upload">
            <div class="upload-left">
              <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                class="el-upload"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" />
              </el-dialog>
            </div>
            <div class="upload-right">
              <el-button type="primary" size="mini">提交</el-button>
            </div>
          </div>

            <!-- 评论列表 -->
            <div class="comment-list">
                <comlist />
            </div>

        </div>
      </el-col>
      <el-col :span="7">
        <div class="other-post">123456</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import comlist from "@/components/post/comlist.vue"
export default {
    data() {
        return {
            // 文章的内容
            postInfo: {
                content: []
            },
            // 评论填写
            form: {
                value: '' //评论框
            },
            //上传图片
            dialogImageUrl: '',
            dialogVisible: false
        }
    },
    mounted() {
        this.getPost()
    },
    methods: {
        async getPost() {
            const res = await this.$axios.get('/posts', {
                params: { id: this.$route.query.id }
            })
            const { data } = res.data
            this.postInfo = data
            console.log(this.postInfo)
        },
        // 预览图片
        handlePictureCardPreview() {
            this.dialogImageUrl = file.url
            this.dialogVisible = true
        },
        //移除图片
        handleRemove() {}
    },
    components:{
        comlist
    }
}
</script>

<style scoped lang='less'>
.main-container {
    width: 1000px;
    margin: 0 auto;
    padding: 20px 0;
}
h2 {
    font-size: 35px;
    padding: 20px 0;
    border-bottom: 1px solid #eee;
}
.read {
    padding: 10px;
    display: flex;
    justify-content: flex-end;
    span {
        margin-right: 20px;
    }
}
.post-info {
    width: 100%;
    /deep/ p {
        img {
            width: 100% !important;
        }
    }
}
.other-post {
    background-color: pink;
}
.commentAndShare {
    display: flex;
    justify-content: center;
    font-size: 14px;
    div {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px 30px;
        color: #ff6700;
        i {
            transform: scale(2);
            padding: 10px 0;
        }
    }
}
.comment-wrapll {
    p {
        padding: 15px 0;
    }
    .textarea {
        margin-bottom: 15px;
    }
    .upload {
        display: flex;
        justify-content: space-between;

        /deep/ .el-upload--picture-card{
            width: 100px;
            height: 100px;
            line-height: 100px !important;
        }
        /deep/ .el-upload-list__item is-success{
            width: 100px;
            height: 100px;
        }
        /deep/ .el-upload-list--picture-card .el-upload-list__item{
            width: 100px;
            height: 100px;
        }
    }
}
</style>