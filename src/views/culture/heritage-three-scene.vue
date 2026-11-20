<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const containerRef = ref<HTMLDivElement | null>(null);

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
  scene.fog = new THREE.FogExp2(0x040b1a, 0.025);

  camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 150);
  camera.position.set(0, 6.5, 16.5);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  el.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.6;
  controls.maxPolarAngle = Math.PI * 0.48;
  controls.minDistance = 9;
  controls.maxDistance = 26;

  // 1. 运河三孔古石桥（拱宸桥意象）全息线框 + 点云模型
  const bridgeGroup = new THREE.Group();

  // 桥面弧线（抛物线拱形桥身）
  const deckPoints: THREE.Vector3[] = [];
  for (let i = -30; i <= 30; i++) {
    const x = i * 0.22;
    const y = 2.2 - Math.pow(x / 5.5, 2) * 1.1;
    deckPoints.push(new THREE.Vector3(x, y, 0));
  }
  const deckCurve = new THREE.CatmullRomCurve3(deckPoints);
  const deckGeo = new THREE.TubeGeometry(deckCurve, 64, 0.12, 8, false);
  const deckMat = new THREE.MeshBasicMaterial({
    color: 0xf6c85f,
    wireframe: true,
    transparent: true,
    opacity: 0.78,
  });

  // 前后两道主桥栏
  const frontDeck = new THREE.Mesh(deckGeo, deckMat);
  frontDeck.position.z = 1.05;
  const backDeck = new THREE.Mesh(deckGeo, deckMat);
  backDeck.position.z = -1.05;
  bridgeGroup.add(frontDeck, backDeck);

  // 桥面连接横梁点云
  const bridgeCloudCount = 1200;
  const bridgeCloudPos = new Float32Array(bridgeCloudCount * 3);
  const bridgeCloudCol = new Float32Array(bridgeCloudCount * 3);
  const gold = new THREE.Color("#F6C85F");
  const cyan = new THREE.Color("#00E5C3");

  for (let i = 0; i < bridgeCloudCount; i++) {
    const t = Math.random();
    const pt = deckCurve.getPointAt(t);
    const z = (Math.random() - 0.5) * 2.1;
    const yOffset = (Math.random() - 0.5) * 0.35;
    bridgeCloudPos[i * 3] = pt.x + (Math.random() - 0.5) * 0.15;
    bridgeCloudPos[i * 3 + 1] = pt.y + yOffset;
    bridgeCloudPos[i * 3 + 2] = z;

    const c = gold.clone().lerp(cyan, Math.random());
    bridgeCloudCol[i * 3] = c.r;
    bridgeCloudCol[i * 3 + 1] = c.g;
    bridgeCloudCol[i * 3 + 2] = c.b;
  }

  const bridgeCloudGeo = new THREE.BufferGeometry();
  bridgeCloudGeo.setAttribute("position", new THREE.BufferAttribute(bridgeCloudPos, 3));
  bridgeCloudGeo.setAttribute("color", new THREE.BufferAttribute(bridgeCloudCol, 3));
  const bridgeCloudMat = new THREE.PointsMaterial({
    size: 0.11,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  bridgeGroup.add(new THREE.Points(bridgeCloudGeo, bridgeCloudMat));

  // 三孔桥拱（中大两侧小）
  const archConfigs = [
    { x: 0, r: 1.55, y: 0.1 },
    { x: -3.25, r: 1.05, y: 0.05 },
    { x: 3.25, r: 1.05, y: 0.05 },
  ];
  archConfigs.forEach((cfg) => {
    [-1.0, 1.0].forEach((zPos) => {
      const archGeo = new THREE.TorusGeometry(cfg.r, 0.055, 8, 32, Math.PI);
      const archMat = new THREE.MeshBasicMaterial({
        color: 0x00e5c3,
        transparent: true,
        opacity: 0.85,
      });
      const arch = new THREE.Mesh(archGeo, archMat);
      arch.position.set(cfg.x, cfg.y, zPos);
      bridgeGroup.add(arch);
    });
  });

  // 桥墩光柱
  [-4.6, -1.75, 1.75, 4.6].forEach((px) => {
    const pierGeo = new THREE.BoxGeometry(0.38, 1.5, 2.2);
    const pierMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const pier = new THREE.Mesh(pierGeo, pierMat);
    pier.position.set(px, 0.75, 0);
    bridgeGroup.add(pier);
  });

  scene.add(bridgeGroup);

  // 2. 全息激光扫描平面（上下往复扫描古桥点云）
  const scanGeo = new THREE.RingGeometry(0.1, 6.2, 64);
  const scanMat = new THREE.MeshBasicMaterial({
    color: 0x00e5c3,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.22,
  });
  const scanPlane = new THREE.Mesh(scanGeo, scanMat);
  scanPlane.rotation.x = -Math.PI / 2;
  scene.add(scanPlane);

  // 3. 三层旋转非遗数字星环
  const ringConfigs = [
    { radius: 6.4, color: 0x00e5c3, tiltX: Math.PI / 2.2, tiltZ: 0.15 },
    { radius: 7.2, color: 0xf6c85f, tiltX: Math.PI / 1.85, tiltZ: -0.22 },
    { radius: 8.0, color: 0x38bdf8, tiltX: Math.PI / 2.0, tiltZ: 0 },
  ];
  const orbitRings: THREE.Mesh[] = [];
  ringConfigs.forEach((rc) => {
    const rGeo = new THREE.TorusGeometry(rc.radius, 0.03, 8, 96);
    const rMat = new THREE.MeshBasicMaterial({
      color: rc.color,
      transparent: true,
      opacity: 0.45,
    });
    const ring = new THREE.Mesh(rGeo, rMat);
    ring.rotation.x = rc.tiltX;
    ring.rotation.z = rc.tiltZ;
    scene!.add(ring);
    orbitRings.push(ring);
  });

  // 4. 下方流动的运河水波点阵
  const waterCols = 48;
  const waterRows = 32;
  const waterCount = waterCols * waterRows;
  const waterPos = new Float32Array(waterCount * 3);
  let wp = 0;
  for (let i = 0; i < waterCols; i++) {
    for (let j = 0; j < waterRows; j++) {
      waterPos[wp * 3] = (i - waterCols / 2) * 0.55;
      waterPos[wp * 3 + 1] = -0.35;
      waterPos[wp * 3 + 2] = (j - waterRows / 2) * 0.55;
      wp++;
    }
  }
  const waterGeo = new THREE.BufferGeometry();
  waterGeo.setAttribute("position", new THREE.BufferAttribute(waterPos, 3));
  const waterMat = new THREE.PointsMaterial({
    color: 0x00e5c3,
    size: 0.09,
    transparent: true,
    opacity: 0.42,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  scene.add(new THREE.Points(waterGeo, waterMat));

  // 5. 上升的金色非遗文化粒子
  const sparkCount = 160;
  const sparkPos = new Float32Array(sparkCount * 3);
  const sparkSpeeds: number[] = [];
  for (let i = 0; i < sparkCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const rad = 1.5 + Math.random() * 5.8;
    sparkPos[i * 3] = Math.cos(angle) * rad;
    sparkPos[i * 3 + 1] = Math.random() * 5.5;
    sparkPos[i * 3 + 2] = Math.sin(angle) * rad;
    sparkSpeeds.push(0.012 + Math.random() * 0.02);
  }
  const sparkGeo = new THREE.BufferGeometry();
  sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPos, 3));
  const sparkMat = new THREE.PointsMaterial({
    color: 0xf6c85f,
    size: 0.14,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  scene.add(new THREE.Points(sparkGeo, sparkMat));

  const clock = new THREE.Clock();
  const animate = () => {
    animId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // 扫描光环上下往复
    scanPlane.position.y = 1.4 + Math.sin(t * 1.6) * 1.35;

    // 旋转外围星环
    orbitRings[0].rotation.z += 0.004;
    orbitRings[1].rotation.z -= 0.003;
    orbitRings[2].rotation.y += 0.002;

    // 水波起伏
    const wArr = waterGeo.attributes.position.array as Float32Array;
    for (let i = 0; i < waterCount; i++) {
      const x = wArr[i * 3];
      const z = wArr[i * 3 + 2];
      wArr[i * 3 + 1] = Math.sin(x * 0.5 + t * 1.8) * 0.18 + Math.cos(z * 0.4 + t * 1.3) * 0.14 - 0.35;
    }
    waterGeo.attributes.position.needsUpdate = true;

    // 金色粒子上升
    const sArr = sparkGeo.attributes.position.array as Float32Array;
    for (let i = 0; i < sparkCount; i++) {
      sArr[i * 3 + 1] += sparkSpeeds[i];
      if (sArr[i * 3 + 1] > 5.8) {
        sArr[i * 3 + 1] = 0;
      }
    }
    sparkGeo.attributes.position.needsUpdate = true;

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
  <div class="heritage-three-wrap" ref="containerRef">
    <div class="holo-badge">
      <span class="dot"></span>
      <span>拱宸古桥 · 亚毫米级点云数字孪生全息模型</span>
    </div>
    <div class="three-hint">🖱️ 拖拽旋转 · 滚轮缩放查看 3D 古建点云</div>
  </div>
</template>

<style scoped lang="scss">
.heritage-three-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: radial-gradient(circle at 50% 50%, rgba(0, 229, 195, 0.1), rgba(4, 11, 26, 0.85));
}

.holo-badge {
  position: absolute;
  top: 14px;
  left: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px;
  background: rgba(6, 18, 42, 0.8);
  border: 1px solid rgba(0, 229, 195, 0.35);
  border-radius: 6px;
  font-size: 12px;
  color: #e2e8f0;
  pointer-events: none;

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #00e5c3;
    box-shadow: 0 0 8px #00e5c3;
  }
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
