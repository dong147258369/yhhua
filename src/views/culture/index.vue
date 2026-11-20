<script setup lang="ts">
import { ref } from "vue";
import ItemWrap from "@/components/item-wrap";
import CountUp from "@/components/count-up";
import { graphic } from "echarts/core";
import HeritageThreeScene from "./heritage-three-scene.vue";

const centerViewMode = ref<"3d" | "table">("3d");

const cultureKpis = [
  { label: "非遗数字档案", value: 1842, unit: "项", color: "#00E5C3" },
  { label: "3D点云文物资产", value: 36480, unit: "件", color: "#F6C85F" },
  { label: "AIGC文创IP", value: 9420, unit: "款", color: "#38BDF8" },
  { label: "云端展馆累计访问", value: 428.6, unit: "万人次", decimals: 1, color: "#FB7185" },
];

const heritageTwinList = ref([
  { name: "扬州雕版印刷技艺", segment: "淮扬段", method: "亚毫米激光扫描", precision: "99.4%", status: "数字孪生上线", color: "#00E5C3" },
  { name: "苏州双面绣纹样库", segment: "江南段", method: "多光谱显微采集", precision: "99.1%", status: "AI纹样训练中", color: "#F6C85F" },
  { name: "通州燃灯塔古建群", segment: "北运河段", method: "无人机倾斜摄影", precision: "98.8%", status: "实时结构监测", color: "#38BDF8" },
  { name: "济宁南旺分水枢纽", segment: "鲁运河段", method: "水文数字孪生体", precision: "98.5%", status: "常态化仿真", color: "#00E5C3" },
  { name: "杭州拱宸桥历史街区", segment: "浙东段", method: "BIM+GIS实景融合", precision: "99.6%", status: "元宇宙开放", color: "#F6C85F" },
]);

const heritageStream = ref([
  { time: "15:52", city: "杭州", event: "拱宸桥运河数字非遗馆上线AR导览新篇章", tag: "文旅融合" },
  { time: "15:46", city: "苏州", event: "苏绣AIGC生成模型新增240组传统配色方案", tag: "AI赋能" },
  { time: "15:39", city: "扬州", event: "大运河博物馆裸眼3D《漕运盛景》日观演破8000", tag: "数字展陈" },
  { time: "15:28", city: "洛阳", event: "隋唐大运河仓窖遗址完成全息数字归档", tag: "文物保护" },
  { time: "15:15", city: "通州", event: "北运河非遗数字研学课程覆盖沿线120所学校", tag: "青年传承" },
]);

// 左上：非遗数字资产门类占比
const categoryPieOption = ref({
  tooltip: { trigger: "item", backgroundColor: "rgba(6,18,42,0.92)", borderColor: "#00E5C3" },
  legend: { bottom: 0, textStyle: { color: "#CBD5E1", fontSize: 11 }, itemWidth: 10, itemHeight: 10 },
  series: [
    {
      type: "pie",
      radius: ["44%", "70%"],
      center: ["50%", "42%"],
      itemStyle: { borderRadius: 6, borderColor: "#040B1A", borderWidth: 2 },
      label: { show: false },
      data: [
        { value: 34, name: "传统美术与纹样", itemStyle: { color: "#F6C85F" } },
        { value: 26, name: "古建与水利遗址", itemStyle: { color: "#00E5C3" } },
        { value: 22, name: "传统技艺与工坊", itemStyle: { color: "#38BDF8" } },
        { value: 18, name: "戏曲民俗音视频", itemStyle: { color: "#FB7185" } },
      ],
    },
  ],
});

