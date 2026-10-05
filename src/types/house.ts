export type HouseDesignId = 'modern' | 'farmhouse' | 'aframe';

export type ViewMode = 'render' | 'blueprint';

export interface HouseDesign {
  id: HouseDesignId;
  name: string;
  style: string;
  area: string;
  beds: number;
  baths: string;
  startingAt: string;
  description: string;
  drawingNo: string;
  levels: string[];
}