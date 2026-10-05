import type { HouseDesign } from '../types/house';

export const houseDesigns: HouseDesign[] = [
{
  id: 'modern',
  name: 'The Meridian',
  style: 'Modern two-story',
  area: '2,850 sq ft',
  beds: 4,
  baths: '3.5',
  startingAt: '$1.18M',
  description:
  'A cantilevered cedar upper level over a glass-walled living wing, finished with a flat, solar-ready roof.',
  drawingNo: 'A-101',
  levels: ['Ground floor', 'Upper floor', 'Roof']
},
{
  id: 'farmhouse',
  name: 'The Hollis',
  style: 'Modern farmhouse',
  area: '2,240 sq ft',
  beds: 3,
  baths: '2.5',
  startingAt: '$865K',
  description:
  'Single-level living under a standing-seam gable roof, with an open great room and a full-width covered porch.',
  drawingNo: 'A-204',
  levels: ['Main floor', 'Gable roof']
},
{
  id: 'aframe',
  name: 'The Alder',
  style: 'A-frame retreat',
  area: '1,320 sq ft',
  beds: 2,
  baths: '1',
  startingAt: '$540K',
  description:
  'Steep roof planes meet a full-height glass gable. A sleeping loft keeps the main floor open to the view.',
  drawingNo: 'A-312',
  levels: ['Main floor & loft', 'Roof shell']
}];