<template>
  <div class="search-form">
    <!-- 头部tab切换 -->
    <el-row type="flex" class="search-tab">
      <span
        v-for="(item, index) in tabs"
        :key="index"
        @click="handleSearchTab(item, index)"
        :class="{active: index === currentTab}"
      >
        <i :class="item.icon"></i>
        {{item.name}}
      </span>
    </el-row>

    <el-form class="search-form-content" ref="form" label-width="80px" :model="form">
      <el-form-item label="出发城市">
        <!-- fetch-suggestions 返回输入建议的方法 -->
        <!-- select 点击选中建议项时触发 -->
        <el-autocomplete
          :fetch-suggestions="queryDepartSearch"
          placeholder="请搜索出发城市"
          @select="handleDepartSelect"
          class="el-autocomplete"
          v-model="form.departCity"
          @blur="lostDepartFocus"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="到达城市">
        <el-autocomplete
          :fetch-suggestions="queryDestSearch"
          placeholder="请搜索到达城市"
          @select="handleDestSelect"
          class="el-autocomplete"
          v-model="form.destCity"
          @blur="lostDestFocus"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="出发时间">
        <!-- change 用户确认选择日期时触发 -->
        <el-date-picker
          type="date"
          placeholder="请选择日期"
          style="width: 100%;"
          @change="handleDate"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
          v-model="form.departDate"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label>
        <el-button style="width:100%;" type="primary" icon="el-icon-search" @click="handleSubmit">搜索</el-button>
      </el-form-item>
      <div class="reverse">
        <span @click="handleReverse">换</span>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 表单的数据
      form: {
        departCity: '', // 出发城市
        destCity: '', //到达城市
        departCode: '', // 出发城市的字母代码
        destCode: '', // 到达城市的字母代码
        departDate: '' // 出发日期
      },
      tabs: [
        { icon: 'iconfont icondancheng', name: '单程' },
        { icon: 'iconfont iconshuangxiang', name: '往返' }
      ],
      currentTab: 0,
      //   出发
      departCity: [],
      //到达
      destCity: [],
      //日期禁用选项
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24
        }
      }
    }
  },
  methods: {
    // 监听出发城市输入框的变化，一旦文字发生了变化,就会触发该事件。
    // value 是输入框的值，cb是回调函数，接收要展示的列表【{value：1}】这种格式
    async queryDepartSearch(value, cb) {
      if (!value) {
        cb([])
        return
      }
      const res = await this.$axios.get('/airs/city', {
        params: { name: value }
      })
      const { data } = res.data
      const newData = data.map(v => {
        v.value = v.name.replace('市', '')
        return v
      })
      this.departCity = newData
      cb(newData)
    },
    // 出发城市失去焦点
    lostDepartFocus() {
      if (this.departCity.length > 0) {
        this.form.departCity = this.departCity[0].value
        this.form.departCode = this.departCity[0].sort
      }
    },

    // 目标城市输入框获得焦点时触发
    // value 是选中的值，cb是回调函数，接收要展示的列表
    async queryDestSearch(value, cb) {
      if (!value) {
        cb([])
        return
      }
      const res = await this.$axios.get('/airs/city', {
        params: { name: value }
      })
      const { data } = res.data
      const newData = data.map(v => {
        v.value = v.name.replace('市', '')
        return v
      })
      this.destCity = newData
      cb(newData)
    },
    //到达城市失去焦点
    lostDestFocus() {
      if (this.destCity.length > 0) {
        this.form.destCity = this.destCity[0].value
        this.form.destCode = this.destCity[0].sort
      }
    },

    // 出发城市下拉选择时触发
    handleDepartSelect(item) {
      this.form.departCode = item.sort
    },

    // 目标城市下拉选择时触发
    handleDestSelect(item) {
      this.form.destCode = item.sort
    },

    // 确认选择日期时触发
    handleDate(value) {},

    // 触发和目标城市切换时触发
    handleReverse() {
      const { departCity, destCity, departCode, destCode } = this.form
      //   交叉赋值
      this.form.destCity = departCity
      this.form.destCode = departCode
      this.form.departCity = destCity
      this.form.departCode = destCode
    },

    // 提交表单是触发
    handleSubmit() {
      const arr = [
        {
          value: this.form.departCity === '',
          message: '请输入出发城市'
        },
        {
          value: this.form.destCity === '',
          message: '请输入目的地'
        },
        {
          value: this.form.departDate === '',
          message: '请输入出发时间'
        }
      ]
      // 假设都所有都成立
      let flag = true
      arr.forEach(v => {
        //假如有一向不成立就阻止继续执行
        if (!flag) return
        if (v.value == true) {
          this.$message.warning(v.message)
          flag = false
        }
      })
      //   如有一项没验证通过,就阻塞代码继续执行
      if (!flag) return
      //   将搜索记录存储，方便下一页的侧边栏搜索历史用
      this.$store.commit('air/setSearchList', this.form)
      //   跳转下一页
      this.$router.push({
        path: '/air/flights',
        query: this.form
      })
    },

    // tab切换时触发
    handleSearchTab(item, index) {
      if (index == 1)
        return this.$alert('目前暂不支持往返，请使用单程选票！', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
          callback: action => {}
        })
    }
  },
  mounted() {}
}
</script>

<style scoped lang="less">
.search-form {
  border: 1px #ddd solid;
  border-top: none;
  width: 360px;
  height: 350px;
  box-sizing: border-box;
}

.search-tab {
  span {
    display: block;
    flex: 1;
    text-align: center;
    height: 48px;
    line-height: 42px;
    box-sizing: border-box;
    border-top: 3px #eee solid;
    background: #eee;
  }

  .active {
    border-top-color: orange;
    background: #fff;
  }

  i {
    margin-right: 5px;
    font-size: 18px;

    &:first-child {
      font-size: 16px;
    }
  }
}

.search-form-content {
  padding: 15px 50px 15px 15px;
  position: relative;

  .el-autocomplete {
    width: 100%;
  }
}

.reverse {
  position: absolute;
  top: 35px;
  right: 15px;

  &:after,
  &:before {
    display: block;
    content: '';
    position: absolute;
    left: -35px;
    width: 25px;
    height: 1px;
    background: #ccc;
  }

  &:after {
    top: 0;
  }

  &:before {
    top: 60px;
  }

  span {
    display: block;
    position: absolute;
    top: 20px;
    right: 0;
    font-size: 12px;
    background: #999;
    color: #fff;
    width: 20px;
    height: 20px;
    line-height: 18px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;

    &:after,
    &:before {
      display: block;
      content: '';
      position: absolute;
      left: 10px;
      width: 1px;
      height: 20px;
      background: #ccc;
    }

    &:after {
      top: -20px;
    }

    &:before {
      top: 20px;
    }
  }
}
</style>