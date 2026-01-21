import React from 'react'
import "./ShopByCategory.css"
import { HomeCategory } from '../../../../types/HomeCategoryTypes'
import { useNavigate } from 'react-router-dom'

const ShopByCategoryCard = ({ item }: { item: HomeCategory }) => {
  const navigate = useNavigate();

  const handleCategoryClick = () => {
    navigate(`/products/${item.categoryId}`);
  };

  return (
    <div onClick={handleCategoryClick} className='flex gap-3 flex-col justify-center items-center group cursor-pointer'>
      <div className='custom-border w-[150px] h-[150px] lg:w-[249px] lg:h-[249px] rounded-full bg-primary-color'>
        <img className='rounded-full group-hover:scale-95 transition-transform transform-duration-700 object-cover object-top h-full w-full'
          src={item.image} alt={item.name} />
      </div>
      <h1>
        {item.name}
      </h1>
    </div>
  )
}

export default ShopByCategoryCard
