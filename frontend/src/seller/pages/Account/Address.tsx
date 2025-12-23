import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../State/Store';
// import { fetchSellerAddress } from '../../../State/seller/sellerAddressSlice';

const Address = () => {
  // const dispatch = useAppDispatch();
  // const { address, loading, error } = useAppSelector(state => state.sellerAddress);

  // useEffect(() => {
  //   dispatch(fetchSellerAddress(localStorage.getItem('jwt') || ''));
  // }, [dispatch]);

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error loading address: {error}</div>;
  // if (!address) return <div>No address data.</div>;

  // Example placeholder:
  return (
    <div>
      <h2>Seller Address</h2>
      <p><strong>Street:</strong> 123 Main St</p>
      <p><strong>City:</strong> Example City</p>
      <p><strong>State:</strong> Example State</p>
      <p><strong>Pin Code:</strong> 123456</p>
      {/* Replace above with dynamic fields from your store */}
    </div>
  );
};

export default Address;
