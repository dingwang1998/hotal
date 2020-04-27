<template>
  <div class="container">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>酒店</el-breadcrumb-item>
      <el-breadcrumb-item>酒店预订</el-breadcrumb-item>
    </el-breadcrumb>

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
    </el-form>
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
        time:''
      },
      //搜索的城市数据
      searchCity: []
    }
  },
  mounted() {},
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
    }
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
</style>