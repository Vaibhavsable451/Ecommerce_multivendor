import React, { useEffect, useState } from 'react'
import StarIcon from '@mui/icons-material/Star';
import { teal } from '@mui/material/colors';
import { Box, Button, Divider, Grid, IconButton, LinearProgress, Modal, Rating } from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Wallet } from '@mui/icons-material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import ZoomableImage from './ZoomableImage';

import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import { fetchProductById, fetchAllProducts } from '../../../State/customer/ProductSlice';
import { fetchReviewsByProductId } from '../../../State/customer/ReviewSlice';
import ReviewCard from '../Review/ReviewCard';
import ProductReviewCard from '../Review/ProductReviewCard';
import SimilarProduct from './SimilarProduct';
import { addItemToCart } from '../../../State/customer/cartSlice';




const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "auto",
    height: "100%",
    // bgcolor: 'background.paper',
    boxShadow: 24,
    outline: "none",
};


const ProductDetails = () => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const dispatch = useAppDispatch();
    const { product, review } = useAppSelector(store => store)
    const navigate = useNavigate()
    const { productId,categoryId } = useParams()
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1)

    useEffect(() => {
        try {
            if (productId) {
                dispatch(fetchProductById(String(productId)))
                dispatch(fetchReviewsByProductId({ productId: Number(productId) }))
            }
            if (categoryId) {
                dispatch(fetchAllProducts({ category: categoryId}));
            }
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    }, [productId, categoryId, dispatch])

    const handleAddCart = () => {
        dispatch(addItemToCart({
            jwt: localStorage.getItem('jwt'),
            request: { productId: Number(productId), size: "FREE", quantity }

        }))
    }

 


    if (product.loading) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <LinearProgress sx={{ width: '50%' }} />
            </div>
        );
    }

    if (product.error) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <p className='text-red-500'>Error: {product.error}</p>
            </div>
        );
    }

    if (!product.product) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <p>Product not found</p>
            </div>
        );
    }

    return (
        <div className='px-5 lg:px-20 pt-10 '>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>

                <section className='flex flex-col lg:flex-row gap-5'>
                    <div className='w-full lg:w-[15%] flex flex-wrap lg:flex-col gap-3'>
                        {product.product?.images.map((item: string, index: number) => <img onClick={() => setSelectedImage(index)} className='lg:w-full w-[50px] cursor-pointer rounded-md' src={item} alt="" />)}
                    </div>
                    <div className='w-full lg:w-[85%]'>
                        <img onClick={handleOpen} className='w-full rounded-md cursor-zoom-out' src={product.product?.images[selectedImage]} alt="" />
                    </div>

                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>

                            <ZoomableImage src={product.product?.images[selectedImage]} alt="" />
                        </Box>
                    </Modal>

                </section>

                <section>
                    <h1 className='font-bold text-lg text-teal-950'>{product.product?.seller?.businessDetails.businessName}</h1>
                    <p className='text-gray-500 font-semibold'>{product.product?.title}</p>

                    <div className='flex justify-between items-center py-2 border w-[180px] px-3 mt-5'>
                        <div className='flex gap-1 items-center'>
                            <span>4</span>
                            <StarIcon sx={{ color: teal[600], fontSize: "17px" }} />
                        </div>
                        <Divider orientation="vertical" flexItem />
                        <span>
                            358 Ratings
                        </span>
                    </div>

                    <div className='space-y-2'>
                        <div className='price flex items-center gap-3 mt-5 text-lg'>
                            <span className='font-semibold text-gray-800' > ₹{product.product?.sellingPrice}</span>
                            <span className='text thin-line-through text-gray-400 '>₹{product.product?.mrpPrice}</span>
                            <span className='text-[#00927c] font-semibold'>{product.product?.discountPercent}% off</span>
                        </div>
                        <p className='text-sm'>Inclusive of all taxes. Free Shipping above ₹1500.</p>
                    </div>

                    <div className='mt-7 space-y-3'>

                        <div className='flex items-center gap-4'>
                            <ShieldIcon sx={{ color: teal[400] }} />
                            <p>Authentic & Quality Assured</p>
                        </div>

                        <div className='flex items-center gap-4'>
                            <WorkspacePremiumIcon sx={{ color: teal[400] }} />
                            <p>100% money back guarantee</p>
                        </div>

                        <div className='flex items-center gap-4'>
                            <LocalShippingIcon sx={{ color: teal[400] }} />
                            <p>Free Shipping & Returns</p>
                        </div>



                        <div className='flex items-center gap-4'>
                            <Wallet sx={{ color: teal[400] }} />
                            <p>Pay on delivery might be available</p>
                        </div>



                    </div>

                    <div className='mt-7 space-y-2'>
                        <h1>QUANTITY:</h1>
                        <div className=' flex items-center gap-2  w-[140px] justify-between'>

                            <Button disabled={quantity == 1} onClick={() => setQuantity(quantity - 1)} variant='outlined'>
                                <RemoveIcon />
                            </Button>
                            <span className='px-3 text-lg font-semibold'>
                                {quantity}
                            </span>
                            <Button onClick={() => setQuantity(quantity + 1)} variant='outlined'>
                                <AddIcon />
                            </Button>

                        </div>
                    </div>

                    <div className="mt-12 flex items-center gap-5">
                        <Button
                            onClick={handleAddCart}
                            sx={{ py: "1rem" }}
                            variant='contained' fullWidth startIcon={<AddShoppingCartIcon />}>
                            Add To Bag
                        </Button>
                        <Button
                            sx={{ py: "1rem" }}
                            variant='outlined' fullWidth startIcon={<FavoriteBorderIcon />}>
                            Whishlist
                        </Button>

                    </div>
                    <div className='mt-5'>
                        <p >
                            {product.product?.description}
                        </p>
                    </div>
                    <div className="ratings w-full mt-10">
                        <h1 className="font-semibold text-lg pb-4">
                            Review & Ratings
                        </h1>

                        <ReviewCard totalReview={review.reviews.length} />
                        <div className='mt-10'>
                            <div className="space-y-5">
                                {review.reviews.map((item: any, i: number) => (
                                    <div className='space-y-5'>
                                        <ProductReviewCard item={item} />
                                        <Divider />
                                    </div>
                                ))}
                                <Button onClick={() => navigate(`/reviews/${productId}`)}>View All {review.reviews.length} Reviews</Button>
                            </div>
                        </div>



                    </div>
                </section>



            </div>
            <section className='mt-20'>
                <h1 className='text-lg font-bold'>Similar Product</h1>

                <div className='pt-5'>
                    <SimilarProduct />
                </div>

            </section>
        </div>
    )
}

export default ProductDetails