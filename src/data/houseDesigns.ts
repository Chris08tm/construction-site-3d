import type { RoomDesign } from '../types/house';

// Room dimensions are in meters, matching the sample plan's dimensions in feet.
export const roomDesigns: RoomDesign[] = [
  {
    id: 'kitchen', name: 'Kitchen', subtitle: 'Made for everyday gathering',
    dimensions: '16′ × 12′', area: '192 sq ft', width: 4.8768, depth: 3.6576,
    features: [
      { id: 'quartz', title: 'Quartz countertops', material: 'Warm white · waterfall edge',
        description: 'A generous island with a continuous waterfall edge. Nonporous quartz makes everyday spills easy to clean, with room to prep, serve, and gather.', position: [0.35, 1.02, 0.5] },
      { id: 'windows', title: 'Impact windows', material: 'Slim frame · laminated glass',
        description: 'Bring natural light to the prep area with impact-rated glazing. Frame, glass, and installation specifications are selected for your home and local requirements.', position: [0.35, 1.95, -1.8] },
      { id: 'cabinetry', title: 'Custom cabinetry', material: 'Natural oak · soft-close storage',
        description: 'Full-extension drawers and a tall pantry keep the essentials close. A tailored cabinet layout puts awkward corners and vertical space to work.', position: [-2.05, 1.45, -0.85] },
    ],
  },
  {
    id: 'bathroom', name: 'Bathroom', subtitle: 'A little more room to unwind',
    dimensions: '10′ × 8′', area: '80 sq ft', width: 3.048, depth: 2.4384,
    features: [
      { id: 'shower', title: 'Walk-in shower', material: 'Frameless glass · low threshold',
        description: 'A generous shower with a clear glass screen, rainfall fixture, and built-in niche. A low threshold keeps the room feeling open and easy to enter.', position: [-0.965, 1.55, -0.7] },
      { id: 'vanity', title: 'Floating oak vanity', material: 'Quartz top · integrated storage',
        description: 'A wall-mounted vanity creates a lighter feel and makes the floor easier to clean. Deep drawers and a quartz surface combine useful storage with a simple finish.', position: [0.13, 0.98, -0.89] },
      { id: 'tile', title: 'Porcelain tile', material: 'Large format · warm limestone look',
        description: 'Coordinated wall and floor tile gives the room a calm, continuous finish. A floor-rated surface and a properly waterproofed assembly complete the design.', position: [0.35, 0.1, 0.65] },
    ],
  },
  {
    id: 'bedroom', name: 'Bedroom', subtitle: 'A quieter kind of retreat',
    dimensions: '16′ × 12′', area: '192 sq ft', width: 4.8768, depth: 3.6576,
    features: [
      { id: 'windows', title: 'Impact windows', material: 'Laminated glass · natural daylight',
        description: 'A tall window brings daylight into your retreat. Impact-rated assemblies can add storm protection, with glazing options chosen for comfort and your home’s requirements.', position: [1.52, 1.8, -1.8] },
      { id: 'flooring', title: 'Engineered oak flooring', material: 'Wide plank · natural matte finish',
        description: 'Warm oak brings texture underfoot. An engineered construction offers a real wood surface, with the finish and installation method tailored to your space.', position: [1.55, 0.1, 1.0] },
      { id: 'storage', title: 'Built-in storage', material: 'Floor-to-ceiling · tailored interiors',
        description: 'A fitted wardrobe makes the most of the wall with a mix of hanging space, shelves, and drawers. Clean fronts keep the room restful and uncluttered.', position: [-2.08, 1.65, 0.35] },
    ],
  },
];
