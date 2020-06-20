<template>
  <div>
    <div style="overflow:hidden;">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-select v-model="form.provinceDefault" placeholder="请选择省" @change="getCity">
            <el-option
              v-for="item in form.province"
              :key="item.PROVINCE_CODE"
              :label="item.PROVINCE_NAME"
              :value="item.PROVINCE_CODE"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="form.cityDefault" placeholder="请选择市" @change="getArea">
            <el-option
              v-for="item in form.city"
              :key="item.CITY_CODE"
              :label="item.CITY_NAME"
              :value="item.CITY_CODE"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="form.areaDefault" placeholder="请选择区" @change="getStreet">
            <el-option
              v-for="item in form.area"
              :key="item.AREA_CODE"
              :label="item.AREA_NAME"
              :value="item.AREA_CODE"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="form.streetDefault" placeholder="请选择街道" @change="getAll">
            <el-option
              v-for="item in form.street"
              :key="item.STREET_CODE"
              :label="item.STREET_NAME"
              :value="item.STREET_CODE"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { GetCity } from "@/api/city";
export default {
  name: "CityPiker",
  data() {
    return {
      form: {
        //省
        province: [],
        provinceDefault: "",
        //市
        city: [],
        cityDefault: "",
        //区
        area: [],
        areaDefault: "",
        //街道
        street: [],
        streetDefault: ""
      },
      diaselectType: ""
    };
  },
  methods: {
    /**
     *一些封装
     */
    //定义获取省的函数
    getProvince() {
      const requestData = { type: "province" };
      GetCity(requestData).then(res => {
        // console.log(res);
        this.form.province = res.data.data.data;
      });
    },
    //在省那个框改变时 就获取市
    getCity(val) {
      //清空后面的框
      //传参告知现在在改变什么
      this.clearAfter("province");

      // console.log(val);
      const requestData = {
        type: "city",
        province_code: val
      };
      GetCity(requestData).then(res => {
        // console.log(res);
        this.form.city = res.data.data.data;
      });

      //实时把值传给父组件,用父组件传递过来的方法
      const adressData = [
        this.form.provinceDefault,
        this.form.cityDefault,
        this.form.areaDefault,
        this.form.streetDefault
      ];
      this.$emit("getAdressData", adressData);
    },
    //在市那里改变的时候获取区
    getArea(val) {
      this.clearAfter("city");
      const requestData = {
        type: "area",
        city_code: val
      };
      GetCity(requestData).then(res => {
        // console.log(res);
        this.form.area = res.data.data.data;
      });

      //实时把值传给父组件,用父组件传递过来的方法
      const adressData = [
        this.form.provinceDefault,
        this.form.cityDefault,
        this.form.areaDefault,
        this.form.streetDefault
      ];
      this.$emit("getAdressData", adressData);
    },
    //选择区后发请求获取街道
    getStreet(val) {
      this.clearAfter("area");
      const requestData = {
        type: "street",
        area_code: val
      };
      GetCity(requestData).then(res => {
        // console.log(res);
        this.form.street = res.data.data.data;
      });

      //实时把值传给父组件,用父组件传递过来的方法
      const adressData = [
        this.form.provinceDefault,
        this.form.cityDefault,
        this.form.areaDefault,
        this.form.streetDefault
      ];
      this.$emit("getAdressData", adressData);
    },
    //选择街道后获取全部
    getAll() {
      //实时把值传给父组件,用父组件传递过来的方法
      const adressData = [
        this.form.provinceDefault,
        this.form.cityDefault,
        this.form.areaDefault,
        this.form.streetDefault
      ];
      this.$emit("getAdressData", adressData);
    },
    //定义清空函数
    clearAfter(param) {
      const valueJson = {
        province: ["cityDefault", "areaDefault", "streetDefault"],
        city: ["areaDefault", "streetDefault"],
        area: ["streetDefault"]
      };
      //清空值数组
      const valueJson2 = {
        province: ["city", "area", "street"],
        city: ["area", "street"],
        area: ["street"]
      };
      //根据param匹配出要清空的值
      const arrObj = valueJson[param];
      const arrObj2 = valueJson2[param];
      //   console.log(arrObj);
      arrObj.forEach(item => {
        this.form[item] = "";
      });
      arrObj2.forEach(item => {
        this.form[item] = "";
      });
    }
  },
  created() {
    this.getProvince();
    // console.log(this.father);
  },
  mounted() {},
  props: {
    father: {
      type: Array,
      default: () => {
        return [1];
      }
    }
  },
  watch: {
    father(new2, old) {
      // console.log(new2);
      //父亲给的信号,清空地址
        this.form.provinceDefault=''
        this.form.cityDefault=''
        this.form.areaDefault=''
        this.form.streetDefault=''
    }
  }
};
</script>
<style lang="scss" scoped>
</style>