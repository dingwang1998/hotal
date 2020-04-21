<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <div></div>

        <!-- 航班头部布局 -->
        <div>
          <flightsListHead />
        </div>

        <!-- 航班信息 -->
        <div>
          <flightsItem v-for="(item,index) in showList" :key="index" :data="item" />
        </div>

        
        <!-- 分页 -->
        <!-- size-change切换条数触发的事情 -->
        <!-- current-change切换页数的的时候触发 -->
        <!-- current-page当前页数 -->
        <!-- page-sizes当前显示条数 -->
        <!-- total总条数 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-size="pageSize"
          :page-sizes="[5, 10, 15,]"
          layout="total,sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <!-- 侧边栏组件 -->
      </div>
    </el-row>
  </section>
</template>

<script>
import flightsListHead from '@/components/air/flightsListHead.vue'
import flightsItem from '@/components/air/flightsItem.vue'

export default {
  data() {
    return {
      // 机票列表
      flights: [],
      // 当前页数
      pageIndex: 1,
      // 展示条数
      pageSize: 5,
      // 总条数
      total:1,
      // 每页展示的列表数组
      showList:[]
    }
  },
  mounted() {
    this.$axios.get('/airs', { params: this.$route.query }).then(res => {
      const { flights ,total} = res.data;
      this.flights = flights;
      this.total=total;
      // 只渲染5条数据 slice（0，5） 不包含第5个
      this.showList=this.flights.slice(0,this.pageSize);
    })
  },
  methods: {
    // 切换条数触发的事情
    handleSizeChange(val) {
      // val是每页展示${val}条数据
      this.pageSize=val;
      // 跳回到第一页
      this.pageIndex=1;
      // 重新展示数据
      this.showList=this.flights.slice((this.pageIndex-1)*val,this.pageIndex*val)
    },
    // 切换页数的的时候触发
    handleCurrentChange(val) {
      this.showList=this.flights.slice((val-1)*this.pageSize,val*this.pageSize);
      // 切换了页数，把当前页数赋值给pageIndex
      this.pageIndex=val;
    }
  },
  components: {
    flightsListHead,
    flightsItem
  }
}
</script>

<style scoped lang="less">
.contianer {
  width: 1000px;
  margin: 20px auto;
}

.flights-content {
  width: 745px;
  font-size: 14px;
}

.aside {
  width: 240px;
}
</style>