<template>
  <div class="main">
    <div class="air-column">
      <h2>乘机人</h2>
      <el-form class="member-info" :rules="rules" :model="form" ref="form">
        <div class="member-info-item" v-for="(item,index) in form.users" :key="index">
          <el-form-item prop="users">
            <el-form-item label="乘机人类型">
              <el-input placeholder="姓名" class="input-with-select" v-model="item.username">
                <el-select slot="prepend" value="1" placeholder="请选择">
                  <el-option label="成人" value="1"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
            <el-form-item label="证件类型">
              <el-input placeholder="证件号码" class="input-with-select" v-model="item.id">
                <el-select slot="prepend" value="1" placeholder="请选择">
                  <el-option label="身份证" value="1" :checked="true"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-form-item>
          <!-- 删除用户 -->
          <span class="delete-user" @click="handleDeleteUser()">-</span>
        </div>
      </el-form>
      <!-- 添加乘机人 -->
      <el-button class="add-member" type="primary" @click="handleAddUsers">添加乘机人</el-button>
    </div>

    <div class="air-column">
      <h2>保险</h2>
      <div>
        <div class="insurance-item" v-for="(item,index) in ticketInfo.insurances" :key="index">
          <el-checkbox
            :label="`${item.type}：￥$${item.price}/份×1  最高赔付${item.compensation}万`"
            border
            @change="handleInsurances(item.id)"
          ></el-checkbox>
        </div>
      </div>
    </div>

    <div class="air-column">
      <h2>联系人</h2>
      <div class="contact">
        <el-form label-width="70px" :rules="rules" ref="form2" :model="form">
          <el-form-item label="姓名" prop="contactName">
            <el-input v-model="form.contactName"></el-input>
          </el-form-item>

          <el-form-item label="手机" prop="contactPhone">
            <el-input placeholder="请输入内容" v-model="form.contactPhone">
              <template slot="append">
                <el-button @click="handleSendCaptcha">发送验证码</el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="验证码" prop="captcha">
            <el-input v-model="form.captcha"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="warning" class="submit" @click="handleSubmit">提交订单</el-button>
      </div>
    </div>
    
    <!-- 计算属性一定要渲染才有效果 -->
    <div v-show="false">{{allPrice}}</div>
  </div>
</template>

