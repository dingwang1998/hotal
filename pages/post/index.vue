<template>
  <div class="main-container">
    <el-row>
      <!-- 左侧导航栏 -->
      <el-col :span="6">
        <!-- 左侧导航栏 -->
        <div class="menus-wrapper">
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            active-text-color="#409eff"
            @open="handleOpen"
            @close="handleClose"
          >
            <el-submenu :index="''+index" v-for="(item,index) in hotCity" :key="index">
              <template slot="title">
                <i class="el-icon-star-on"></i>
                <span>{{item.type}}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item
                  :index="1-index2"
                  class="city-info"
                  v-for="(item2,index2) in item.children"
                  :key="index2"
                >
                  <span class="cities">{{index2+1}}</span>
                  <span class="cities">{{item2.city}}</span>
                  <span>{{item2.desc}}</span>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
          <h3>推荐城市</h3>
          <div class="recommen-img">
            <img src="http://157.122.54.189:9093/images/pic_sea.jpeg" />
          </div>
        </div>
      </el-col>

      <!-- 右侧导航栏 -->
      <el-col :span="18">
        <div class="post-wrapper">
          <el-input
            placeholder="请输入想去的地方,比如 ' 广州 '"
            suffix-icon="el-icon-search"
            v-model="searchCity"
          ></el-input>
          <div class="hot-city">
            <span>推荐</span>
            <a href="#">广州</a>
            <a href="#">上海</a>
            <a href="#">北京</a>
          </div>
          <!-- 推荐攻略 -->
          <div class="recommend-plan">
            <h3>推荐攻略</h3>
            <el-button type="primary" icon="el-icon-edit" size="medium" @click="$router.push('/post/create')">梦游笔记</el-button>
          </div>

          <!-- 文章列表 -->
          <div class="post-list" v-for="item in totalList" :key="item.id">

            <div class="postone" v-if="item.images.length>=3" @click="toPostDetail(item)">
              <h3>{{item.title}}</h3>
              <p>{{item.summary}}</p>
              <div class="post-img">
                <img :src="item2" v-for="(item2,index2) in item.images" :key="index2" />
              </div>
              <div class="post-info">
                <div class="info-left">
                  <i class="el-icon-edit">{{item.cityName}}</i>
                  <span>by</span>
                  <img :src="$axios.defaults.baseURL+item.account.defaultAvatar" />
                  <a href="#" class="stylecolor">{{item.account.nickname}}</a>
                  <i class="el-icon-view">{{item.watch}}</i>
                </div>
                <div class="info-right">
                  <span class="stylecolor">{{item.like}}赞</span>
                </div>
              </div>
            </div>
            <div class="posttwo" v-if="item.images.length<3" @click="toPostDetail(item)">
              <div class="left-img">
                <img :src="item.images" />
              </div>
              <div class="right-post">
                <h3>{{item.title}}</h3>
                <p>{{item.summary}}</p>
                <div class="sec-info">
                  <div class="sec-info-action">
                    <i class="el-icon-edit">{{item.cityName}}</i>
                    <span>by</span>
                    <img :src="$axios.defaults.baseURL+item.account.defaultAvatar" />
                    <a href="#" class="stylecolor">{{item.account.nickname}}</a>
                    <i class="el-icon-view">{{item.watch}}</i>
                  </div>
                  <div class="right-zan">
                    <span class="stylecolor">{{item.like}}赞</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 分页功能 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[3, 5, 10]"
            :current-page="form._start"
            :page-size="form._limit"
            layout="total,sizes,prev, pager, next, jumper"
            :total="total"
            background
          ></el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                _start: 0,//当前页数
                _limit: 3//每页显示多少
            },
            // 左侧推荐城市数组
            hotCity: [],
            //右侧的文章列表数据
            totalList: [],
            //总文章条数
            total: 0,
            // 搜索城市的输入框值
            searchCity: ''
        }
    },
    async mounted() {
        //获取左侧推荐
        const res = await this.$axios.get('/posts/cities')
        const { data } = res.data
        this.hotCity = data;
        this.getPost();
    },
    methods: {
        //获取文章列表
        async getPost() {
            // 获取文章列表
            const postdata = await this.$axios.get('/posts',{params:{_start:this.form._start,_limit:this.form._limit}})
            this.totalList = postdata.data.data
            this.total = postdata.data.total
            console.log(this.totalList)
        },
        handleOpen() {},
        handleClose() {},
        //切换每页显示多少条
        handleSizeChange(page) {
            this.form._start=0;
            this.form._limit=page;
            this.getPost();
        },
        //切换页数
        handleCurrentChange(value) {
            this.form._start=value;
            this.getPost();
        },
        //点击文章，跳转到文章详情
        toPostDetail(item){
            console.log(item);
            this.$router.push({
                path:`/post/detail`,
                query:{
                    id:item.id
                }
            })
        }
    }
}
</script>

