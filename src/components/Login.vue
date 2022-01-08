<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 登录表单 -->
      <el-form ref='loginFromRef' :model='loginFrom' :rules='loginFromRules' label-width="0px" class='login_from'>
        <el-form-item prop='username'>
          <el-input v-model='loginFrom.username' prefix-icon='el-icon-user'></el-input>
        </el-form-item>
        <el-form-item prop='password'>
          <el-input v-model='loginFrom.password' type='password' prefix-icon='el-icon-lock'></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' @click="login">登录</el-button>
          <el-button type='info' @click='resetLoginFrom'>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      loginFrom: {
        username: 'admin',
        password: '123456'
      },
      loginFromRules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginFrom () {
      // 重置
      this.$refs.loginFromRef.resetFields()
    },
    login () {
      this.$refs.loginFromRef.validate(async (valid) => {
        // 校验表单格式，开了eslint return不能为空
        if (!valid) return false
        const { data: res } = await this.$axios.post('login', this.loginFrom)
        if (res.meta.status === 400) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        console.log(res)
        // 登录成功后保存token
        sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: skyblue;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login_from {
  width: 100%;
  position: absolute;
  bottom: 0;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
