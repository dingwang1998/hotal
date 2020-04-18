<template>
  <el-form :model="form" ref="form" :rules="rules" class="form">
    <el-form-item class="form-item" prop="nickname">
      <el-input placeholder="请输入用户昵称" v-model="form.nickname"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="password">
      <el-input placeholder="请输入用户密码" type="password" v-model="form.password"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="checkpassword">
      <el-input placeholder="再次确认密码" type="password" v-model="form.checkpassword"></el-input>
    </el-form-item>
    <el-form-item class="form-item" prop="username">
      <el-input placeholder="请输入手机号" v-model="form.username"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="captcha">
      <el-input placeholder="验证码" v-model="form.captcha">
        <template slot="append">
          <el-button @click="handleSendCaptcha">发送验证码</el-button>
        </template>
      </el-input>
    </el-form-item>

    <el-button class="submit" type="primary" @click="handleRegSubmit">注册</el-button>
  </el-form>
</template>

<script>
export default {
  data() {
    //   rule表示当前的规则(可以使用)  value输入框的值  callback是必须调用，可以传入Error对象实现报错
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      // 表单数据
      form: {
        username: '', //手机号码
        captcha: '', //手机验证码
        password: '', //密码
        nickname: '', //你的名字
        checkpassword: '' //确认密码
      },
      // 表单规则
      rules: {
        username: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '手机号为11位', trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '请输入手机验证码', trigger: 'blur' }
        ],
        nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        //   validator自定义验证  validatePass2是验证的函数
        checkpassword: [
          {
            validator: validatePass2,
            message: '请再次输入密码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 发送验证码
    handleSendCaptcha() {
      if (this.form.username === '') {
        this.$refs.form.validateField('username')
        return
      }
      // 用dispatch来调用mutatins的方法
      this.$store.dispatch('user/sendNum', this.form.username).then(code => {
        this.$message.success('正在注册用户,验证码是' + code)
      })
    },

    // 注册
    handleRegSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 由于后台接口需要的参数中没有checkpassword,要把它结构出来，剩余参数传递
          const { checkpassword, ...other } = this.form
          this.$store.dispatch('user/register', other).then(data => {
            this.$message.success('恭喜您注册成功!')
            this.$router.push('/')
          })
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