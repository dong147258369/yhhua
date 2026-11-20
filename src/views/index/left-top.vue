<script setup lang="ts">
import CountUp from "@/components/count-up";
import { huacanKpiMetrics } from "@/mock/huacan";
</script>

<template>
  <div class="kpi-grid">
    <div
      v-for="item in huacanKpiMetrics"
      :key="item.key"
      class="kpi-card"
      :style="{ '--accent': item.color }"
    >
      <div class="kpi-header">
        <span class="kpi-label">{{ item.label }}</span>
        <span class="kpi-trend">↑ {{ item.trend }}</span>
      </div>
      <div class="kpi-value-row">
        <span class="kpi-value" :style="{ color: item.color }">
          <CountUp
            :endVal="item.value"
            :duration="2"
            :options="{ decimalPlaces: item.decimals || 0 }"
          />
        </span>
        <span class="kpi-unit">{{ item.unit }}</span>
      </div>
      <div class="kpi-bar">
        <div class="kpi-bar-inner" :style="{ background: item.color }"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.kpi-grid {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 14px;
  padding: 12px 14px;
  box-sizing: border-box;
}

.kpi-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 14px 16px;
  border-radius: 8px;
  background: linear-gradient(145deg, rgba(10, 26, 58, 0.8), rgba(6, 16, 38, 0.9));
  border: 1px solid rgba(56, 189, 248, 0.25);
  box-shadow: inset 0 0 18px rgba(0, 180, 255, 0.08);
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--accent);
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 229, 195, 0.16), inset 0 0 16px rgba(56, 189, 248, 0.14);
  }
}

.kpi-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .kpi-label {
    font-size: 14px;
    color: #cbd5e1;
    font-weight: 500;
    letter-spacing: 0.5px;
  }

  .kpi-trend {
    font-size: 12px;
    color: #00e5c3;
    background: rgba(0, 229, 195, 0.12);
    border: 1px solid rgba(0, 229, 195, 0.3);
    padding: 2px 7px;
    border-radius: 10px;
    font-weight: 600;
  }
}

.kpi-value-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-top: 6px;

  .kpi-value {
    font-size: 30px;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
    letter-spacing: 1px;
    text-shadow: 0 0 12px rgba(246, 200, 95, 0.25);
  }

  .kpi-unit {
    font-size: 13px;
    color: #94a3b8;
  }
}

.kpi-bar {
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 6px;

  .kpi-bar-inner {
    width: 72%;
    height: 100%;
    border-radius: 2px;
    box-shadow: 0 0 8px currentColor;
  }
}
</style>
