<template>
  <div>
    <el-dialog title="编辑" width="650px" @opened="diaOpen" :visible="isVisible" @close="close">
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="邮箱" prop="username" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off" type="email"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="truename" :label-width="formLabelWidth">
          <el-input v-model="form.truename" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone" :label-width="formLabelWidth">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地区" :label-width="formLabelWidth" prop="region">
          <CityPicker @getAdressData="getAdressData"></CityPicker>
        </el-form-item>
        <!-- 是否禁用或者启用 -->
        <el-form-item label="是否启用" :label-width="formLabelWidth" prop="status">
          <el-radio v-model="form.status" label="1" :disabled="flagStatus == 'edit'">禁用</el-radio>
          <el-radio v-model="form.status" label="2" :disabled="flagStatus == 'edit'">启用</el-radio>
        </el-form-item>
        <!-- 角色类型 -->
        <el-form-item label="功能权限" :label-width="formLabelWidth" prop="role">
          <!-- 要把选项名字写在括号里,并且把label绑上去 -->
          <!-- 与label相对应则被选中 -->
          <el-checkbox-group v-model="form.role">
            <el-checkbox
              :label="item.role"
              v-for="item in systemList"
              :key="item.name"
            >{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <!-- 所有按钮 -->
        <el-form-item label="按钮权限" :label-width="formLabelWidth" prop="btn">
          <template v-if="btnList.length>0">
            <div v-for="item in btnList" :key="item.name">
              <h4>{{item.name}}</h4>
              <template v-if="item.perm &&item.perm.length>0">
                <el-checkbox-group v-model="form.btnPerm">
                  <el-checkbox
                    :label="eve.value"
                    v-for="eve in item.perm"
                    :key="eve.name"
                  >{{eve.name}}</el-checkbox>
                </el-checkbox-group>
              </template>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="按钮说明" :label-width="formLabelWidth">
          <span>说明:1.信息管理下编辑、删除、详情按钮可用于权限测试;
            2、用户列表的编辑按钮和删除按钮可用于权限测试
          </span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { validateEmail } from "@/utils/validate";
import { GetSystem, AddUser, EditUser, GetAllBtns } from "@/api/user";
import CityPicker from "@c/CityPicker";
export default {
  inject: ["reload"],
  name: "Dialog",
  data() {
    //验证邮箱
    var validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户邮箱"));
      } else if (validateEmail(value)) {
        callback(new Error("邮箱格式有误"));
      } else {
        callback(); //true
      }
    };

    //验证密码
    let validatePass = (rule, value, callback) => {
      //如果是编辑,但是根本没动密码框
      //因为编辑初始化密码框就为空
      //没值不验证
      if (this.flagStatus == "edit" && !value) {
        callback();
      }
      //id存在并且填写了密码就需要校验
      //失去焦点的时候
      if (this.flagStatus == "edit" && value) {
        if (value === "") {
          callback(new Error("请输入密码"));
        } else {
          callback();
        }
      } else {
        //添加
        if (value === "") {
          callback(new Error("请输入密码"));
        } else {
          callback();
        }
      }
    };
    return {
      //标明是编辑还是添加
      flagStatus: "",
      form: {
        username: "",
        truename: "",
        password: "",
        phone: "",
        region: "",
        status: "2",
        role: [],
        //为此用户选择的按钮权限
        btnPerm: []
      },
      formLabelWidth: "120px",
      //隐藏与显示
      isVisible: false,
      //表单验证
      rules: {
        username: [{ validator: validateUsername, trigger: "blur" }],
        //因为编辑密码不一样,所以这里得判断验证
        password: [{ validator: validatePass, trigger: "blur" }],
        role: [{ required: true, message: "请选择用户功能", trigger: "blur" }]
      },
      //用户所选的系统列表
      systemList: [],
      //所有可选的按钮
      btnList: []
    };
  },
  methods: {
    diaOpen() {
      //关于编辑
      if (this.flagStatus == "edit") {
        //地址没修改就默认之前的
        //数据需要做一下处理
        //这个是父组件传过来的当前编辑行的数据
        const currentEditData = JSON.parse(
          JSON.stringify(this.currentEditData)
        );
        currentEditData.role = currentEditData.role
          ? currentEditData.role.split(",")
          : [];
        currentEditData.btnPerm = currentEditData.btnPerm
          ? currentEditData.btnPerm.split(",")
          : [];
        for (let key in currentEditData) {
          this.form[key] = currentEditData[key];
        }
      }

      //获取用户所选的系统列表
      this.getSystem();
      //获取所有按钮
      this.getAllBtns();
    },
    close() {},
    //打开dialog框
    faControlOpen() {
      this.isVisible = true;
    },
    //父组件改变我的状态
    faControlStatus(status) {
      this.flagStatus = status;
    },
    //关闭dialog框
    close() {
      this.isVisible = false;
      this.$refs["form"].resetFields();
    },
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          //因为这里需要改变双向绑定的类型,所以采用深拷贝
          let requestData = JSON.parse(JSON.stringify(this.form));
          requestData.role = requestData.role.join();
          requestData.btnPerm = requestData.btnPerm.join();
          //传过去的地址也需要处理一下
          const currentRegion = {
            provinceValue: requestData.region[0],
            cityValue: requestData.region[1],
            areaValue: requestData.region[2],
            streetValue: requestData.region[3]
          };
          // console.log(currentRegion);
          requestData.region = JSON.stringify(currentRegion);
          if (this.flagStatus == "add") {
            AddUser(requestData).then(res => {
              this.reload();
            });
          }
          if (this.flagStatus == "edit") {
            if (requestData.password == "") {
              delete requestData.password;
            }
            EditUser(requestData).then(res => {
              this.$message({
                type: "success",
                message: "修改成功",
                duration: 500
              });
              this.reload();
            });
          }
        }
      });
    },
    // ==========================
    //实时获取子组件地址改变时传过来的值
    getAdressData(val) {
      this.form.region = val;
    },
    getSystem() {
      //因为这是dialog框里面的数据,只需要在第一次打开的时候获取就行了
      //关闭dialog框就相当于是显示与隐藏而已
      if (this.systemList.length > 0) {
        return false;
      }
      GetSystem({}).then(res => {
        // console.log(res);
        this.systemList = res.data.data;
      });
    },
    //获取所有按钮选项,用于展示
    getAllBtns() {
      if (this.btnList.length > 0) {
        return false;
      }
      GetAllBtns({}).then(res => {
        this.btnList = res.data.data;
      });
    }
  },
  created() {},
  mounted() {},
  components: {
    CityPicker
  },
  props: {
    currentEditData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  }
};
</script>
<style lang="scss" scoped>
//此组件使用说明
// 1.由父组件控制我的打开,我写一个方法,父组件自己来调用
</style>
<style lang="scss">
label.el-radio,
label.el-checkbox {
  margin-right: 30px;
}
</style>