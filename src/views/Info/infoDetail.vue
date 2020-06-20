<template>
  <div>
    <el-form :model="form" ref="form" :rules="rules">
      <el-form-item label="信息分类" prop="category" :label-width="formLabelWidth">
        <el-select v-model="form.category" placeholder="请选择分类">
          <el-option
            v-for="item in diaselectType"
            :key="item.id"
            :label="item.category_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 标题 -->
      <el-form-item label="标题" prop="title" :label-width="formLabelWidth">
        <el-input v-model="form.title" autocomplete="off"></el-input>
      </el-form-item>
      <!-- 缩略图 -->
      <el-form-item label="缩略图" :label-width="formLabelWidth">
        <ImgUpload :faUploadImg.sync="form.imgUrl"></ImgUpload>
      </el-form-item>
      <!-- 发布日期 -->
      <el-form-item label="发布日期" :label-width="formLabelWidth">
        <el-date-picker type="date" placeholder="选择日期" v-model="form.date" disabled></el-date-picker>
      </el-form-item>
      <el-form-item label="概况" prop="content" :label-width="formLabelWidth">
        <quillEditor v-model="form.content" ref="myQuillEditor"></quillEditor>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth">
        <el-button @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { EditNewsInfo, GetTableData } from "@/api/info";
import { timestampToTime } from "@/utils/toolFunc";
import ImgUpload from "@c/ImgUpload";
//引入富文本编辑器
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  inject: ["reload"],
  data() {
    return {
      form: {
        detailId: "",
        category: "",
        title: "",
        content: "",
        date: "",
        imgUrl: ""
      },
      diaselectType: "",
      formLabelWidth: "90px",
      //表单验证
      rules: {
        title: [{ required: true, message: "请填写标题", trigger: "blur" }]
      }
    };
  },
  methods: {
    initDetailData() {
      const id =
        this.$route.params.detailData || this.$store.getters["info/detailData"];
      GetTableData({ id: parseInt(id), pageNumber: 1, pageSize: 1 }).then(
        res => {
          let initData = res.data.data.data[0];
          this.form.title = initData.title;
          this.form.category = initData.categoryId;
          this.form.content = initData.content;
          this.form.date = timestampToTime(initData.createDate);
          this.form.imgUrl = initData.imgUrl;
          this.form.detailId = initData.id;
        }
      );
    },
    //初始化搜索分类
    getCategory() {
      this.$store.dispatch("info/getfirstCategoryList", {}).then(res => {
        this.diaselectType = res.data.data.data;
      });
    },
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let requestData = {
            id: this.form.detailId,
            categoryId: this.form.category,
            title: this.form.title,
            content: this.form.content,
            imgUrl: this.form.imgUrl
          };
          EditNewsInfo(requestData).then(res => {
            this.$message({
              type:'success',
              message:'修改成功',
              duration:1000
            })
            this.reload();
          });
        }
      });
    }
  },
  created() {
    this.initDetailData();
    this.getCategory();
  },
  mounted() {},
  components: {
    ImgUpload,
    quillEditor
  }
};
</script>
<style lang="scss" scoped>
</style>