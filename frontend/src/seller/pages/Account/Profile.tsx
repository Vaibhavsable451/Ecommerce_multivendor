import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../State/Store';
import type { SellerProfile } from '../../../State/seller/sellerProfileSlice';
import { fetchSellerProfile } from '../../../State/seller/sellerProfileSlice';

const Profile = () => {
  const dispatch = useAppDispatch();
  const { profile, loading, error } = useAppSelector(state => state.sellerProfile) as { profile: SellerProfile | null, loading: boolean, error: string | null };

  useEffect(() => {
    dispatch(fetchSellerProfile(localStorage.getItem('jwt') || ''));
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile: {error}</div>;
  if (!profile) return <div>No profile data.</div>;

  return (
    <div>
      <h2>Seller Profile</h2>
      <p><strong>Name:</strong> {profile.sellerName}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Mobile:</strong> {profile.mobile}</p>
      <h3>Business Details</h3>
      <p><strong>Business Name:</strong> {profile.businessDetails?.businessName}</p>
      <p><strong>GSTIN:</strong> {profile.gstin}</p>
      <p><strong>Account Status:</strong> {profile.accountStatus}</p>
    </div>
  );
};

export default Profile;