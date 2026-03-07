export interface ProductSpec {
  label: string;
  value: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export enum SectionType {
  HERO = 'HERO',
  SPECS = 'SPECS',
  PROGRAM = 'PROGRAM',
  PRODUCT = 'PRODUCT'
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  specs: string;
  categoryId?: 'bait' | 'tackle' | 'bundle' | 'ebook' | 'rod';
  subtitle?: string;
  tag?: string;
  isFinalChance?: boolean;
  detailedSpecs?: {
    length: string;
    pieces: string;
    lureWeight: string;
    lineRating: string;
    action: string;
  };
  items?: string[];
  images?: string[];
  subCategory?: string;
  itemsSold?: number;
}