<template>
  <div class="login">
    <div class="loginBar">
      <div class="logo">
        <img src="./img/login_logo.png" alt />
      </div>
      <el-form :model="form" ref="ruleForm" :rules="rules" class="demo-ruleForm">
        <el-form-item prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-row :gutter="20">
            <el-col :span="13">
              <el-input v-model="form.code" placeholder="验证码"></el-input>
            </el-col>
            <el-col :span="7">
              <el-button :disabled="btnflag" @click="getCode">{{text}}</el-button>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item prop="agree">
          <el-checkbox v-model=" form.agree">
            我已阅读并同意
            <a href="javascript:void(0);" type="primary">用户协议</a>
            和
            <a href="javascript:void(0);" type="primary">隐私条款</a>
          </el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            style="width:100%"
            :loading="isLoad"
            @click="formLogin"
          >{{loginTxt}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginTxt: "登录",
      btnflag: false,
      text: "请输入验证码",
      form: {
        mobile: "18801185985",
        code: "246810",
        agree: true
      },
      isLoad: false,
      rules: {
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            pattern: "0?(13|14|15|18|17)[0-9]{9}",
            min: 11,
            max: 11,
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ],
        code: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { min: 6, max: 6, message: "请输入正确的验证码", trigger: "blur" }
        ],
        agree: [
          { pattern: /true/, message: "用户协议不能为空", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    getCode() {
      this.btnflag = true;
      let sec = 60;
      this.text = "还有60秒";
      let timerId = setInterval(() => {
        sec--;
        this.text = "还有" + sec + "秒";
        if (sec == 0) {
          this.btnflag = false;
          this.text = "请输入验证码";
          clearInterval(timerId);
        }
      }, 1000);
    },
    formLogin() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.isLoad = true;
          this.loginTxt = "登陆中...";
          this.$axios
            .post("/mp/v1_0/authorizations", {
              mobile: this.form.mobile,
              code: this.form.code
            })
            .then(res => {
              this.$message.success("登录成功!");
              this.$store.commit("updata", res.data.data);
              this.isLoad = false;
              this.loginTxt = "登陆";
              // window.console.log(res);
              this.$router.push("/home");
            })
            .catch(() => {
              this.$message.error("手机号或验证码错误!");
              this.isLoad = false;
              this.loginTxt = "登陆";
            });
        }
      });
    }
  }
};
</script>

<style lang='less' scoped>
.login {
  margin: 0;
  padding: 0;
  height: 100%;
  background: url("./img/login_bg.jpg") no-repeat center / cover;
  display: flex;
  justify-content: center;
  align-items: center;
  .loginBar {
    padding: 20px 40px;
    width: 300px;
    background-color: #fff;
    .logo {
      padding: 20px 0;
      text-align: center;
      img {
        width: 150px;
      }
    }
  }
}
</style>