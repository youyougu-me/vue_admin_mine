<template>
  <div id="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="@/assets/images/loginav.png" alt />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username" class="item-from">
          <el-input v-model="registerForm.username" size="medium" placeholder="请输入用户邮箱">
            <i slot="suffix">
              <svg-icon iconClass="user" />
            </i>
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password" class="item-from">
          <el-input
            v-model="registerForm.password"
            type="password"
            size="medium"
            placeholder="请输入密码"
          >
            <i slot="suffix">
              <svg-icon iconClass="password" />
            </i>
          </el-input>
        </el-form-item>
        <el-form-item prop="verify" class="item-from">
          <el-input v-model="registerForm.verify" type="password" size="medium" placeholder="请确认密码">
            <i slot="suffix">
              <svg-icon iconClass="password" />
            </i>
          </el-input>
        </el-form-item>
        <!-- 验证码 -->
        <el-form-item prop="code" class="item-from">
          <el-row :gutter="5" align="middle">
            <el-col :span="15">
              <el-input v-model="registerForm.code" size="medium" placeholder="请输入验证码"></el-input>
            </el-col>
            <el-col :span="9">
              <el-button
                type="default"
                size="medium"
                class="pull-right"
                @click="getRegisterSms"
              >获取验证码</el-button>
            </el-col>
          </el-row>
        </el-form-item>

        <!-- 按钮区域 -->
        <el-form-item class="btns item-from">
          <el-button type="danger" size="medium" @click="register">确认注册</el-button>
          <span
            @click="login"
            style="margin-left:13px;cursor:pointer;color:#3d3d3d;text-decoration:underline;"
          >已有账号?去登录</span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { validateEmail, validatePassY } from "@/utils/validate";
import { GetLoginSms, ReGister } from "@/api/login";
export default {
  name: "Register",
  data() {
    // 验证用户名
    var validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户邮箱"));
      } else if (validateEmail(value)) {
        callback(new Error("邮箱格式有误"));
      } else {
        callback(); //true
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (validatePassY(value)) {
        callback(new Error("密码为6至20位数字+字母"));
      } else {
        if (this.registerForm.verify !== "") {
          this.$refs.registerFormRef.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请确认密码"));
      } else if (value !== this.registerForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      registerForm: {
        username: "",
        password: "",
        verify: "",
        code: ""
      },
      registerFormRules: {
        username: [{ validator: validateUsername, trigger: "blur" }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
        verify: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  methods: {
    register() {
      this.$refs.registerFormRef.validate(valid => {
        if (!valid) return;
        this.goRegister();
      });
    },

    //方法封装*************************
    goRegister() {
      let requestData = {
        username: this.registerForm.username,
        password: this.registerForm.password,
        code: this.registerForm.code
      };
      ReGister(requestData).then(res => {
        // console.log(res);
        this.$message({
          type: "success",
          message: res.data.message
        });
        this.$refs.registerFormRef.resetFields();
      });
    },
    login() {
      this.$router.push({
        name: "Login"
      });
    },
    getRegisterSms() {
      if (this.registerForm.username == "") {
        this.$message({
          type: "error",
          message: "请先填写邮箱后再获取验证码"
        });
        return false;
      }
      const requestData = {
        username: this.registerForm.username,
        module: "register"
      };
      GetLoginSms(requestData).then(res => {
        this.$message({
          type: "success",
          message: res.data.message
        });
        const str = res.data.message;
        const i = str.indexOf("：");
        const sms = str.substring(i + 1);
        this.registerForm.code = sms;
      });
    }
  }
};
</script>

<style lang="scss">
#login_container {
  height: 100vh;
  .login_box {
    width: 450px;
    height: 370px;
    background-color: #fff;
    border-radius: 10px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: $mainCcolor;
    //头像盒子
    .avatar_box {
      height: 40px;
      width: 40px;
      position: absolute;
      left: 40%;
      transform: translate(-50%, -50%);
      img {
        background-color: #fff;
        border-radius: 30px;
        border: 1px solid #eee;
        box-shadow: 0 0 2px #ddd;
        width: 100%;
        height: 100%;
      }
    }
    //表单区域
    .login_form {
      position: absolute;
      bottom: 20px;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      .item-from {
        margin: 0 auto;
        margin-bottom: 25px;
        width: 80%;
      }
      .btns {
        display: flex;
        justify-content: flex-end;
      }
      //图标
      .el-input {
        span.el-input__suffix {
          span.el-input__suffix-inner {
            line-height: 45px;
            margin-right: 5px;
            .svg-icon {
              font-size: 18px !important;
              color: #c0cfe2 !important;
            }
          }
        }
      }
    }
  }
}
</style>
