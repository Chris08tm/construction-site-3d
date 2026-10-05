import { useEffect, useRef, useState } from 'react';
import { XIcon } from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { buildRoom } from '../utils/houseModels';
import type { RoomDesign } from '../types/house';

interface HouseViewerProps {
  room: RoomDesign;
  activeFeature: string | null;
  onSelectFeature: (id: string | null) => void;
  resetSignal: number;
}

export function HouseViewer({ room, activeFeature, onSelectFeature, resetSignal }: HouseViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const resetRef = useRef<(() => void) | null>(null);
  const [unsupported, setUnsupported] = useState(false);
  const featureIndex = room.features.findIndex(feature => feature.id === activeFeature);
  const feature = room.features[featureIndex];
  const dismissFeature = () => {
    onSelectFeature(null);
    markerRefs.current[featureIndex]?.focus({ preventScroll: true });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let disposed = false;
    let dirty = true;
    container.dataset.materials = 'loading';
    const invalidate = () => { dirty = true; };
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setUnsupported(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.AgXToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.className = 'room-canvas';
    renderer.domElement.setAttribute('aria-label', `3D cutaway of a furnished ${room.name.toLowerCase()}. Use arrow keys to rotate.`);
    renderer.domElement.tabIndex = 0;
    container.prepend(renderer.domElement);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#e5e3df');
    scene.environmentIntensity = 0.65;
    const pmrem = new THREE.PMREMGenerator(renderer);
    let environment: THREE.WebGLRenderTarget | undefined;
    const environmentReady = new RGBELoader().loadAsync('/materials/studio.hdr').then(texture => {
      if (!disposed) {
        environment = pmrem.fromEquirectangular(texture);
        scene.environment = environment.texture;
        scene.environmentRotation.y = 0.6;
        invalidate();
      }
      texture.dispose();
    }).catch(() => { /* Direct lights remain usable if the environment cannot load. */ });
    const camera = new THREE.OrthographicCamera(-4, 4, 3, -3, 0.1, 60);
    const controls = new OrbitControls(camera, renderer.domElement);
    renderer.domElement.style.touchAction = 'pan-y';
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.addEventListener('change', invalidate);
    controls.minPolarAngle = Math.PI / 6;
    controls.maxPolarAngle = Math.PI / 2.65;
    // Keep both open faces of the cutaway in view.
    controls.minAzimuthAngle = 0.05;
    controls.maxAzimuthAngle = Math.PI / 2 - 0.05;
    const reset = () => {
      camera.position.set(8, 7, 10);
      controls.target.set(0, 0.9, 0);
      controls.update();
    };
    reset(); resetRef.current = reset;
    const onKey = (event: KeyboardEvent) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home'].includes(event.key)) return;
      event.preventDefault();
      if (event.key === 'Home') { reset(); return; }
      const spherical = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
      if (event.key === 'ArrowLeft') spherical.theta -= 0.12;
      if (event.key === 'ArrowRight') spherical.theta += 0.12;
      if (event.key === 'ArrowUp') spherical.phi -= 0.1;
      if (event.key === 'ArrowDown') spherical.phi += 0.1;
      camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(spherical));
      controls.update();
    };
    renderer.domElement.addEventListener('keydown', onKey);
    scene.add(new THREE.HemisphereLight('#eef3f5', '#a2998c', 0.75));
    const sun = new THREE.DirectionalLight('#fff6e8', 2.8);
    sun.position.set(1, 7, 5); sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 0.5, far: 30 });
    sun.shadow.normalBias = 0.025; sun.shadow.bias = -0.0001;
    sun.shadow.radius = 4;
    scene.add(sun);
    const fill = new THREE.DirectionalLight('#e2ecff', 0.65);
    fill.position.set(-3, 4, -2); scene.add(fill);
    const model = buildRoom(room); scene.add(model.root);
    Promise.all([model.ready, environmentReady]).then(() => {
      if (!disposed) { container.dataset.materials = 'ready'; invalidate(); }
    });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color: '#dedcd6', roughness: 0.96 }));
    ground.rotation.x = -Math.PI / 2; ground.position.y = -0.16; ground.receiveShadow = true; scene.add(ground);
    const resize = () => {
      const width = container.clientWidth, height = container.clientHeight;
      if (!width || !height) return;
      const aspect = width / height;
      const halfHeight = Math.max(3.05, (room.width * 0.73 + 0.5) / aspect);
      camera.left = -halfHeight * aspect; camera.right = halfHeight * aspect;
      camera.top = halfHeight; camera.bottom = -halfHeight;
      camera.updateProjectionMatrix(); renderer.setSize(width, height, false);
      invalidate();
    };
    resize();
    const observer = new ResizeObserver(resize); observer.observe(container);
    let visible = true;
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    intersection.observe(container);
    const points = room.features.map(feature => new THREE.Vector3(...feature.position));
    const projected = new THREE.Vector3();
    let frame = 0;
    const draw = () => {
      frame = requestAnimationFrame(draw);
      if (!visible || document.hidden) return;
      controls.update();
      if (!dirty) return;
      renderer.render(scene, camera);
      dirty = false;
      points.forEach((point, i) => {
        const marker = markerRefs.current[i];
        if (!marker) return;
        projected.copy(point).project(camera);
        marker.style.left = `${(projected.x + 1) / 2 * 100}%`;
        marker.style.top = `${(1 - projected.y) / 2 * 100}%`;
        marker.style.visibility = projected.z < 1 ? 'visible' : 'hidden';
      });
    };
    draw();
    const contextLost = (event: Event) => { event.preventDefault(); setUnsupported(true); };
    renderer.domElement.addEventListener('webglcontextlost', contextLost);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame); observer.disconnect(); intersection.disconnect();
      resetRef.current = null;
      renderer.domElement.removeEventListener('keydown', onKey);
      renderer.domElement.removeEventListener('webglcontextlost', contextLost);
      controls.removeEventListener('change', invalidate);
      controls.dispose(); model.dispose(); ground.geometry.dispose(); ground.material.dispose();
      environment?.dispose(); pmrem.dispose();
      sun.shadow.dispose(); renderer.dispose(); renderer.domElement.remove();
    };
  }, [room]);

  useEffect(() => { resetRef.current?.(); }, [resetSignal]);

  return <div className="room-viewer relative flex h-full w-full flex-col pb-[288px] sm:pb-0" onKeyDown={event => {
    if (event.key === 'Escape' && feature) { event.stopPropagation(); dismissFeature(); }
  }}>
    <div ref={containerRef} className="relative min-h-0 w-full flex-1">
      {unsupported ? <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
        <p className="max-w-xs text-sm leading-relaxed text-muted">The 3D preview is unavailable in this browser. Select a feature here or <a href="#about" className="underline underline-offset-2">view the sample floor plan</a>.</p>
        <div className="flex flex-wrap justify-center gap-2">
          {room.features.map((item, i) => <button key={item.id} ref={element => { markerRefs.current[i] = element; }} type="button" onClick={() => onSelectFeature(item.id)} aria-expanded={activeFeature === item.id} className="rounded-lg border border-line bg-white px-3 py-2 text-xs">{String(i + 1).padStart(2, '0')} · {item.title}</button>)}
        </div>
      </div> : room.features.map((item, i) => <button
        key={`${room.id}-${item.id}`} ref={element => { markerRefs.current[i] = element; }}
        type="button" onClick={() => onSelectFeature(item.id)}
        aria-label={`Explore ${item.title}`} aria-pressed={activeFeature === item.id}
        aria-expanded={activeFeature === item.id} aria-controls={activeFeature === item.id ? 'room-feature-detail' : undefined}
        className={`room-marker ${activeFeature === item.id ? 'is-active' : ''}`}>
        <span>{String(i + 1).padStart(2, '0')}</span>
      </button>)}
    </div>
    {feature && <div id="room-feature-detail" role="region" aria-label={`${feature.title} details`} aria-live="polite" aria-atomic="true" className="absolute inset-x-3 bottom-3 z-10 flex h-[264px] flex-col rounded-xl border border-white/80 bg-white/95 p-4 shadow-lg backdrop-blur-sm sm:inset-x-auto sm:bottom-4 sm:right-4 sm:h-[240px] sm:w-[310px] sm:p-5">
      <div className="flex shrink-0 items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent font-mono text-xs text-white">{String(featureIndex + 1).padStart(2, '0')}</span>
        <div className="min-w-0 flex-1 pt-1"><h3 className="text-sm font-semibold text-ink">{feature.title}</h3><p className="mt-2 font-mono text-[10px] leading-relaxed text-blueprint">{feature.material}</p></div>
        <button type="button" onClick={dismissFeature} aria-label="Close feature details" className="-mr-2 -mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-paper hover:text-ink"><XIcon size={17} aria-hidden="true" /></button>
      </div>
      <p tabIndex={0} className="mt-3 min-h-0 overflow-y-auto text-sm leading-relaxed text-muted">{feature.description}</p>
    </div>}
  </div>;
}