// 左中：AIGC国风文创品类热度
const aigcHeatOption = ref({
  tooltip: { trigger: "axis", backgroundColor: "rgba(6,18,42,0.92)", borderColor: "#00E5C3" },
  grid: { left: 82, right: 32, top: 12, bottom: 18 },
  xAxis: { type: "value", show: false },
  yAxis: {
    type: "category",
    data: ["数字藏品", "非遗服饰", "文博盲盒", "智慧研学", "国潮家居"].reverse(),
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: "#E2E8F0", fontSize: 12 },
  },
  series: [
    {
      type: "bar",
      barWidth: 13,
      data: [94, 88, 82, 76, 69].reverse(),
      itemStyle: {
        borderRadius: 6,
        color: new graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: "#00E5C3" },
          { offset: 1, color: "#F6C85F" },
        ]),
      },
      label: { show: true, position: "right", color: "#F6C85F", fontSize: 11, formatter: "{c}" },
    },
  ],
});

// 左下：重点数字展馆/古镇客流
const museumFlowOption = ref({
  tooltip: { trigger: "axis", backgroundColor: "rgba(6,18,42,0.92)", borderColor: "#00E5C3" },
  grid: { left: 44, right: 16, top: 26, bottom: 26 },
  xAxis: {
    type: "category",
    data: ["扬州运博", "杭州拱宸", "苏州平江", "通州燃灯", "洛阳仓窖"],
    axisLabel: { color: "#CBD5E1", fontSize: 11 },
    axisLine: { lineStyle: { color: "rgba(56,189,248,0.3)" } },
  },
  yAxis: {
    type: "value",
    axisLabel: { color: "#94A3B8", fontSize: 11 },
    splitLine: { lineStyle: { color: "rgba(255,255,255,0.06)", type: "dashed" } },
  },
  series: [
    {
      name: "日均数字导览(千人)",
      type: "bar",
      barWidth: 18,
      data: [24.6, 21.8, 19.4, 15.2, 13.8],
      itemStyle: {
        borderRadius: [5, 5, 0, 0],
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "#38BDF8" },
          { offset: 1, color: "rgba(56,189,248,0.15)" },
        ]),
      },
    },
  ],
});

// 中下：近6个月数字资产采集增量
const assetMonthlyOption = ref({
  tooltip: { trigger: "axis", backgroundColor: "rgba(6,18,42,0.92)", borderColor: "#00E5C3" },
  grid: { left: 48, right: 20, top: 28, bottom: 26 },
  xAxis: {
    type: "category",
    data: ["6月", "7月", "8月", "9月", "10月", "11月"],
    axisLabel: { color: "#CBD5E1" },
    axisLine: { lineStyle: { color: "rgba(56,189,248,0.3)" } },
  },
  yAxis: {
    type: "value",
    name: "新增资产(件)",
    nameTextStyle: { color: "#94A3B8", fontSize: 11 },
    axisLabel: { color: "#94A3B8" },
    splitLine: { lineStyle: { color: "rgba(255,255,255,0.06)", type: "dashed" } },
  },
  series: [
    {
      name: "3D点云与建模增量",
      type: "line",
      smooth: true,
      symbolSize: 8,
      lineStyle: { width: 3, color: "#00E5C3" },
      itemStyle: { color: "#00E5C3" },
      areaStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgba(0,229,195,0.35)" },
          { offset: 1, color: "rgba(0,229,195,0.02)" },
        ]),
      },
      data: [3240, 4120, 4890, 5620, 6480, 7350],
    },
  ],
});

// 右上：文化IP商业化转化率趋势
const ipConversionOption = ref({
  tooltip: { trigger: "axis", backgroundColor: "rgba(6,18,42,0.92)", borderColor: "#F6C85F" },
  grid: { left: 44, right: 18, top: 26, bottom: 26 },
  xAxis: {
    type: "category",
    data: ["2022", "2023", "2024", "2025", "2026"],
    axisLabel: { color: "#CBD5E1" },
    axisLine: { lineStyle: { color: "rgba(56,189,248,0.3)" } },
  },
  yAxis: {
    type: "value",
    max: 100,
    axisLabel: { color: "#94A3B8", formatter: "{value}%" },
    splitLine: { lineStyle: { color: "rgba(255,255,255,0.06)", type: "dashed" } },
  },
  series: [
    {
      name: "IP授权转化率",
      type: "line",
      smooth: true,
      lineStyle: { width: 3, color: "#F6C85F" },
      itemStyle: { color: "#F6C85F" },
      data: [38.5, 46.2, 55.8, 64.1, 72.6],
    },
  ],
});

