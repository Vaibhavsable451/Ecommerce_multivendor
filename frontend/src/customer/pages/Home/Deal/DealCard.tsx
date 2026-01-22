import React, { useState } from 'react';
import { Deal } from 'types/dealTypes';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const DealCard = ({item, allDeals, index}:{item:Deal, allDeals: Deal[], index: number}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(index);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((prev) => (prev - 1 + allDeals.length) % allDeals.length);
  };
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((prev) => (prev + 1) % allDeals.length);
  };

  const handleCardClick = () => {
    const categoryId = item.category?.categoryId;
    if (categoryId) {
      navigate(`/product/${categoryId}`);
    }
  };

  return (
    <>
      <div className='w-[13rem] cursor-pointer' onClick={handleOpen}>
        <img className='border-x-[7px] border-t-[7px] border-pink-600 w-full h-[12rem] object-cover object-top' src={item.category.image} alt='' style={{cursor: 'pointer'}}/>
        <div className='border-4 border-black bg-black text-white p-2 text-center'>
          <p className='text-lg font-semibold'> {item.category.name}</p>
          <p className='text-2xl font-bold'>{item.discount}% OFF</p>
          <p className='text-balance text-lg'>shop now</p>
        </div>
      </div>
      <Dialog open={open} onClose={handleClose} maxWidth='md'>
        <div style={{ position: 'relative', background: 'black', padding: 16 }}>
          <IconButton onClick={handleClose} style={{ position: 'absolute', right: 8, top: 8, color: 'white', zIndex: 2 }}>
            <CloseIcon />
          </IconButton>
          <IconButton onClick={handlePrev} style={{ position: 'absolute', left: 8, top: '50%', color: 'white', zIndex: 2 }}>
            <ArrowBackIosNewIcon />
          </IconButton>
          <img 
            src={allDeals[current].category.image} 
            alt='' 
            style={{ maxHeight: 400, maxWidth: 600, margin: 'auto', display: 'block', cursor: 'pointer' }} 
          />
          <IconButton onClick={handleNext} style={{ position: 'absolute', right: 8, top: '50%', color: 'white', zIndex: 2 }}>
            <ArrowForwardIosIcon />
          </IconButton>
          <div className='text-white text-center mt-2'>
            <div className='font-bold text-lg'>{allDeals[current].category.name}</div>
            <div className='text-md'>{allDeals[current].discount}% OFF</div>
            <button className='mt-2 px-4 py-2 bg-primary-color rounded' onClick={handleCardClick}>Go to Deal</button>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default DealCard;
