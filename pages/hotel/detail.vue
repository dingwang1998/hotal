<template>
  <div class="mainconteniner">
    <!-- 面包屑 -->
    <div class="bread">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item @click="$router.push('/hotel/index')">{{hotelDetail.big_cate}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{hotelDetail.real_city}}酒店</el-breadcrumb-item>
        <el-breadcrumb-item>{{hotelDetail.name}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 酒店名称 -->
    <div class="hotelInfo">
      <h2>{{hotelDetail.name}}</h2>
      <p>{{hotelDetail.alias}}</p>
      <p>
        <span class="el-icon-location"></span>
        <span>{{hotelDetail.address}}</span>
      </p>
    </div>

    <!-- 酒店预览 -->
    <div class="hotelImg clearfix">
      <div class="preview">
        <img :src="mainImage" />
      </div>
      <div class="hotelRight">
        <img :src="item.url" v-for="(item,index) in images" :key="index" @click="changeImage(item)" />
      </div>
    </div>

    <!-- 表格 -->
    <el-table :data="priceInfo" style="width: 100%">
      <el-table-column prop="name" label="价格来源" width="380"></el-table-column>
      <el-table-column prop="bestType" label="低价房型" width="380"></el-table-column>
      <el-table-column prop="price" label="最低价格/每晚" width="380">
        <span class="hightLight">￥{{priceInfo[0].price}}</span>
        <span>起</span>
        <span class="el-icon-arrow-right hightLight"></span>
      </el-table-column>
    </el-table>

    <!-- 地图 -->
    <div class="mapPlace">
      <script
        type="text/javascript"
        src="https://webapi.amap.com/maps?v=1.4.15&key=fba3fa19294ea55fb391428ba742810d"
      ></script>

      <div class="mapview">
        <div id="container"></div>
      </div>
      <div class="mapinfo">
        <div class="card">
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick" tab-position="top">
            <el-tab-pane label="酒店"></el-tab-pane>
            <el-tab-pane label="餐饮"></el-tab-pane>
            <el-tab-pane label="交通"></el-tab-pane>
            <el-tab-pane label="娱乐"></el-tab-pane>
          </el-tabs>
        </div>
        <div id="panel"></div>
      </div>
    </div>

    <!-- 酒店信息 -->
    <div class="infoDetail">
      <div class="inforow">
        <div class="baseinfo">
          <span>基本信息</span>
        </div>
        <div class="detail">
          <span>入住时间14:00之后</span>
          <span>离店时间14:00之后</span>
          <span>2010年开业/2010年装修</span>
          <span>酒店规模/{{hotelDetail.roomCount}}间客房</span>
        </div>
      </div>
      <div class="inforow">
        <div class="baseinfo">
          <span>主要设施</span>
        </div>
        <div class="detail">
          <el-tag
            type="success"
            v-for="(item,index) in hotelDetail.hotelassets"
            :key="index"
          >{{item.name}}</el-tag>
        </div>
      </div>
      <div class="inforow">
        <div class="baseinfo">
          <span>停车服务</span>
        </div>
        <div class="detail">
          <span>门口免费停车</span>
        </div>
      </div>
      <div class="inforow">
        <div class="baseinfo">
          <span>品牌信息</span>
        </div>
        <div class="detail">
          <el-tag v-if="hotelDetail.hotelbrand">{{hotelDetail.hotelbrand.name}}</el-tag>
        </div>
      </div>
    </div>

    <!-- 底部信息 -->
    <h3>
      0条真实评价
      <el-rate v-model="value" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate>
    </h3>

    <div class="comment">
      <div class="total">
        <p>总评数:118</p>
        <p>好评数:54</p>
        <p>差评数:5</p>
      </div>
      <div class="pointer">
        <span class="one">环境</span>
        <span class="two">产品</span>
        <span class="three">服务</span>
        <el-progress
          type="circle"
          :percentage="item*10"
          color="#ff6700"
          v-for="(item,index) in hotelDetail.scores"
          :key="index"
        ></el-progress>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            hotelDetail: {
                hotelbrand: {}
            },
            //图片信息集合
            mainImage: 'http://157.122.54.189:9093/images/hotel-pics/1.jpeg',
            images: [
                {
                    id: 1,
                    url: 'http://157.122.54.189:9093/images/hotel-pics/1.jpeg'
                },
                {
                    id: 2,
                    url: 'http://157.122.54.189:9093/images/hotel-pics/2.jpeg'
                },
                {
                    id: 3,
                    url: 'http://157.122.54.189:9093/images/hotel-pics/3.jpeg'
                },
                {
                    id: 4,
                    url: 'http://157.122.54.189:9093/images/hotel-pics/4.jpeg'
                },
                {
                    id: 5,
                    url: 'http://157.122.54.189:9093/images/hotel-pics/5.jpeg'
                },
                {
                    id: 6,
                    url: 'http://157.122.54.189:9093/images/hotel-pics/6.jpeg'
                }
            ],
            //价格信息
            priceInfo: [{}],
            // 品牌信息
            brand: [],
            value: 0,
            // 地图对象
            map: '',
            // 地图对象
            obj: {
                zoom: 11, //级别
                center: [113.3, 22.8], //中心点坐标
                viewMode: '3D' //使用3D视图
            },
            // 经纬度
            localtion: {},
            // 点标记
            mark: {
                position: [],
                title: '南山南'
            },
            //点击搜索项目
            activeName: '',
            //搜索条件
            cityType: '酒店',
            // 周边条件
            searchNear: {},
            cityName: ''
        }
    },
    mounted() {
        this.getHotelInfo()
        setTimeout(() => {
            let typeName = '酒店'
            this.changeCondition(typeName)
        }, 2000)
    },
    methods: {
        changeCondition(typeName) {
            this.obj.center[0] = this.localtion.longitude
            this.obj.center[1] = this.localtion.latitude
            this.obj.position = new AMap.LngLat(
                this.obj.center[0],
                this.obj.center[1]
            )
            this.mark.position = this.obj.center
            this.mark.title = this.hotelDetail.name
            this.mark.content = `<span class="iconfont icon-zidingyibiaozhu"></span>`

            let str = 'container'
            let obj = this.obj
            let cityName = this.real_city
            var left = this.mark.position[0]
            var right = this.mark.position[1]
            // console.log(left)

            // 地图
            var map = new AMap.Map(str, obj)
            // 点标记
            var marker = new AMap.Marker(this.mark)
            // this.changeCondition()
            //查询
            AMap.service(['AMap.PlaceSearch'], function() {
                //构造地点查询类
                var placeSearch = new AMap.PlaceSearch({
                    type: typeName, // 兴趣点类别
                    pageSize: 6, // 单页显示结果条数
                    pageIndex: 1, // 页码
                    citylimit: true, //是否强制限制在设置的城市内搜索
                    map: map, // 展现结果的地图实例
                    panel: 'panel', // 结果列表将在此容器中进行展示。
                    autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
                })

                var cpoint = [left, right] //中心点坐标
                placeSearch.searchNearBy(
                    cityName,
                    cpoint,
                    3000,
                    (status, result) => {
                        // console.log(result)
                    }
                )
            })

            this.map = map
            this.map.add(marker)
        },
        //请求酒店
        async getHotelInfo() {
            const res = await this.$axios.get('/hotels', {
                params: { id: this.$route.query.id }
            })
            this.hotelDetail = res.data.data[0]
            this.priceInfo = res.data.data[0].products
            this.value = this.hotelDetail.stars
            this.localtion = this.hotelDetail.location
            this.real_city = this.hotelDetail.real_city
            console.log(this.hotelDetail)
        },
        // 浏览大图
        changeImage(item) {
            this.mainImage = item.url
        },
        //点击搜索项目
        handleClick(tab, event) {
            console.log(tab)
            this.changeCondition(tab.label)
        }
    }
}
</script>

