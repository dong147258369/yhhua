import {
  canalCorridorCities,
  canalProvincesData,
  canalTrunkCoords,
  type CanalNodeCity,
} from "@/mock/huacan";

export const buildCanalMapOption = () => {
  const provinceSeriesData = [
    ...canalProvincesData.map((p) => ({
      name: p.name,
      value: p.score,
      projects: p.projects,
      outputValue: p.outputValue,
    })),
    { name: "台湾省", value: 85, projects: 5640, outputValue: 22.4 },
    { name: "香港特别行政区", value: 84, projects: 4280, outputValue: 19.8 },
    { name: "澳门特别行政区", value: 80, projects: 2930, outputValue: 12.6 },
  ];

  // 两岸暨港澳协同飞线 + 运河沿线联动飞线
  const flightLines = [
    { fromName: "台北", toName: "杭州·拱墅", coords: [[121.52, 25.04], [120.15, 30.28]] },
    { fromName: "台北", toName: "苏州", coords: [[121.52, 25.04], [120.62, 31.3]] },
    { fromName: "香港", toName: "杭州·拱墅", coords: [[114.17, 22.32], [120.15, 30.28]] },
    { fromName: "澳门", toName: "扬州", coords: [[113.54, 22.19], [119.41, 32.39]] },
    { fromName: "北京·通州", toName: "杭州·拱墅", coords: [[116.65, 39.9], [120.15, 30.28]] },
    { fromName: "洛阳", toName: "扬州", coords: [[112.45, 34.62], [119.41, 32.39]] },
  ];

  const roleColorMap: Record<CanalNodeCity["role"], string> = {
    core: "#F6C85F",
    hub: "#00E5C3",
    partner: "#FB7185",
  };

  return {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(6, 18, 42, 0.94)",
      borderColor: "#F6C85F",
      borderWidth: 1,
      textStyle: { color: "#F8FAFC", fontSize: 12 },
      formatter: (params: any) => {
        if (params.seriesType === "effectScatter" && params.data?.cityInfo) {
          const c: CanalNodeCity = params.data.cityInfo;
          return `
            <div style="font-weight:700;font-size:14px;color:#F6C85F;margin-bottom:4px;">${c.name}</div>
            <div style="color:#94A3B8;margin-bottom:6px;max-width:220px;white-space:normal;">${c.highlight}</div>
            <div>沿线双创园区：<b style="color:#00E5C3">${c.workshops}</b> 座</div>
            <div>智创项目数：<b style="color:#38BDF8">${c.projects.toLocaleString()}</b> 项</div>
            <div>非遗数字资产：<b style="color:#F6C85F">${c.heritageAssets}</b> 项</div>
          `;
        }
        if (params.seriesType === "map" && params.data) {
          return `
            <div style="font-weight:700;color:#00E5C3;margin-bottom:3px;">${params.name}</div>
            <div>智创活力指数：<b>${params.data.value}</b></div>
            <div>智创项目：<b>${params.data.projects?.toLocaleString() || "-"}</b> 项</div>
            <div>孵化产值：<b>${params.data.outputValue || "-"}</b> 亿元</div>
          `;
        }
        return params.name;
      },
    },
    geo: {
      map: "china",
      roam: false,
      zoom: 1.18,
      center: [108.5, 33.5],
      aspectScale: 0.78,
      itemStyle: {
        areaColor: "rgba(11, 31, 68, 0.75)",
        borderColor: "rgba(56, 189, 248, 0.45)",
        borderWidth: 1,
      },
      emphasis: {
        label: { show: false },
        itemStyle: {
          areaColor: "rgba(0, 180, 255, 0.35)",
          borderColor: "#00E5C3",
        },
      },
    },
    visualMap: {
      show: true,
      seriesIndex: 0,
      left: 16,
      bottom: 16,
      min: 70,
      max: 100,
      text: ["高活力", "协同区"],
      inRange: {
        color: [
          "rgba(14, 58, 110, 0.78)",
          "rgba(0, 145, 195, 0.82)",
          "rgba(0, 210, 185, 0.88)",
        ],
      },
      textStyle: { color: "#CBD5E1", fontSize: 11 },
    },
    series: [
      {
        name: "运河沿线省市",
        type: "map",
        geoIndex: 0,
        data: provinceSeriesData,
      },
      // 京杭大运河主轴航道（折线流光）
      {
        name: "京杭大运河主轴",
        type: "lines",
        coordinateSystem: "geo",
        polyline: true,
        zlevel: 2,
        effect: {
          show: true,
          period: 5,
          trailLength: 0.35,
          color: "#F6C85F",
          symbolSize: 5,
        },
        lineStyle: {
          color: "#00E5C3",
          width: 2.6,
          opacity: 0.85,
          shadowColor: "#00E5C3",
          shadowBlur: 10,
        },
        data: [{ coords: canalTrunkCoords }],
      },
      // 两岸暨港澳与运河枢纽协同飞线
      {
        name: "智创协同飞线",
        type: "lines",
        coordinateSystem: "geo",
        zlevel: 2,
        effect: {
          show: true,
          period: 4,
          trailLength: 0.25,
          symbol: "arrow",
          symbolSize: 6,
          color: "#F6C85F",
        },
        lineStyle: {
          color: "#FB7185",
          width: 1.4,
          opacity: 0.55,
          curveness: 0.28,
          type: "dashed",
        },
        data: flightLines,
      },
      // 核心城市节点散点
      {
        name: "运河智创节点",
        type: "effectScatter",
        coordinateSystem: "geo",
        zlevel: 3,
        rippleEffect: {
          brushType: "stroke",
          scale: 3.5,
          period: 4,
        },
        symbolSize: (val: any) => (val[2] === "core" ? 13 : val[2] === "partner" ? 11 : 9),
        label: {
          show: true,
          position: "right",
          formatter: "{b}",
          color: "#F8FAFC",
          fontSize: 11,
          fontWeight: 600,
          textBorderColor: "#040B1A",
          textBorderWidth: 2,
        },
        data: canalCorridorCities.map((city) => ({
          name: city.name,
          value: [...city.coords, city.role],
          cityInfo: city,
          itemStyle: {
            color: roleColorMap[city.role],
            shadowBlur: 12,
            shadowColor: roleColorMap[city.role],
          },
        })),
      },
    ],
  };
};
