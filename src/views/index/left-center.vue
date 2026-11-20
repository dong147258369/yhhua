<script setup lang="ts">
import { ref } from "vue";
import { huacanTracks } from "@/mock/huacan";

const option = ref({
  tooltip: {
    trigger: "item",
    backgroundColor: "rgba(6, 18, 42, 0.92)",
    borderColor: "#00E5C3",
    borderWidth: 1,
    textStyle: { color: "#F8FAFC", fontSize: 13 },
    formatter: (params: any) => {
      const item = huacanTracks[params.dataIndex];
      return `
        <div style="font-weight:600;color:${item.color};margin-bottom:4px;">${item.name}</div>
        <div>占比：<b style="color:#F6C85F">${item.value}%</b></div>
        <div>申报项目：<b>${item.projects.toLocaleString()}</b> 项</div>
      `;
    },
  },
  legend: {
    orient: "vertical",
    right: 10,
    top: "middle",
    itemWidth: 10,
    itemHeight: 10,
    itemGap: 12,
    textStyle: {
      color: "#CBD5E1",
      fontSize: 12,
    },
    formatter: (name: string) => {
      const found = huacanTracks.find((t) => t.name === name);
      return found ? `${name}  ${found.value}%` : name;
    },
  },
  series: [
    {
      name: "智创赛道",
      type: "pie",
      radius: ["36%", "74%"],
      center: ["33%", "52%"],
      roseType: "area",
      itemStyle: {
        borderRadius: 6,
        borderColor: "#061229",
        borderWidth: 2,
      },
      label: { show: false },
      emphasis: {
        scale: true,
        scaleSize: 6,
      },
      data: huacanTracks.map((t) => ({
        name: t.name,
        value: t.value,
        itemStyle: { color: t.color },
      })),
    },
  ],
});
</script>

<template>
  <div class="track-wrap">
    <div class="center-badge">
      <div class="badge-num">6</div>
      <div class="badge-text">运河产业</div>
    </div>
    <v-chart class="chart" :option="option" autoresize />
  </div>
</template>

<style scoped lang="scss">
.track-wrap {
  position: relative;
  width: 100%;
  height: 100%;

  .chart {
    width: 100%;
    height: 100%;
  }

  .center-badge {
    position: absolute;
    left: 33%;
    top: 52%;
    transform: translate(-50%, -50%);
    text-align: center;
    pointer-events: none;

    .badge-num {
      font-size: 22px;
      font-weight: 800;
      color: #f6c85f;
      line-height: 1.1;
    }

    .badge-text {
      font-size: 11px;
      color: #94a3b8;
    }
  }
}
</style>
