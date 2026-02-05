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