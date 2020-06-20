
<template>
  <div>
    <!-- echarts图表区域 -->
    <div id="main" style="width: 900px;height:400px;"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  data() {
    return {
      dataOrigin: {
        legend: { data: ["华东", "华南", "华北", "西部", "其他"] },
        yAxis: [{ type: "value" }],
        xAxis: [
          {
            data: [
              "2019-12-27",
              "2019-12-28",
              "2019-12-29",
              "2019-12-30",
              "2019-12-31",
              "2020-1-1"
            ],
            boundaryGap: false
          }
        ],
        series: [
          {
            name: "华东",
            type: "line",
            stack: "总量",
            areaStyle: { normal: {} },
            data: [2999, 3111, 4100, 3565, 3528, 6000]
          },
          {
            name: "华南",
            type: "line",
            stack: "总量",
            areaStyle: { normal: {} },
            data: [5090, 2500, 3400, 6000, 6400, 7800]
          },
          {
            name: "华北",
            type: "line",
            stack: "总量",
            areaStyle: { normal: {} },
            data: [6888, 4000, 8010, 12321, 13928, 12984]
          },
          {
            name: "西部",
            type: "line",
            stack: "总量",
            areaStyle: { normal: {} },
            data: [9991, 4130, 7777, 12903, 13098, 14028]
          },
          {
            name: "其他",
            type: "line",
            stack: "总量",
            areaStyle: { normal: {} },
            data: [15212, 5800, 10241, 14821, 15982, 14091]
          }
        ],
        title: { text: "用户来源" },
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "cross", label: { backgroundColor: "#E9EEF3" } }
        },
        grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true }
      }
    };
  },
  methods: {},
  created() {},
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));
    // 指定图表的配置项和数据
    myChart.setOption(this.dataOrigin);
  },
  components: {}
};
</script>
<style lang="scss" scoped>
</style>