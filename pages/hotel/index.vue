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
      <el-select v-model="form.region" placeholder="请选择活动区域">
        <div class="childnum">
          <span>每间</span>
          <div class="adult">
            <el-option label="区域一" value="shanghai">
              <el-select v-model="form.region" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
              </el-select>
            </el-option>
            <el-option label="区域一" value="shanghai">
              <el-select v-model="form.region" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-option>
          </div>
        </div>
        <el-option value="beijing">
          <el-button type="primary" size="mini">确定</el-button>
        </el-option>
      </el-select>

      <!-- 查看价格 -->
      <el-button type="primary" style="margin-left:15px">查看价格</el-button>
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
          <div class="areatown">
            <span>人民广场</span>
            <span>成桥镇</span>
            <span>奉贤区</span>
            <span>建设镇</span>
            <span>三星镇</span>
            <span>新河镇</span>
            <span>新河镇</span>
            <span>新河镇</span>
            <span>新河镇</span>
            <span>新河镇</span>
            <span>新河镇</span>
            <span>新河镇</span>
            <div class="showAll">
              <i class="el-icon-download" style="font-size:12px">显示全部城市信息</i>
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
            <span>
              <strong>👑</strong>
              <strong>👑</strong>
              <strong>👑</strong>
              <span>#333</span>
            </span>
            <span>
              <strong>👑</strong>
              <strong>👑</strong>
              <strong>👑</strong>
              <strong>👑</strong>
              <span>666</span>
            </span>
            <span>
              <strong>👑</strong>
              <strong>👑</strong>
              <strong>👑</strong>
              <strong>👑</strong>
              <strong>👑</strong>
              <span>999</span>
            </span>
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
          <span>{{showPrice}}</span>
        </p>
        <el-slider v-model="showPrice" :max="4000" :show-tooltip="false"></el-slider>
      </div>
      <div class="level">
        <p>住宿等级</p>
        <el-dropdown>
          <span class="el-dropdown-link">
            <span>不限</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-plus">黄金糕</el-dropdown-item>
            <el-dropdown-item icon="el-icon-circle-plus">狮子头</el-dropdown-item>
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
            <el-dropdown-item icon="el-icon-plus">黄金糕</el-dropdown-item>
            <el-dropdown-item icon="el-icon-circle-plus">狮子头</el-dropdown-item>
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
            <el-dropdown-item icon="el-icon-plus">黄金糕</el-dropdown-item>
            <el-dropdown-item icon="el-icon-circle-plus">狮子头</el-dropdown-item>
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
            <el-dropdown-item icon="el-icon-plus">黄金糕</el-dropdown-item>
            <el-dropdown-item icon="el-icon-circle-plus">狮子头</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <!--酒店展示 -->
    <div class="hotelslist">
      <div class="hotelimg">
        <img
          src="https://p1.meituan.net/hotel/c48d045b9f5bf221c479f55c622c8782154904.jpg%40700w_700h_0e_1l%7Cwatermark%3D1%26%26r%3D1%26p%3D9%26x%3D2%26y%3D2%26relative%3D1%26o%3D20"
        />
      </div>
      <div class="hotelpreinfo">
        <h3>锦江之星</h3>
        <p>jin jiang zhi xing (shang hai min hang wu jing dian</p>
        <div class="hotelstar">
          <el-rate
            v-model="pointer"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value}"
          ></el-rate>
          <span>
            <span class="pricecolor">6</span>条评价
          </span>
          <span>
            <span class="pricecolor">98</span>篇游记
          </span>
        </div>
        <p>
          <i class="el-icon-map-location"></i>
          <span>位于:剑川路165号(近龙吴路)</span>
        </p>
      </div>
      <div class="pricelist">
        <div class="travelname">
          <div>携程</div>
          <div>
            <span class="pricecolor">
              $232
              <span>起</span>
            </span>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <div class="travelname">
          <div>携程</div>
          <div>
            <span class="pricecolor">
              $232
              <span>起</span>
            </span>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <div class="travelname">
          <div>携程</div>
          <div>
            <span class="pricecolor">
              $232
              <span>起</span>
            </span>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页功能 -->
    <div class="fenye">
      <el-pagination background layout="prev, pager, next" :total="1000"></el-pagination>
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
            //酒店价格显示
            showPrice: 0,
            // 酒店评分
            pointer: 3.7
        }
    },
    mounted() {
        // Amap在模板中导入js文件之后就应经是一个全局变量了
        // map是一个地图的对象
        var map = new AMap.Map('container', {
            zoom: 11, //级别
            center: [113.3245904, 23.1066805] //中心点坐标
        })
        this.map = map;
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
        async handleSelect(cityname) {
           const res=await this.$axios.get()
        }
    }
}
</script>

<style scoped lang="less">
// css原生写法 引入字体图标
@import url('//at.alicdn.com/t/font_1794855_xmtpqbfl5jh.css');
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
    display: flex;
}
.hotelinfo {
    display: flex;
    flex-direction: column;
    .infoup {
        display: flex;
        .area {
            width: 70px;
        }
        .areatown {
            span {
                padding: 0px 6px;
            }
            span:hover {
                background: #ff6700;
                color: #fff;
                cursor: pointer;
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
        }
    }
}
.infodown {
    display: flex;
    margin-top: 15px;
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
    width: 500px;
    height: 320px;
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
    border: 1px solid #999;
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
        border-left: 1px solid #666;
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
    height: 220px;
    padding: 20px 0;
    border-bottom: 1px solid #333;
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
        margin: 0 50px;
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
        font-size: 14px;
        width: 200px;
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
    width: 100%;
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
//筛选人数
.childnum {
    width: 300px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;

    .adult {
        display: flex;
        .el-select-dropdown__item {
            padding: 0;
        }
        /deep/.el-input--suffix {
            width: 90px;
            margin-left: 15px;
            .el-input__inner {
                height: 30px;
                line-height: 30px;
            }
        }
    }
}
.selected {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    box-sizing: border-box;
    height: 50px;
    line-height: 50px;
    background-color: #fff;
    border-top: 1px solid #eee;
    .el-button--mini {
        height: 30px;
    }
}
</style>