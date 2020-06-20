<template>
  <div id="infolist">
    <Breadcrumb :breadList="breadList" />
    <el-row type="flex" align="middle" :gutter="10">
      <!-- =============分类====================== -->
      <el-col :span="1">
        <span class="pull-right">分类:</span>
      </el-col>
      <el-col :span="3">
        <el-select v-model="categorySelectValue" placeholder="请选择" class="pull-left">
          <el-option
            v-for="item in categoryOptions"
            :key="item.id"
            :label="item.category_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-col>
      <!-- =============日期====================== -->
      <el-col :span="1">
        <span class="pull-right">日期:</span>
      </el-col>
      <el-col :span="5">
        <el-date-picker
          v-model="dateValue"
          type="datetimerange"
          align="right"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['12:00:00', '08:00:00']"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd HH:mm:ss"
          class="pull-left"
        ></el-date-picker>
      </el-col>
      <!-- =============关键字====================== -->
      <el-col :span="2">
        <span class="pull-right">关键字:</span>
      </el-col>
      <el-col :span="2">
        <el-select v-model="keywordSelectValue" placeholder="请选择">
          <el-option
            v-for="item in keywordOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <!-- =============搜索框====================== -->
      <!-- <el-col :span="1"></el-col> -->
      <el-col :span="3">
        <el-input placeholder="请输入内容" class="pull-right" v-model="searchText"></el-input>
      </el-col>
      <el-col :span="3">
        <el-button type="danger" class="pull-left" @click="search">搜索</el-button>
      </el-col>
      <el-col :span="4">
        <el-button type="danger" class="pull-right" @click="add">新增</el-button>
      </el-col>
    </el-row>
    <div style="height:30px;"></div>
    <!-- =============底部表格区域================== -->
    <el-table
      :data="tableData"  
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
      v-loading="tableLoading"
    >
      >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="categoryId" label="类型" :formatter="returnType"></el-table-column>
      <el-table-column prop="createDate" label="日期" :formatter="returnDate"></el-table-column>
      <el-table-column label="操作">
        <!-- scope是用来接收数据的,有当前行的所有数据 -->
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="default"
            @click="editInfo(scope.row)"
            v-if="btnPerm('info:edit')"
          >编辑</el-button>
          <el-button size="mini" type="primary" @click="goDetail(scope.row)" v-if="btnPerm('info:detailed')">编辑详情</el-button>
          <el-button size="mini" type="danger" @click="deleteBtn(scope.row.id)"  v-if="btnPerm('info:del')">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- =============分页区域================== -->
    <div style="height:30px;"></div>
    <el-row>
      <el-col :span="13">
        <el-button @click="piDelete">批量删除</el-button>
      </el-col>
      <el-col :span="10">
        <Pagination
          class="pull-right"
          :total="total"
          @currentPageChange="currentPageChange"
          @pageSizeChange="pageSizeChange"
        ></Pagination>
      </el-col>
      <el-col :span="1"></el-col>
    </el-row>
    <!-- dialog框 -->
    <Dialog ref="dialog" :currentEditData="currentEditData"></Dialog>
  </div>
</template>

