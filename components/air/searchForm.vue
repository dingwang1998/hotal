<template>
  <section class="container">
    <h2 class="air-title">
      <span class="iconfont iconfeiji"></span>
      <i>国内机票</i>
    </h2>

    <!-- 搜索广告栏 -->
    <el-row type="flex" justify="space-between">
      <!-- 搜索表单 -->
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

        <el-form
          class="search-form-content"
          :model="form"
          ref="form"
          label-width="80px"
        >
          <!-- 出发城市输入框 -->
          <el-form-item label="出发城市">
            <!-- fetch-suggestions 返回输入建议的方法 根据输入的关键字，发请求，返回的数据会出现在下拉列表中 -->
            <!-- select 点击选中建议项时触发的方法-->
            <el-autocomplete
              :fetch-suggestions="queryDepartSearch"
              placeholder="请搜索出发城市"
              v-model="form.departCity"
              @select="handleDepartSelect"
              @blur="handleDeparBlur"
              class="el-autocomplete"
            ></el-autocomplete>
          </el-form-item>

          <!-- 到达城市输入框 -->
          <el-form-item label="到达城市">
            <el-autocomplete
              :fetch-suggestions="queryDestSearch"
              placeholder="请搜索到达城市"
              v-model="form.destCity"
              @select="handleDestSelect"
              @blur="handledestBlur"
              class="el-autocomplete"
            ></el-autocomplete>
          </el-form-item>

          <!-- 出发时间输入框 -->
          <el-form-item label="出发时间">
            <!-- change 用户确认选择日期时触发 -->
            <el-date-picker
              v-model="form.departDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择日期"
              style="width: 100%;"
              @change="handleDate"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>

          <!-- 搜索按钮 -->
          <el-form-item label>
            <el-button
              style="width:100%;"
              type="primary"
              icon="el-icon-search"
              v-model="form.departDate"
              @click="handleSubmit"
            >搜索</el-button>
          </el-form-item>
          <div class="reverse">
            <span @click="handleReverse">换</span>
          </div>
        </el-form>
      </div>

      <!-- banner广告 -->
      <div class="sale-banner">
        <img src="http://157.122.54.189:9093/images/pic_sale.jpeg" />
      </div>
    </el-row>

    <!-- 广告 -->
    <el-row type="flex" class="statement">
      <el-col :span="8">
        <i class="iconfont iconweibiaoti-_huabanfuben" style="color:#409EFF;"></i>
        <span>100%航协认证</span>
      </el-col>
      <el-col :span="8">
        <i class="iconfont iconbaozheng" style="color:green;"></i>
        <span>出行保证</span>
      </el-col>
      <el-col :span="8">
        <i class="iconfont icondianhua" style="color:#409EFF;"></i>
        <span>7x24小时服务</span>
      </el-col>
    </el-row>

    <h2 class="air-sale-title">
      <span class="iconfont icontejiajipiao"></span>
      <i>特价机票</i>
    </h2>

    <!-- 特价机票 -->
    <div class="air-sale"></div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      tabs: [
        { icon: 'iconfont icondancheng', name: '单程' },
        { icon: 'iconfont iconshuangxiang', name: '往返' }
      ],
      // 高亮tab栏
      currentTab: 0,
      // 表单数据
      form: {
        departCity: '', //出发城市
        departCode: '', //出发城市代码
        destCity: '', //到达城市
        destCode: '', //到达城市代码
        departDate: '' //出发日期
      },
      // 失去焦点时候默认的数据
      departCity: [], //出发
      destCity: [], //目的地
      // 选择可选日期区域 pickerOptions对象
      pickerOptions: {
        // 这里的time是自动传入的
        disabledDate(time) {
          // 这里的<号代表之前的天数不可选，-3600 * 1000 * 24是除掉当天不可选之外的，都可以被选中
          return time.getTime() < Date.now() - 3600 * 1000 * 24
        }
      },
    }
  },
  methods: {
    // tab切换时触发
    handleSearchTab(item, index) {
      if (index == 1)
        return this.$alert('目前暂不支持往返，请使用单程选票！', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
          callback: action => {}
        })
    },
    // 出发城市输入框获得焦点时触发
    // value 是选中的值，cb是回调函数，接收要展示的列表
    async queryDepartSearch(value, cb) {
      if (!value) return
      const res = await this.$axios.get('/airs/city', {
        params: { name: value }
      })
      const { data } = res.data
      // console.log(data);
      const newData = data.map(v => {
        v.value = v.name.replace('市', '')
        return v
      })
      this.departCity = newData
      cb(newData)
    },
    // 目标城市输入框获得焦点时触发
    // value 是选中的值，cb是回调函数,cb里面接受一个数组，数组用对象形式存储信息，接收要展示的列表
    async queryDestSearch(value, cb) {
      if (!value) return
      const res = await this.$axios.get('/airs/city', {
        params: { name: value }
      })
      const { data } = res.data
      console.log(data)
      const newData = data.map(v => {
        v.value = v.name.replace('市', '')
        return v
      })
      this.destCity = newData
      cb(newData)
    },
    // 出发城市失去焦点
    handleDeparBlur() {
      if (this.departCity.length > 0) {
        // 将出发城市表单中的默认值设置为返回条件的第一个城市
        this.form.departCity = this.departCity[0].value
        // 根据API，需要存入出发城市code
        this.form.departCode = this.departCity[0].sort
      }
    },
    // 到达城市失去焦点
    handledestBlur() {
      if (this.destCity.length > 0) {
        this.form.destCity = this.destCity[0].value
        // 根据API，需要存入到达城市code
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
    handleReverse() {},

    // 提交表单时触发
    handleSubmit() {
      // 创建表单验证的信息数组
      const arr = [
        { value: this.form.departCity === '', message: '请输入出发城市' },
        { value: this.form.destCity === '', message: '请输入目的地' },
        { value: this.form.departDate === '', message: '请输入出发日期' }
      ];
      // 开关思想
      let flag = true;
      // 遍历数组中的value,只要有一个验证没通过，就阻止继续
      arr.forEach(v=>{
        if(!flag)return;
        // 判断每一项的value是否为真
        if(v.value==true){
          // 为真代表数值为空 就提醒用户要输入东西 然后把flag设置为false
          this.$message.warning(v.message);
          flag=false;
        }
      });
      // 有一项不通过，就会停止执行，如果flag为true时候才会继续执行
      if(!flag) return;
    }
  },
  mounted() {}
}
</script>

