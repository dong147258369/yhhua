export interface KpiCardItem {
  key: string;
  label: string;
  value: number;
  unit: string;
  decimals?: number;
  trend: string;
  color: string;
}

export interface TrackItem {
  name: string;
  value: number;
  projects: number;
  color: string;
}

export interface CanalProvinceMetric {
  name: string;
  shortName: string;
  score: number;
  projects: number;
  outputValue: number; // 亿元
  patents: number;
}

export interface CanalNodeCity {
  name: string;
  province: string;
  coords: [number, number];
  role: "core" | "hub" | "partner";
  workshops: number;
  projects: number;
  heritageAssets: number;
  highlight: string;
}

export interface LiveActivityItem {
  id: string;
  time: string;
  city: string;
  track: string;
  title: string;
  status: string;
  badgeColor: string;
  detail: string;
}

// 主屏 L1：运河数字经济核心总览
export const huacanKpiMetrics: KpiCardItem[] = [
  {
    key: "works",
    label: "运河智创成果",
    value: 128460,
    unit: "件",
    trend: "+24.6%",
    color: "#F6C85F",
  },
  {
    key: "parks",
    label: "沿线协同园区",
    value: 42,
    unit: "座",
    trend: "+6座",
    color: "#00E5C3",
  },
  {
    key: "conversion",
    label: "成果转化率",
    value: 68.4,
    unit: "%",
    decimals: 1,
    trend: "+8.2%",
    color: "#38BDF8",
  },
  {
    key: "output",
    label: "运河孵化产值",
    value: 386.5,
    unit: "亿元",
    decimals: 1,
    trend: "+31.4%",
    color: "#FF8A5B",
  },
];

// 主屏 L2：运河六大核心产业布局
export const huacanTracks: TrackItem[] = [
  { name: "运河数字文创", value: 31, projects: 39820, color: "#F6C85F" },
  { name: "非遗数字孪生", value: 22, projects: 28260, color: "#00E5C3" },
  { name: "绿色智慧航运", value: 16, projects: 20550, color: "#38BDF8" },
  { name: "沿线智能制造", value: 13, projects: 16700, color: "#6366F1" },
  { name: "运河生态治理", value: 10, projects: 12850, color: "#FB7185" },
  { name: "元宇宙文旅", value: 8, projects: 10280, color: "#34D399" },
];

// 主屏 L3：京杭大运河沿线 8 省市智创活力榜
export const canalProvincesData: CanalProvinceMetric[] = [
  { name: "江苏省", shortName: "江苏", score: 96.4, projects: 28450, outputValue: 98.6, patents: 4120 },
  { name: "浙江省", shortName: "浙江", score: 94.8, projects: 26120, outputValue: 92.4, patents: 3890 },
  { name: "北京市", shortName: "北京", score: 93.2, projects: 22680, outputValue: 84.2, patents: 3650 },
  { name: "山东省", shortName: "山东", score: 86.5, projects: 16420, outputValue: 45.8, patents: 2140 },
  { name: "天津市", shortName: "天津", score: 82.1, projects: 11240, outputValue: 26.5, patents: 1580 },
  { name: "河南省", shortName: "河南", score: 79.6, projects: 9850, outputValue: 18.9, patents: 1320 },
  { name: "河北省", shortName: "河北", score: 75.4, projects: 7420, outputValue: 11.4, patents: 960 },
  { name: "安徽省", shortName: "安徽", score: 73.8, projects: 6280, outputValue: 8.7, patents: 840 },
];

// 主屏 C1：京杭大运河智创走廊核心城市节点（按由北向南主轴排列 + 港澳台协同节点）
export const canalCorridorCities: CanalNodeCity[] = [
  {
    name: "北京·通州",
    province: "北京市",
    coords: [116.65, 39.9],
    role: "core",
    workshops: 8,
    projects: 22680,
    heritageAssets: 342,
    highlight: "北京城市副中心数字文化与AI智算枢纽",
  },
  {
    name: "天津",
    province: "天津市",
    coords: [117.2, 39.13],
    role: "hub",
    workshops: 5,
    projects: 11240,
    heritageAssets: 218,
    highlight: "三岔河口智慧航运与工业互联网示范区",
  },
  {
    name: "沧州",
    province: "河北省",
    coords: [116.86, 38.31],
    role: "hub",
    workshops: 3,
    projects: 7420,
    heritageAssets: 164,
    highlight: "大运河非遗武术与数字文旅融合基地",
  },
  {
    name: "济宁",
    province: "山东省",
    coords: [116.59, 35.42],
    role: "hub",
    workshops: 4,
    projects: 16420,
    heritageAssets: 285,
    highlight: "南旺枢纽水利数字孪生与绿色船舶制造",
  },
  {
    name: "洛阳",
    province: "河南省",
    coords: [112.45, 34.62],
    role: "hub",
    workshops: 4,
    projects: 9850,
    heritageAssets: 310,
    highlight: "隋唐大运河国家文化公园数字博物馆群",
  },
  {
    name: "淮安",
    province: "江苏省",
    coords: [119.02, 33.61],
    role: "hub",
    workshops: 4,
    projects: 9420,
    heritageAssets: 246,
    highlight: "淮扬美食非遗AIGC与智慧水运调度中心",
  },
  {
    name: "扬州",
    province: "江苏省",
    coords: [119.41, 32.39],
    role: "core",
    workshops: 6,
    projects: 11200,
    heritageAssets: 389,
    highlight: "中国大运河博物馆数字孪生与青年文创高地",
  },
  {
    name: "苏州",
    province: "江苏省",
    coords: [120.62, 31.3],
    role: "core",
    workshops: 7,
    projects: 15830,
    heritageAssets: 425,
    highlight: "苏绣非遗大模型与两岸青年智创产业园",
  },
  {
    name: "杭州·拱墅",
    province: "浙江省",
    coords: [120.15, 30.28],
    role: "core",
    workshops: 9,
    projects: 26120,
    heritageAssets: 468,
    highlight: "京杭大运河南端终点 · 数字文创与人工智能创新高地",
  },
  {
    name: "台北",
    province: "台湾省",
    coords: [121.52, 25.04],
    role: "partner",
    workshops: 4,
    projects: 5640,
    heritageAssets: 120,
    highlight: "海峡两岸青年创意设计协同中心",
  },
  {
    name: "香港",
    province: "香港特别行政区",
    coords: [114.17, 22.32],
    role: "partner",
    workshops: 3,
    projects: 4280,
    heritageAssets: 96,
    highlight: "粤港澳大湾区国际数字文创出海桥头堡",
  },
  {
    name: "澳门",
    province: "澳门特别行政区",
    coords: [113.54, 22.19],
    role: "partner",
    workshops: 2,
    projects: 2930,
    heritageAssets: 78,
    highlight: "中葡文化交融与数字艺术创新工坊",
  },
];

