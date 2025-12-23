import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Product } from '../../../types/ProductTypes'
import { fetchAllProducts } from '../../../State/customer/ProductSlice'
import SimilarProductCard from './SimilarProductCard'
import { PaginatedResponse } from '../../../types/ApiResponseTypes'
import { AppDispatch, useAppSelector } from '../../../State/Store'

interface SimilarProductProps {
  categoryId?: string;
  currentProductId?: string;
}

const SmilarProduct = ({categoryId}:any) => {
  const { products } = useAppSelector((store) => store.product);
  return (
    <div>
        <div className='grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 grid-cols-1 justify-between gap-4 gap-y-8'>

        {products.map((item,index) => <div 
            key = {item.id} className=''>
              <SimilarProductCard product={item} />
            </div>)}

        </div>
    </div>
  )
}

export default SmilarProduct