export interface Product {
    id: number;
    name: string;
    description: string;
    technicalDetails?: string;
    images: string[]; // Array of image URLs
    categoryId: number;
}
  