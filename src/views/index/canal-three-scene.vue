<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface CityBeacon {
  name: string;
  t: number; // 沿运河曲线位置 0~1
  offsetX: number;
  height: number;
  color: string;
  tag: string;
}

const cityBeacons: CityBeacon[] = [
  { name: "北京·通州", t: 0.06, offsetX: -1.4, height: 4.2, color: "#F6C85F", tag: "北运河起点" },
  { name: "天津", t: 0.19, offsetX: 1.5, height: 3.1, color: "#00E5C3", tag: "三岔河口" },
  { name: "济宁", t: 0.36, offsetX: -1.6, height: 3.4, color: "#00E5C3", tag: "南旺枢纽" },
  { name: "淮安", t: 0.53, offsetX: 1.6, height: 3.2, color: "#38BDF8", tag: "水运中枢" },
  { name: "扬州", t: 0.68, offsetX: -1.5, height: 3.9, color: "#F6C85F", tag: "运河文脉" },
  { name: "苏州", t: 0.82, offsetX: 1.5, height: 4.1, color: "#00E5C3", tag: "双创高地" },
  { name: "杭州·拱墅", t: 0.95, offsetX: -1.3, height: 4.6, color: "#F6C85F", tag: "南端终点" },
];

const containerRef = ref<HTMLDivElement | null>(null);
const projectedLabels = ref<
  { name: string; tag: string; x: number; y: number; visible: boolean; color: string }[]
>([]);

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let controls: OrbitControls | null = null;
let animId = 0;

