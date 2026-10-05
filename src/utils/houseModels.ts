import * as THREE from 'three';
import type { HouseDesignId } from '../types/house';

export interface HouseLevel {
  group: THREE.Group;
  explodeOffset: number;
}

export interface HouseModel {
  root: THREE.Group;
  levels: HouseLevel[];
}

type Materials = ReturnType<typeof createMaterials>;

export function buildHouse(id: HouseDesignId, edgeMaterial: THREE.LineBasicMaterial): HouseModel {
  const mats = createMaterials();
  const model = id === 'modern' ? buildModern(mats) : id === 'farmhouse' ? buildFarmhouse(mats) : buildAFrame(mats);

  model.levels.forEach((level) => model.root.add(level.group));

  model.root.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.userData.baseMaterial = obj.material;
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(obj.geometry, 25), edgeMaterial);
      edges.visible = false;
      obj.add(edges);
    }
  });

  return model;
}

export function disposeHouse(model: HouseModel) {
  model.root.traverse((obj) => {
    if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) {
      obj.geometry.dispose();
    }
    if (obj instanceof THREE.Mesh) {
      const base = obj.userData.baseMaterial as THREE.Material | undefined;
      base?.dispose();
    }
  });
}

function createMaterials() {
  return {
    wall: new THREE.MeshStandardMaterial({ color: '#F2EFE8', roughness: 0.9 }),
    cedar: new THREE.MeshStandardMaterial({ color: '#9C6B43', roughness: 0.75 }),
    charcoal: new THREE.MeshStandardMaterial({ color: '#2B3038', roughness: 0.6 }),
    metal: new THREE.MeshStandardMaterial({ color: '#33383F', roughness: 0.45, metalness: 0.35 }),
    glass: new THREE.MeshStandardMaterial({
      color: '#8FB2CA',
      roughness: 0.1,
      metalness: 0.25,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    }),
    concrete: new THREE.MeshStandardMaterial({ color: '#C8C5BD', roughness: 0.95 }),
    floor: new THREE.MeshStandardMaterial({ color: '#D9C8AE', roughness: 0.8 }),
    soft: new THREE.MeshStandardMaterial({ color: '#B8B1A5', roughness: 0.95 }),
    solar: new THREE.MeshStandardMaterial({ color: '#1C2A3D', roughness: 0.3, metalness: 0.5 }),
    stone: new THREE.MeshStandardMaterial({ color: '#8E877C', roughness: 1 })
  };
}

function addMesh(parent: THREE.Object3D, geometry: THREE.BufferGeometry, material: THREE.Material, x: number, y: number, z: number) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

/** Box positioned by its bottom face (y = bottom). */
function box(parent: THREE.Object3D, w: number, h: number, d: number, mat: THREE.Material, x: number, y: number, z: number) {
  return addMesh(parent, new THREE.BoxGeometry(w, h, d), mat, x, y + h / 2, z);
}

/** Four hollow walls so interiors are visible when upper levels lift away. */
function shell(parent: THREE.Object3D, w: number, h: number, d: number, mat: THREE.Material, x: number, y: number, z: number, t = 0.2) {
  box(parent, w, h, t, mat, x, y, z + d / 2 - t / 2);
  box(parent, w, h, t, mat, x, y, z - d / 2 + t / 2);
  box(parent, t, h, d - 2 * t, mat, x - w / 2 + t / 2, y, z);
  box(parent, t, h, d - 2 * t, mat, x + w / 2 - t / 2, y, z);
}

