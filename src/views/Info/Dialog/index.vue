<template>
  <div>
    <el-dialog title="编辑" width="600px" @opened="diaOpen" :visible="isVisible" @close="close">
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="类别" prop="category" :label-width="formLabelWidth">
          <el-select v-model="form.category" placeholder="分类">
            <el-option
              v-for="item in diaselectType"
              :key="item.id"
              :label="item.category_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="概况" prop="content" :label-width="formLabelWidth">
          <el-input v-model="form.content" autocomplete="off"></el-input>
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
import { AddNewsInfo, EditNewsInfo } from "@/api/info";
export default {
  inject: ["reload"],
  name: "Dialog",
  data() {
    return {
      //标明是编辑还是添加
      flagStatus: "",
      form: {
        category: "",
        title: "",
        content: ""
      },
      diaselectType: "",
      formLabelWidth: "90px",
      //隐藏与显示
      isVisible: false,
      //表单验证
      rules: {
        title: [{ required: true, message: "请填写标题", trigger: "blur" }]
      }
    };
  },
  methods: {
    diaOpen() {
      //获取类别
      this.$store.dispatch("info/getfirstCategoryList", {}).then(res => {
        this.diaselectType = res.data.data.data;
      });

      //关于编辑
      // console.log(this.currentEditData);
      if (this.flagStatus == "edit") {
        this.form.title = this.currentEditData.title;
        this.form.category = this.currentEditData.categoryId;
        this.form.content = this.currentEditData.content;
      }
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
          if (this.flagStatus == "add") {
            // AddNewsInfo
            AddNewsInfo(this.form).then(res => {
              this.reload();
            });
          }
          if (this.flagStatus == "edit") {
            const requestData = {
              id: this.currentEditData.id,
              title: this.form.title,
              categoryId: this.form.category,
              content: this.form.content
            };
            EditNewsInfo(requestData).then(res => {
              this.reload();
            });
          }
        }
      });
    }
  },
  created() {},
  mounted() {},
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