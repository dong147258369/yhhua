<script setup lang="ts">
import { ref, computed } from "vue";
import ItemWrap from "@/components/item-wrap";
import CountUp from "@/components/count-up";
import { graphic } from "echarts/core";
import EngineThreeScene from "./engine-three-scene.vue";

const centerViewMode = ref<"3d" | "table">("3d");

const ecoKpis = [
  { label: "华灿大赛落地项目", value: 1480, unit: "项", color: "#F6C85F" },
  { label: "合作双一流/港澳台高校", value: 186, unit: "所", color: "#00E5C3" },
  { label: "高价值发明专利", value: 18500, unit: "件", color: "#38BDF8" },
  { label: "年度投融资对接额", value: 64.8, unit: "亿元", decimals: 1, color: "#FB7185" },
];

const starProjects = ref([
  { name: "运河智航·纯电无人货运系统", team: "浙大-台北联合团队", stage: "A+轮 · 8500万", track: "智慧航运", color: "#00E5C3" },
  { name: "墨韵AI·非遗纹样生成引擎", team: "中国美院青创组", stage: "天使轮 · 2400万", track: "AI+文创", color: "#F6C85F" },
  { name: "姑苏绣影·高精度织造数字孪生", team: "苏大-香港理工团队", stage: "B轮 · 1.2亿", track: "智能制造", color: "#38BDF8" },
  { name: "通州绿脉·智慧水环境感知矩阵", team: "北理工产学研团队", stage: "产业落地", track: "绿色低碳", color: "#34D399" },
  { name: "漕运幻境·XR空间计算剧场", team: "中传-澳门青年工坊", stage: "Pre-A · 3600万", track: "元宇宙文旅", color: "#FB7185" },
]);

const roadshowNews = ref([
  { time: "16:00", city: "杭州", msg: "大运河数字经济与人工智能专场路演达成意向投资 1.8 亿元" },
  { time: "15:45", city: "苏州", msg: "两岸青年数字创意专利池新增授权 48 项" },
  { time: "15:30", city: "北京", msg: "京杭大运河产学研联合实验室发布 3 项行业标准" },
  { time: "15:12", city: "南京", msg: "长三角运河智造产业基金完成二期募资" },
  { time: "14:55", city: "台北", msg: "海峡两岸青年文创设计云端工作坊同步开营" },
]);

const marqueeNews = computed(() => [...roadshowNews.value, ...roadshowNews.value]);

// 左上：运河沿线重点城市智创产出（按城市）
const workshopBarOption = ref({
  tooltip: { trigger: "axis", backgroundColor: "rgba(6,18,42,0.92)", borderColor: "#00E5C3" },
  grid: { left: 46, right: 16, top: 26, bottom: 26 },
  xAxis: {
    type: "category",
    data: ["杭州", "北京", "苏州", "扬州", "天津", "济宁"],
    axisLabel: { color: "#CBD5E1", fontSize: 12 },
    axisLine: { lineStyle: { color: "rgba(56,189,248,0.3)" } },
  },
  yAxis: {
    type: "value",
    name: "智创成果(项)",
    nameTextStyle: { color: "#94A3B8", fontSize: 11 },
    axisLabel: { color: "#94A3B8" },
    splitLine: { lineStyle: { color: "rgba(255,255,255,0.06)", type: "dashed" } },
  },
  series: [
    {
      type: "bar",
      barWidth: 18,
      data: [340, 295, 260, 210, 195, 180],
      itemStyle: {
        borderRadius: [5, 5, 0, 0],
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "#F6C85F" },
          { offset: 1, color: "rgba(246,200,95,0.18)" },
        ]),
      },
    },
  ],
});

// 左中：高校赛事转化阶梯
const funnelBarOption = ref({
  tooltip: { trigger: "axis", backgroundColor: "rgba(6,18,42,0.92)", borderColor: "#00E5C3" },
  grid: { left: 74, right: 44, top: 10, bottom: 16 },
  xAxis: { type: "value", show: false },
  yAxis: {
    type: "category",
    data: ["获投融资", "落地转化", "国赛获奖", "省赛入围", "作品征集"],
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: "#E2E8F0", fontSize: 12 },
  },
  series: [
    {
      type: "bar",
      barWidth: 13,
      data: [320, 1480, 4620, 24500, 128460],
      itemStyle: {
        borderRadius: 6,
        color: new graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: "#38BDF8" },
          { offset: 1, color: "#00E5C3" },
        ]),
      },
      label: { show: true, position: "right", color: "#00E5C3", fontSize: 11 },
    },
  ],
});

