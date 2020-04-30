<template>
  <div class="container">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>酒店</el-breadcrumb-item>
      <el-breadcrumb-item>酒店预订</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 预定部分 -->
    <el-form :model="form">
      <!-- 城市日期人数搜索 -->
      <el-autocomplete
        class="inline-input"
        suffix-icon="el-icon-search"
        v-model="form.mainCity"
        :fetch-suggestions="querySearch"
        placeholder="切换城市"
        :trigger-on-focus="false"
        @select="handleSelect"
        @blur="defaultSelected"
      ></el-autocomplete>

      <!-- 时间选择 -->
      <el-date-picker
        v-model="form.time"
        type="daterange"
        range-separator="至"
        start-placeholder="入住日期"
        end-placeholder="退房日期"
      ></el-date-picker>

      <!-- 选人数 -->
      <el-autocomplete
        popper-class="my-autocomplete"
        v-model="peopleNum"
        :fetch-suggestions="querySearch"
        placeholder="人数未定"
        @select="handleSelect"
      >
        <i class="el-icon-edit el-input__icon" slot="suffix"></i>
        <template slot-scope="{ item }">
          <div class="name">{{ item.value }}</div>
          <span class="addr">{{ item.address }}</span>
        </template>
      </el-autocomplete>

      <!-- 查看价格 -->
      <el-button type="primary">查看价格</el-button>
    </el-form>

    <!-- 高德地图展示 -->
    <div class="map">
      <script
        type="text/javascript"
        src="https://webapi.amap.com/maps?v=1.4.15&key=	fba3fa19294ea55fb391428ba742810d"
      ></script>

      <el-row>
        <el-col :span="10">
          <div id="container"></div>
        </el-col>
        <el-col :span="14">
          <div class="map-list">
            <div class="CityArea">
              <div>区域</div>
              <ul class="place">
                  <li>库塔</li>
                  <li>乌布</li>
                  <li>金巴兰海滩</li>
                  <li>金巴兰海滩</li>
                  <li>宾艮海滩</li>
                  <li>五拉赖国际机场</li>
                  <li>登巴萨</li>
                  <li>水明漾</li>
                  <li>库布和阿贡火山</li>
                  <li>艾湄湾</li>
              </ul>
            </div>
            <div class="cityPlan">
              <span>攻略</span>
            </div>
            <div class="cityPrice">
              <span>均价</span>
              
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                //城市框中的值
                mainCity: '',
                //开始及出发时间
                time: ''
            },
            //搜索的城市数据
            searchCity: [],
            //人数框的值
            peopleNum: '',

            tabPosition: 'left',
            // 地图对象
            map: '',
        }
    },
    mounted() {
        // Amap在模板中导入js文件之后就应经是一个全局变量了
        // map是一个地图的对象
        var map = new AMap.Map('container', {
            zoom: 11, //级别
            center: [113.3245904, 23.1066805] //中心点坐标
        })
        this.map = map
    },
    methods: {
        //相当于change事件，一旦输入框的值变化就变化
        querySearch(value, cb) {
            if (!value) {
                this.form.mainCity = ''
                cb([])
            }
            this.$axios({
                url: '/airs/city',
                params: {
                    name: value
                }
            }).then(res => {
                const { data } = res.data
                this.searchCity = data
                const newData = data.map(v => {
                    v.value = v.name
                    return v
                })
                cb(newData)
            })
        },
        //失去焦点自动选择第一个
        defaultSelected() {
            if (this.form.mainCity) {
                this.form.mainCity = this.searchCity[0].name
            }
        },
        // 下拉选择时候触发的事件
        handleSelect(value) {
            console.log(123)
        },

        //选定人数
        handleSelect() {}
    }
}
</script>

<style scoped lang="less">
.container {
    width: 1000px;
    margin: 0 auto;
    padding: 20px 0;
}
.el-breadcrumb {
    margin-bottom: 15px;
}
.my-autocomplete {
    li {
        line-height: normal;
        padding: 7px;

        .name {
            text-overflow: ellipsis;
            overflow: hidden;
        }
        .addr {
            font-size: 12px;
            color: #b4b4b4;
        }

        .highlighted .addr {
            color: #ddd;
        }
    }
}
.map {
    margin-top: 15px;
    width: 100%;
    height: 320px;
}
#container {
    width: 100%;
    height: 320px;
}
.map-list {
    padding: 20px;
    box-sizing: border-box;
    width: 100%;
    height: 320px;
    background-color: pink;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.CityArea,.cityPrice,.cityPlan{
    display: flex;
    span{
        margin-right:15px;
    }
}
.place{
    margin-left: 15px;
}
</style>