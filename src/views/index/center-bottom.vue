<script setup lang="ts">
import { ref } from "vue";
import { graphic } from "echarts/core";
import { trendYearsData } from "@/mock/huacan";

const option = ref({
  tooltip: {
    trigger: "axis",
    backgroundColor: "rgba(6, 18, 42, 0.92)",
    borderColor: "#00E5C3",
    borderWidth: 1,
    textStyle: { color: "#F8FAFC", fontSize: 12 },
  },
  legend: {
    top: 4,
    right: 20,
    textStyle: { color: "#CBD5E1", fontSize: 12 },
    itemWidth: 14,
    itemHeight: 8,
  },
  grid: {
    left: 58,
    right: 58,
    top: 38,
    bottom: 28,
  },
  xAxis: {
    type: "category",
    data: trendYearsData.years,
    axisLine: { lineStyle: { color: "rgba(56, 189, 248, 0.3)" } },
    axisLabel: { color: "#CBD5E1", fontSize: 12 },
  },
  yAxis: [
    {
      type: "value",
      name: "专利/IP(件)",
      nameTextStyle: { color: "#94A3B8", fontSize: 11 },
      axisLabel: { color: "#94A3B8", fontSize: 11 },
      splitLine: { lineStyle: { color: "rgba(255,255,255,0.06)", type: "dashed" } },
    },
    {
      type: "value",
      name: "产值(亿元)",
      nameTextStyle: { color: "#F6C85F", fontSize: 11 },
      axisLabel: { color: "#F6C85F", fontSize: 11 },
      splitLine: { show: false },
    },
  ],
  series: [
    {
      name: "专利与IP转化量",
      type: "bar",
      barWidth: 22,
      itemStyle: {
        borderRadius: [5, 5, 0, 0],
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "#00E5C3" },
          { offset: 1, color: "rgba(0, 180, 255, 0.18)" },
        ]),
      },
      data: trendYearsData.patents,
    },
    {
      name: "智创数字经济规模",
      type: "line",
      yAxisIndex: 1,
      smooth: true,
      symbol: "circle",
      symbolSize: 8,
      lineStyle: {
        width: 3,
        color: "#F6C85F",
        shadowColor: "rgba(246, 200, 95, 0.6)",
        shadowBlur: 10,
      },
      itemStyle: {
        color: "#F6C85F",
        borderColor: "#040B1A",
        borderWidth: 2,
      },
      areaStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgba(246, 200, 95, 0.28)" },
          { offset: 1, color: "rgba(246, 200, 95, 0.01)" },
        ]),
      },
      data: trendYearsData.economicScale,
    },
  ],
});
</script>

<template>
  <v-chart class="chart" :option="option" autoresize />
</template>

<style scoped lang="scss">
.chart {
  width: 100%;
  height: 100%;
}
</style>
