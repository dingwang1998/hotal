<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <div>
          <flightsFilters :data="copyData" @getList="getList"></flightsFilters>
        </div>

        <!-- 航班头部布局 -->
        <div>
          <flightsListHead />
        </div>

        <!-- 航班信息 -->
        <div>
          <flightsItem v-for="(item,index) in dataList" :key="index" :data="item" />
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
        <flightsAside></flightsAside>
      </div>
    </el-row>
  </section>
</template>

<script>
import flightsListHead from '@/components/air/flightsListHead.vue'
import flightsItem from '@/components/air/flightsItem.vue'
import flightsFilters from '@/components/air/flightsFilters.vue'
import flightsAside from '@/components/air/flightsAside.vue'

export default {
    data() {
        return {
            // 机票列表总数据 包含了info,flights,total,options
            flightsData: {
                flights: [], //机票信息
                info: {}, //当前页的航信信息  单程那边显示的信息
                options: {}
            },
            // 备份的数据一旦赋值后,就不可改变
            copyData: {
                flights: [], //机票信息
                info: {}, //当前页的航信信息  单程那边显示的信息
                options: {}
            },
            // 当前页数
            pageIndex: 1,
            // 展示条数
            pageSize: 5,
            // 总条数
            total: 1
        }
    },
    mounted() {
        this.$axios.get('/airs', { params: this.$route.query }).then(res => {
            // 将机票列表总数据保存在flightsData中
            this.flightsData = res.data

            // 并且备份一份数据
            this.copyData = { ...res.data }
            // console.log(this.copyData);

            // 机票列表总数
            this.total = res.data.total
        })
    },
    computed: {
        // 计算属性会监听函数内部所有实例的（即this）属性的变化
        // 页面要渲染的机票列表
        dataList() {
            const arr = this.flightsData.flights.slice(
                (this.pageIndex - 1) * this.pageSize,
                this.pageIndex * this.pageSize
            )
            return arr
        }
    },
    methods: {
        // 选择每页展示多少条 触发的事件
        handleSizeChange(val) {
            // val是每页展示${val}条数据
            this.pageSize = val
            // 跳回到第一页
            this.pageIndex = 1
        },
        // 切换第几页的的时候触发
        handleCurrentChange(val) {
            // 切换了页数，把当前页数赋值给pageIndex
            this.pageIndex = val
        },
        // 传递给子组件的事件
        getList(arr) {
            // flightsData.flights是展示的数据
            this.flightsData.flights = arr
            // 重置总条数
            this.total = arr.length
        }
    },
    // 监听本页的路由变化，一旦变化就重新获取数据
    watch:{
      $route(){
         this.$axios.get('/airs', { params: this.$route.query }).then(res => {
            // 将机票列表总数据保存在flightsData中
            this.flightsData = res.data

            // 并且备份一份数据
            this.copyData = { ...res.data }
            // console.log(this.copyData);

            // 机票列表总数
            this.total = res.data.total
        })
        
      }
    },
    components: {
        flightsListHead,
        flightsItem,
        flightsFilters,
        flightsAside,
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