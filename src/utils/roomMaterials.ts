import * as THREE from 'three';

/** Locally served, photographed PBR surfaces; source/license details live beside the assets. */
export function createRoomMaterials() {
  const textures: THREE.Texture[] = [];
  const materials: THREE.Material[] = [];
  const manager = new THREE.LoadingManager();
  let disposed = false;
  let finish: (() => void) | undefined;
  const ready = new Promise<void>(resolve => { finish = resolve; });
  manager.onLoad = () => finish?.();
  const loader = new THREE.TextureLoader(manager);
  const texture = (file: string, color = false) => {
    const t = loader.load(`/materials/${file}`, loaded => { if (disposed) loaded.dispose(); });
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 4;
    if (color) t.colorSpace = THREE.SRGBColorSpace;
    textures.push(t);
    return t;
  };
  const physical = (parameters: THREE.MeshPhysicalMaterialParameters, scale = 1) => {
    const material = new THREE.MeshPhysicalMaterial(parameters);
    material.userData.textureScale = scale;
    materials.push(material);
    return material;
  };
  const oakMap = texture('oak-color.jpg', true);
  const oakNormal = texture('oak-normal.jpg');
  const oakRoughness = texture('oak-roughness.jpg');
  const fabricNormal = texture('fabric-normal.jpg');
  const stoneMap = texture('stone-color.jpg', true);
  const stoneNormal = texture('stone-normal.jpg');
  const stoneRoughness = texture('stone-roughness.jpg');
  const oak = physical({ map: oakMap, normalMap: oakNormal, normalScale: new THREE.Vector2(0.16, 0.16), roughnessMap: oakRoughness, roughness: 0.65, clearcoat: 0.12, clearcoatRoughness: 0.5 }, 1.8);
  const floor = physical({ map: texture('floor-color.jpg', true), normalMap: texture('floor-normal.jpg'), normalScale: new THREE.Vector2(0.3, 0.3), roughnessMap: texture('floor-roughness.jpg'), roughness: 0.75, clearcoat: 0.2, clearcoatRoughness: 0.4 }, 1.2);
  const tile = physical({ map: stoneMap, normalMap: stoneNormal, normalScale: new THREE.Vector2(0.16, 0.16), roughnessMap: stoneRoughness, roughness: 0.85 }, 1.5);
  const fabric = (color: string) => physical({ color, normalMap: fabricNormal, normalScale: new THREE.Vector2(0.22, 0.22), roughness: 0.96, sheen: 0.6, sheenRoughness: 0.8, sheenColor: new THREE.Color('#ded5c6') }, 0.35);
  const wall = physical({ color: '#e6e3dc', roughness: 0.93 });
  const ceramic = physical({ color: '#f5f3ee', roughness: 0.18, clearcoat: 0.65, clearcoatRoughness: 0.1 });
  const quartz = physical({ color: '#edece7', roughness: 0.24, clearcoat: 0.4, clearcoatRoughness: 0.25 });
  const metal = physical({ color: '#9c8661', metalness: 0.94, roughness: 0.28 });
  const steel = physical({ color: '#b5b8b8', metalness: 0.97, roughness: 0.24 });
  const dark = physical({ color: '#242928', roughness: 0.48, metalness: 0.12 });
  const sage = physical({ color: '#56615b', roughness: 0.6 });
  const glass = physical({ color: '#edf6f3', transmission: 0.94, thickness: 0.008, roughness: 0.06, ior: 1.5, transparent: true, opacity: 0.4, depthWrite: false });
  const window = physical({ color: '#d5e2e1', roughness: 0.08, metalness: 0.2, transmission: 0.25, thickness: 0.025, clearcoat: 1 });
  const blackGlass = physical({ color: '#101717', roughness: 0.15, metalness: 0.25, clearcoat: 1 });
  const warmLight = physical({ color: '#fff2d7', emissive: '#ffdba6', emissiveIntensity: 1.2, roughness: 0.7 });
  return {
    oak, floor, tile, wall, ceramic, quartz, metal, steel, dark, sage, glass, window, blackGlass, warmLight,
    linen: fabric('#d4cbbb'), whiteFabric: fabric('#eee9df'), throwFabric: fabric('#777a6c'), rug: fabric('#c4bbaa'),
    ready,
    dispose() { disposed = true; materials.forEach(m => m.dispose()); textures.forEach(t => t.dispose()); },
  };
}