function buildModern(m: Materials): HouseModel {
  const root = new THREE.Group();
  const ground = new THREE.Group();
  const upper = new THREE.Group();
  const roof = new THREE.Group();

  // Ground floor
  box(ground, 10.4, 0.3, 7.4, m.concrete, 0, 0, 0);
  box(ground, 9.6, 0.04, 6.6, m.floor, 0, 0.3, 0);
  shell(ground, 9.6, 3, 6.6, m.wall, 0, 0.3, 0);
  box(ground, 5.2, 2.5, 0.06, m.glass, -1.6, 0.5, 3.33);
  [-4.2, -2.9, -1.6, -0.3, 1.0].forEach((x) => box(ground, 0.07, 2.5, 0.09, m.charcoal, x, 0.5, 3.34));
  box(ground, 1.1, 2.3, 0.08, m.cedar, 2.9, 0.3, 3.34);
  box(ground, 0.06, 2.2, 3.6, m.glass, 4.83, 0.6, -0.6);
  box(ground, 0.15, 3, 3.4, m.wall, 1.4, 0.3, -1.4);
  box(ground, 2.6, 0.55, 0.9, m.soft, -2.2, 0.34, 0.9);
  box(ground, 1.8, 0.75, 1, m.cedar, -2.2, 0.34, -1.6);
  box(ground, 2.2, 0.95, 0.9, m.charcoal, 3, 0.34, -0.4);
  box(ground, 4.2, 0.15, 2.4, m.cedar, -2.4, 0, 4.9);

  // Upper floor (cantilevered)
  box(upper, 10.4, 0.25, 6.2, m.concrete, 0.8, 3.3, -0.2);
  shell(upper, 10.4, 2.7, 6.2, m.cedar, 0.8, 3.55, -0.2);
  box(upper, 6.5, 1.3, 0.06, m.glass, 0.3, 4.25, 2.93);
  [-1.9, 0.3, 2.5].forEach((x) => box(upper, 0.07, 1.3, 0.09, m.charcoal, x, 4.25, 2.94));
  box(upper, 0.15, 2.7, 5.8, m.wall, 0.8, 3.55, -0.2);
  box(upper, 1.8, 0.5, 2.1, m.soft, -2.2, 3.55, -1.2);
  box(upper, 1.8, 0.5, 2.1, m.soft, 3.6, 3.55, -1.2);

  // Roof
  box(roof, 11, 0.3, 6.8, m.charcoal, 0.8, 6.25, -0.2);
  [-2.2, 0.4, 3.0].forEach((x) => {
    const panel = box(roof, 2.2, 0.08, 3.2, m.solar, x, 6.7, -0.6);
    panel.rotation.x = -0.12;
  });

  return {
    root,
    levels: [
    { group: ground, explodeOffset: 0 },
    { group: upper, explodeOffset: 2.6 },
    { group: roof, explodeOffset: 5.2 }]

  };
}

function buildFarmhouse(m: Materials): HouseModel {
  const root = new THREE.Group();
  const ground = new THREE.Group();
  const roof = new THREE.Group();

  box(ground, 11, 0.3, 8, m.stone, 0, 0, 0);
  box(ground, 10, 0.04, 7, m.floor, 0, 0.3, 0);
  shell(ground, 10, 3, 7, m.wall, 0, 0.3, 0);

  [-3.6, -1.8, 1.8, 3.6].forEach((x) => {
    box(ground, 1.3, 1.7, 0.05, m.charcoal, x, 0.95, 3.52);
    box(ground, 1.1, 1.5, 0.06, m.glass, x, 1.05, 3.55);
  });
  box(ground, 1.1, 2.3, 0.08, m.cedar, 0, 0.3, 3.54);
  [-1.5, 1.5].forEach((z) => {
    box(ground, 0.05, 1.7, 1.3, m.charcoal, 5.02, 0.95, z);
    box(ground, 0.06, 1.5, 1.1, m.glass, 5.05, 1.05, z);
  });

  // Porch
  box(ground, 10, 0.2, 2.4, m.cedar, 0, 0, 4.7);
  [-4.7, -1.6, 1.6, 4.7].forEach((x) => box(ground, 0.24, 2.9, 0.24, m.cedar, x, 0.2, 5.7));
  const porchRoof = box(ground, 10.6, 0.15, 2.9, m.metal, 0, 3.05, 4.9);
  porchRoof.rotation.x = 0.18;

  // Interior
  box(ground, 0.15, 3, 3.2, m.wall, -1.4, 0.3, -1.9);
  box(ground, 4.2, 3, 0.15, m.wall, 2.8, 0.3, -0.6);
  box(ground, 1.8, 0.5, 2, m.soft, -3.3, 0.34, -2.1);
  box(ground, 2.6, 0.55, 0.9, m.soft, 0.6, 0.34, 1.6);
  box(ground, 2.4, 0.95, 0.8, m.charcoal, 3, 0.34, 1.2);

  // Gable roof
  const shape = new THREE.Shape();
  shape.moveTo(-4.1, 0);
  shape.lineTo(4.1, 0);
  shape.lineTo(0, 3.2);
  shape.closePath();
  const gable = new THREE.ExtrudeGeometry(shape, { depth: 11, bevelEnabled: false });
  gable.translate(0, 0, -5.5);
  const roofMesh = addMesh(roof, gable, m.metal, 0, 3.3, 0);
  roofMesh.rotation.y = Math.PI / 2;
  box(roof, 0.8, 2.4, 0.8, m.stone, 3, 4.4, -1.1);

  return {
    root,
    levels: [
    { group: ground, explodeOffset: 0 },
    { group: roof, explodeOffset: 4.2 }]

  };
}

