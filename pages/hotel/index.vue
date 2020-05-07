<template>
  <div class="container">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>酒店</el-breadcrumb-item>
      <el-breadcrumb-item>{{this.cityinfolist[0].name}}酒店预订</el-breadcrumb-item>
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
      <el-popover placement="bottom" width="265" trigger="manual" v-model="visible" class="tiolist">
        <div class="tabone">
          <span>每间</span>
          <div>
            <el-select v-model="options.adult" placeholder="成人" :value="options.adult">
              <el-option label="1成人" value="1成人"></el-option>
              <el-option label="2成人" value="2成人"></el-option>
              <el-option label="3成人" value="3成人"></el-option>
            </el-select>
            <el-select v-model="options.child" placeholder="儿童" :value="options.child">
              <el-option label="1儿童" value="1儿童"></el-option>
              <el-option label="2儿童" value="2儿童"></el-option>
              <el-option label="3儿童" value="3儿童"></el-option>
            </el-select>
          </div>
        </div>
        <div class="tabtwo">
          <el-button @click="chooseChild">确定</el-button>
        </div>
      </el-popover>
      <el-input
        placeholder="人数未定"
        suffix-icon="el-icon-user"
        @focus="isShowTab"
        :value="options.value"
      ></el-input>

      <!-- 查看价格 -->
      <el-button
        type="primary"
        style="margin-left:15px"
        @click="checkPrice"
        v-loading.fullscreen.lock="fullscreenLoading"
      >查看价格</el-button>
    </el-form>

    <!-- 高德地图展示 -->
    <div class="map">
      <script
        type="text/javascript"
        src="https://webapi.amap.com/maps?v=1.4.15&key=	fba3fa19294ea55fb391428ba742810d"
      ></script>
      <div class="hotelinfo">
        <div class="infoup">
          <div class="area">区域:</div>
          <div>
            <div class="areatown">
              <h3 v-if="ishowArea">暂无数据</h3>
              <span v-for="(item,index) in cityinfolist[0].scenics" :key="index">{{item.name}}</span>
            </div>
            <div class="showAll">
              <i class="el-icon-download" style="font-size:12px" @click="showAllcityInfo">显示全部城市信息</i>
            </div>
          </div>
        </div>
        <div class="infodown">
          <div class="aveprice">
            均价
            <el-tooltip
              class="item"
              effect="dark"
              content="等级均价由平日价格计算得出,节假日价格会有上浮"
              placement="top-start"
            >
              <el-button>?</el-button>
            </el-tooltip>:
          </div>
          <div class="queen">
            <div class="one">
              <span class="iconfont icon-icon_huangguan" v-for="item in 3" :key="item.id"></span>￥332
            </div>
            <div class="one">
              <span class="iconfont icon-icon_huangguan" v-for="item in 4" :key="item.id"></span>￥521
            </div>
            <div class="one">
              <span class="iconfont icon-icon_huangguan" v-for="item in 5" :key="item.id"></span>￥768
            </div>
          </div>
        </div>
      </div>
      <div id="container"></div>
    </div>

    <!-- 条件筛选 -->
    <div class="condition">
      <div class="price">
        <p>
          <span>价格</span>
          <span>0~{{showPrice}}</span>
        </p>
        <el-slider
          v-model="showPrice"
          :max="4000"
          :show-tooltip="false"
          @change="changePrice(showPrice)"
          :step="10"
        ></el-slider>
      </div>
      <div class="level">
        <p>住宿等级</p>
        <el-dropdown>
          <span class="el-dropdown-link">
            <span>不限</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-checkbox-group v-model="hotelstar">
              <el-checkbox
                :label="item.level"
                :value="item.level"
                v-for="(item,index) in hotelCategory.levels"
                :key="index"
                @change="chooseLevel(item.level)"
              >{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="type">
        <p>住宿类型</p>
        <el-dropdown>
          <span class="el-dropdown-link">
            <span>不限</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-checkbox-group v-model="hoteltype">
              <el-checkbox
                :label="item1.id"
                :value="item1.id"
                v-for="(item1,index1) in hotelCategory.types"
                :key="index1"
                @change="chooseType"
              >{{item1.name}}</el-checkbox>
            </el-checkbox-group>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="equipment">
        <p>酒店设备</p>
        <el-dropdown>
          <span class="el-dropdown-link">
            <span>不限</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-checkbox-group v-model="hotelequipment">
              <el-checkbox
                :label="item2.id"
                :value="item2.id"
                v-for="(item2,index2) in hotelCategory.assets"
                :key="index2"
                @change="chooseEquipment"
              >{{item2.name}}</el-checkbox>
            </el-checkbox-group>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="brand">
        <p>酒店品牌</p>
        <el-dropdown>
          <span class="el-dropdown-link">
            <span>不限</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-checkbox-group v-model="hotelbrand">
              <el-checkbox
                :label="item3.id"
                :value="item3.id"
                v-for="(item3,index3) in hotelCategory.brands"
                :key="index3"
                @change="chooseBrand"
              >{{item3.name}}</el-checkbox>
            </el-checkbox-group>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <!--酒店展示 -->
    <div class="hotelshowlist">
      <div class="hotelslist" v-for="(item,index) in backHotelInfo" :key="index">
        <div class="hotelimg">
          <img :src="item.photos" />
        </div>
        <div class="hotelpreinfo">
          <h3 @click="$router.push(`/hotel/detail?id=${item.id}`)">{{item.name}}</h3>
          <p>{{item.alias}}</p>
          <div class="hotelstar">
            <el-rate
              v-model="pointer"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value}"
            ></el-rate>
            <span>
              <span class="pricecolor">{{Math.ceil(Math.random()*10)+Math.ceil(Math.random()*10)}}</span>条评价
            </span>
            <span>
              <span class="pricecolor">{{Math.ceil(Math.random()*10)+Math.ceil(Math.random()*10)}}</span>篇游记
            </span>
          </div>
          <p>
            <i class="el-icon-map-location"></i>
            <span>位于:{{item.address}}</span>
          </p>
        </div>
        <!-- </nuxt-link> -->
        <div class="pricelist">
          <a href="https://hotels.ctrip.com/hotel/8627044.html#ctm_ref=ctr_hp_sb_lst">
            <div class="travelname" v-for="(item2,index2) in item.products" :key="index2">
              <div>{{item2.name}}</div>
              <div>
                <span class="pricecolor">
                  ￥{{item2.price}}
                  <span>起</span>
                </span>
                <i class="el-icon-arrow-right"></i>
              </div>
            </div>
          </a>
        </div>
      </div>
      <div class="noData" v-if="isShowNoData">
        <h3>暂时没有您想要的酒店</h3>
      </div>
    </div>
    <!-- 分页功能 -->
    <div class="fenye">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="start"
        :page-size="10"
        layout=" prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
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
            tabPosition: 'left',
            // 地图对象
            map: '',
            // 酒店价格调整
            hotelprice: 4000,
            // 酒店评分
            pointer: 3.7,
            // 查找的城市信息
            cityinfolist: [{}],
            // 返回城市酒店信息
            backHotelInfo: [],
            // 下一页显示多少条数据
            start: 0,
            total: 0,
            // 加载显示
            fullscreenLoading: false,
            // 显示选择人数的框
            visible: false,
            // 选择人数
            options: {
                value: '',
                child: '',
                adult: ''
            },
            // 当前位置信息
            localInfo: {},
            // 暂无数据
            ishowArea: true,
            //酒店经纬度集合
            earth: [],
            marklist: [],
            //中心点
            center: [],
            //酒店价格显示
            showPrice: 4000,
            //酒店星级
            hotelstar: [],
            //酒店类别
            hoteltype: [],
            //酒店设施
            hotelequipment: [],
            //酒店品牌
            hotelbrand: [],
            // 酒店详情
            hotelCategory: [],
            // 是否展示数据
            isShowNoData: false,
            // --------------筛选拼接----------------------
            city: '',
            price_lt: '',
            hotellevel_in: '',
            hoteltype_in: '',
            hotelasset_in: '',
            hotelbrand_in: '',
            totalUrl: ''
        }
    },
    mounted() {
        setTimeout(() => {
            var map = new AMap.Map('container')
            // Amap在模板中导入js文件之后就应经是一个全局变量了
            // map是一个地图的对象
            var map = new AMap.Map('container', {
                zoom: 11, //级别
                // center: [113.30, 22.80],//顺德经纬度
                resizeEnable: false //自动定位到当前位置
            })
            this.map = map
            this.markList()
            // 弹框提示当前位置
            AMap.plugin('AMap.CitySearch', () => {
                var citySearch = new AMap.CitySearch()
                citySearch.getLocalCity((status, result) => {
                    if (status === 'complete' && result.info === 'OK') {
                        // 查询成功，result即为当前所在城市信息
                        // console.log(result)
                        // this.form.mainCity=result.city
                        this.$alert(`${result.city}`, '当前定位', {
                            confirmButtonText: '确定',
                            callback: action => {}
                        })
                    }
                })
            })
            this.getHotelBrand()
        }, 200)
    },
    methods: {
        //点标记
        markList(backHotelInfo) {
            //遍历给经纬度加酒店title
            this.earth.forEach((v1, i1) => {
                return (v1.hotelName = backHotelInfo[i1].name)
            })
            this.marklist = []
            this.earth.forEach((v, i) => {
                return (this.marklist[i] = new AMap.Marker({
                    position: new AMap.LngLat(v.longitude, v.latitude),
                    title: `${v.hotelName}`
                }))
            })
            this.map.add(this.marklist)
        },
        // 封装请求城市酒店
        async getHotel(cityId, start, prcie) {
            const res = await this.$axios.get('/hotels', {
                params: {
                    city: cityId, //城市id
                    _start: start, //显示多少数据
                    price_It: prcie
                }
            })
            this.backHotelInfo = res.data.data
            console.log(this.backHotelInfo)
            this.total = res.data.total
            if(res.data.total==0){
                this.isShowNoData=true
            };
            this.earth = this.backHotelInfo.map(v => {
                return v.location
            })
            this.map.remove(this.marklist)
            setTimeout(() => {
                this.markList(this.backHotelInfo)
            }, 10)
        },
        //封装请求酒店选项
        getHotelBrand() {
            this.$axios({
                url: '/hotels/options'
            }).then(res => {
                const { data } = res.data
                this.hotelCategory = data

                console.log(this.hotelCategory)
            })
        },
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
        async handleSelect(cityname) {
            const res = await this.$axios.get(`/cities`, {
                params: {
                    name: cityname.name
                }
            })
            this.cityinfolist = res.data.data
            this.city = `&city=${this.cityinfolist[0].id}`
            // console.log(this.city);
            this.getHotel(this.cityinfolist[0].id)
            this.ishowArea = false
        },
        //点击展示全部城市信息
        showAllcityInfo() {
            if (!this.form.mainCity) {
                return
            }
            if (!document.querySelector('.areatown').getAttribute('style')) {
                document.querySelector('.areatown').style.height = 60 + `px`
            }
            if (
                document.querySelector('.areatown').getAttribute('style') ==
                'height: 155px;'
            ) {
                document.querySelector('.areatown').style.height = 60 + `px`
            } else {
                document.querySelector('.areatown').style.height = 155 + `px`
            }
        },
        // 点击切换页数
        handleCurrentChange(value) {
            if(!this.totalUrl){
                this.getHotel(this.cityinfolist[0].id, (value - 1) * 5, null)
            }else{
                this.totalUrl+=`&_start=5`
                this.hobbyHotel(this.totalUrl)
            }
        },
        //点击查询价格
        checkPrice() {
            this.fullscreenLoading = true
            this.getHotel(this.cityinfolist[0].id)
            setTimeout(() => {
                this.fullscreenLoading = false
            }, 2000)
        },
        //展示选人数框
        isShowTab() {
            this.visible = true
        },
        //点击确认人数
        chooseChild() {
            this.options.value = `${this.options.adult}${this.options.child}`
            this.visible = false
        },

        //点击跳转页面
        handleCityId() {
            this.$router.push({
                url: '/hotel/detail',
                query: {
                    city: 197
                }
            })
        },
        // 封装筛选条件后请求酒店
        hobbyHotel(totelUrl) {
            this.$axios({
                url: `/hotels?${totelUrl}`//&_start=5
            }).then(res => {
                this.backHotelInfo = res.data.data
                console.log(this.backHotelInfo)
                this.total = res.data.total
                if(res.data.total==0){
                    this.isShowNoData=true;
                }
                this.earth = this.backHotelInfo.map(v => {
                    return v.location
                })
                this.map.remove(this.marklist)
                setTimeout(() => {
                    this.markList(this.backHotelInfo)
                }, 10)
            })
        },

        // 拖动价格
        changePrice(showPrice) {
            this.price_lt = `&price_lt=${this.showPrice}`
            this.totalUrl =
                this.city +
                this.price_lt +
                this.hotellevel_in +
                this.hoteltype_in +
                this.hotelasset_in +
                this.hotelbrand_in
            this.hobbyHotel(this.totalUrl)

        },
        //选择酒店等级
        chooseLevel(level) {
            if(!this.city)return this.$message.error('请输入城市');
            this.price_lt = `&price_lt=${this.showPrice}`
            const Qs = require('qs')
            this.hotellevel_in = `&${decodeURIComponent(
                Qs.stringify(
                    { hotellevel_in: this.hotelstar },
                    { arrayFormat: 'repeat' }
                )
            )}`
            this.totalUrl =
                this.city +
                this.price_lt +
                this.hotellevel_in +
                this.hoteltype_in +
                this.hotelasset_in +
                this.hotelbrand_in
            console.log(this.totalUrl)
            this.hobbyHotel(this.totalUrl)
        },
        //选择住宿类型
        chooseType() {
            if(!this.city)return this.$message.error('请输入城市');
            this.price_lt = `&price_lt=${this.showPrice}`
            const Qs = require('qs')
            this.hoteltype_in = `&${decodeURIComponent(
                Qs.stringify(
                    { hoteltype_in: this.hoteltype },
                    { arrayFormat: 'repeat' }
                )
            )}`
            this.totalUrl =
                this.city +
                this.price_lt +
                this.hotellevel_in +
                this.hoteltype_in +
                this.hotelasset_in +
                this.hotelbrand_in
            //    console.log(this.totalUrl);
            this.hobbyHotel(this.totalUrl)
        },
        //选择设备
        chooseEquipment() {
            if(!this.city)return this.$message.error('请输入城市');
            this.price_lt = `&price_lt=${this.showPrice}`
            const Qs = require('qs')
            this.hotelasset_in = `&${decodeURIComponent(
                Qs.stringify(
                    { hotelasset_in: this.hotelequipment },
                    { arrayFormat: 'repeat' }
                )
            )}`
            this.totalUrl =
                this.city +
                this.price_lt +
                this.hotellevel_in +
                this.hoteltype_in +
                this.hotelasset_in +
                this.hotelbrand_in
            this.hobbyHotel(this.totalUrl)
        },
        //选择品牌
        chooseBrand() {
            if(!this.city)return this.$message.error('请输入城市');
            this.price_lt = `&price_lt=${this.showPrice}`
            const Qs = require('qs')
            this.hotelbrand_in = `&${decodeURIComponent(
                Qs.stringify(
                    { hotelbrand_in: this.hotelbrand },
                    { arrayFormat: 'repeat' }
                )
            )}`
            this.totalUrl =
                this.city +
                this.price_lt +
                this.hotellevel_in +
                this.hoteltype_in +
                this.hotelasset_in +
                this.hotelbrand_in
            this.hobbyHotel(this.totalUrl)
        },
    }
}
</script>

