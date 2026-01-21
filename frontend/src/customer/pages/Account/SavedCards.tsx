import React from 'react'
import AddCardIcon from '@mui/icons-material/AddCard';
import { teal } from '@mui/material/colors';

import { useAppSelector } from '../../../State/Store';

const SavedCards = () => {
  const { user } = useAppSelector(store => store.auth);
  const savedCards = user?.savedCards || [];
  return (
    <div className='flex flex-col justify-center items-center lg:min-h-[60vh] gap-6'>
      {savedCards && savedCards.length > 0 ? (
        <div className='w-full space-y-4'>
          {savedCards.map((card: any) => (
            <div key={card.id} className='border p-4 rounded-lg shadow-md w-full'>
              <div className='font-semibold'>Card Number: **** **** **** {card.last4}</div>
              <div>Cardholder: {card.cardholder}</div>
              <div>Expiry: {card.expiry}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center w-full lg:w-[68%] space-y-4'>
          <AddCardIcon sx={{color:teal[400], fontSize:"150px"}}/>
          <h1 className='font-bold text-lg textg'>No saved cards found</h1>
          <p className='text-gray-700'>It's convenient to pay with saved cards. Your card information will be secure, we use 128-bit encryption</p>
        </div>
      )}
    </div>
  )
}

export default SavedCards