const initThree = () => {
  const el = containerRef.value;
  if (!el) return;

  const width = el.clientWidth || 800;
  const height = el.clientHeight || 520;

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x040b1a, 0.022);

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 200);
  camera.position.set(0, 13, 22);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  el.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.45;
  controls.maxPolarAngle = Math.PI * 0.46;
  controls.minDistance = 12;
  controls.maxDistance = 34;

  // 环境光与点光源
  scene.add(new THREE.AmbientLight(0x38bdf8, 0.8));
  const dirLight = new THREE.DirectionalLight(0xf6c85f, 1.2);
  dirLight.position.set(10, 20, 10);
  scene.add(dirLight);

  // 1. 赛博运河水波粒子海
  const cols = 64;
  const rows = 44;
  const waveCount = cols * rows;
  const wavePositions = new Float32Array(waveCount * 3);
  const waveColors = new Float32Array(waveCount * 3);
  const c1 = new THREE.Color("#0284c7");
  const c2 = new THREE.Color("#00e5c3");

  let ptr = 0;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = (i - cols / 2) * 0.68;
      const z = (j - rows / 2) * 0.68;
      wavePositions[ptr * 3] = x;
      wavePositions[ptr * 3 + 1] = -0.35;
      wavePositions[ptr * 3 + 2] = z;

      const mix = c1.clone().lerp(c2, i / cols);
      waveColors[ptr * 3] = mix.r;
      waveColors[ptr * 3 + 1] = mix.g;
      waveColors[ptr * 3 + 2] = mix.b;
      ptr++;
    }
  }

  const waveGeo = new THREE.BufferGeometry();
  waveGeo.setAttribute("position", new THREE.BufferAttribute(wavePositions, 3));
  waveGeo.setAttribute("color", new THREE.BufferAttribute(waveColors, 3));
  const waveMat = new THREE.PointsMaterial({
    size: 0.11,
    vertexColors: true,
    transparent: true,
    opacity: 0.52,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const wavePoints = new THREE.Points(waveGeo, waveMat);
  scene.add(wavePoints);

  // 2. 京杭大运河主轴 3D 曲线河道
  const canalCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-4.2, 0.05, -13),
    new THREE.Vector3(2.4, 0.05, -9),
    new THREE.Vector3(-3.0, 0.05, -4.5),
    new THREE.Vector3(2.8, 0.05, 0),
    new THREE.Vector3(-2.6, 0.05, 4.8),
    new THREE.Vector3(2.5, 0.05, 9.2),
    new THREE.Vector3(-1.4, 0.05, 13.2),
  ]);

  const tubeGeo = new THREE.TubeGeometry(canalCurve, 120, 0.36, 12, false);
  const tubeMat = new THREE.MeshBasicMaterial({
    color: 0x00e5c3,
    transparent: true,
    opacity: 0.38,
    wireframe: false,
  });
  const canalMesh = new THREE.Mesh(tubeGeo, tubeMat);
  scene.add(canalMesh);

  // 外层能量线框管道
  const wireTubeGeo = new THREE.TubeGeometry(canalCurve, 80, 0.56, 8, false);
  const wireTubeMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.16,
    wireframe: true,
  });
  scene.add(new THREE.Mesh(wireTubeGeo, wireTubeMat));

  // 3. 沿运河奔涌的 240 颗金色/青色数字光流粒子
  const flowCount = 240;
  const flowPositions = new Float32Array(flowCount * 3);
  const flowColors = new Float32Array(flowCount * 3);
  const flowOffsets: number[] = [];
  const goldCol = new THREE.Color("#F6C85F");
  const cyanCol = new THREE.Color("#00E5C3");

  for (let i = 0; i < flowCount; i++) {
    flowOffsets.push(Math.random());
    const col = i % 3 === 0 ? goldCol : cyanCol;
    flowColors[i * 3] = col.r;
    flowColors[i * 3 + 1] = col.g;
    flowColors[i * 3 + 2] = col.b;
  }

  const flowGeo = new THREE.BufferGeometry();
  flowGeo.setAttribute("position", new THREE.BufferAttribute(flowPositions, 3));
  flowGeo.setAttribute("color", new THREE.BufferAttribute(flowColors, 3));
  const flowMat = new THREE.PointsMaterial({
    size: 0.24,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const flowPoints = new THREE.Points(flowGeo, flowMat);
  scene.add(flowPoints);

  // 4. 运河数字拱桥光弧（象征拱宸桥/运河文化地标）
  [0.24, 0.58, 0.88].forEach((tVal) => {
    const pt = canalCurve.getPointAt(tVal);
    const tangent = canalCurve.getTangentAt(tVal);
    const archGeo = new THREE.TorusGeometry(1.5, 0.045, 8, 36, Math.PI);
    const archMat = new THREE.MeshBasicMaterial({
      color: 0xf6c85f,
      transparent: true,
      opacity: 0.72,
    });
    const arch = new THREE.Mesh(archGeo, archMat);
    arch.position.set(pt.x, 0.05, pt.z);
    const angle = Math.atan2(tangent.x, tangent.z);
    arch.rotation.y = angle + Math.PI / 2;
    scene.add(arch);
  });

  // 5. 沿线 7 大城市 3D 光柱与扩散脉冲环
  const beaconNodes: {
    anchor: THREE.Vector3;
    ring: THREE.Mesh;
    pillar: THREE.Mesh;
    meta: CityBeacon;
  }[] = [];

  cityBeacons.forEach((city) => {
    const curvePt = canalCurve.getPointAt(city.t);
    const anchor = new THREE.Vector3(curvePt.x + city.offsetX, 0.1, curvePt.z);
    const col = new THREE.Color(city.color);

    // 发光光柱
    const pillarGeo = new THREE.CylinderGeometry(0.08, 0.22, city.height, 16);
    const pillarMat = new THREE.MeshBasicMaterial({
      color: col,
      transparent: true,
      opacity: 0.78,
    });
    const pillar = new THREE.Mesh(pillarGeo, pillarMat);
    pillar.position.set(anchor.x, city.height / 2 + 0.1, anchor.z);
    scene.add(pillar);

    // 顶部光球
    const orbGeo = new THREE.SphereGeometry(0.22, 16, 16);
    const orbMat = new THREE.MeshBasicMaterial({ color: col });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    orb.position.set(anchor.x, city.height + 0.2, anchor.z);
    scene.add(orb);

    // 底部扩散脉冲环
    const ringGeo = new THREE.RingGeometry(0.35, 0.55, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: col,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(anchor.x, 0.12, anchor.z);
    scene.add(ring);

    beaconNodes.push({
      anchor: new THREE.Vector3(anchor.x, city.height + 0.75, anchor.z),
      ring,
      pillar,
      meta: city,
    });
  });

  // 动画循环
  const clock = new THREE.Clock();
  const animate = () => {
    animId = requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // 更新水波粒子起伏
    const posArr = waveGeo.attributes.position.array as Float32Array;
    for (let i = 0; i < waveCount; i++) {
      const x = posArr[i * 3];
      const z = posArr[i * 3 + 2];
      posArr[i * 3 + 1] =
        Math.sin(x * 0.35 + elapsed * 1.4) * 0.28 +
        Math.cos(z * 0.3 + elapsed * 1.1) * 0.22 -
        0.35;
    }
    waveGeo.attributes.position.needsUpdate = true;

    // 更新沿运河奔涌的数字光流粒子
    const fArr = flowGeo.attributes.position.array as Float32Array;
    for (let i = 0; i < flowCount; i++) {
      const t = (flowOffsets[i] + elapsed * 0.085) % 1;
      const pt = canalCurve.getPointAt(t);
      const jitter = Math.sin(elapsed * 3 + i) * 0.16;
      fArr[i * 3] = pt.x + jitter;
      fArr[i * 3 + 1] = pt.y + 0.15 + Math.cos(elapsed * 2.5 + i) * 0.12;
      fArr[i * 3 + 2] = pt.z;
    }
    flowGeo.attributes.position.needsUpdate = true;

    // 更新城市脉冲环与 3D 投影标签坐标
    const w = el.clientWidth || 800;
    const h = el.clientHeight || 520;
    const labels: typeof projectedLabels.value = [];

    beaconNodes.forEach((node, idx) => {
      const pulse = 1 + ((elapsed * 0.8 + idx * 0.25) % 1) * 1.6;
      node.ring.scale.set(pulse, pulse, 1);
      (node.ring.material as THREE.MeshBasicMaterial).opacity = Math.max(
        0,
        1 - (pulse - 1) / 1.6
      );

      if (camera) {
        const v = node.anchor.clone().project(camera);
        labels.push({
          name: node.meta.name,
          tag: node.meta.tag,
          color: node.meta.color,
          x: (v.x * 0.5 + 0.5) * w,
          y: (-v.y * 0.5 + 0.5) * h,
          visible: v.z < 1 && v.x > -0.95 && v.x < 0.95 && v.y > -0.95 && v.y < 0.95,
        });
      }
    });
    projectedLabels.value = labels;

    controls?.update();
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  };

  animate();
};

onMounted(() => {
  initThree();
});

onUnmounted(() => {
  cancelAnimationFrame(animId);
  controls?.dispose();
  renderer?.dispose();
  if (renderer?.domElement && renderer.domElement.parentNode) {
    renderer.domElement.parentNode.removeChild(renderer.domElement);
  }
});
</script>

<template>
  <div class="three-canal-wrap" ref="containerRef">
    <!-- 3D 投影城市浮标 -->
    <div
      v-for="lbl in projectedLabels"
      v-show="lbl.visible"
      :key="lbl.name"
      class="city-3d-tag"
      :style="{ left: `${lbl.x}px`, top: `${lbl.y}px`, '--tag-color': lbl.color }"
    >
      <span class="tag-name">{{ lbl.name }}</span>
      <span class="tag-sub">{{ lbl.tag }}</span>
    </div>

    <div class="three-hint">🖱️ 拖拽旋转视角 · 滚轮缩放 3D 运河数字孪生</div>
  </div>
</template>

<style scoped lang="scss">
.three-canal-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: radial-gradient(circle at 50% 45%, rgba(0, 180, 255, 0.12), rgba(4, 11, 26, 0.85));
}

.city-3d-tag {
  position: absolute;
  transform: translate(-50%, -100%);
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  white-space: nowrap;

  .tag-name {
    padding: 2px 8px;
    border-radius: 4px;
    background: rgba(6, 18, 42, 0.86);
    border: 1px solid var(--tag-color);
    color: var(--tag-color);
    font-size: 12px;
    font-weight: 700;
    box-shadow: 0 0 10px rgba(0, 229, 195, 0.25);
  }

  .tag-sub {
    margin-top: 2px;
    font-size: 10px;
    color: #cbd5e1;
    text-shadow: 0 1px 4px #000;
  }
}

.three-hint {
  position: absolute;
  left: 16px;
  bottom: 14px;
  font-size: 11px;
  color: #94a3b8;
  background: rgba(6, 18, 42, 0.72);
  padding: 4px 10px;
  border-radius: 12px;
  border: 1px solid rgba(56, 189, 248, 0.2);
  pointer-events: none;
}
</style>
