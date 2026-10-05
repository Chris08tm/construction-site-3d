import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { buildHouse, disposeHouse, type HouseModel } from '../utils/houseModels';
import type { HouseDesignId, ViewMode } from '../types/house';

interface HouseViewerProps {
  designId: HouseDesignId;
  mode: ViewMode;
  exploded: boolean;
  resetSignal: number;
}

interface ViewerState {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  ground: THREE.Mesh;
  renderGrid: THREE.GridHelper;
  blueprintGrid: THREE.GridHelper;
  edgeMaterial: THREE.LineBasicMaterial;
  blueprintMaterial: THREE.MeshBasicMaterial;
  model: HouseModel | null;
}

const CAMERA_HOME = new THREE.Vector3(17, 11, 19);
const TARGET_HOME = new THREE.Vector3(0, 2.8, 0);
const RENDER_BG = '#ECEAE4';
const BLUEPRINT_BG = '#0B2650';

export function HouseViewer({ designId, mode, exploded, resetSignal }: HouseViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<ViewerState | null>(null);
  const explodedRef = useRef(exploded);
  const [unsupported, setUnsupported] = useState(false);

  explodedRef.current = exploded;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true });
    } catch {
      setUnsupported(true);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.cursor = 'grab';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(RENDER_BG);
    scene.fog = new THREE.Fog(RENDER_BG, 38, 75);

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);
    camera.position.copy(CAMERA_HOME);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(TARGET_HOME);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minPolarAngle = 0.25;
    controls.maxPolarAngle = Math.PI / 2.12;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    controls.autoRotate = !reduceMotion;
    controls.autoRotateSpeed = 0.6;
    const stopAutoRotate = () => {
      controls.autoRotate = false;
      renderer.domElement.style.cursor = 'grabbing';
    };
    const endDrag = () => {
      renderer.domElement.style.cursor = 'grab';
    };
    controls.addEventListener('start', stopAutoRotate);
    controls.addEventListener('end', endDrag);

    scene.add(new THREE.HemisphereLight('#ffffff', '#b9b3a6', 1.15));
    const sun = new THREE.DirectionalLight('#fff3e2', 2.3);
    sun.position.set(12, 20, 10);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -16;
    sun.shadow.camera.right = 16;
    sun.shadow.camera.top = 16;
    sun.shadow.camera.bottom = -16;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 60;
    sun.shadow.bias = -0.0005;
    scene.add(sun);

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(40, 64),
      new THREE.MeshStandardMaterial({ color: '#E2DFD7', roughness: 1 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const renderGrid = new THREE.GridHelper(60, 60, '#CFCBC0', '#D9D6CD');
    renderGrid.position.y = 0.01;
    scene.add(renderGrid);

    const blueprintGrid = new THREE.GridHelper(60, 60, '#4673BA', '#1C437F');
    blueprintGrid.visible = false;
    scene.add(blueprintGrid);

    const state: ViewerState = {
      renderer,
      scene,
      camera,
      controls,
      ground,
      renderGrid,
      blueprintGrid,
      edgeMaterial: new THREE.LineBasicMaterial({ color: '#D6E6FF' }),
      blueprintMaterial: new THREE.MeshBasicMaterial({
        color: '#2A62B5',
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
        side: THREE.DoubleSide
      }),
      model: null
    };
    stateRef.current = state;

    const resize = () => {
      const { clientWidth, clientHeight } = container;
      if (!clientWidth || !clientHeight) return;
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    let visible = true;
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    intersectionObserver.observe(container);

    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (!visible) return;
      const model = state.model;
      if (model) {
        model.levels.forEach((level) => {
          const target = explodedRef.current ? level.explodeOffset : 0;
          const current = level.group.position.y;
          level.group.position.y = reduceMotion ? target : current + (target - current) * 0.14;
        });
      }
      controls.update();
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      controls.removeEventListener('start', stopAutoRotate);
      controls.removeEventListener('end', endDrag);
      controls.dispose();
      if (state.model) disposeHouse(state.model);
      ground.geometry.dispose();
      (ground.material as THREE.Material).dispose();
      renderGrid.dispose();
      blueprintGrid.dispose();
      state.edgeMaterial.dispose();
      state.blueprintMaterial.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) container.removeChild(renderer.domElement);
      stateRef.current = null;
    };
  }, []);

  useEffect(() => {
    const state = stateRef.current;
    if (!state) return;
    if (state.model) {
      state.scene.remove(state.model.root);
      disposeHouse(state.model);
    }
    const model = buildHouse(designId, state.edgeMaterial);
    if (explodedRef.current) {
      model.levels.forEach((level) => level.group.position.y = level.explodeOffset);
    }
    state.scene.add(model.root);
    state.model = model;
  }, [designId]);

  useEffect(() => {
    const state = stateRef.current;
    if (state) applyMode(state, mode);
  }, [mode, designId]);

  useEffect(() => {
    const state = stateRef.current;
    if (!state || resetSignal === 0) return;
    state.camera.position.copy(CAMERA_HOME);
    state.controls.target.copy(TARGET_HOME);
    state.controls.update();
  }, [resetSignal]);

  if (unsupported) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-blueprint-deep p-8 text-center">
        <p className="max-w-xs text-sm text-blueprint-light">
          Your browser doesn’t support 3D previews. Request a quote and we’ll send full drawings for this design.
        </p>
      </div>);

  }

  return (
    <div
      ref={containerRef}
      className="h-full w-full touch-none"
      role="img"
      aria-label="Interactive 3D model of the selected house design. Drag to rotate." />);


}

function applyMode(state: ViewerState, mode: ViewMode) {
  const blueprint = mode === 'blueprint';
  const bg = blueprint ? BLUEPRINT_BG : RENDER_BG;
  state.scene.background = new THREE.Color(bg);
  if (state.scene.fog instanceof THREE.Fog) state.scene.fog.color.set(bg);
  state.ground.visible = !blueprint;
  state.renderGrid.visible = !blueprint;
  state.blueprintGrid.visible = blueprint;

  state.model?.root.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.material = blueprint ? state.blueprintMaterial : obj.userData.baseMaterial as THREE.Material;
      obj.castShadow = !blueprint;
    } else if (obj instanceof THREE.LineSegments) {
      obj.visible = blueprint;
    }
  });
}