// 左下：专利结构分布
const patentPieOption = ref({
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
        { value: 42, name: "AI算法与大模型", itemStyle: { color: "#00E5C3" } },
        { value: 26, name: "数字孪生与图形", itemStyle: { color: "#F6C85F" } },
        { value: 19, name: "新能源与智能船", itemStyle: { color: "#38BDF8" } },
        { value: 13, name: "外观与版权IP", itemStyle: { color: "#FB7185" } },
      ],
    },
  ],
});

// 中下：两岸暨港澳青年团队协同趋势
const teamTrendOption = ref({
  tooltip: { trigger: "axis", backgroundColor: "rgba(6,18,42,0.92)", borderColor: "#00E5C3" },
  legend: { top: 2, right: 16, textStyle: { color: "#CBD5E1", fontSize: 11 } },
  grid: { left: 48, right: 48, top: 34, bottom: 26 },
  xAxis: {
    type: "category",
    data: ["2022", "2023", "2024", "2025", "2026"],
    axisLabel: { color: "#CBD5E1" },
    axisLine: { lineStyle: { color: "rgba(56,189,248,0.3)" } },
  },
  yAxis: [
    {
      type: "value",
      name: "协同团队(支)",
      nameTextStyle: { color: "#94A3B8", fontSize: 11 },
      axisLabel: { color: "#94A3B8" },
      splitLine: { lineStyle: { color: "rgba(255,255,255,0.06)", type: "dashed" } },
    },
    {
      type: "value",
      name: "转化率(%)",
      nameTextStyle: { color: "#F6C85F", fontSize: 11 },
      axisLabel: { color: "#F6C85F" },
      splitLine: { show: false },
    },
  ],
  series: [
    {
      name: "两岸暨港澳联合团队",
      type: "bar",
      barWidth: 20,
      data: [420, 680, 960, 1340, 1820],
      itemStyle: { borderRadius: [5, 5, 0, 0], color: "#00E5C3" },
    },
    {
      name: "项目商业转化率",
      type: "line",
      yAxisIndex: 1,
      smooth: true,
      data: [44.2, 51.6, 58.9, 63.5, 68.4],
      lineStyle: { width: 3, color: "#F6C85F" },
      itemStyle: { color: "#F6C85F" },
    },
  ],
});

// 右上：产学研合作高校TOP6
const uniRankOption = ref({
  tooltip: { trigger: "axis", backgroundColor: "rgba(6,18,42,0.92)", borderColor: "#00E5C3" },
  grid: { left: 82, right: 30, top: 10, bottom: 16 },
  xAxis: { type: "value", show: false },
  yAxis: {
    type: "category",
    data: ["中国美院", "北京理工", "苏州大学", "南京大学", "清华大学", "浙江大学"],
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: "#E2E8F0", fontSize: 12 },
  },
  series: [
    {
      type: "bar",
      barWidth: 12,
      data: [142, 168, 195, 214, 246, 268],
      itemStyle: {
        borderRadius: 6,
        color: new graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: "#0284C7" },
          { offset: 1, color: "#F6C85F" },
        ]),
      },
      label: { show: true, position: "right", color: "#F6C85F", fontSize: 11, formatter: "{c}项" },
    },
  ],
});

// 右中：产业基金投向占比
const fundRoseOption = ref({
  tooltip: { trigger: "item", backgroundColor: "rgba(6,18,42,0.92)", borderColor: "#00E5C3" },
  legend: { bottom: 0, textStyle: { color: "#CBD5E1", fontSize: 11 }, itemWidth: 10, itemHeight: 10 },
  series: [
    {
      type: "pie",
      radius: ["28%", "68%"],
      center: ["50%", "42%"],
      roseType: "radius",
      itemStyle: { borderRadius: 5, borderColor: "#040B1A", borderWidth: 2 },
      label: { show: false },
      data: [
        { value: 36, name: "AI与数字底座", itemStyle: { color: "#00E5C3" } },
        { value: 28, name: "文化数字化IP", itemStyle: { color: "#F6C85F" } },
        { value: 20, name: "绿色智能航运", itemStyle: { color: "#38BDF8" } },
        { value: 16, name: "青年初创种子", itemStyle: { color: "#FB7185" } },
      ],
    },
  ],
});
</script>

