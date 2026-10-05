export interface NavLink {
  label: string;
  href: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  timeline: string;
  image: string;
  imageAlt: string;
}

export interface ProcessStep {
  title: string;
  duration: string;
  description: string;
}

export type GalleryCategory = 'Exteriors' | 'Interiors' | 'Kitchens & Baths' | 'In Progress';

export interface GalleryItem {
  id: string;
  title: string;
  location: string;
  year: string;
  category: GalleryCategory;
  image: string;
  span: 'tall' | 'wide' | 'base';
}

export interface Testimonial {
  quote: string;
  name: string;
  project: string;
}