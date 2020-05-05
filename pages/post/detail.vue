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
        <h2>{{postInfo[0].title}}</h2>
        <div class="read">
          <span>攻略: {{moment(postInfo[0].created_at).format('YYYY-MM-DD hh:mm')}}</span>
          <span>阅读: {{postInfo[0].watch}}</span>
        </div>
        <div class="post-info" v-html="postInfo[0].content" v-if="postInfo.length>0"></div>

        <!-- 评论与分享 -->
        <div class="commentAndShare">
          <div @click="autoFocus">
            <i class="el-icon-edit"></i>
            <span>写评论(162)</span>
          </div>
          <div @click="$message.error('暂时未开放分享')">
            <i class="el-icon-share"></i>
            <span>分享({{postInfo[0].like}})</span>
          </div>
        </div>

        <!-- 评论区域 -->
        <div class="comment-wrapll">
          <p>评论</p>
          <el-tag
            type="success"
            style="margin-bottom:5px"
            v-if="reply.isShow"
          >回复@{{reply.showReplyObject}}</el-tag>
          <el-input
            type="textarea"
            v-model="form.value"
            class="textarea"
            placeholder="说点什么..."
            ref="repyInput"
          ></el-input>
          <!-- 上传图片 -->
          <div class="upload">
            <div class="upload-left">
              <el-upload
                action="http://157.122.54.189:9095/upload"
                name="files"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                class="el-upload"
                :file-list="fileList"
                :on-success="handleImageSuccess"
                ref="clearFileList"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" />
              </el-dialog>
            </div>
            <div class="upload-right">
              <el-button type="primary" size="mini" @click="submitBtn">提交</el-button>
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
                    <span>{{moment(item.created_at).format('YYYY-MM-DD hh:mm')}}</span>
                  </p>
                </div>
              </div>
              <div class="reply-btn">
                <el-button type="primary" size="mini" @click="replySomeone(item)">回复</el-button>
              </div>
            </div>
            <div class="content">
              <!-- 这里放循环评论的地方 -->
              <comlist :data="item.parent" v-if="item.parent" @replybtn="replySomeone" />
              <p>{{item.content}}</p>
              <img
                :src="$axios.defaults.baseURL+item2.url"
                v-for="(item2,index2) in item.pics"
                :key="index2"
              />
            </div>
          </div>
        </div>

        <!-- 分页器 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="start"
          :page-sizes="[5, 8, 12]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
        ></el-pagination>
      </el-col>

      <!-- 右侧内容 -->
      <el-col :span="7">
        <div class="other-post">
          <p style="color:#409eff">相关攻略</p>
          <div
            class="postlistform"
            v-for="(item,index) in tuijian"
            :key="index"
            @click="toPostDetail(item)"
          >
            <div v-html="item.content" class="postImgShow"></div>
            <div class="fontset">
              <span>2020-20-40</span>
              <span>04:25</span>
              <span>阅读:24</span>
            </div>
          </div>
          <!-- <div class="postincluep">
            <div class="postimg">
              <img src="http://157.122.54.189:9095/uploads/20f093ff243d484b9c7776f47794911f.jpg" />
            </div>
            <div class="postcontent">
              <div>非常棒</div>
              <div class="fontset">
                <span>2020-20-40</span>
                <span>04:25</span>
                <span>阅读:24</span>
              </div>
            </div>
          </div> -->
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import comlist from '@/components/post/comlist.vue'
import moment from 'moment'
export default {
    data() {
        return {
            moment,
            // 文章的内容
            postInfo: [{}],
            //推荐文章的数据
            tuijian: [],
            // 评论填写
            form: {
                value: '' //评论框
            },
            //上传图片
            dialogImageUrl: '',
            dialogVisible: false,
            // 获取评论数据
            commentLists: [],
            // 获取评论的条数
            limit: 5,
            start: 0,
            // 评论总书
            total: 0,
            // 回复对象
            reply: {
                isShow: false,
                showReplyObject: '',
                id: ''
            },
            // 照片墙图片的列表
            fileList: []
        }
    },
    mounted() {
        this.getPost()
        this.commentList(this.limit, this.start)
        this.$axios({
            url: '/posts/recommend',
            params: {
                id: this.$route.query
            }
        }).then(res => {
            const { data } = res.data
            this.tuijian = data
            console.log(data)
        })
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
        async commentList(limit1, start1) {
            const commentList = await this.$axios.get('/posts/comments', {
                params: {
                    post: this.$route.query.id,
                    _limit: limit1,
                    _start: start1
                }
            })
            this.commentLists = commentList.data.data
            this.total = commentList.data.total
            console.log(this.commentLists)
        },
        // 预览图片
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url
            this.dialogVisible = true
        },
        //移除图片
        handleRemove() {},
        //点击切换页数
        handleSizeChange(page) {
            this.limit = page
            this.commentList(this.limit, this.start)
        },
        // 每页显示多少内容
        handleCurrentChange(value) {
            console.log(value)
            if (value === 1) value = 0
            this.start = value
            this.commentList(this.limit, this.start)
        },
        //点击提交按钮
        submitBtn() {
            // if (!this.form.value) return this.$message.error('评论内容不能为空')
            if (this.reply.isShow) {
                this.$axios({
                    url: '/comments',
                    method: 'POST',
                    data: {
                        content: this.form.value,
                        follow: this.reply.id,
                        post: this.$route.query.id,
                        pics: this.fileList
                    },
                    headers: {
                        Authorization:
                            `Bearer ` + this.$store.state.user.userJson.token
                    }
                }).then(res => {
                    this.reply.isShow = false
                    this.form.value = ''
                    this.$message.success(res.data.message)
                    this.commentList(this.limit, this.start)
                    this.fileList=[]
                })
            } else {
                this.$axios({
                    method: 'POST',
                    url: '/comments',
                    data: {
                        content: this.form.value,
                        pics: this.fileList,
                        post: this.$route.query.id,
                        follow: this.reply.id
                    },
                    headers: {
                        Authorization:
                            `Bearer ` + this.$store.state.user.userJson.token
                    }
                }).then(res => {
                    this.reply.isShow = false
                    const { message } = res.data
                    this.form.value = ''
                    this.$message.success(message)
                    this.commentList(this.limit, this.start)
                    this.fileList=[]
                })
            }
        },
        //回复某人
        replySomeone(item) {
            this.reply.id = item.id;
            this.reply.isShow = true;
            this.reply.showReplyObject = item.account.nickname;
            this.$refs.repyInput.focus();
            this.$refs.clearFileList.clearFiles();
        },
        //写评论
        autoFocus() {
            this.$refs.repyInput.focus()
        },
        //成功上传图片之后
        handleImageSuccess(response, file, fileList) {
            // console.log(fileList[0]);
            console.log(fileList[0].response[0])
            this.fileList[0] = fileList[0].response[0]
            // console.log(this.fileList[0]);
        },
        //点击跳转页面
        toPostDetail(item) {
            this.$router.push({
                url: '/posts',
                query: {
                    id: item.id
                }
            })
        }
    },
    // 监听路由的变化
    watch: {
        $route(item) {
            console.log(item)
            this.$axios({
                url: '/posts',
                params: { id: item.query.id }
            }).then(res => {
                const { data } = res.data
                this.postInfo = data
                this.commentList(this.limit, this.start)
            })
        }
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
    /deep/ p {
        img {
            width: 100% !important;
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
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.content {
    background-color: #f6f6f6;
    margin-left: 60px;
    padding: 5px;
    border: 1px solid gray;
    border-radius: 5px;
    p {
        word-break: break-all;
        white-space: pre-wrap;
    }
    img {
        width: 80px;
        height: 80px;
        border: 1px dashed #eee;
    }
}

// -------分页器-------
.el-pagination {
    margin-top: 15px;
}

// --------------右侧----------------
.other-post {
    margin-left: 10px;
    box-sizing: border-box;
    p {
        font-size: 20px;
        padding: 10px 0;
        border-bottom: 1px solid #eee;
    }
    .postlistform {
        height: 90px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid #eee;
        /deep/.postImgShow{
            display: flex;
         p{
            display: flex;
            align-items: center;
            img{
                width: 65px;

            }
        }
    }
    }
    .postincluep {
        display: flex;
        align-items: center;
        height: 80px;
        img {
            display: block;
            height: 80px;
            margin-right: 10px;
        }
        .postcontent {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
    }
    .fontset {
        font-size: 12px;
        span {
            margin-right: 3px;
        }
    }
    .postincluep {
        height: 80px;
        padding: 20px 0;
        border-bottom: 1px solid #eee;
    }
    
}

</style>