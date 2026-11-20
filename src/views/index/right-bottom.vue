<script setup lang="ts">
import { ref, computed } from "vue";
import { liveActivitiesData, type LiveActivityItem } from "@/mock/huacan";

const activeDetailId = ref<string | null>(null);
const marqueeItems = computed(() => [...liveActivitiesData, ...liveActivitiesData]);

const toggleDetail = (id: string) => {
  activeDetailId.value = activeDetailId.value === id ? null : id;
};
</script>

<template>
  <div class="feed-wrap">
    <div class="feed-track">
      <div
        v-for="(item, idx) in marqueeItems"
        :key="`${item.id}-${idx}`"
        class="feed-row"
        @click="toggleDetail(`${item.id}-${idx}`)"
      >
        <div class="row-top">
          <span class="row-city">[{{ item.city }}]</span>
          <span class="row-track">{{ item.track }}</span>
          <span class="row-time">{{ item.time }}</span>
          <span
            class="row-badge"
            :style="{ color: item.badgeColor, borderColor: item.badgeColor }"
          >
            {{ item.status }}
          </span>
        </div>
        <div class="row-title">{{ item.title }}</div>
        <div v-if="activeDetailId === `${item.id}-${idx}`" class="row-detail">
          {{ item.detail }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@keyframes scrollUpFeed {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50%);
  }
}

.feed-wrap {
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 4px 6px;
  box-sizing: border-box;

  &:hover .feed-track {
    animation-play-state: paused;
  }
}

.feed-track {
  display: flex;
  flex-direction: column;
  gap: 8px;
  animation: scrollUpFeed 22s linear infinite;
}

.feed-row {
  padding: 8px 10px;
  border-radius: 6px;
  background: rgba(10, 26, 58, 0.58);
  border: 1px solid rgba(56, 189, 248, 0.16);
  cursor: pointer;
  transition: all 0.25s ease;
  flex-shrink: 0;

  &:hover {
    border-color: #00e5c3;
    background: rgba(0, 229, 195, 0.1);
  }

  .row-top {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    margin-bottom: 4px;

    .row-city {
      color: #f6c85f;
      font-weight: 700;
    }

    .row-track {
      color: #94a3b8;
      flex: 1;
    }

    .row-time {
      color: #64748b;
      font-variant-numeric: tabular-nums;
    }

    .row-badge {
      padding: 1px 6px;
      border-radius: 10px;
      border: 1px solid;
      font-size: 10px;
      font-weight: 600;
    }
  }

  .row-title {
    font-size: 13px;
    color: #f1f5f9;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .row-detail {
    margin-top: 6px;
    padding-top: 6px;
    border-top: 1px dashed rgba(255, 255, 255, 0.14);
    font-size: 11px;
    line-height: 1.45;
    color: #cbd5e1;
  }
}
</style>
