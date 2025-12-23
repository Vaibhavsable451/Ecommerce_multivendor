import { Product } from './ProductTypes';

export interface SimilarProductProps {
  product: Product;
}

export interface SimilarProductsResponse {
  products: Product[];
  totalPages: number;
  currentPage: number;
}