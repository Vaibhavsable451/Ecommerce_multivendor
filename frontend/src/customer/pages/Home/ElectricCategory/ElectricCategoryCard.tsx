import React from 'react'
import { HomeCategory } from '../../../../types/HomeCategoryTypes'

import { useNavigate } from 'react-router-dom';

const ElectricCategoryCard = ({item}:{item:HomeCategory}) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/products/${item.categoryId}`);
  };
  return (
    <div className='flex flex-col gap-2 justify-center cursor-pointer' onClick={handleClick}>
      <img className='object-contain h-10' src={item.image} alt="" />
      <h2 className='font-semibold text-sm text-center'>{item.name}</h2>
    </div>
  )
}

export default ElectricCategoryCard
