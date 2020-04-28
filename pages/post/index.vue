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
            @open="handleOpen"
            @close="handleClose"
          >
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-star-on"></i>
                <span>热门城市</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="1-1" class="city-info">
                  <span>1</span>
                  <span>北京</span>
                  <span>世界著名古都和现代国际化城市</span>
                </el-menu-item>
                <el-menu-item index="1-2" class="city-info">
                  <span>1</span>
                  <span>北京</span>
                  <span>世界著名古都和现代国际化城市</span>
                </el-menu-item>
                <el-menu-item index="1-3" class="city-info">
                  <span>1</span>
                  <span>北京</span>
                  <span>世界著名古都和现代国际化城市</span>
                </el-menu-item>
                <el-menu-item index="1-4" class="city-info">
                  <span>1</span>
                  <span>北京</span>
                  <span>世界著名古都和现代国际化城市</span>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>

            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-star-on"></i>
                <span>热门城市</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="2-1" class="city-info">
                  <span>1</span>
                  <span>北京</span>
                  <span>世界著名古都和现代国际化城市</span>
                </el-menu-item>
                <el-menu-item index="2-2" class="city-info">
                  <span>1</span>
                  <span>北京</span>
                  <span>世界著名古都和现代国际化城市</span>
                </el-menu-item>
                <el-menu-item index="2-3" class="city-info">
                  <span>1</span>
                  <span>北京</span>
                  <span>世界著名古都和现代国际化城市</span>
                </el-menu-item>
                <el-menu-item index="2-4" class="city-info">
                  <span>1</span>
                  <span>北京</span>
                  <span>世界著名古都和现代国际化城市</span>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>

            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-star-on"></i>
                <span>热门城市</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="3-1" class="city-info">
                  <span>1</span>
                  <span>北京</span>
                  <span>世界著名古都和现代国际化城市</span>
                </el-menu-item>
                <el-menu-item index="3-2" class="city-info">
                  <span>1</span>
                  <span>北京</span>
                  <span>世界著名古都和现代国际化城市</span>
                </el-menu-item>
                <el-menu-item index="3-3" class="city-info">
                  <span>1</span>
                  <span>北京</span>
                  <span>世界著名古都和现代国际化城市</span>
                </el-menu-item>
                <el-menu-item index="3-4" class="city-info">
                  <span>1</span>
                  <span>北京</span>
                  <span>世界著名古都和现代国际化城市</span>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>

            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-star-on"></i>
                <span>热门城市</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="4-1" class="city-info">
                  <span>1</span>
                  <span>北京</span>
                  <span>世界著名古都和现代国际化城市</span>
                </el-menu-item>
                <el-menu-item index="4-2" class="city-info">
                  <span>1</span>
                  <span>北京</span>
                  <span>世界著名古都和现代国际化城市</span>
                </el-menu-item>
                <el-menu-item index="4-3" class="city-info">
                  <span>1</span>
                  <span>北京</span>
                  <span>世界著名古都和现代国际化城市</span>
                </el-menu-item>
                <el-menu-item index="4-4" class="city-info">
                  <span>1</span>
                  <span>北京</span>
                  <span>世界著名古都和现代国际化城市</span>
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
            suffix-icon="el-icon-date"
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
            <el-button type="primary" icon="el-icon-edit" size="medium ">梦游笔记</el-button>
          </div>

          <!-- 文章列表 -->
          <div class="post-list">
            <div class="postone">
              <h3>又抓了一批“女主播”！聊天记录曝光……</h3>
              <p>
                这些都是美女骗局的把戏!警方调查后发现确实有“雨晴”这个人,和林先生视频的的确是“雨晴”,
                但和林先生聊天的又并非“雨晴”,这是怎么回事。因为这是一个架构清晰、组织严密、分工明确、
                涉案人员众多的诈骗犯罪团伙!朱某负责注册公司,并聘用江某成为公司主播。为了快速牟取利用,
              </p>
              <div class="post-img">
                <img
                  src="https://p3.pstatp.com/list/190x124/pgc-image/b254654ed20f4db39caebb68e95f7e0e"
                />
                <img src="https://p1.pstatp.com/list/190x124/pgc-image/RxLYDsX4gMQHwN" />
                <img src="https://p3.pstatp.com/list/190x124/pgc-image/RxKLmJ2FNUp42s" />
              </div>
              <div class="post-info">
                <div class="info-left">
                  <i class="el-icon-edit">北京市</i>
                  <span>by</span>
                  <img
                    src="https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3744215463,383557679&fm=26&gp=0.jpg"
                  />
                  <a href="#" class="stylecolor">地球发动机</a>
                  <i class="el-icon-view">15024</i>
                </div>
                <div class="info-right">
                  <span class="stylecolor">80赞</span>
                </div>
              </div>
            </div>


            <div class="posttwo">
              <div class="left-img">
                <img
                  src="http://p1-tt.byteimg.com/list/190x124/dfic-imagehandler/9f747eec-31d3-4a7d-87b2-8b9538e3e600"
                />
              </div>
              <div class="right-post">
                <h3>又抓了一批“女主播”！聊天记录曝光……</h3>
                <p>
                  这些都是美女骗局的把戏!警方调查后发现确实有“雨晴”这个人,和林先生视频的的确是“雨晴”,
                  但和林先生聊天的又并非“雨晴”,这是怎么回事。因为这是一个架构清晰、组织严密、分工明确、
                  但和林先生聊天的又并非“雨晴”,这是怎么回事。
                </p>
                <div class="sec-info">
                  <div class='sec-info-action'>
                    <i class="el-icon-edit">北京市</i>
                    <span>by</span>
                    <img
                      src="https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3744215463,383557679&fm=26&gp=0.jpg"
                    />
                    <a href="#" class="stylecolor">地球发动机</a>
                    <i class="el-icon-view">15024</i>
                  </div>
                  <div class="right-zan">
                      <span class="stylecolor">80赞</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
    data() {
        return {
            // 搜索城市的输入框值
            searchCity: ''
        }
    },
    methods: {
        handleOpen() {},
        handleClose() {}
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
    // height: 100vh;
    box-sizing: border-box;
    /deep/ .el-submenu__title {
        height: 40px;
        line-height: 40px;
    }
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
// .post-wrapper {
//     // height: 100vh;
// }
/deep/ .el-input--suffix .el-input__inner {
    outline: none;
    outline-style: none; /*去掉轮廓线*/
    border: 2px solid #ff6700;
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
    padding: 10px 0;
    .postone {
        padding: 10px 0;
        border-bottom: 1px solid #eee;
        margin-bottom: 10px;
        h3 {
            margin-bottom: 10px;
            cursor: pointer;
        }
        h3:hover {
            color: #ff6700;
        }
        p {
            font-size: 14px;
        }
        .post-img {
            padding: 15px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: nowrap;
            img {
                width: 32%;
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
    h3:hover{
        color: #ff6700;
        cursor: pointer;
    }
    .left-img{
        width: 32%;
        img{
            width: 227.19px;
            height:148.27px;
        }
    }
}
.sec-info{
    display: flex;
    justify-content: space-between;
    img{
        width: 20px;
        border-radius: 50%;
    }
    .sec-info-action{
        font-size: 12px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        width: 220px;
    }
}
.right-post{
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    margin-left: 15px;
    height: 100%;
}
</style>