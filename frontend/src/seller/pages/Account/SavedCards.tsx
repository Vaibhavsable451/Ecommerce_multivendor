import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../State/Store';
// import { fetchSellerCards } from '../../../State/seller/sellerCardsSlice';

const SavedCards = () => {
  // const dispatch = useAppDispatch();
  // const { cards, loading, error } = useAppSelector(state => state.sellerCards);

  // useEffect(() => {
  //   dispatch(fetchSellerCards(localStorage.getItem('jwt') || ''));
  // }, [dispatch]);

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error loading cards: {error}</div>;
  // if (!cards || cards.length === 0) return <div>No saved cards.</div>;

  // Example placeholder:
  return (
    <div>
      <h2>Saved Cards</h2>
      <ul>
        <li>**** **** **** 1234 (Visa)</li>
        <li>**** **** **** 5678 (Mastercard)</li>
      </ul>
      {/* Replace above with dynamic fields from your store */}
    </div>
  );
};

export default SavedCards;
