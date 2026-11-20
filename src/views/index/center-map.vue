<script setup lang="ts">
import { ref, onMounted } from "vue";
import { GETNOBASE } from "@/api";
import { registerMap, getMap } from "echarts/core";
import BorderBox13 from "@/components/datav/border-box-13";
import { buildCanalMapOption } from "./center.map";
import { canalCorridorCities, type CanalNodeCity } from "@/mock/huacan";
import CanalThreeScene from "./canal-three-scene.vue";

withDefaults(
  defineProps<{
    title: number | string;
  }>(),
  {
    title: "京杭大运河智创走廊与两岸协同网",
  }
);

const viewMode = ref<"3d" | "2d">("3d");
const option = ref<Record<string, any>>({});
const selectedCity = ref<CanalNodeCity>(canalCorridorCities[8]); // 默认展示 杭州·拱墅

const initMap = async () => {
  let mapjson = getMap("china")?.geoJSON;
  if (!mapjson) {
    mapjson = await GETNOBASE("./map-geojson/china.json");
    registerMap("china", {
      geoJSON: mapjson as any,
      specialAreas: {},
    });
  }
  option.value = buildCanalMapOption();
};

const handleMapClick = (params: any) => {
  if (params.seriesType === "effectScatter" && params.data?.cityInfo) {
    selectedCity.value = params.data.cityInfo;
  }
};

onMounted(() => {
  initMap();
});
</script>

<template>
  <div class="centermap">
    <div class="maptitle">
      <div class="zuo"></div>
      <span class="titletext">{{ title }}</span>
      <div class="you"></div>
    </div>
    <div class="mapwrap">
      <BorderBox13>
        <!-- 视图模式切换（3D运河数字孪生 / 2D地理飞线） -->
        <div class="view-switch">
          <span
            class="switch-btn"
            :class="{ active: viewMode === '3d' }"
            @click="viewMode = '3d'"
          >
            🌊 3D运河孪生
          </span>
          <span
            class="switch-btn"
            :class="{ active: viewMode === '2d' }"
            @click="viewMode = '2d'"
          >
            🗺️ 地理走廊飞线
          </span>
        </div>

        <!-- 3D Three.js 运河特效视图 -->
        <CanalThreeScene v-if="viewMode === '3d'" />

        <!-- 2D ECharts 地理飞线视图 -->
        <template v-else>
          <!-- 图例标识 -->
          <div class="legend-bar">
            <span class="leg-item"><i class="dot core"></i>核心枢纽</span>
            <span class="leg-item"><i class="dot hub"></i>运河节点</span>
            <span class="leg-item"><i class="dot partner"></i>港澳台协同</span>
            <span class="leg-item"><i class="line-trunk"></i>京杭大运河主轴</span>
          </div>

          <!-- 选中节点浮窗 -->
          <div class="city-spotlight" v-if="selectedCity">
            <div class="spot-head">
              <span class="spot-name">{{ selectedCity.name }}</span>
              <span class="spot-prov">{{ selectedCity.province }}</span>
            </div>
            <p class="spot-desc">{{ selectedCity.highlight }}</p>
            <div class="spot-stats">
              <div>
                <span class="val text-gold">{{ selectedCity.workshops }}</span>
                <span class="lbl">双创园区</span>
              </div>
              <div>
                <span class="val text-cyan">{{ selectedCity.projects.toLocaleString() }}</span>
                <span class="lbl">智创项目</span>
              </div>
              <div>
                <span class="val text-blue">{{ selectedCity.heritageAssets }}</span>
                <span class="lbl">非遗资产</span>
              </div>
            </div>
          </div>

          <v-chart
            v-if="Object.keys(option).length > 0"
            class="chart"
            :option="option"
            @click="handleMapClick"
            autoresize
          />
        </template>
      </BorderBox13>
    </div>
  </div>
</template>

<style scoped lang="scss">
.centermap {
  margin-bottom: 14px;

  .maptitle {
    height: 52px;
    display: flex;
    justify-content: center;
    align-items: center;

    .titletext {
      font-size: 24px;
      font-weight: 900;
      letter-spacing: 4px;
      background: linear-gradient(90deg, #00e5c3 0%, #f6c85f 50%, #38bdf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0 14px;
    }

    .zuo,
    .you {
      background-size: 100% 100%;
      width: 29px;
      height: 20px;
    }

    .zuo {
      background: url("@/assets/img/xiezuo.png") no-repeat;
    }

    .you {
      background: url("@/assets/img/xieyou.png") no-repeat;
    }
  }

  .mapwrap {
    height: 556px;
    width: 100%;
    position: relative;
    box-sizing: border-box;

    .chart {
      width: 100%;
      height: 100%;
    }
  }
}

.view-switch {
  position: absolute;
  top: 16px;
  right: 18px;
  z-index: 20;
  display: flex;
  gap: 8px;

  .switch-btn {
    padding: 5px 12px;
    font-size: 12px;
    font-weight: 600;
    border-radius: 6px;
    cursor: pointer;
    color: #cbd5e1;
    background: rgba(6, 18, 42, 0.85);
    border: 1px solid rgba(56, 189, 248, 0.35);
    transition: all 0.25s ease;

    &:hover {
      color: #ffffff;
      border-color: #00e5c3;
    }

    &.active {
      color: #040b1a;
      background: linear-gradient(90deg, #00e5c3, #f6c85f);
      border-color: transparent;
      box-shadow: 0 0 12px rgba(0, 229, 195, 0.45);
    }
  }
}

.legend-bar {
  position: absolute;
  top: 16px;
  left: 20px;
  z-index: 10;
  display: flex;
  gap: 14px;
  padding: 6px 12px;
  background: rgba(6, 18, 42, 0.78);
  border: 1px solid rgba(56, 189, 248, 0.25);
  border-radius: 6px;
  font-size: 12px;
  color: #cbd5e1;

  .leg-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    display: inline-block;
    &.core {
      background: #f6c85f;
      box-shadow: 0 0 8px #f6c85f;
    }
    &.hub {
      background: #00e5c3;
      box-shadow: 0 0 8px #00e5c3;
    }
    &.partner {
      background: #fb7185;
      box-shadow: 0 0 8px #fb7185;
    }
  }

  .line-trunk {
    width: 16px;
    height: 3px;
    background: linear-gradient(90deg, #00e5c3, #f6c85f);
    border-radius: 2px;
  }
}

.city-spotlight {
  position: absolute;
  right: 18px;
  bottom: 18px;
  z-index: 10;
  width: 248px;
  padding: 12px 14px;
  background: rgba(6, 18, 42, 0.88);
  border: 1px solid rgba(246, 200, 95, 0.45);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(6px);

  .spot-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;

    .spot-name {
      font-size: 16px;
      font-weight: 700;
      color: #f6c85f;
    }

    .spot-prov {
      font-size: 11px;
      padding: 2px 6px;
      border-radius: 4px;
      background: rgba(0, 229, 195, 0.14);
      color: #00e5c3;
    }
  }

  .spot-desc {
    font-size: 12px;
    line-height: 1.45;
    color: #cbd5e1;
    margin: 0 0 10px;
  }

  .spot-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 8px;
    text-align: center;

    .val {
      display: block;
      font-size: 15px;
      font-weight: 800;
    }
    .lbl {
      font-size: 11px;
      color: #94a3b8;
    }
    .text-gold {
      color: #f6c85f;
    }
    .text-cyan {
      color: #00e5c3;
    }
    .text-blue {
      color: #38bdf8;
    }
  }
}
</style>
