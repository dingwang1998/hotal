<template>
  <div class="maincontainer">
    <el-row>
      <el-col :span="18">
        <div class="head">
          <p>发表新攻略</p>
          <span>分享你的个人游记,让更多人看到哦!</span>
          <el-input v-model="title" placeholder="请输入文章标题"></el-input>
        </div>
        <div class="editor">
          <no-ssr placeholder="Loading Your Editor...">
            <vue-editor
              placeholder="写点什么..."
              v-model="content"
              :editorToolbar="customToolbar"
              useCustomImageHandler
              @image-added="handleImageAdded"
            ></vue-editor>
          </no-ssr>
          <!-- useCustomImageHandler:开启自定义图片上传功能-->
          <!-- image-added 点击上传图片按钮时候的钩子-->
        </div>

        <!-- 选择城市 -->
        <div class="chooseCity">
          <span>选择城市</span>
          <el-autocomplete
            class="inline-input"
            suffix-icon="el-icon-search"
            v-model="city"
            :fetch-suggestions="querySearch"
            placeholder="添加城市分类"
            :trigger-on-focus="false"
            @select="handleSelect"
            @blur="defaultSelected"
          ></el-autocomplete>
        </div>

        <div class="submitBtn">
          <el-button type="primary" size="medium" @click="submitButton">发布</el-button>
          <el-button type="primary" size="medium" @click="saveDraft">存为草稿</el-button>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="draft">
          <h3>
            <span class="iconfont icon-caogao"></span>
            <span>草稿箱</span>
            ({{draft}})
          </h3>
          <div
            class="draftlist"
            v-for="(item,index) in $store.state.post.darftList"
            :key="index"
            @click="chooseDarft(item)"
          >
            <p class="title">
              <span>{{item.title}}</span>
              <span style="font-size:12px;margin-top:5px">2020-20-20</span>
            </p>
            <span class="iconfont icon-shanchu" @click="deleteBtn(index)"></span>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// Nuxt 中使用Vue2 插件问题  https://codesandbox.io/embed/rynzn4r2nn
let VueEditor

if (process.browser) {
    VueEditor = require('vue2-editor').VueEditor
}
export default {
    data() {
        return {
            title: '', //标题
            content: '', //富文本
            city: '', //添加城市
            cityId: '',
            cityArray: [], //搜索城市建议 展示数组
            customToolbar: [
                ['bold', 'italic', 'underline'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['image', 'code-block']
            ],
            // ------------------草稿箱数量和展示--------------------
            draft: 0,
            // 是否显示删除按钮
            isShowDelete: false
        }
    },
    mounted() {},
    methods: {
        //发布文章封装
        sendPost(title = null, content = null, cityId = null) {
            this.$axios({
                method: 'POST',
                url: '/posts',
                data: {
                    title: title,
                    content: content,
                    city: cityId
                },
                headers: {
                    Authorization:
                        `Bearer ` + this.$store.state.user.userJson.token
                }
            }).then(res => {
                console.log(res)
                const { message } = res.data
                this.$message.success(message)
                this.title = ''
                this.content = ''
                this.city = ''
            })
        },
        //选择城市失去焦点
        defaultSelected() {},
        //选择城市下拉
        handleSelect(value) {
            this.cityId = value.id
        },
        //下拉框选择事件
        querySearch(value, cb) {
            if (!value) {
                this.city = ''
                cb([])
            }
            this.$axios({
                url: '/airs/city',
                params: { name: this.city }
            }).then(res => {
                const { data } = res.data
                const newData = data.map(v => {
                    v.value = v.name
                    return v
                })
                this.cityArray = newData
                cb(newData)
            })
        },
        //点击发布
        submitButton() {
            //开关思想 表单验证
            let arr = [
                { value: this.inputValue == '', message: '请输入文章标题' },
                { value: this.content == '', message: '请输入内容' }
            ]
            let flag = true
            arr.forEach(v => {
                if (!flag) return
                if (v.value) {
                    this.$message.warning(v.message)
                    flag = false
                } else {
                    flag = true
                }
            })
            if (!flag) return
            this.sendPost(this.title, this.content, this.cityId)
        },
        //点击存入草稿
        async saveDraft() {
            await this.$store.commit('post/saveDarftList', {
                title: this.title,
                content: this.content,
                city: this.city
            })
            this.isShowDelete = true
            this.title = ''
            this.content = ''
            this.city = ''
        },
        //点击删除草稿箱
        deleteBtn(index) {
            this.$confirm('此操作将永久删除该草稿, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$store.commit('post/deleteDarfList', index)
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
        },
        //点击草稿返回数据
        chooseDarft(item) {
            this.title = item.title
            this.content = item.content
            this.city = item.city
        },
        // 富文本添加图片
        handleImageAdded(file, Editor, cursorLocation, resetUploader) {
            let formData = new FormData()
            formData.append('files', file) //这里的files是请求参数

            this.$axios({
                url: '/upload', //请求地址
                method: 'POST',
                data: formData
            })
                .then(result => {
                    console.log(result)
                    let url = result.data[0].url // Get url from response
                    //往编辑器中添加刚刚上传成功的图片，第一个参数是编辑器获得焦点的地方，第三个是图片路径（需加上基准路径this.$axios.defaults.baseURL）
                    Editor.insertEmbed(
                        cursorLocation,
                        'image',
                        this.$axios.defaults.baseURL + url
                    )
                    resetUploader()
                })
                .catch(err => {
                    console.log(err)
                })
        }
    },
    components: {}
}
</script>

<style scoped lang='less'>
@margin-top: 15px;
// 整个大盒子
.maincontainer {
    width: 1000px;
    margin: 0 auto;
    padding: 10px 0;
}
// 标题和输入框
.head {
    p {
        font-size: 25px;
    }
    span {
        display: inline-block;
        font-size: 12px;
        color: gray;
    }
    .el-input {
        margin-top: @margin-top;
    }
}
// 富文本
.editor {
    margin-top: @margin-top;
    /deep/.ql-editor {
        height: 500px;
    }
}
//选择城市
.chooseCity {
    margin-top: @margin-top;
    span {
        margin-right: 10px;
    }
}
// 发布
.submitBtn {
    margin-top: @margin-top;
    strong {
        color: #ff6700;
    }
    strong:hover {
        text-decoration: underline;
        cursor: pointer;
    }
}
// --------草稿箱-------
.draft {
    margin-left: 15px;
    padding: 5px;
    .icon-caogao {
        color: #409eff;
        font-size: 20px;
    }
    h3 {
        margin-bottom: 15px;
    }
    .draftlist {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #f6f6f6;
        padding: 5px 10px;
        margin-bottom: 5px;
        .title {
            display: flex;
            flex-direction: column;
        }

        .icon-shanchu:hover {
            color: red;
            cursor: pointer;
        }
    }
    .clearAll {
        margin-top: @margin-top;
    }
}
</style>