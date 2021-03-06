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
              <span style="font-size:12px;margin-top:5px">{{moment().endOf('day').fromNow()}}</span>
            </p>
            <span class="iconfont icon-shanchu" @click="deleteBtn(index)"></span>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import moment from 'moment'
moment.locale('zh-cn', {
    months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split(
        '_'
    ),
    monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split(
        '_'
    ),
    weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
    weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
    weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
    longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'YYYY-MM-DD',
        LL: 'YYYY年MM月DD日',
        LLL: 'YYYY年MM月DD日Ah点mm分',
        LLLL: 'YYYY年MM月DD日ddddAh点mm分',
        l: 'YYYY-M-D',
        ll: 'YYYY年M月D日',
        lll: 'YYYY年M月D日 HH:mm',
        llll: 'YYYY年M月D日dddd HH:mm'
    },
    meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
    meridiemHour: function(hour, meridiem) {
        if (hour === 12) {
            hour = 0
        }
        if (meridiem === '凌晨' || meridiem === '早上' || meridiem === '上午') {
            return hour
        } else if (meridiem === '下午' || meridiem === '晚上') {
            return hour + 12
        } else {
            // '中午'
            return hour >= 11 ? hour : hour + 12
        }
    },
    meridiem: function(hour, minute, isLower) {
        const hm = hour * 100 + minute
        if (hm < 600) {
            return '凌晨'
        } else if (hm < 900) {
            return '早上'
        } else if (hm < 1130) {
            return '上午'
        } else if (hm < 1230) {
            return '中午'
        } else if (hm < 1800) {
            return '下午'
        } else {
            return '晚上'
        }
    },
    calendar: {
        sameDay: '[今天]LT',
        nextDay: '[明天]LT',
        nextWeek: '[下]ddddLT',
        lastDay: '[昨天]LT',
        lastWeek: '[上]ddddLT',
        sameElse: 'L'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(日|月|周)/,
    ordinal: function(number, period) {
        switch (period) {
            case 'd':
            case 'D':
            case 'DDD':
                return number + '日'
            case 'M':
                return number + '月'
            case 'w':
            case 'W':
                return number + '周'
            default:
                return number
        }
    },
    relativeTime: {
        future: '%s内',
        past: '%s前',
        s: '几秒',
        ss: '%d秒',
        m: '1分钟',
        mm: '%d分钟',
        h: '1小时',
        hh: '%d小时',
        d: '1天',
        dd: '%d天',
        M: '1个月',
        MM: '%d个月',
        y: '1年',
        yy: '%d年'
    },
    week: {
        // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
        dow: 1, // Monday is the first day of the week.
        doy: 4 // The week that contains Jan 4th is the first week of the year.
    }
})
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
            isShowDelete: false,
            moment
        }
    },
    mounted() {
        console.log(this.$store.state.post.darftList)
    },
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
    components: {
        moment
    }
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