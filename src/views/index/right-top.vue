<script setup lang="ts">
import { ref } from "vue";
import { radarCapabilityData } from "@/mock/huacan";

const option = ref({
  tooltip: {
    trigger: "item",
    backgroundColor: "rgba(6, 18, 42, 0.92)",
    borderColor: "#00E5C3",
    borderWidth: 1,
    textStyle: { color: "#F8FAFC", fontSize: 12 },
  },
  legend: {
    bottom: 2,
    itemWidth: 14,
    itemHeight: 8,
    textStyle: { color: "#CBD5E1", fontSize: 11 },
    data: ["2026 运河赋能指数", "2025 基准水平"],
  },
  radar: {
    center: ["50%", "46%"],
    radius: "62%",
    indicator: radarCapabilityData.indicators,
    axisName: {
      color: "#E2E8F0",
      fontSize: 11,
      fontWeight: 500,
    },
    splitNumber: 4,
    splitArea: {
      areaStyle: {
        color: [
          "rgba(0, 229, 195, 0.08)",
          "rgba(56, 189, 248, 0.04)",
          "rgba(0, 229, 195, 0.06)",
          "rgba(56, 189, 248, 0.02)",
        ],
      },
    },
    splitLine: { lineStyle: { color: "rgba(56, 189, 248, 0.25)" } },
    axisLine: { lineStyle: { color: "rgba(56, 189, 248, 0.3)" } },
  },
  series: [
    {
      name: "能力评估",
      type: "radar",
      data: [
        {
          value: radarCapabilityData.currentYear,
          name: "2026 运河赋能指数",
          symbol: "circle",
          symbolSize: 6,
          lineStyle: { color: "#F6C85F", width: 2 },
          itemStyle: { color: "#F6C85F" },
          areaStyle: { color: "rgba(246, 200, 95, 0.25)" },
        },
        {
          value: radarCapabilityData.lastYear,
          name: "2025 基准水平",
          symbol: "none",
          lineStyle: { color: "#00E5C3", width: 1.5, type: "dashed" },
          itemStyle: { color: "#00E5C3" },
          areaStyle: { color: "rgba(0, 229, 195, 0.14)" },
        },
      ],
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
