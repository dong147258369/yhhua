<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface OrbitNodeMeta {
  name: string;
  color: string;
  radius: number;
  speed: number;
  phase: number;
  tiltX: number;
  tiltZ: number;
}

const orbitMetas: OrbitNodeMeta[] = [
  { name: "AI大模型算力", color: "#00E5C3", radius: 4.5, speed: 0.55, phase: 0, tiltX: 0.35, tiltZ: 0.2 },
  { name: "高校科研院所", color: "#F6C85F", radius: 5.6, speed: 0.42, phase: 2.1, tiltX: -0.45, tiltZ: 0.35 },
  { name: "华灿青年赛区", color: "#FB7185", radius: 6.4, speed: 0.36, phase: 4.2, tiltX: 0.25, tiltZ: -0.4 },
  { name: "产业转化基金", color: "#38BDF8", radius: 4.9, speed: 0.48, phase: 1.4, tiltX: -0.25, tiltZ: -0.25 },
  { name: "绿色智能制造", color: "#34D399", radius: 6.0, speed: 0.38, phase: 3.3, tiltX: 0.5, tiltZ: 0.1 },
  { name: "数字版权IP库", color: "#A78BFA", radius: 5.2, speed: 0.45, phase: 5.1, tiltX: -0.35, tiltZ: 0.45 },
];

const containerRef = ref<HTMLDivElement | null>(null);
const nodeLabels = ref<{ name: string; color: string; x: number; y: number; visible: boolean }[]>([]);

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let controls: OrbitControls | null = null;
let animId = 0;