function buildAFrame(m: Materials): HouseModel {
  const root = new THREE.Group();
  const ground = new THREE.Group();
  const roof = new THREE.Group();

  box(ground, 8.6, 0.4, 9.6, m.concrete, 0, 0, 0);
  box(ground, 8, 0.04, 9, m.floor, 0, 0.4, 0);
  box(ground, 8.6, 0.15, 2.6, m.cedar, 0, 0.25, 6.1);

  // Loft and interior
  box(ground, 4.4, 0.2, 4.4, m.cedar, 0, 3.2, -2.3);
  [-2, 2].forEach((x) => box(ground, 0.16, 2.8, 0.16, m.cedar, x, 0.4, -0.15));
  box(ground, 1.8, 0.4, 2, m.soft, 0, 3.4, -2.6);
  box(ground, 2.6, 0.55, 0.9, m.soft, 0, 0.44, 1.6);
  box(ground, 3, 0.95, 0.7, m.charcoal, 0, 0.44, -4);
  box(ground, 1.4, 0.45, 0.9, m.cedar, 0, 0.44, 3);

  // Roof shell
  const halfBase = 4.3;
  const rise = 6.6;
  const length = Math.hypot(halfBase, rise);
  const angle = Math.atan2(rise, halfBase);
  const left = addMesh(roof, new THREE.BoxGeometry(length, 0.25, 9.8), m.metal, -halfBase / 2, 0.4 + rise / 2, 0);
  left.rotation.z = angle;
  const right = addMesh(roof, new THREE.BoxGeometry(length, 0.25, 9.8), m.metal, halfBase / 2, 0.4 + rise / 2, 0);
  right.rotation.z = -angle;

  const tri = new THREE.Shape();
  tri.moveTo(-3.9, 0);
  tri.lineTo(3.9, 0);
  tri.lineTo(0, 6);
  tri.closePath();
  addMesh(roof, new THREE.ShapeGeometry(tri), m.glass, 0, 0.4, 4.55);
  const backMaterial = m.cedar.clone();
  backMaterial.side = THREE.DoubleSide;
  addMesh(roof, new THREE.ShapeGeometry(tri), backMaterial, 0, 0.4, -4.55);
  box(roof, 0.08, 6, 0.08, m.charcoal, 0, 0.4, 4.6);
  box(roof, 4.6, 0.08, 0.08, m.charcoal, 0, 3.3, 4.6);

  return {
    root,
    levels: [
    { group: ground, explodeOffset: 0 },
    { group: roof, explodeOffset: 4 }]

  };
}