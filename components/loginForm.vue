<template>
  <!-- model用于存放表单的对象 -->
  <!-- rules验证规则 -->
  <!-- prop规则的对象名字 -->
  <el-form :model="form" ref="form" :rules="rules" class="form">
    <el-form-item class="form-item" prop="username">
      <el-input placeholder="用户名/手机" v-model="form.username" @keyup.enter.native="handleLoginSubmit"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="password">
      <el-input placeholder="密码" type="password" v-model="form.password" @keyup.enter.native="handleLoginSubmit"></el-input>
    </el-form-item>

    <p class="form-text">
      <nuxt-link to="#">忘记密码？</nuxt-link>
    </p>

    <el-button class="submit" type="primary" @click="handleLoginSubmit">登录</el-button>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      // 表单数据
      form: {
        //   表单用户名
        username: '',
        //   表单密码
        password: ''
      },
      // 表单规则
      rules: {
        username: [
          //   required代表必填    rigger失去焦点触发
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 11, max: 11, message: '用户名格式不正确', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 6, message: '密码格式不正确', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 提交登录
    handleLoginSubmit() {
      // this.$axios({
      //     method:'POST',
      //     url:'/accounts/login',
      //     data:this.form,
      // }).then(res=>{
      //     const{data}=res;
      //     console.log(data);
      //   //   this.$store.commit(参数1，参数2)  通过这种方法调用mutations的方法，去修改vuex里面的state的值
      //   // 参数1:vuex的文件名下的mutations里面的方法
      //     this.$store.commit('user/saveData',data)
      // })
      // --------------------------
      this.$refs.form.validate(async(valid)=>{
        // valid如果值是true代表验证通过
        if(valid){
          // 调用actions方法用this.$store.dispatch固定写法,第一个参数是vuex存储的方法，第二个参数是要传过去的数据
          // await的结果用一个变量来存储
          const data=await this.$store.dispatch('user/login',this.form);
          // 弹窗提示
          this.$message.success('登录成功'+data.user.nickname);
          this.$router.push('/');
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.form {
  padding: 25px;
}

.form-item {
  margin-bottom: 20px;
}

.form-text {
  font-size: 12px;
  color: #409eff;
  text-align: right;
  line-height: 1;
}

.submit {
  width: 100%;
  margin-top: 10px;
}
</style>