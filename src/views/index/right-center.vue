<script setup lang="ts">
import { ref } from "vue";
import { empowerGaugeData } from "@/mock/huacan";

const buildGaugeOption = (val: number, color: string) => ({
  series: [
    {
      type: "gauge",
      startAngle: 215,
      endAngle: -35,
      min: 0,
      max: 100,
      radius: "88%",
      center: ["50%", "54%"],
      progress: {
        show: true,
        width: 8,
        roundCap: true,
        itemStyle: {
          color,
          shadowBlur: 10,
          shadowColor: color,
        },
      },
      axisLine: {
        roundCap: true,
        lineStyle: {
          width: 8,
          color: [[1, "rgba(255, 255, 255, 0.1)"]],
        },
      },
      pointer: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      detail: {
        valueAnimation: true,
        fontSize: 20,
        fontWeight: 800,
        color,
        offsetCenter: [0, "4%"],
        formatter: "{value}%",
      },
      data: [{ value: val }],
    },
  ],
});

const gauges = ref(
  empowerGaugeData.map((item) => ({
    ...item,
    option: buildGaugeOption(item.value, item.color),
  }))
);
</script>

<template>
  <div class="gauges-grid">
    <div v-for="g in gauges" :key="g.name" class="gauge-item">
      <v-chart class="gauge-chart" :option="g.option" autoresize />
      <div class="gauge-label">{{ g.name }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.gauges-grid {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 6px 10px 12px;
  box-sizing: border-box;
}

.gauge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(10, 26, 58, 0.45);
  border: 1px solid rgba(56, 189, 248, 0.16);
  border-radius: 8px;
  padding: 6px 4px;

  .gauge-chart {
    width: 100%;
    height: 165px;
  }

  .gauge-label {
    font-size: 13px;
    font-weight: 600;
    color: #e2e8f0;
    margin-top: -10px;
    letter-spacing: 0.5px;
  }
}
</style>
