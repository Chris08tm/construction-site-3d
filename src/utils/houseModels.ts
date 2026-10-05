import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { createRoomMaterials } from './roomMaterials';
import type { RoomDesign } from '../types/house';

export interface RoomModel { root: THREE.Group; ready: Promise<void>; dispose: () => void }

export function buildRoom(room: RoomDesign): RoomModel {
  const root = new THREE.Group();
  const m = createRoomMaterials();
  const reflections: Reflector[] = [];
  const w = room.width, d = room.depth, back = -d / 2;

  // Use physical surface dimensions so grain and tile don't stretch across differently sized objects.
  const uvInMeters = (geometry: THREE.BufferGeometry, material: THREE.Material, offset = 0) => {
    const scale = material.userData.textureScale ?? 1;
    const p = geometry.getAttribute('position'), n = geometry.getAttribute('normal'), uv = geometry.getAttribute('uv');
    if (!uv) return;
    for (let i = 0; i < p.count; i++) {
      const nx = Math.abs(n.getX(i)), ny = Math.abs(n.getY(i)), nz = Math.abs(n.getZ(i));
      const u = nx > ny && nx > nz ? p.getZ(i) : p.getX(i);
      const v = ny > nx && ny > nz ? p.getZ(i) : p.getY(i);
      uv.setXY(i, u / scale + offset, v / scale);
    }
  };
  const mesh = (g: THREE.BufferGeometry, material: THREE.Material, x: number, y: number, z: number, name = '') => {
    const object = new THREE.Mesh(g, material);
    object.position.set(x, y, z); object.castShadow = true; object.receiveShadow = true; object.name = name;
    root.add(object); return object;
  };
  const box = (width: number, height: number, depth: number, material: THREE.Material, x: number, y: number, z: number, radius = 0.004, name = '') => {
    const g = radius ? new RoundedBoxGeometry(width, height, depth, 2, radius) : new THREE.BoxGeometry(width, height, depth);
    uvInMeters(g, material, x * 0.17 + z * 0.31);
    return mesh(g, material, x, y + height / 2, z, name);
  };
  const cylinder = (r: number, height: number, material: THREE.Material, x: number, y: number, z: number, r2 = r) => mesh(new THREE.CylinderGeometry(r, r2, height, 40), material, x, y + height / 2, z);
  const tube = (points: number[][], radius: number, material: THREE.Material) => {
    const path = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(p[0], p[1], p[2])));
    return mesh(new THREE.TubeGeometry(path, 32, radius, 10, false), material, 0, 0, 0);
  };
  const ring = (radius: number, thickness: number, material: THREE.Material, x: number, y: number, z: number, oval = 1) => {
    const object = mesh(new THREE.TorusGeometry(radius, thickness, 12, 48), material, x, y, z);
    object.rotation.x = -Math.PI / 2; object.scale.y = oval; return object;
  };
  const lathe = (profile: number[][], material: THREE.Material, x: number, y: number, z: number) => mesh(new THREE.LatheGeometry(profile.map(p => new THREE.Vector2(p[0], p[1])), 48), material, x, y, z);
  const handle = (x: number, y: number, z: number, width = 0.22) => {
    [-width / 2, width / 2].forEach(dx => box(0.012, 0.014, 0.035, m.metal, x + dx, y, z));
    box(width + 0.012, 0.012, 0.012, m.metal, x, y, z + 0.023);
  };
  const faucet = (x: number, y: number, z: number, height = 0.32) => {
    cylinder(0.026, 0.025, m.steel, x, y, z);
    tube([[x, y + 0.025, z], [x, y + height - 0.07, z], [x, y + height, z + 0.07], [x, y + height - 0.015, z + 0.17], [x, y + height - 0.1, z + 0.18]], 0.013, m.steel);
    box(0.055, 0.012, 0.016, m.steel, x + 0.025, y + 0.1, z);
  };
  const plant = (x: number, z: number) => {
    lathe([[0, 0], [0.14, 0], [0.2, 0.32], [0.195, 0.35], [0.175, 0.35], [0.12, 0.045], [0, 0.045]], m.ceramic, x, 0.025, z);
    cylinder(0.17, 0.01, m.dark, x, 0.29, z);
    tube([[x, 0.3, z], [x + 0.025, 0.8, z], [x - 0.03, 1.35, z + 0.02]], 0.012, m.oak);
    for (let i = 0; i < 16; i++) {
      const angle = i * 2.4, height = 0.58 + i * 0.045;
      const ex = x + Math.cos(angle) * 0.23, ez = z + Math.sin(angle) * 0.23;
      tube([[x, height - 0.07, z], [ex, height + 0.1, ez]], 0.004, m.sage);
      const leaf = new THREE.SphereGeometry(1, 16, 12);
      const object = mesh(leaf, m.sage, ex, height + 0.12, ez);
      object.scale.set(0.09, 0.19, 0.012); object.rotation.set(0.35, -angle, 0.5);
    }
  };

  // Architectural shell: real window openings, baseboard profiles, and two cutaway faces.
  box(w + 0.2, 0.15, d + 0.2, m.wall, 0, -0.15, 0, 0.008);
  box(w, 0.025, d, room.id === 'bathroom' ? m.tile : m.floor, 0, 0, 0, 0, 'finished-floor');
  if (room.id === 'bedroom') {
    box(0.13, 2.65, d / 2 + 0.7, m.wall, -w / 2 - 0.065, 0, (back + 0.7) / 2, 0);
    box(0.13, 0.55, 0.9, m.wall, -w / 2 - 0.065, 2.1, 1.15, 0);
    box(0.13, 2.65, d / 2 - 1.6, m.wall, -w / 2 - 0.065, 0, (1.6 + d / 2) / 2, 0);
    [0.7, 1.6].forEach(z => box(0.15, 2.15, 0.06, m.ceramic, -w / 2 - 0.035, 0, z));
    box(0.15, 0.06, 0.96, m.ceramic, -w / 2 - 0.035, 2.1, 1.15);
  } else {
    box(0.13, 2.65, d + 0.13, m.wall, -w / 2 - 0.065, 0, 0, 0);
  }
  if (room.id === 'bathroom') {
    box(w, 2.65, 0.13, m.wall, 0, 0, back - 0.065, 0);
  } else {
    const wx = room.id === 'bedroom' ? 1.52 : 0.35;
    const ww = room.id === 'bedroom' ? 1.15 : 1.7;
    const left = wx - ww / 2, right = wx + ww / 2, bottom = 1.2, height = 1.12;
    box(left + w / 2, 2.65, 0.13, m.wall, (-w / 2 + left) / 2, 0, back - 0.065, 0);
    box(w / 2 - right, 2.65, 0.13, m.wall, (right + w / 2) / 2, 0, back - 0.065, 0);
    box(ww, bottom, 0.13, m.wall, wx, 0, back - 0.065, 0);
    box(ww, 2.65 - bottom - height, 0.13, m.wall, wx, bottom + height, back - 0.065, 0);
    const pane = box(ww, height, 0.012, m.window, wx, bottom, back - 0.035, 0);
    pane.castShadow = false;
    [left, wx, right].forEach(x => box(0.035, height, 0.07, m.dark, x, bottom, back));
    [bottom, bottom + height].forEach(y => box(ww + 0.05, 0.035, 0.075, m.dark, wx, y, back));
    box(ww + 0.16, 0.03, 0.2, m.quartz, wx, bottom - 0.025, back + 0.03);
    box(0.014, 0.12, 0.025, m.steel, wx + 0.045, 1.48, back + 0.03);
  }
  box(w, 0.11, 0.02, m.ceramic, 0, 0.025, back + 0.015);
  const skirtingLength = room.id === 'bedroom' ? d / 2 + 0.7 : d;
  box(0.02, 0.11, skirtingLength, m.ceramic, -w / 2 + 0.015, 0.025, room.id === 'bedroom' ? (back + 0.7) / 2 : 0);

  if (room.id === 'kitchen') {
    // Flush full-height pantry and integrated refrigerator, with no obstructing shelves.
    [-2.05, -1.33].forEach((x, i) => {
      box(0.7, 2.4, 0.62, m.dark, x, 0.08, back + 0.33);
      box(0.69, 1.44, 0.025, m.oak, x, 0.98, back + 0.657, 0.003, i ? 'integrated-fridge' : 'pantry-door');
      box(0.69, 0.87, 0.025, m.oak, x, 0.1, back + 0.657);
      box(0.014, 0.38, 0.024, m.metal, x + 0.23, 1.1, back + 0.69);
      handle(x, 0.88, back + 0.684, 0.25);
      box(0.7, 0.08, 0.55, m.dark, x, 0.025, back + 0.31);
    });
    // Recessed plinth and drawer fronts sit below a 30 mm worktop.
    box(3.12, 0.09, 0.51, m.dark, 0.59, 0.025, back + 0.3);
    for (let i = 0; i < 4; i++) {
      const x = -0.58 + i * 0.78;
      box(0.772, 0.78, 0.6, m.oak, x, 0.12, back + 0.33);
      [0.15, 0.41, 0.67].forEach(y => {
        box(0.762, 0.25, 0.02, m.oak, x, y, back + 0.65);
        handle(x, y + 0.2, back + 0.674);
      });
    }
    // Actual countertop opening, with the sink below its rim.
    const cx = 0.59, cz = back + 0.355, cw = 3.17, cd = 0.7, sx = 0.3, sz = back + 0.36;
    const shape = new THREE.Shape();
    shape.moveTo(-cw / 2, -cd / 2); shape.lineTo(cw / 2, -cd / 2); shape.lineTo(cw / 2, cd / 2); shape.lineTo(-cw / 2, cd / 2); shape.closePath();
    const hole = new THREE.Path();
    const hx = sx - cx, hz = cz - sz;
    hole.moveTo(hx - 0.3, hz - 0.215); hole.lineTo(hx - 0.3, hz + 0.215); hole.lineTo(hx + 0.3, hz + 0.215); hole.lineTo(hx + 0.3, hz - 0.215); hole.closePath(); shape.holes.push(hole);
    const countertop = new THREE.ExtrudeGeometry(shape, { depth: 0.03, bevelEnabled: true, bevelSize: 0.002, bevelThickness: 0.002, bevelSegments: 2, steps: 1 });
    countertop.rotateX(-Math.PI / 2); mesh(countertop, m.quartz, cx, 0.91, cz, 'countertop-with-sink-opening');
    box(0.6, 0.015, 0.43, m.steel, sx, 0.74, sz, 0.005);
    [-0.295, 0.295].forEach(dx => box(0.015, 0.19, 0.43, m.steel, sx + dx, 0.75, sz));
    [-0.207, 0.207].forEach(dz => box(0.6, 0.19, 0.015, m.steel, sx, 0.75, sz + dz));
    cylinder(0.031, 0.002, m.dark, sx, 0.756, sz);
    faucet(sx, 0.94, back + 0.095);
    box(3.17, 0.25, 0.018, m.quartz, cx, 0.94, back + 0.013);
    // Induction hob, oven glazing and a wall-mounted extractor clear of the window.
    box(0.62, 0.014, 0.49, m.blackGlass, 1.61, 0.944, back + 0.37, 0.012);
    [1.46, 1.76].forEach(x => [back + 0.23, back + 0.49].forEach(z => ring(0.09, 0.0015, m.steel, x, 0.959, z)));
    box(0.58, 0.43, 0.015, m.blackGlass, 1.76, 0.21, back + 0.681, 0.009);
    handle(1.76, 0.61, back + 0.715, 0.42);
    box(0.66, 0.065, 0.44, m.steel, 1.65, 1.98, back + 0.25);
    box(0.31, 0.6, 0.23, m.steel, 1.65, 2.045, back + 0.14);
    box(0.44, 0.007, 0.035, m.warmLight, 1.65, 1.978, back + 0.39);
    // Waterfall island, clear prep aisle and tucked-in seating.
    box(1.99, 0.09, 0.66, m.dark, 0.1, 0.025, 0.48);
    box(2.03, 0.79, 0.77, m.sage, 0.1, 0.115, 0.49);
    box(2.22, 0.035, 1.03, m.quartz, 0.1, 0.915, 0.6);
    [-0.99, 1.19].forEach(x => box(0.035, 0.89, 1.03, m.quartz, x, 0.025, 0.6));
    for (let i = 0; i < 24; i++) box(0.014, 0.77, 0.01, m.sage, -0.88 + i * 0.084, 0.12, 0.88, 0.003);
    [-0.5, 0.58].forEach(x => {
      cylinder(0.205, 0.06, m.oak, x, 0.64, 1.36);
      const cushion = box(0.38, 0.04, 0.37, m.linen, x, 0.69, 1.36, 0.018); cushion.rotation.y = 0.05;
      [-0.145, 0.145].forEach(dx => [-0.145, 0.145].forEach(dz => tube([[x + dx * 1.25, 0.025, 1.36 + dz * 1.25], [x + dx, 0.65, 1.36 + dz]], 0.014, m.dark)));
      ring(0.175, 0.01, m.dark, x, 0.24, 1.36);
    });
    box(0.36, 0.018, 0.26, m.oak, -0.52, 0.953, 0.5, 0.03);
    lathe([[0, 0], [0.07, 0], [0.115, 0.04], [0.13, 0.085], [0.12, 0.085], [0.095, 0.042], [0, 0.025]], m.ceramic, -0.52, 0.973, 0.5);
    lathe([[0, 0], [0.075, 0], [0.095, 0.09], [0.06, 0.2], [0.04, 0.23], [0.033, 0.23], [0.055, 0.08], [0, 0.025]], m.ceramic, 0.7, 0.951, 0.42);
  }

  if (room.id === 'bathroom') {
    // Wet area occupies the rear-left corner. The rest of the rear wall carries the vanity and WC.
    box(1.09, 2.64, 0.018, m.tile, -0.965, 0.025, back + 0.015, 0);
    box(0.018, 2.64, 1.34, m.tile, -w / 2 + 0.015, 0.025, back + 0.67, 0);
    box(1.07, 0.035, 1.34, m.tile, -0.965, 0.025, back + 0.67);
    box(0.56, 0.28, 0.028, m.dark, -0.96, 1.08, back + 0.039, 0.006);
    box(0.56, 0.02, 0.13, m.quartz, -0.96, 1.08, back + 0.075);
    box(0.5, 0.006, 0.018, m.warmLight, -0.96, 1.34, back + 0.055);
    cylinder(0.035, 0.13, m.sage, -1.08, 1.1, back + 0.09);
    cylinder(0.03, 0.17, m.ceramic, -0.96, 1.1, back + 0.09);
    tube([[-0.965, 1.02, back + 0.1], [-0.965, 2.12, back + 0.1], [-0.965, 2.2, back + 0.2], [-0.965, 2.2, back + 0.48]], 0.011, m.steel);
    cylinder(0.145, 0.018, m.steel, -0.965, 2.17, back + 0.48);
    box(0.008, 2.12, 1.3, m.glass, -0.423, 0.06, back + 0.66, 0, 'shower-screen').castShadow = false;
    [0.2, 1.8].forEach(y => box(0.03, 0.04, 0.025, m.steel, -0.423, y, back + 0.025));
    box(0.012, 0.012, 1.3, m.steel, -0.423, 2.18, back + 0.66);
    box(0.8, 0.004, 0.035, m.dark, -0.965, 0.062, back + 0.09);
    // Narrower vanity leaves a separate, usable toilet bay against the same plumbing wall.
    box(0.91, 0.44, 0.49, m.oak, 0.13, 0.36, back + 0.275);
    [0.38, 0.59].forEach(y => { box(0.898, 0.202, 0.02, m.oak, 0.13, y, back + 0.53); handle(0.13, y + 0.15, back + 0.56); });
    box(0.96, 0.025, 0.56, m.quartz, 0.13, 0.8, back + 0.3);
    lathe([[0, 0], [0.1, 0], [0.18, 0.07], [0.21, 0.13], [0.198, 0.135], [0.16, 0.07], [0.055, 0.028], [0, 0.028]], m.ceramic, 0.13, 0.825, back + 0.33);
    cylinder(0.018, 0.002, m.steel, 0.13, 0.855, back + 0.33);
    faucet(0.13, 0.826, back + 0.07, 0.26);
    box(0.86, 0.97, 0.03, m.steel, 0.13, 1.05, back + 0.025, 0.015);
    const mirror = new Reflector(new THREE.PlaneGeometry(0.83, 0.94), { clipBias: 0.003, textureWidth: 512, textureHeight: 512, color: '#e7e9e9' });
    mirror.position.set(0.13, 1.535, back + 0.043); root.add(mirror); reflections.push(mirror);
    box(0.65, 0.035, 0.08, m.warmLight, 0.13, 2.08, back + 0.06);
    // Close-coupled WC: cistern sits against the rear wall, bowl projects into its own bay.
    const tx = 1.12;
    box(0.38, 0.64, 0.22, m.ceramic, tx, 0.04, back + 0.13, 0.04, 'wc-cistern');
    box(0.39, 0.035, 0.23, m.ceramic, tx, 0.68, back + 0.13, 0.015);
    cylinder(0.023, 0.003, m.steel, tx, 0.716, back + 0.13);
    box(0.24, 0.28, 0.36, m.ceramic, tx, 0.025, back + 0.43, 0.065);
    const bowl = lathe([[0.1, 0], [0.15, 0.07], [0.22, 0.17], [0.22, 0.21], [0.18, 0.21], [0.14, 0.11], [0.06, 0.055], [0, 0.055]], m.ceramic, tx, 0.22, back + 0.45);
    bowl.scale.z = 1.28; bowl.name = 'wc-bowl';
    ring(0.195, 0.023, m.ceramic, tx, 0.45, back + 0.45, 1.28);
    box(0.07, 0.015, 0.1, m.ceramic, tx, 0.46, back + 0.21);
    // Folded towels on the left wall, clear of the shower opening and central aisle.
    box(0.04, 0.03, 0.48, m.steel, -w / 2 + 0.04, 1.15, 0.7);
    box(0.035, 0.44, 0.31, m.whiteFabric, -w / 2 + 0.065, 0.75, 0.7, 0.012);
  }

  if (room.id === 'bedroom') {
    box(2.65, 0.014, 2.8, m.rug, 0.08, 0.028, 0.15, 0.006);
    box(1.72, 0.21, 2.09, m.oak, -0.05, 0.16, -0.28, 0.025);
    [-0.72, 0.62].forEach(x => [-1.15, 0.59].forEach(z => cylinder(0.03, 0.15, m.oak, x, 0.04, z)));
    box(1.72, 0.25, 2.03, m.whiteFabric, -0.05, 0.37, -0.28, 0.07);
    box(1.94, 1.12, 0.14, m.linen, -0.05, 0.04, -1.42, 0.06);
    for (let i = 0; i < 6; i++) box(0.003, 0.98, 0.004, m.throwFabric, -0.82 + i * 0.31, 0.11, -1.346, 0);
    // Subdivided cloth drapes over the mattress edges rather than forming a rigid box.
    const cloth = (length: number, z: number, y: number, material: THREE.Material) => {
      const g = new THREE.PlaneGeometry(2.03, length, 44, 36);
      g.rotateX(-Math.PI / 2);
      const p = g.getAttribute('position');
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i), depth = p.getZ(i);
        const drop = Math.max(0, Math.abs(x) - 0.78) * 1.65;
        const fold = Math.sin(x * 24 + depth * 5) * 0.008 + Math.sin(depth * 18 + x * 4) * 0.007;
        p.setY(i, -drop + fold);
      }
      g.computeVertexNormals(); uvInMeters(g, material);
      const object = mesh(g, material, -0.05, y, z); object.material.side = THREE.DoubleSide;
    };
    cloth(1.55, 0.08, 0.67, m.whiteFabric);
    cloth(0.52, 0.56, 0.695, m.throwFabric);
    [-0.48, 0.38].forEach((x, index) => {
      const g = new RoundedBoxGeometry(0.7, 0.18, 0.48, 6, 0.075);
      const p = g.getAttribute('position');
      for (let i = 0; i < p.count; i++) p.setY(i, p.getY(i) + Math.sin(p.getX(i) * 33) * Math.sin(p.getZ(i) * 27) * 0.006);
      g.computeVertexNormals(); uvInMeters(g, m.whiteFabric);
      const pillow = mesh(g, m.whiteFabric, x, 0.72, -1.02);
      pillow.rotation.set(-0.15, index ? -0.06 : 0.06, 0);
    });
    [-1.31, 1.22].forEach(x => {
      box(0.45, 0.34, 0.42, m.oak, x, 0.15, -1.08, 0.012);
      box(0.44, 0.15, 0.02, m.oak, x, 0.3, -0.86); handle(x, 0.41, -0.84, 0.16);
      cylinder(0.09, 0.012, m.metal, x, 0.49, -1.08);
      cylinder(0.009, 0.23, m.metal, x, 0.5, -1.08);
      const shade = mesh(new THREE.CylinderGeometry(0.1, 0.16, 0.2, 48, 1, true), m.whiteFabric, x, 0.8, -1.08); shade.material.side = THREE.DoubleSide;
      cylinder(0.06, 0.006, m.warmLight, x, 0.7, -1.08);
    });
    // Flush wardrobe stops before the hall doorway, leaving its opening unobstructed.
    box(0.57, 2.5, 1.8, m.oak, -w / 2 + 0.29, 0.025, -0.4);
    for (let i = 0; i < 3; i++) {
      box(0.022, 2.4, 0.589, m.oak, -w / 2 + 0.586, 0.09, -1 + i * 0.6);
      box(0.025, 0.32, 0.013, m.metal, -w / 2 + 0.614, 1.0, -0.83 + i * 0.6);
    }
    plant(1.98, -1.22);
  }

  return { root, ready: m.ready, dispose: () => {
    reflections.forEach(reflector => reflector.dispose());
    root.traverse(object => { if (object instanceof THREE.Mesh) object.geometry.dispose(); });
    m.dispose();
  } };
}
