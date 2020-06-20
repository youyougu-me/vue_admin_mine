<template>
  <div id="userlist">
    <Breadcrumb :breadList="breadList" />
    <el-row type="flex" align="middle" :gutter="10">
      <!-- =============分类====================== -->
      <el-col :span="1">
        <span class="pull-right">关键字:</span>
      </el-col>
      <el-col :span="3">
        <el-select v-model="categorySelectValue" placeholder="请选择" class="pull-left">
          <el-option
            v-for="item in categoryOptions"
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
      <el-col :span="10"></el-col>
      <el-col :span="4">
        <el-button type="danger" class="pull-right" @click="add">添加用户</el-button>
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
      <el-table-column prop="username" label="邮箱"></el-table-column>
      <el-table-column prop="truename" label="姓名"></el-table-column>
      <el-table-column prop="phone" label="电话"></el-table-column>
      <el-table-column prop="region" label="地址" :formatter="returnAddress"></el-table-column>
      <el-table-column prop="role" label="功能"></el-table-column>
      <el-table-column label="禁启用状态">
        
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#4fc08d"
            inactive-color="#eee"
            active-value="2"
            inactive-value="1"
            @change="switchChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <!-- scope是用来接收数据的,有当前行的所有数据 -->
        <template slot-scope="scope">
          <el-button size="mini" type="default" @click="editInfo(scope.row)" v-if="btnPerm('user:edit')">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteBtn(scope.row.id)" v-if="btnPerm('user:del')">删除</el-button>
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
import { GetUserList, DeleteUser, ControlStatus } from "@/api/user";
import Pagination from "@c/Pagination/pagination";
import { timestampToTime } from "@/utils/toolFunc";
import Dialog from "./Dialog/index";
export default {
  inject: ["reload"],
  data() {
    return {
      //面包屑
      breadList: ["用户管理", "用户列表"],
      //顶部搜索====================================
      //分类下拉框
      categorySelectValue: "truename",
      categoryOptions: [
        {
          value: "truename",
          label: "姓名"
        },
        {
          label: "手机号",
          value: "phone"
        },
        {
          label: "邮箱",
          value: "email"
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
      checkboxGroupData: [],
      //防止转换开关频繁切换的标识
      updateUserStatusFlag: false
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
      GetUserList(this.searchAllContent).then(res => {
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
    returnAddress(row){
      // console.log(row);
      const rowdom=['重庆','北京','河北','湖南','成都','贵州','河南','山东','浙江','福建','新疆']
      return rowdom[row.id[3]]
    },

    //表格的两个按钮操作===========================================
    deleteBtn(val) {
      const params = {
        content: "你确定删除此条数据吗",
        fn: () =>
          DeleteUser({ id: [val] }).then(res => {
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
          DeleteUser({ id: this.checkboxGroupData }).then(res => {
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
    },
    //==================================================
    switchChange(val) {
      if (this.updateUserStatusFlag) {
        return false;
      }
      this.updateUserStatusFlag = true;
      // console.log(val);
      const requestData = {
        id: val.id,
        status: val.status
      };
      ControlStatus(requestData)
        .then(res => {
          // console.log(res);
          this.$message({
            message: res.data.message,
            type: "success"
          });
          this.updateUserStatusFlag = !this.updateUserStatusFlag;
        })
        .catch(err => {
          this.updateUserStatusFlag = !this.updateUserStatusFlag;
        });
    }
  },
  created() {
    this.getTableData();
  },
  mounted() {
    // console.log(this.$refs.pagination.pageSize);
  },
  computed: {
    //搜索所有内容
    //因为在data里不能让某个值等于data.,所以只能这么写
    searchAllContent: function() {
      return {
        username: this.categorySelectValue == "username" ? this.searchText : "",
        truename: this.categorySelectValue == "truename" ? this.searchText : "",
        phone: this.categorySelectValue == "phone" ? this.searchText : "",
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
#userlist {
}
</style>