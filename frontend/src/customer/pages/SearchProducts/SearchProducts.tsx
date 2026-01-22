import React, { ChangeEvent, useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'State/Store';
import { searchProduct } from 'State/customer/ProductSlice';
import ProductCard from '../Product/ProductCard';
import { useLocation } from 'react-router-dom';


const SearchProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useAppDispatch();
  const { product } = useAppSelector(store => store)
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query');

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      dispatch(searchProduct(query));
    }
  }, [query, dispatch]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }
  const handleProductSearch = () => {
    dispatch(searchProduct(searchQuery))
  }
  return (
    <div className='min-h-screen px-20'>
      <section className='pt-10'>
        {product.searchProduct?.length > 0 ? (
          <section className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-5 px-5 justify-center">
            {product.searchProduct.map((item: any, index: number) => (
              <div key={index * 9} className="">
                <ProductCard item={item} />
              </div>
            ))}
          </section>
        ) : searchQuery ? (
          <section className="items-center flex flex-col gap-5 justify-center h-[67vh]">
            <img
              className="w-80"
              src="https://cdn.pixabay.com/photo/2022/05/28/10/45/oops-7227010_960_720.png"
              alt=""
            />
            <h1 className="font-bold text-xl text-center flex items-center gap-2">
              Product Not Found
            </h1>
          </section>
        ) : (
          <div className='h-[70vh] flex flex-col justify-center items-center'>
            <h1 className='font-bold text-6xl'>
              Search Product Here
            </h1>
          </div>
        )}
      </section>
    </div>
  )
}

export default SearchProducts