<style scoped lang='less'>
.main-container {
    width: 1000px;
    margin: 0 auto;
    padding: 20px 0;
}
.menus-wrapper {
    box-sizing: border-box;
    /deep/ .el-menu-item {
        padding-left: 0px !important;
        padding-right: 0px !important;
    }
    /deep/ .el-menu-item-group__title {
        padding: 0;
    }
    h3 {
        padding: 10px 20px;
        margin-top: 15px;
        font-size: 16px;
        border-bottom: 1px solid #ccc;
    }
    .recommen-img {
        width: 100%;
        padding: 5px;
        box-sizing: border-box;
        cursor: pointer;
        img {
            width: 100%;
        }
    }
    .city-info {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
/deep/ .el-input--suffix .el-input__inner {
    outline: none;
    outline-style: none; /*去掉轮廓线*/
    border: 2px solid #ff6700;
}
/deep/ .el-submenu__title {
    padding: 0 !important;
}
.cities {
    font-size: 20px;
    color: #ff6700;
    margin-right: 10px;
}
.post-wrapper {
    padding: 0 20px;
    .hot-city {
        font-size: 14px;
        margin-top: 10px;
        color: gray;
        a {
            margin-left: 15px;
            color: gray;
        }
    }
    .recommend-plan {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #eee;
        h3 {
            padding: 15px 0;
            border-bottom: 2px solid #ff6700;
            color: #ff6700;
        }
        .el-button--medium {
            padding: 12px 10px;
        }
    }
}
.post-list {
    .postone {
        padding: 10px 0;
        border-bottom: 1px solid #eee;
        cursor: pointer;
        h3 {
            margin-bottom: 10px;
            cursor: pointer;
        }
        h3:hover {
            color: #ff6700;
        }
        p {
            font-size: 16px;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
        }
        .post-img {
            width: 100%;
            height: 160px;
            padding: 10px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: nowrap;
            overflow: hidden;
            img {
                width: 33%;
                margin-right: 10px;
                height: 100%;
            }
        }
    }
}
.post-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    img {
        width: 20px;
        border-radius: 50%;
    }
    .info-left {
        width: 220px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .info-right {
        font-size: 16px;
    }
}
.stylecolor {
    color: #ff6700 !important;
}
.posttwo {
    display: flex;
    align-items: center;
    padding: 10px 0;
    height: 172.17px;
    border-bottom: 1px solid #eee;
    h3:hover {
        color: #ff6700;
        cursor: pointer;
    }
    .left-img {
        width: 32%;
        img {
            width: 227.19px;
            height: 148.27px;
        }
    }
}
.sec-info {
    display: flex;
    justify-content: space-between;
    img {
        width: 20px;
        border-radius: 50%;
    }
    .sec-info-action {
        font-size: 12px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        width: 220px;
    }
}
.right-post {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    margin-left: 15px;
    height: 100%;
    p {
        font-size: 16px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
    }
}
.el-input {
    color: #ff6700;
}
</style>