// 京杭大运河主轴航道折线坐标（由北向南）
export const canalTrunkCoords: [number, number][] = [
  [116.65, 39.9],  // 北京通州
  [117.2, 39.13],  // 天津
  [116.86, 38.31], // 沧州
  [116.35, 36.45], // 聊城过渡点
  [116.59, 35.42], // 济宁
  [117.18, 34.26], // 徐州过渡点
  [119.02, 33.61], // 淮安
  [119.41, 32.39], // 扬州
  [120.3, 31.57],  // 无锡过渡点
  [120.62, 31.3],  // 苏州
  [120.15, 30.28], // 杭州
];

// 主屏 C2：2021-2026 智创成果转化与数字经济规模趋势
export const trendYearsData = {
  years: ["2021", "2022", "2023", "2024", "2025", "2026"],
  patents: [4280, 6150, 8920, 12460, 15840, 18500],
  economicScale: [112.4, 156.8, 208.5, 268.2, 324.6, 386.5],
};

// 主屏 R1：大运河五维数智赋能评估
export const radarCapabilityData = {
  indicators: [
    { name: "智慧航运赋能", max: 100 },
    { name: "运河文化传承", max: 100 },
    { name: "沿岸数字创新", max: 100 },
    { name: "绿色生态治理", max: 100 },
    { name: "区域协同发展", max: 100 },
  ],
  currentYear: [94, 92, 86, 95, 89],
  lastYear: [82, 84, 74, 81, 76],
};

// 主屏 R2：AI与文化数字化赋能核心指标
export const empowerGaugeData = [
  { name: "非遗3D建模", value: 86.4, color: "#00E5C3" },
  { name: "智算算力利用", value: 91.2, color: "#F6C85F" },
  { name: "绿色智能航运", value: 74.8, color: "#38BDF8" },
];

// 主屏 R3：实时孵化与路演动态流
export const liveActivitiesData: LiveActivityItem[] = [
  {
    id: "act-1",
    time: "15:58:12",
    city: "杭州·拱墅",
    track: "AI+数字文创",
    title: "运河数字非遗大模型完成备案上线",
    status: "已上线",
    badgeColor: "#00E5C3",
    detail: "融合京杭大运河沿线 1200+ 项传统纹样与工艺语料，支持设计师一键生成国风文创 3D 资产。",
  },
  {
    id: "act-2",
    time: "15:54:36",
    city: "苏州·姑苏",
    track: "两岸青年协同",
    title: "华灿两岸青年AI文创孵化营签约12项",
    status: "签约落地",
    badgeColor: "#F6C85F",
    detail: "来自北京、苏州、台北的 12 支青年团队在苏州赛区落地签约，首期获得 2800 万元产业基金支持。",
  },
  {
    id: "act-3",
    time: "15:49:08",
    city: "北京·通州",
    track: "智慧航运",
    title: "北运河无人电动游船编队调度能耗降低14.2%",
    status: "稳定运行",
    badgeColor: "#38BDF8",
    detail: "基于数字孪生水文感知与 AI 路径规划，实现全航段零碳排放智慧调度。",
  },
  {
    id: "act-4",
    time: "15:43:25",
    city: "扬州·广陵",
    track: "非遗数字孪生",
    title: "雕版印刷高精度点云数字档案突破5000件",
    status: "归档入库",
    badgeColor: "#00E5C3",
    detail: "亚毫米级激光扫描完成古籍雕版永久数字化留存，同步开放线上虚拟研学展厅。",
  },
  {
    id: "act-5",
    time: "15:37:50",
    city: "济宁·南旺",
    track: "工业智能制造",
    title: "内河新能源智能船舶协同研发中心揭牌",
    status: "正式投运",
    badgeColor: "#FF8A5B",
    detail: "联合 8 家沿线高校与船舶企业，推动纯电动力内河货船标准化智造。",
  },
  {
    id: "act-6",
    time: "15:31:14",
    city: "洛阳·老城",
    track: "元宇宙文旅",
    title: "隋唐大运河XR沉浸式光影剧场日客流破万",
    status: "高峰运行",
    badgeColor: "#FB7185",
    detail: "依托空间计算与裸眼3D投影技术，再现盛唐漕运盛景，获评国家级智慧文旅示范项目。",
  },
];
