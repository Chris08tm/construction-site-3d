export type RoomId = 'kitchen' | 'bathroom' | 'bedroom';

export interface RoomFeature {
  id: string;
  title: string;
  material: string;
  description: string;
  position: [number, number, number];
}

export interface RoomDesign {
  id: RoomId;
  name: string;
  subtitle: string;
  dimensions: string;
  area: string;
  width: number;
  depth: number;
  features: RoomFeature[];
}
