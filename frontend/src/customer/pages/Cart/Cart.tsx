import React, { useEffect, useState } from 'react'
import CartItem from './CartItemCard'
import { Close, LocalOffer } from '@mui/icons-material'
import { teal } from '@mui/material/colors'
import { Button, IconButton, TextField } from '@mui/material'
import PricingCard from './PricingCard'
import { useNavigate } from 'react-router-dom'
import store, { useAppDispatch, useAppSelector } from '../../../State/Store'
import { fetchUserCart } from '../../../State/customer/cartSlice'




const Cart = () => {
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponCode(e.target.value)
    setError(null)
  }
  
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    
    setIsLoading(true)
    try {
      // TODO: Implement coupon validation API call
      setAppliedCoupon(couponCode)
      setCouponCode("")
    } catch (err) {
      setError("Invalid coupon code")
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
  }
  
  const dispatch = useAppDispatch()
  const { cart } = useAppSelector(store => store.cart)

  useEffect(() => {
    dispatch(fetchUserCart(localStorage.getItem("jwt") || ""))
  }, [dispatch])

  return (
    
    <div className='pt-10 px-5 sm:px-10 md:px-60 min-h-screen'>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>
        <div className='cartItemSection lg:col-span-2 space-y-3'>
          
          {cart?.cartItems.map((item: any)=><CartItem item={item}/>)}
        </div>

        <div className='col-span-1 text-sm space-y-3'>
          <div className='border rounded-md px-5 py-3 space-y-5'>
            
              <div className='flex gap-3 text-sm items-center'>
              <div className='flex gap-3 text-sm items-center'>
                <LocalOffer sx={{color:teal[600], fontSize:"17px"}}/>

              </div>
              <span>
                Apply Coupons
              </span>
              </div>
             {!appliedCoupon ? (
              <div className='flex justify-between items-center'>
                <TextField 
                  onChange={handleChange} 
                  value={couponCode}
                  id="outlined-basic" 
                  placeholder='Coupon Code' 
                  size='small' 
                  variant="outlined"
                  error={!!error}
                  helperText={error}
                />
                <Button 
                  size='small'
                  onClick={handleApplyCoupon}
                  disabled={isLoading || !couponCode.trim()}
                >
                  {isLoading ? 'Applying...' : 'Apply'}
                </Button>
              </div>
            ) : (
              <div className='flex'>
                <div className='p-1 pl-5 pr-3 border rounded-md flex gap-2 items-center'>
                  <span className=''>{appliedCoupon} Applied</span>
                  <IconButton size='small' onClick={handleRemoveCoupon}>
                    <Close className='text-red-600'/>
                  </IconButton>
                </div>
              </div>
            )}
            

          </div>

          <div className='border rounded-md'>
            <PricingCard 
              subtotal={cart?.totalMrpPrice || 0}
              discount={cart ? (cart.totalMrpPrice - cart.totalSellingPrice) : 0}
              shipping={cart?.totalSellingPrice && cart.totalSellingPrice > 500 ? 0 : 40}
              platformFee={0}
              total={cart?.totalSellingPrice ? (cart.totalSellingPrice + (cart.totalSellingPrice > 500 ? 0 : 40)) : 0}
            />
            <div className='p-5'>
              <Button
              onClick={()=>navigate("/checkout")}
              fullWidth  variant='contained' sx={{py:"11px"}}>
                Buy Now 
              </Button>
            </div>
          </div>

          <div>

          </div>

        </div>


      </div>


    </div>
  )
}

export default Cart