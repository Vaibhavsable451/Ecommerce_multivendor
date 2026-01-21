import { Category } from '@mui/icons-material';
import { Seller } from './SellerTypes';
export interface Product{
  id: number;
  title: string;
  description:string;
  mrpPrice:number;
  sellingPrice: number;
  discountPercent: number;
  quantity:number;
  color:string;
  images:string[];
  numRating?:number;
  category?:Category;
  seller?:Seller;
  createdAt?:Date;
  sizes:string

}

export interface Category {
  id?: number; // Optional since id is auto-generated
  name: string;
  categoryId: string;
  parentCategory?: Category; // Optional since a category might not have a parent
  level: number;
}