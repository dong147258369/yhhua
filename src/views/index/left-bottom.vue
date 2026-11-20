<script setup lang="ts">
import { ref, computed } from "vue";
import { canalProvincesData } from "@/mock/huacan";

type SortMode = "score" | "projects" | "outputValue";
const activeMode = ref<SortMode>("score");

const modeLabels: { key: SortMode; label: string; unit: string }[] = [
  { key: "score", label: "活力指数", unit: "分" },
  { key: "projects", label: "项目数", unit: "项" },
  { key: "outputValue", label: "孵化产值", unit: "亿元" },
];

const currentUnit = computed(
  () => modeLabels.find((m) => m.key === activeMode.value)?.unit || ""
);

const rankedList = computed(() => {
  const sorted = [...canalProvincesData].sort(
    (a, b) => b[activeMode.value] - a[activeMode.value]
  );
  const maxVal = sorted[0]?.[activeMode.value] || 1;
  return sorted.map((item, idx) => ({
    ...item,
    rank: idx + 1,
    percent: Math.max(18, Math.round((item[activeMode.value] / maxVal) * 100)),
  }));
});

// 复制一份用于无缝连续向上滚动
const marqueeList = computed(() => [...rankedList.value, ...rankedList.value]);
</script>

<template>
  <div class="province-rank-wrap">
    <div class="mode-tabs">
      <span
        v-for="m in modeLabels"
        :key="m.key"
        class="mode-btn"
        :class="{ active: activeMode === m.key }"
        @click="activeMode = m.key"
      >
        {{ m.label }}
      </span>
    </div>

    <div class="scroll-viewport">
      <div class="scroll-track">
        <div
          v-for="(item, index) in marqueeList"
          :key="`${item.name}-${index}`"
          class="rank-row"
          :class="{ 'is-top3': item.rank <= 3 }"
        >
          <span class="rank-badge">0{{ item.rank }}</span>
          <span class="prov-name">{{ item.shortName }}</span>
          <div class="bar-bg">
            <div class="bar-fill" :style="{ width: `${item.percent}%` }"></div>
          </div>
          <span class="prov-val">
            {{
              activeMode === "projects"
                ? item[activeMode].toLocaleString()
                : item[activeMode]
            }}{{ currentUnit }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@keyframes scrollUpRank {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50%);
  }
}

.province-rank-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .mode-tabs {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 2px 6px 8px;
    flex-shrink: 0;

    .mode-btn {
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 4px;
      cursor: pointer;
      color: #94a3b8;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(56, 189, 248, 0.2);
      transition: all 0.2s;

      &:hover {
        color: #f8fafc;
        border-color: #00e5c3;
      }

      &.active {
        color: #040b1a;
        background: linear-gradient(90deg, #00e5c3, #f6c85f);
        border-color: transparent;
        font-weight: 700;
      }
    }
  }

  .scroll-viewport {
    flex: 1;
    overflow: hidden;
    position: relative;
    padding: 0 4px;

    &:hover .scroll-track {
      animation-play-state: paused;
    }
  }

  .scroll-track {
    display: flex;
    flex-direction: column;
    gap: 8px;
    animation: scrollUpRank 18s linear infinite;
  }

  .rank-row {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 34px;
    padding: 0 10px;
    border-radius: 6px;
    background: rgba(10, 26, 58, 0.55);
    border: 1px solid rgba(56, 189, 248, 0.14);
    flex-shrink: 0;

    &.is-top3 {
      border-color: rgba(246, 200, 95, 0.35);
      .rank-badge {
        background: linear-gradient(135deg, #f6c85f, #f59e0b);
        color: #040b1a;
      }
      .bar-fill {
        background: linear-gradient(90deg, #00e5c3, #f6c85f);
        box-shadow: 0 0 8px rgba(246, 200, 95, 0.45);
      }
      .prov-val {
        color: #f6c85f;
      }
    }

    .rank-badge {
      width: 24px;
      height: 18px;
      line-height: 18px;
      text-align: center;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 800;
      background: rgba(56, 189, 248, 0.2);
      color: #38bdf8;
      flex-shrink: 0;
    }

    .prov-name {
      width: 40px;
      font-size: 13px;
      font-weight: 600;
      color: #e2e8f0;
      flex-shrink: 0;
    }

    .bar-bg {
      flex: 1;
      height: 8px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 4px;
      overflow: hidden;

      .bar-fill {
        height: 100%;
        border-radius: 4px;
        background: linear-gradient(90deg, #0284c7, #38bdf8);
        transition: width 0.5s ease;
      }
    }

    .prov-val {
      width: 78px;
      text-align: right;
      font-size: 12px;
      font-weight: 700;
      color: #00e5c3;
      font-variant-numeric: tabular-nums;
      flex-shrink: 0;
    }
  }
}
</style>