<script>
import Breadcrumb from "@c/Breadcrumb/index";
import { confirm } from "@/utils/elefunc";
import { GetTableData, DeleteNewsInfo } from "@/api/info";
import Pagination from "@c/Pagination/pagination";
import { timestampToTime } from "@/utils/toolFunc";
import Dialog from "./Dialog/index";
export default {
  inject: ["reload"],
  data() {
    return {
      //面包屑
      breadList: ["信息管理", "信息列表"],
      //顶部搜索====================================
      //分类下拉框
      categorySelectValue: "",
      categoryOptions: "",
      //日期
      dateValue: "",
      //关键字
      keywordSelectValue: "id",
      keywordOptions: [
        {
          value: "id",
          label: "ID"
        },
        {
          value: "title",
          label: "标题"
          // disabled: true
        }
      ],
      //搜索文本
      searchText: "",
      //底部表格====================================
      tableData: [],
      //分页数据
      total: 0,
      currentPage: 1,
      pageSize: 5,
      //因为接口对于搜索的总条数不自动更新,所以我自己来
      searchFlag: false,
      tableLoading: false,
      //点击编辑===========
      //当前编辑项的数据
      currentEditData: {},
      checkboxGroupData: []
    };
  },
  methods: {
    //表格的数据获取========================================
    search() {
      // console.log(this.searchAllContent);
      this.searchFlag = true;
      this.getTableData();
    },
    getTableData() {
      this.tableLoading = true;
      GetTableData(this.searchAllContent).then(res => {
        this.tableLoading = false;
        // console.log(res.data.data.total);
        this.tableData = res.data.data.data;
        if (this.searchFlag == true) {
          this.total = res.data.data.data.length;
          this.searchFlag = false;
        } else {
          this.total = res.data.data.total;
        }

        // console.log(this.total);
      });
    },
    //底部分页操作
    currentPageChange(currentPage) {
      this.currentPage = currentPage;
      this.getTableData();
    },
    pageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getTableData();
    },
    //格式化日期
    returnDate(row) {
      // console.log(row.createDate);
      return timestampToTime(row.createDate);
    },
    //格式化类型
    returnType(row) {
      // console.log(row.categoryId);
      if (!this.categoryOptions) return false;
      let type = this.categoryOptions.filter(item => {
        if (item.id == row.categoryId) {
          return item;
        }
      });
      return type[0].category_name;
    },
    //初始化搜索分类
    getCategory() {
      this.$store.dispatch("info/getfirstCategoryList", {}).then(res => {
        this.categoryOptions = res.data.data.data;
      });
    },
    //表格的三个按钮操作===========================================
    deleteBtn(val) {
      const params = {
        content: "你确定删除此条数据吗",
        fn: () =>
          DeleteNewsInfo({ id: [val] }).then(res => {
            this.reload();
          })
      };
      confirm(params);
    },
    editInfo(val) {
      //调子组件的方法
      this.$refs.dialog.faControlOpen();
      //告诉子组件我是编辑
      this.$refs.dialog.faControlStatus("edit");
      this.currentEditData = val;
    },
    goDetail(val) {
      this.$store.commit("info/SET_DETAIL_DATA", val.id);
      this.$router.push({
        //密文传参传一次就没有了,存在vuex里面
        name: "InfoDetail",
        params: {
          detailData: val.id
        }
      });
    },
    //checkbox多选
    handleSelectionChange(val) {
      this.checkboxGroupData = val.map(item => item.id);
    },
    piDelete() {
      if (this.checkboxGroupData.length == 0) {
        this.$message({
          type: "warning",
          message: "请选择要删除的数据"
        });
        return false;
      }
      const params = {
        content: "你确定删除选中数据吗",
        fn: () =>
          DeleteNewsInfo({ id: this.checkboxGroupData }).then(res => {
            this.reload();
          })
      };
      confirm(params);
    },
    //新增打开dialog
    add() {
      //调子组件的方法
      this.$refs.dialog.faControlOpen();
      //告诉子组件我是新增
      this.$refs.dialog.faControlStatus("add");
    }
  },
  created() {
    this.getTableData();
    this.getCategory();
  },
  mounted() {
    // console.log(this.$refs.pagination.pageSize);
  },
  computed: {
    //搜索所有内容
    //因为在data里不能让某个值等于data.,所以只能这么写
    searchAllContent: function() {
      return {
        categoryId: this.categorySelectValue,
        startTiem: this.dateValue.length > 0 ? this.dateValue[0] : "",
        endTime: this.dateValue.length > 0 ? this.dateValue[1] : "",
        title: this.keywordSelectValue == "title" ? this.searchText : "",
        id: this.keywordSelectValue == "id" ? this.searchText : "",
        pageNumber: this.currentPage,
        pageSize: this.pageSize
      };
    }
  },
  components: {
    Pagination,
    Dialog,
    Breadcrumb
  }
};
</script>
<style lang="scss" scoped>
#infolist {
}
</style>