<style scoped lang="less">
body {
    margin: 0;
}
.container {
    height: 100%;
    width: 1000px;
    margin: 0 auto;
    padding: 20px 0;
    .el-table {
        height: 100%;
    }
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
//地图外大盒子
.map {
    height: 343px;
    margin-top: 15px;
    display: flex;
}
.hotelinfo {
    width: 50%;
    .infoup {
        .area {
            padding-bottom: 5px;
            border-bottom: 1px solid #eee;
            margin-bottom: 5px;
        }
        .areatown {
            height: 60px;
            transition: all 0.3s;
            overflow: hidden;
            h3 {
                font-weight: normal;
            }
            span {
                display: inline-block;
                padding: 5px;
                border-radius: 5px;
            }
            span:hover {
                background: #ff6700;
                color: #fff;
                cursor: pointer;
            }
        }
    }
    .infodown {
        margin-top: 10px;
        .queen {
            margin-top: 5px;
            // display: flex;
            // flex-direction: column;
            div {
                margin: 10px 0;
                span {
                    color: orange;
                }
            }
        }
    }
}
.showAll {
    i {
        color: #ff6700;
    }
    i:hover {
        cursor: pointer;
        text-decoration: underline;
    }
}
.aveprice {
    padding-bottom: 5px;
    border-bottom: 1px solid #eee;
}
.aveprice .el-tooltip {
    padding: 0;
}
.aveprice .item {
    width: 10px;
    height: 10px;
    font-size: 12px;
    transform: scale(-1);
    background-color: #eee;
}
#container {
    width: 50%;
    height: 100%;
    margin-left: 15px;
}
// 条件筛选
.condition {
    margin-top: 15px;
    height: 80px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 10px;
    box-sizing: border-box;
    border: 1px solid #eee;
    border-radius: 5px;
    .price {
        width: 25%;
        padding: 0 10px;
        p {
            display: flex;
            justify-content: space-between;
        }
    }
    .level,
    .type,
    .equipment,
    .brand {
        width: 15%;
        border-left: 1px solid #eee;
        padding-left: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size: 16px;
    }
    .el-dropdown-link {
        display: flex;
        justify-content: space-between;
    }
}
//酒店区域
.hotelslist {
    display: flex;
    justify-content: space-between;
    height: 220px;
    padding: 20px 0;
    border-bottom: 1px solid #eee;
    .hotelimg {
        height: 100%;
        width: 320px;
        img {
            width: 320px;
            height: 100%;
            display: block;
        }
    }
    .hotelpreinfo {
        h3 {
            font-size: 25px;
            font-weight: normal;
            cursor: pointer;
        }
        h3:hover {
            text-decoration: underline;
        }
        width: 350px;
        p {
            color: gray;
        }
        .hotelstar {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
        }
    }
    .pricelist {
        font-size: 16px;
        width: 260px;
        .travelname {
            display: flex;
            justify-content: space-between;
            padding: 20px;
            box-sizing: border-box;
            border-bottom: 1px solid #eee;
        }
    }
}
//分页功能
.fenye {
    width: 80%;
    display: flex;
    justify-content: flex-end;
    padding: 20px 0;
    .el-pagination {
        width: 40%;
    }
}
//公共颜色
.pricecolor {
    color: #ff6700;
    margin-right: 5px;
}
//选人数
.el-input {
    width: 22%;
}
.el-form {
    position: relative;
}
.tiolist {
    display: flex;
    flex-direction: column;
    width: 265px;
    position: absolute;
    left: 570px;
    top: 45px;

    /deep/ .el-input__inner {
        width: 100px;
    }
    .tabone {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid #eee;
    }
    .tabtwo {
        padding-top: 10px;
        display: flex;
        justify-content: flex-end;
    }
}
// 复选框
/deep/.el-checkbox {
    width: 80px;
    display: flex;
    align-items: center;
    // justify-content: space-between;
    padding: 5px 0 5px 10px;
}
/deep/ .el-checkbox-group {
    overflow: auto;
    height: 180px;
}
.noData {
    text-align: center;
    padding: 50px 0;
    color: gray;
}
</style>