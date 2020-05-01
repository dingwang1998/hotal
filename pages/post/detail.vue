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
          <div class="comment-list" v-for="(item,index) in commentLists" :key="index">
            <div class="totalinfo">
              <div class="user">
                <img :src="$axios.defaults.baseURL+item.account.defaultAvatar" />
                <div class="userinfo">
                  <p>{{item.account.nickname}}</p>
                  <p>
                    <!-- <span>{{item.account.created_at}}</span> -->
                    <span>{{moment(item.account.created_at).format('YYYY-MM-DD hh:mm')}}</span>
                  </p>
                </div>
              </div>
              <div class="reply-btn">
                <el-button type="primary" size="mini">回复</el-button>
              </div>
            </div>
            <div class="content">
              <p>{{item.content}}</p>
              <!-- 这里放循环评论的地方 -->
              <!-- 这里放循环评论的地方 -->
              <comlist :data="item.parent" v-if="item.parent"/>
            </div>
          </div>

        </div>
      </el-col>
      <el-col :span="7">
        <div class="other-post">
            <p style="color:#409eff">相关攻略</p>
            <div class="postlistform">
                <div>不知道接口是哪个 暂时不写</div>
                <div  class="fontset"><span>2020-20-40</span><span>04:25</span><span>阅读:24</span></div>
            </div>
            <div class="postincluep">
                <div class="postimg">
                    <img src="http://157.122.54.189:9095/uploads/20f093ff243d484b9c7776f47794911f.jpg">
                </div>
                <div class="postcontent">
                    <div>不知道接口是哪个</div>
                    <div class="fontset"><span>2020-20-40</span><span>04:25</span><span>阅读:24</span></div>
                </div>
            </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import comlist from '@/components/post/comlist.vue'
import moment from "moment";
export default {
    data() {
        return {
            moment,
            // 文章的内容
            postInfo: {
                content: []
            },
            //推荐文章的数据
            // tuijian:[],
            // 评论填写
            form: {
                value: '' //评论框
            },
            //上传图片
            dialogImageUrl: '',
            dialogVisible: false,
            // 获取评论数据
            commentLists:[],
        }
    },
    mounted() {  
        this.getPost();
        this.commentList();
    },
    methods: {
        //主要文章
        async getPost() {
            const res = await this.$axios.get('/posts', {
                params: { id: this.$route.query.id }
            })
            const { data } = res.data
            this.postInfo = data
        },
        //获取文章评论
        async commentList(){
            const commentList=await this.$axios.get('/posts/comments',{
                params:{
                    post:this.$route.query.id,
                    _limit:30,
                    _start:0,
                }
            })
            this.commentLists=commentList.data.data;
            console.log(this.commentLists);
        },

        // 预览图片
        handlePictureCardPreview() {
            this.dialogImageUrl = file.url
            this.dialogVisible = true
        },
        //移除图片
        handleRemove() {}
    },
    components: {
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
        span {
            img {
                width: 100% !important;
            }
        }
    }
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
        padding: 10px 0;
    }
    .textarea {
        margin-bottom: 15px;
    }
    .upload {
        display: flex;
        justify-content: space-between;

        /deep/ .el-upload--picture-card {
            width: 100px;
            height: 100px;
            line-height: 100px !important;
        }
        /deep/ .el-upload-list__item is-success {
            width: 100px;
            height: 100px;
        }
        /deep/ .el-upload-list--picture-card .el-upload-list__item {
            width: 100px;
            height: 100px;
        }
    }
}
.comment-list {
    margin-top: 15px;
    font-size: 14px;
    width: 100%;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
    box-sizing: border-box;
    .user {
        display: flex;
        align-items: center;
        img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            margin-right: 15px;
        }
        p {
            padding: 0;
        }
    }
}
.totalinfo {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.content {
    margin-left: 60px;
}



// --------------右侧----------------
.other-post{
    margin-left: 10px;
    box-sizing: border-box;
    p{
        font-size: 20px;
        padding: 10px 0;
        border-bottom: 1px solid #eee;
    }
    .postlistform{
        height: 70px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 20px 0;

        border-bottom: 1px solid #eee;
    }
    .postincluep{
        display: flex;
        align-items: center;
        height: 80px;
        img{
            display: block;
            height: 80px;
            margin-right: 10px;
        }
        .postcontent{
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
    }
    .fontset{
        font-size: 12px;
        span{
            margin-right: 3px;
        }
    }
    .postincluep{
        height: 80px;
        padding: 20px 0;
        border-bottom: 1px solid #eee;
    }
}
</style>