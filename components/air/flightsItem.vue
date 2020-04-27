<template>
  <div class="flight-item">
    <div @click="showInfo">
      <!-- 显示的机票信息 -->
      <el-row type="flex" align="middle" class="flight-info">
        <el-col :span="6">
          <span>{{data.airline_name}}</span>
          {{data.flight_no}}
        </el-col>
        <el-col :span="12">
          <el-row type="flex" justify="space-between" class="flight-info-center">
            <el-col :span="8" class="flight-airport">
              <strong>{{data.dep_time}}</strong>
              <span>{{data.org_airport_name}}{{data.org_airport_quay}}</span>
            </el-col>
            <el-col :span="8" class="flight-time">
              <span>{{rankTime}}</span>
            </el-col>
            <el-col :span="8" class="flight-airport">
              <strong>{{data.arr_time}}</strong>
              <span>{{data.dst_airport_name}}{{data.dst_airport_quay}}</span>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6" class="flight-info-right">
          ￥
          <span class="sell-price">{{data.base_price / 2}}</span>起
        </el-col>
      </el-row>
    </div>
    <div
      class="flight-recommend"
      v-for="(item,index) in data.seat_infos"
      :key="index"
      v-show="isShow"
    >
      <!-- 隐藏的座位信息列表 -->
      <el-row type="flex" justify="space-between" align="middle">
        <el-col :span="4">低价推荐</el-col>
        <el-col :span="20">
          <el-row type="flex" justify="space-between" align="middle" class="flight-sell">
            <el-col :span="16" class="flight-sell-left">
              <span>{{item.group_name}}</span>
              | {{item.supplierName}}
            </el-col>
            <el-col :span="5" class="price">￥{{item.org_settle_price}}</el-col>
            <el-col :span="3" class="choose-button">
              <nuxt-link :to="{path: `/air/order`, query: {id: data.id,seat_xid: item.seat_xid} }">
                <el-button type="warning" size="mini" @click="choseTicket(item)">选定</el-button>
              </nuxt-link>
              <p>剩余：{{item.discount}}</p>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 是否显示座位列表
      isShow: false
    }
  },
  // props声明一个对象，用来接受父组件传过来的值
  props: {
    data: {
      type: Object,
      flights: {}
    }
  },
  methods: {
    // 是否显示作为列表
    showInfo() {
      this.isShow = !this.isShow
    },
    //选定机票
    choseTicket(item) {
      //   console.log(item)
      //   console.log(this.data)
    }
  },
  mounted() {},
  computed: {
    rankTime() {
      const dep = this.data.dep_time //[10:50]
      const arr = this.data.arr_time //[12:30]

      const end = arr.split(':') //[12,30]
      const start = dep.split(':') //[10,50]

      // 间隔时间分钟
      const dis = end[0] * 60 + +end[1] + -(start[0] * 60 + +start[1])
      // 换算成小时
      const hour = Math.floor(dis / 60)
      // 换算分钟
      const min = dis % 60

      return `${hour}时${min}分`
    }
  }
}
</script>

<style scoped lang="less">
.flight-item {
  border: 1px #ddd solid;
  margin-bottom: 10px;

  .flight-info {
    padding: 15px;
    cursor: pointer;

    > div {
      &:first-child,
      &:last-child {
        text-align: center;
      }
    }
  }

  .flight-info-center {
    padding: 0 30px;
    text-align: center;

    .flight-airport {
      strong {
        display: block;
        font-size: 24px;
        font-weight: normal;
      }
      span {
        font-size: 12px;
        color: #999;
      }
    }

    .flight-time {
      span {
        display: inline-block;
        padding: 10px 0;
        border-bottom: 1px #eee solid;
        color: #999;
      }
    }
  }

  .flight-info-right {
    .sell-price {
      font-size: 24px;
      color: orange;
      margin: 0 2px;
    }
  }
}

.flight-recommend {
  background: #f6f6f6;
  border-top: 1px #eee solid;
  padding: 0 20px;

  .flight-sell {
    border-bottom: 1px #eee solid;
    padding: 10px 0;

    &:last-child {
      border-bottom: none;
    }

    .flight-sell-left {
      font-size: 12px;
      span {
        color: green;
      }
    }

    .price {
      font-size: 20px;
      color: orange;
    }

    .choose-button {
      text-align: center;
      color: #666;
      button {
        display: block;
        width: 100%;
        margin-bottom: 5px;
      }
    }
  }
}
</style>