// 右中：沿线非遗数字采集完整度雷达
const heritageRadarOption = ref({
  tooltip: { trigger: "item", backgroundColor: "rgba(6,18,42,0.92)", borderColor: "#00E5C3" },
  radar: {
    center: ["50%", "52%"],
    radius: "62%",
    indicator: [
      { name: "古建遗址", max: 100 },
      { name: "传统美术", max: 100 },
      { name: "手工技艺", max: 100 },
      { name: "民俗节庆", max: 100 },
      { name: "运河美食", max: 100 },
      { name: "戏曲曲艺", max: 100 },
    ],
    axisName: { color: "#CBD5E1", fontSize: 11 },
    splitLine: { lineStyle: { color: "rgba(56,189,248,0.25)" } },
    axisLine: { lineStyle: { color: "rgba(56,189,248,0.25)" } },
  },
  series: [
    {
      type: "radar",
      data: [
        {
          value: [95, 92, 88, 84, 90, 86],
          name: "数字化完整度",
          lineStyle: { color: "#00E5C3", width: 2 },
          itemStyle: { color: "#00E5C3" },
          areaStyle: { color: "rgba(0,229,195,0.25)" },
        },
      ],
    },
  ],
});
</script>

<template>
  <div class="culture-screen">
    <!-- 左栏 -->
    <div class="col-side">
      <ItemWrap class="panel-box" title="非遗数字资产门类分布">
        <v-chart class="chart" :option="categoryPieOption" autoresize />
      </ItemWrap>
      <ItemWrap class="panel-box" title="AIGC国风文创品类热度">
        <v-chart class="chart" :option="aigcHeatOption" autoresize />
      </ItemWrap>
      <ItemWrap class="panel-box" title="重点数字展馆导览客流">
        <v-chart class="chart" :option="museumFlowOption" autoresize />
      </ItemWrap>
    </div>

    <!-- 中栏 -->
    <div class="col-center">
      <div class="kpi-strip">
        <div v-for="k in cultureKpis" :key="k.label" class="kpi-mini">
          <div class="kpi-lbl">{{ k.label }}</div>
          <div class="kpi-num" :style="{ color: k.color }">
            <CountUp :endVal="k.value" :duration="2" :options="{ decimalPlaces: k.decimals || 0 }" />
            <span class="kpi-unit">{{ k.unit }}</span>
          </div>
        </div>
      </div>

      <ItemWrap class="panel-table" title="运河非遗数字孪生全息与监测台账">
        <div class="center-stage">
          <div class="stage-switch">
            <span
              class="sw-btn"
              :class="{ active: centerViewMode === '3d' }"
              @click="centerViewMode = '3d'"
            >
              🏮 3D非遗全息孪生
            </span>
            <span
              class="sw-btn"
              :class="{ active: centerViewMode === 'table' }"
              @click="centerViewMode = 'table'"
            >
              📋 数字孪生台账
            </span>
          </div>

          <HeritageThreeScene v-if="centerViewMode === '3d'" />

          <div v-else class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>项目名称</th>
                  <th>所属区段</th>
                  <th>采集技术</th>
                  <th>孪生精度</th>
                  <th>运行状态</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in heritageTwinList" :key="row.name">
                  <td class="td-name">{{ row.name }}</td>
                  <td>{{ row.segment }}</td>
                  <td class="td-tech">{{ row.method }}</td>
                  <td class="td-prec">{{ row.precision }}</td>
                  <td>
                    <span class="status-pill" :style="{ color: row.color, borderColor: row.color }">
                      {{ row.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </ItemWrap>

      <ItemWrap class="panel-bottom" title="3D点云与数字资产月度增量趋势">
        <v-chart class="chart" :option="assetMonthlyOption" autoresize />
      </ItemWrap>
    </div>

    <!-- 右栏 -->
    <div class="col-side">
      <ItemWrap class="panel-box" title="运河文化IP商业化转化率">
        <v-chart class="chart" :option="ipConversionOption" autoresize />
      </ItemWrap>
      <ItemWrap class="panel-box" title="六大非遗门类数字化完整度">
        <v-chart class="chart" :option="heritageRadarOption" autoresize />
      </ItemWrap>
      <ItemWrap class="panel-box" title="非遗活态传承实时动态">
        <div class="stream-list">
          <div v-for="s in heritageStream" :key="s.event" class="stream-row">
            <div class="stream-meta">
              <span class="time">{{ s.time }}</span>
              <span class="city">{{ s.city }}</span>
              <span class="tag">{{ s.tag }}</span>
            </div>
            <div class="stream-text">{{ s.event }}</div>
          </div>
        </div>
      </ItemWrap>
    </div>
  </div>
</template>

<style scoped lang="scss">
.culture-screen {
  width: 100%;
  min-height: calc(100% - 64px);
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.col-side {
  width: 520px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 14px;
}

.col-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 14px;
}

.panel-box {
  height: 310px;
}

.kpi-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  height: 102px;

  .kpi-mini {
    background: rgba(10, 26, 58, 0.72);
    border: 1px solid rgba(0, 229, 195, 0.28);
    border-radius: 8px;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .kpi-lbl {
      font-size: 13px;
      color: #cbd5e1;
      margin-bottom: 6px;
    }

    .kpi-num {
      font-size: 26px;
      font-weight: 800;
      font-variant-numeric: tabular-nums;
      .kpi-unit {
        font-size: 12px;
        color: #94a3b8;
        margin-left: 4px;
        font-weight: 400;
      }
    }
  }
}

.panel-table {
  height: 500px;
}

.center-stage {
  position: relative;
  width: 100%;
  height: 100%;

  .stage-switch {
    position: absolute;
    top: 12px;
    right: 16px;
    z-index: 20;
    display: flex;
    gap: 8px;

    .sw-btn {
      padding: 4px 10px;
      font-size: 12px;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      color: #cbd5e1;
      background: rgba(6, 18, 42, 0.85);
      border: 1px solid rgba(56, 189, 248, 0.35);
      transition: all 0.25s;

      &:hover {
        color: #fff;
        border-color: #00e5c3;
      }

      &.active {
        color: #040b1a;
        background: linear-gradient(90deg, #00e5c3, #f6c85f);
        border-color: transparent;
      }
    }
  }
}

.panel-bottom {
  height: 320px;
}

.chart {
  width: 100%;
  height: 100%;
}

.table-wrap {
  padding: 10px 14px;
  height: 100%;
  overflow: hidden;

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;

    th {
      text-align: left;
      padding: 10px 8px;
      color: #94a3b8;
      border-bottom: 1px solid rgba(56, 189, 248, 0.25);
      font-weight: 600;
    }

    td {
      padding: 16px 8px;
      color: #e2e8f0;
      border-bottom: 1px dashed rgba(255, 255, 255, 0.08);
    }

    .td-name {
      color: #f6c85f;
      font-weight: 600;
    }
    .td-tech {
      color: #94a3b8;
    }
    .td-prec {
      color: #00e5c3;
      font-weight: 700;
    }

    .status-pill {
      padding: 3px 8px;
      border-radius: 10px;
      border: 1px solid;
      font-size: 11px;
      font-weight: 600;
    }
  }
}

.stream-list {
  padding: 6px 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .stream-row {
    padding: 7px 10px;
    border-radius: 6px;
    background: rgba(10, 26, 58, 0.55);
    border: 1px solid rgba(56, 189, 248, 0.16);

    .stream-meta {
      display: flex;
      gap: 8px;
      font-size: 11px;
      margin-bottom: 3px;
      .time {
        color: #94a3b8;
      }
      .city {
        color: #f6c85f;
        font-weight: 700;
      }
      .tag {
        color: #00e5c3;
        margin-left: auto;
      }
    }

    .stream-text {
      font-size: 12px;
      color: #f1f5f9;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
