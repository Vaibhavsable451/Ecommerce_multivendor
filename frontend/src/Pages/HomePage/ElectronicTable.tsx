import React, { useEffect } from 'react'
import HomeCategoryTable from './HomeCategoryTable'
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import { fetchHomePageData } from '../../../State/customer/customerSlice';
import { CircularProgress, Typography } from '@mui/material';
import { getErrorMessage } from '../../../Util/errorHandler';

const ElectronicTable = () => {
  const dispatch = useAppDispatch();
  const { customer } = useAppSelector(store => store);
  const { loading, error, homePageData } = customer;

  useEffect(() => {
    // Fetch data if not already loaded
    if (!homePageData) {
      dispatch(fetchHomePageData());
    }
  }, [dispatch, homePageData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        <Typography variant="h6">Error loading electronic categories: {getErrorMessage(error)}</Typography>
      </div>
    );
  }

  return (
    <div>
      <Typography variant="h5" className="mb-4">Electronic Categories</Typography>
      <HomeCategoryTable data={homePageData?.electricCategories || []}/>
    </div>
  )
}

export default ElectronicTable