<style scoped lang="less">
.air-sale {
  border: 1px #ddd solid;
  padding: 20px;
  margin-bottom: 50px;

  .air-sale-pic {
    > div {
      width: 225px;
      height: 140px;
      position: relative;
      overflow: hidden;

      img {
        width: 100%;
      }

      .layer-bar {
        position: absolute;
        bottom: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.5);
        color: #fff;
        height: 30px;
        line-height: 30px;
        width: 100%;
        box-sizing: border-box;
        padding: 0 15px;
        font-size: 14px;

        span:last-child {
          font-size: 18px;
        }
      }
    }
  }
}

.air-sale-group {
  margin-top: 20px;
  padding-top: 8px;
  border-right: 1px #eee solid;

  &:last-child {
    border-right: none;
  }

  .air-sale-row {
    font-size: 12px;
    color: #666;
    margin-bottom: 8px;

    .air-sale-price {
      color: orange;
      font-size: 20px;
    }
  }
}

.container {
  width: 1000px;
  margin: 0 auto;
}

.air-title {
  margin: 15px 0;
  font-size: 20px;
  font-weight: normal;
  color: orange;

  span {
    font-size: 20px;
  }
}

.statement {
  margin: 15px 0;
  border: 1px #ddd solid;
  background: #f5f5f5;
  height: 58px;
  padding: 10px 0;
  box-sizing: border-box;

  > div {
    text-align: center;
    line-height: 38px;
    border-right: 1px #ddd solid;

    &:last-child {
      border-right: none;
    }

    * {
      vertical-align: middle;
    }

    i {
      font-size: 30px;
    }
  }
}

.air-sale-title {
  margin: 15px 0;
  font-size: 20px;
  font-weight: normal;
  color: #409eff;

  span {
    font-size: 20px;
  }
}
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