import * as React from 'react';
import { Product } from '../../../types/ProductTypes';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-w-1 aspect-h-1">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{product.title}</h3>
        <div className="mt-2 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900">₹{product.sellingPrice}</span>
            {product.mrpPrice > product.sellingPrice && (
              <span className="text-sm text-gray-500 line-through">₹{product.mrpPrice}</span>
            )}
          </div>
          {product.category?.name && (
            <p className="text-sm text-gray-600">{product.category.name}</p>
          )}
        </div>
        <button className="mt-4 w-full bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition-colors duration-300">
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard; 