<script>
export default {
  data() {
    // rule规则 value输入框的值  callback回调函数并且必须要调用
    const validatorUser = (rule, value, callback) => {
      //   假设全部验证都通过
      let valid = true
      // value是一个对象，比如{name:"a",id:'1'}
      value.forEach(v => {
        // 如果有一个验证不通过，即可终止
        if (valid === false) return
        // 如果username是空
        if (v.username.trim() === '') {
          valid = false
          return callback(new Error('乘机人姓名不能为空'))
        }
        // 如果乘机人证件号为空
        if (v.id.trim() === '') {
          valid = false
          return callback(new Error('乘机人证件号不能为空'))
        }
        // 如果所有都验证通过
        if (valid) {
          callback()
        }
      })
    }
    return {
      form: {
        users: [{ username: '', id: '' }], //乘机人信息
        insurances: [], //选中的保险
        contactName: '', // 联系人名字
        contactPhone: '', // 联系人电话
        captcha: '', // 验证码这个参数接口文档漏掉了
        invoice: false, // 默认不需要发票
        seat_xid: '', // 座位id
        air: '' // 航班id
      },
      // 机票所有信息
      ticketInfo: [],
      // 验证表单的规则对象
      rules: {
        users: [{ validator: validatorUser, trigger: 'blur' }],
        contactName: [{ required: true, message: '联系人姓名不能为空' }],
        contactPhone: [{ required: true, message: '联系人电话不能为空' }],
        captcha: [{ required: true, message: '验证码不能为空' }]
      }
    }
  },
  computed:{
      allPrice(){
          if(!this.ticketInfo.seat_infos)return 0;
            let price=0;
            //先算出基础机票价格
            price=this.ticketInfo.seat_infos.org_settle_price+this.ticketInfo.airport_tax_audlet;
            //循环 选中的保险 的数组 查看是否有选保险业务
            this.form.insurances.forEach(v=>{
                // 循环机票信息里的保险数组，主要是拿到保险单价
                this.ticketInfo.insurances.forEach(item=>{
                    // 判断选中的保险id 和 保险数组对应
                    if(v=item){
                        price+=item.price;
                    }
                })
            })
            // 判断多少乘机人
            price *=this.form.users.length;
            // 将计算出的价格保存到store中，传值给Aside
            this.$store.commit('air/setallPrice',price);
            // 计算属性记得return
            return price;
      }
  },
  mounted() {
    const { id, seat_xid } = this.$route.query
    this.form.air = id
    this.form.seat_xid = seat_xid

    // 根据id和座位信息 请求当前机票信息
    this.$axios({
        url:'/airs/'+id,
        params:{
            seat_xid:seat_xid
        }
    }).then(res=>{
        const{data}=res;
    // //把机票的信息保存到data,里面有保险和右侧栏需要展示的数据
        this.ticketInfo=data;
        // //把详细信息保存到store中      
      this.$store.commit('air/setticketData',data);
    })
  },
  methods: {
    // 添加乘机人
    handleAddUsers() {
      this.form.users.push({ username: '', id: '' })
    },

    // 移除乘机人
    handleDeleteUser(index) {
      this.form.users.splice(index, 1)
    },

    // 发送手机验证码
    handleSendCaptcha() {
      if (!this.form.contactPhone) return
      this.$store.dispatch('user/sendNum', this.form.contactPhone).then(res => {
        this.$message.success('验证码是: ' + res)
      })
    },
    // 是否选择保险
    handleInsurances(id) {
      // 判断数组里面是否已经存在这个id，若无返回-1，
      const checkId = this.form.insurances.indexOf(id)

      if (checkId > -1) {
        // 如果数组存在id了，就删除那一项id
        this.form.insurances.splice(checkId, 1)
      } else {
        // 若没有id，则追加id
        this.form.insurances.push(id)
      }
    },
    // 提交订单
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$refs.form2.validate(valid2 => {
            if (valid2) {
              // 创建订单
              this.$axios({
                url: '/airorders',
                method: 'POST',
                headers: {
                  // 这里千万要注意Bearer 后面必须要有一个空格（基于JWT标准）
                  Authorization:
                    `Bearer ` + this.$store.state.user.userJson.token
                },
                data: this.form
              }).then(res => {
                this.$message.success('订单提交成功')
                // 跳转到支付页面
                const { id } = res.data.data;
                // console.log(id);
                this.$router.push({
                  path: '/air/pay',
                  query:{
                      id:id
                  }
                })
              })
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.air-column {
  border-bottom: 1px #ddd dashed;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.air-column h2 {
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: normal;
}

/deep/ .el-select .el-input {
  width: 130px;
}

.input-with-select {
  width: 590px;
}

.input-with-select /deep/ .el-input-group__prepend {
  background-color: #fff;
}
.member-info /deep/ .el-form-item {
  margin-bottom: 0;
}

.member-info-item {
  border-bottom: 1px #eee dashed;
  padding-bottom: 20px;
  position: relative;

  &:first-child {
    .delete-user {
      display: none;
    }
  }
}

.add-member {
  margin-top: 20px;
}

.delete-user {
  display: block;
  background: #ddd;
  width: 16px;
  height: 16px;
  font-size: 14px;
  text-align: center;
  line-height: 16px;
  color: #fff;
  cursor: pointer;
  border-radius: 50px;
  position: absolute;
  right: -30px;
  top: 50%;
}

.insurance {
  > div {
    margin-top: 10px;
  }
}

.insurance-item {
  margin-bottom: 20px;
}

.contact {
  /deep/ .el-input {
    width: 50%;
  }
}

.submit {
  margin: 50px auto;
  display: block;
  width: 250px;
  height: 50px;
}
</style>