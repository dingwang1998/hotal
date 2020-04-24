<template>
  <div class="filters">
    <el-row type="flex" class="filters-top" justify="space-between" align="middle">
      <el-col :span="8">
        单程：
        {{data.info.departCity}} - {{data.info.destCity}}
        /
        {{data.info.departDate}}
      </el-col>
      <el-col :span="4">
        <!-- label是下拉框中显示的数据 -->
        <!-- 点击change事件打印的是value -->
        <el-select size="mini" v-model="airport" placeholder="起飞机场">
          <el-option
            :label="item"
            :value="item"
            v-for="(item,index) in data.options.airport"
            :key="index"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="flightTimes" placeholder="起飞时间">
          <el-option
            :label="`${item.from}:00 - ${item.to}:00`"
            :value="`${item.from},${item.to}`"
            v-for="(item,index) in data.options.flightTimes"
            :key="index"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="company" placeholder="航空公司">
          <el-option
            :label="item"
            :value="item"
            v-for="(item,index) in data.options.company"
            :key="index"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="airSize" placeholder="机型">
          <el-option
            :label="item.size"
            :value="item.value"
            v-for="(item,index) in airSizeList"
            :key="index"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
    <div class="filter-cancel">
      筛选：
      <el-button type="primary" round plain size="mini" @click="handleFiltersCancel">撤销</el-button>
    </div>
    <div v-show="false">{{filter}}</div>
  </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            airport: '', // 机场
            flightTimes: '', // 出发时间
            company: '', // 航空公司
            airSize: '', // 机型大小
            // 机型大小自己设定
            airSizeList: [
                { size: '大', value: 'L' },
                { size: '中', value: 'M' },
                { size: '小', value: 'S' }
            ]
        }
    },
    computed: {
        filter() {
            const filters = [
                { key: 'org_airport_name', value: this.airport },
                { key: 'dep_time', value: this.flightTimes },
                { key: 'airline_name', value: this.company },
                { key: 'plane_size', value: this.airSize }
            ]

            // 过滤有值的条件加入筛选  如果下拉选了选项,就返回它对应的value,数组形式存储
            const hasFilters = filters.filter(v => {
                return v.value
            })
            // console.log(hasFilters);

            const arr = this.data.flights.filter(v => {
                const valid = hasFilters.every(item => {
                // console.log(v[item.key]);
                    // console.log(+item.value.split(',')[0]); //下拉框选的时间 [6,12]
                    // console.log(+v[item.key].split(':')[0]); //数据里的 出发时间

                    // 下拉框的时间[0]<=出发时间<下拉框时间[1] 符合筛选条件

                    // v[item.key]相当于filters的key
                    return (
                        v[item.key] == item.value ||
                        (+item.value.split(',')[0] <= +v[item.key].split(':')[0] &&
                         +v[item.key].split(':')[0] < +item.value.split(',')[1])
                    )
                })
                return valid //如果valid就返回符合条件的  新数组接收
            })
            this.$emit('getList', arr)
        }
    },
    methods: {
        // // 选择机场时候触发
        // handleAirport(value) {
        //     const arr=this.data.flights.filter(v=>{
        //         return v.org_airport_name==this.airport;
        //     })
        //     console.log(arr);
        //     this.$emit('getList',arr)
        // },

        // // 选择出发时间时候触发
        // handleFlightTimes(value) {
        //     console.log(this.flightTimes);
        //     const time=this.flightTimes.split(','); //[6,12]
        //     const arr=this.data.flights.filter(v=>{
        //         // 每个航班的出发时间的小时(返回的是字符串)
        //         const current=v.dep_time.split(":")[0];
        //         // 满足以下条件,代表这趟航班是满足条件的
        //         return +time[0]<= +current && +current < +time[1];
        //     })
        //     this.$emit('getList',arr);
        // },

        // // 选择航空公司时候触发
        // handleCompany(value) {
        //     console.log(this.data.flights);
        //     const company=this.data.flights.filter(v=>{
        //         return this.company===v.airline_name
        //     })
        //     this.$emit('getList',company)
        // },

        // // 选择机型时候触发
        // handleAirSize(value) {
        //     console.log(this.airSize);
        //     const size=this.data.flights.filter(v=>{
        //         return this.airSize==v.plane_size
        //     })
        //     this.$emit('getList',size)
        // },

        // 撤销条件时候触发
        handleFiltersCancel() {
            this.airport = ''
            this.flightTimes = ''
            this.company = ''
            this.airSize = ''
        }
    }
}
</script>

<style scoped lang="less">
.filters {
    margin-bottom: 20px;
}

.filters-top {
    > div {
        /deep/ .el-select {
            margin-left: 10px;
        }
    }
}

.filter-cancel {
    margin-top: 10px;
}
</style>