const initThree = () => {
  const el = containerRef.value;
  if (!el) return;

  const width = el.clientWidth || 760;
  const height = el.clientHeight || 420;

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x040b1a, 0.024);

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 150);
  camera.position.set(0, 5.5, 16);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  el.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;
  controls.minDistance = 9;
  controls.maxDistance = 26;

  // 1. 中央 3D 智创能量核心（二十面体双层线框 + 发光内核）
  const coreGroup = new THREE.Group();

  const innerGeo = new THREE.IcosahedronGeometry(1.45, 1);
  const innerMat = new THREE.MeshBasicMaterial({
    color: 0x00e5c3,
    wireframe: true,
    transparent: true,
    opacity: 0.85,
  });
  const innerCore = new THREE.Mesh(innerGeo, innerMat);

  const outerGeo = new THREE.IcosahedronGeometry(2.15, 0);
  const outerMat = new THREE.MeshBasicMaterial({
    color: 0xf6c85f,
    wireframe: true,
    transparent: true,
    opacity: 0.55,
  });
  const outerCore = new THREE.Mesh(outerGeo, outerMat);

  const glowGeo = new THREE.SphereGeometry(0.95, 24, 24);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.45,
  });
  const glowSphere = new THREE.Mesh(glowGeo, glowMat);

  coreGroup.add(innerCore, outerCore, glowSphere);
  scene.add(coreGroup);

  // 2. 轨道星环 + 卫星节点 + 核心连接线
  const satellites: {
    mesh: THREE.Mesh;
    line: THREE.Line;
    meta: OrbitNodeMeta;
  }[] = [];

  orbitMetas.forEach((meta) => {
    const col = new THREE.Color(meta.color);

    // 轨道环
    const ringGeo = new THREE.TorusGeometry(meta.radius, 0.025, 8, 96);
    const ringMat = new THREE.MeshBasicMaterial({
      color: col,
      transparent: true,
      opacity: 0.28,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2 + meta.tiltX;
    ring.rotation.z = meta.tiltZ;
    scene!.add(ring);

    // 卫星球体
    const satGeo = new THREE.SphereGeometry(0.28, 16, 16);
    const satMat = new THREE.MeshBasicMaterial({ color: col });
    const satMesh = new THREE.Mesh(satGeo, satMat);
    scene!.add(satMesh);

    // 卫星与核心的能量连接线
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(meta.radius, 0, 0),
    ]);
    const lineMat = new THREE.LineBasicMaterial({
      color: col,
      transparent: true,
      opacity: 0.5,
    });
    const line = new THREE.Line(lineGeo, lineMat);
    scene!.add(line);

    satellites.push({ mesh: satMesh, line, meta });
  });

  // 3. 星辰数据粒子场（220 颗）
  const starCount = 220;
  const starPos = new Float32Array(starCount * 3);
  const starCol = new Float32Array(starCount * 3);
  const cCyan = new THREE.Color("#00E5C3");
  const cGold = new THREE.Color("#F6C85F");

  for (let i = 0; i < starCount; i++) {
    const r = 3.2 + Math.random() * 8.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.65;
    starPos[i * 3 + 2] = r * Math.cos(phi);

    const c = i % 3 === 0 ? cGold : cCyan;
    starCol[i * 3] = c.r;
    starCol[i * 3 + 1] = c.g;
    starCol[i * 3 + 2] = c.b;
  }

  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute("color", new THREE.BufferAttribute(starCol, 3));
  const starMat = new THREE.PointsMaterial({
    size: 0.14,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const starField = new THREE.Points(starGeo, starMat);
  scene.add(starField);

  // 4. 底部科技圆盘网格
  const gridHelper = new THREE.PolarGridHelper(9, 12, 6, 64, 0x00e5c3, 0x1e3a8a);
  gridHelper.position.y = -3.8;
  (gridHelper.material as THREE.Material).transparent = true;
  (gridHelper.material as THREE.Material).opacity = 0.22;
  scene.add(gridHelper);

  const clock = new THREE.Clock();
  const animate = () => {
    animId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // 能量核心旋转 + 呼吸脉动
    innerCore.rotation.y = t * 0.6;
    innerCore.rotation.x = t * 0.35;
    outerCore.rotation.y = -t * 0.38;
    outerCore.rotation.z = t * 0.25;
    const pulseScale = 1 + Math.sin(t * 2.4) * 0.12;
    glowSphere.scale.set(pulseScale, pulseScale, pulseScale);

    starField.rotation.y = t * 0.08;

    // 更新卫星位置、连接线与 3D 投影标签
    const w = el.clientWidth || 760;
    const h = el.clientHeight || 420;
    const labels: typeof nodeLabels.value = [];

    satellites.forEach((sat) => {
      const m = sat.meta;
      const angle = m.phase + t * m.speed;
      const pos = new THREE.Vector3(
        Math.cos(angle) * m.radius,
        0,
        Math.sin(angle) * m.radius
      );
      pos.applyEuler(new THREE.Euler(m.tiltX, 0, m.tiltZ));
      sat.mesh.position.copy(pos);

      const lineArr = sat.line.geometry.attributes.position.array as Float32Array;
      lineArr[3] = pos.x;
      lineArr[4] = pos.y;
      lineArr[5] = pos.z;
      sat.line.geometry.attributes.position.needsUpdate = true;

      if (camera) {
        const proj = pos.clone().add(new THREE.Vector3(0, 0.45, 0)).project(camera);
        labels.push({
          name: m.name,
          color: m.color,
          x: (proj.x * 0.5 + 0.5) * w,
          y: (-proj.y * 0.5 + 0.5) * h,
          visible: proj.z < 1 && proj.x > -0.92 && proj.x < 0.92 && proj.y > -0.92 && proj.y < 0.92,
        });
      }
    });
    nodeLabels.value = labels;

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
  <div class="engine-three-wrap" ref="containerRef">
    <div class="core-badge">
      <span class="dot"></span>
      <span>智创中国 · 产学研协同 3D 算力星核</span>
    </div>

    <div
      v-for="lbl in nodeLabels"
      v-show="lbl.visible"
      :key="lbl.name"
      class="sat-tag"
      :style="{ left: `${lbl.x}px`, top: `${lbl.y}px`, '--tag-col': lbl.color }"
    >
      {{ lbl.name }}
    </div>

    <div class="three-hint">🖱️ 拖拽旋转 · 滚轮缩放 3D 协同星核</div>
  </div>
</template>

<style scoped lang="scss">
.engine-three-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.14), rgba(4, 11, 26, 0.88));
}

.core-badge {
  position: absolute;
  top: 14px;
  left: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px;
  background: rgba(6, 18, 42, 0.82);
  border: 1px solid rgba(246, 200, 95, 0.4);
  border-radius: 6px;
  font-size: 12px;
  color: #f8fafc;
  pointer-events: none;

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #f6c85f;
    box-shadow: 0 0 8px #f6c85f;
  }
}

.sat-tag {
  position: absolute;
  transform: translate(-50%, -100%);
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(6, 18, 42, 0.84);
  border: 1px solid var(--tag-col);
  color: var(--tag-col);
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
  pointer-events: none;
  box-shadow: 0 0 8px rgba(0, 229, 195, 0.2);
}

.three-hint {
  position: absolute;
  left: 16px;
  bottom: 12px;
  font-size: 11px;
  color: #94a3b8;
  background: rgba(6, 18, 42, 0.72);
  padding: 4px 10px;
  border-radius: 12px;
  border: 1px solid rgba(56, 189, 248, 0.2);
  pointer-events: none;
}
</style>