<style scoped lang='less'>
.mainconteniner {
    width: 1000px;
    // height: 100vh;
    margin: 0 auto;
}
.bread {
    margin-top: 15px;
    /deep/ .el-breadcrumb {
        font-size: 15px;
    }
}
.hotelInfo {
    margin: 20px 0;
    h2 {
        font-weight: normal;
        padding-bottom: 5px;
    }
    p {
        font-size: 14px;
        color: gray;
        padding: 2px 0;
    }
}
.hotelImg {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 360px;
    width: 1000px;
    .preview {
        width: 640px;
        height: 100%;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .hotelRight {
        width: 340px;
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        box-sizing: border-box;

        img {
            width: 160px;
            height: 110px;
            margin-bottom: 15px;
        }
        img:nth-child(2n) {
            margin-left: 20px;
        }
    }
}
.el-table {
    height: 190px;
    width: 100%;
    margin: 30px 0;
}

.infoDetail {
    // height: 250px;
    margin: 30px 0;
    .inforow {
        display: flex;
        height: 30px;
        line-height: 30px;
        padding: 15px;
        border-bottom: 1px solid #eee;
        .baseinfo {
            width: 100px;
            margin-right: 50px;
        }
        .detail {
            width: 100%;
            display: flex;
            // justify-content: space-evenly;
            span {
                margin-right: 60px;
            }
        }
    }
}
.hightLight {
    color: #ff6700;
}
.comment {
    margin: 20px 0 50px 0;
    display: flex;
    .total {
        margin-right: 30px;
    }
}
.pointer {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    position: relative;
    span {
        position: absolute;
        color: #ff6700;
    }
    .one {
        left: 188px;
        top: 18px;
    }
    .two {
        left: 433px;
        top: 18px;
    }
    .three {
        left: 678px;
        top: 18px;
    }
}
/deep/ .el-progress-circle {
    width: 80px !important;
    height: 80px !important;
}
/deep/.el-progress__text {
    top: 65%;
}
h3 {
    margin-bottom: 15px;
}

// -------地图-------
.mapPlace {
    height: 380px;
    margin: 40px 0;
    display: flex;
    .mapview {
        width: 60%;
    }
    .mapinfo {
        overflow: auto;
        width: 40%;
        #panel {
            width: 100%;
            height: 100%;
        }
    }
}
#container {
    width: 100%;
    height: 100%;
}
/deep/ .iconfont {
    color: blue;
    font-size: 30px;
}
/deep/ .el-tabs__header {
    margin: 0;
}
/deep/ .amap_lib_placeSearch .poibox {
    min-height: 55px;
}
</style>