import React from 'react'
import ReviewCard from './ReviewCard'
import { Divider } from '@mui/material'
import { useDispatch } from 'react-redux'
import { addItemToCart } from '../../../State/customer/cartSlice'

interface ReviewProps {
  reviews: {
    userName: string;
    date: string;
    rating: number;
    comment: string;
    totalReview?: number;
  }[];
  product: {
    product?: {
      id?: number;
      images?: string[];
      title?: string;
      brand?: string;
      sellingPrice?: number;
      mrpPrice?: number;
      discountPercent?: number;
      description?: string;
      seller?: {
        businessDetails?: {
          businessName?: string;
        };
      };
    };
  };
}

const Review = ({ reviews, product }: ReviewProps & { product: any }) => {
  const dispatch = useDispatch()
  return (
    <div className='p-5 lg:px-20 flex flex-col lg:flex-row gap-20'>
      <section className='w-full md:w-1/2 lg:w-[30%] space-y-4'>
        <img 
          src={product.product?.images?.[0] || '/images/placeholder.jpg'}
          alt={product.product?.title || "Product Image"}
          className='w-full h-auto object-contain cursor-pointer rounded-lg shadow-sm'
          onClick={() => {
            if (product.product?.id) {
              dispatch(addItemToCart({
                jwt: localStorage.getItem("jwt") || "",
                request: {
                  productId: product.product.id,
                  size: "M",
                  quantity: 1
                }
              }) as any);
            }
          }}
        />

        <div className='space-y-4'>
          <div>
            <h1 className='font-bold text-2xl'>{product.product?.seller?.businessDetails?.businessName || product.product?.brand || 'Store Name'}</h1>
            <p className='text-lg text-gray-600'>{product.product?.title || "Product Title"}</p>
          </div>

          <div className='space-y-2'>
            <div className='price flex items-center gap-3 text-2xl'>
              <span className='font-sans text-gray-800'>
                ₹ {product.product?.sellingPrice || 0}
              </span>
              <span className='line-through text-gray-400'>
                ₹ {product.product?.mrpPrice || 0}
              </span>
              <span className='text-primary-color font-semibold'>
                {product.product?.discountPercent || 0}% off
              </span>
            </div>

            <p className='text-sm text-gray-500'>{product.product?.description || 'Premium quality product'}</p>

            <div className='flex items-center gap-2 mt-4'>
              <button 
                className='px-4 py-2 bg-primary-color text-white rounded-md hover:bg-opacity-90 transition-all'
                onClick={() => {
                  if (product.product?.id) {
                    dispatch(addItemToCart({
                      jwt: localStorage.getItem("jwt") || "",
                      request: {
                        productId: product.product.id,
                        size: "M",
                        quantity: 1
                      }
                    }) as any);
                  }
                }}
              >
                Add to Cart
              </button>
              <div className='flex items-center gap-2 border rounded-md p-2'>
                <span className='text-gray-600'>Quantity:</span>
                <select className='border-none outline-none bg-transparent'>
                  {[1,2,3,4,5].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className='mt-6 space-y-3'>
              <div className='flex items-center gap-2 text-gray-600'>
                <span className='material-icons'>local_shipping</span>
                <span>Free Delivery</span>
              </div>
              <div className='flex items-center gap-2 text-gray-600'>
                <span className='material-icons'>verified</span>
                <span>100% Authentic Product</span>
              </div>
              <div className='flex items-center gap-2 text-gray-600'>
                <span className='material-icons'>cached</span>
                <span>7 Days Return Policy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='space-y-5 w-full bg-white p-5 rounded-lg shadow-md'>
         <h2 className='text-2xl font-semibold mb-4'>Product Reviews</h2>
         {reviews && reviews.length > 0 ? (
           reviews.map((review, index) => (
            <div key={index} className='space-y-3'>
              <ReviewCard
                totalReview={0}
                userName={review.userName} 
                date={review.date} 
                rating={review.rating} 
                comment={review.comment}
              />
              <Divider/>
            </div>
           ))
         ) : (
           <p className='text-gray-500'>No reviews yet for this product.</p>
         )}
      </section>

    </div>
  )
}

export default Review