<template>
  <div class="innovation-screen">
    <!-- 左栏 -->
    <div class="col-side">
      <ItemWrap class="panel-box" title="运河沿线重点城市智创产出">
        <v-chart class="chart" :option="workshopBarOption" autoresize />
      </ItemWrap>
      <ItemWrap class="panel-box" title="高校智创成果转化漏斗">
        <v-chart class="chart" :option="funnelBarOption" autoresize />
      </ItemWrap>
      <ItemWrap class="panel-box" title="硬科技与数字创意专利结构">
        <v-chart class="chart" :option="patentPieOption" autoresize />
      </ItemWrap>
    </div>

    <!-- 中栏 -->
    <div class="col-center">
      <div class="kpi-strip">
        <div v-for="k in ecoKpis" :key="k.label" class="kpi-mini">
          <div class="kpi-lbl">{{ k.label }}</div>
          <div class="kpi-num" :style="{ color: k.color }">
            <CountUp :endVal="k.value" :duration="2" :options="{ decimalPlaces: k.decimals || 0 }" />
            <span class="kpi-unit">{{ k.unit }}</span>
          </div>
        </div>
      </div>

      <ItemWrap class="panel-table" title="智创中国3D协同引擎与明星项目">
        <div class="center-stage">
          <div class="stage-switch">
            <span
              class="sw-btn"
              :class="{ active: centerViewMode === '3d' }"
              @click="centerViewMode = '3d'"
            >
              🚀 3D智创星核
            </span>
            <span
              class="sw-btn"
              :class="{ active: centerViewMode === 'table' }"
              @click="centerViewMode = 'table'"
            >
              📋 明星项目台账
            </span>
          </div>

          <EngineThreeScene v-if="centerViewMode === '3d'" />

          <div v-else class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>项目名称</th>
                  <th>协同团队</th>
                  <th>所属赛道</th>
                  <th>融资/落地阶段</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in starProjects" :key="p.name">
                  <td class="td-name">{{ p.name }}</td>
                  <td>{{ p.team }}</td>
                  <td>{{ p.track }}</td>
                  <td>
                    <span class="status-pill" :style="{ color: p.color, borderColor: p.color }">
                      {{ p.stage }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </ItemWrap>

      <ItemWrap class="panel-bottom" title="两岸暨港澳青年团队协同与转化趋势">
        <v-chart class="chart" :option="teamTrendOption" autoresize />
      </ItemWrap>
    </div>

    <!-- 右栏 -->
    <div class="col-side">
      <ItemWrap class="panel-box" title="产学研协同高校贡献TOP6">
        <v-chart class="chart" :option="uniRankOption" autoresize />
      </ItemWrap>
      <ItemWrap class="panel-box" title="运河智创产业基金投向占比">
        <v-chart class="chart" :option="fundRoseOption" autoresize />
      </ItemWrap>
      <ItemWrap class="panel-box" title="智创路演与产学研实时快讯">
        <div class="news-viewport">
          <div class="news-track">
            <div v-for="(n, idx) in marqueeNews" :key="`${n.msg}-${idx}`" class="news-row">
              <div class="news-meta">
                <span class="time">{{ n.time }}</span>
                <span class="city">[{{ n.city }}]</span>
              </div>
              <div class="news-msg">{{ n.msg }}</div>
            </div>
          </div>
        </div>
      </ItemWrap>
    </div>
  </div>
</template>

<style scoped lang="scss">
.innovation-screen {
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
    border: 1px solid rgba(246, 200, 95, 0.28);
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

    .status-pill {
      padding: 3px 8px;
      border-radius: 10px;
      border: 1px solid;
      font-size: 11px;
      font-weight: 600;
    }
  }
}

@keyframes scrollNewsUp {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50%);
  }
}

.news-viewport {
  height: 100%;
  overflow: hidden;
  padding: 4px 10px;

  &:hover .news-track {
    animation-play-state: paused;
  }
}

.news-track {
  display: flex;
  flex-direction: column;
  gap: 8px;
  animation: scrollNewsUp 18s linear infinite;
}

.news-row {
  padding: 7px 10px;
  border-radius: 6px;
  background: rgba(10, 26, 58, 0.55);
  border: 1px solid rgba(56, 189, 248, 0.16);
  flex-shrink: 0;

  .news-meta {
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
  }

  .news-msg {
    font-size: 12px;
    color: #f1f5f9;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
