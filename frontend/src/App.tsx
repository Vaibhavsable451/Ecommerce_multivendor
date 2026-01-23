import React, { useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripeCheckoutForm from './component/StripeCheckoutForm';
import logo from './logo.svg';
import './App.css';
import { Button, ThemeProvider } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Navbar from './customer/components/Navbar/Navbar';
import customeTheme from './Theme/customeTheme';
import Home from './customer/pages/Home/Home';
import Product from './customer/pages/Product/Product';
import ProductDetails from './customer/pages/Page Details/ProductDetails';
import Review from './customer/pages/Review/Review';
import Cart from './customer/pages/Cart/Cart';
import Checkout from './customer/pages/Checkout/Checkout';
import Account from './customer/pages/Account/Account';
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import BecomeSeller from './customer/pages/BecomeSeller/BecomeSeller';
import SellerDashboard from './seller/pages/SellerDashboard/SellerDashboard';
import AdminDashboard from './Pages/Dashboard/AdminDashboard';
import AdminAuth from './auth/AdminAuth';


import store, { useAppDispatch, useAppSelector } from 'State/Store';
import { fetchSellerProfile } from 'State/seller/sellerSlice';
import { fetchProducts } from 'State/fetchProduct';
import Auth from './customer/pages/Auth/Auth';
import { fetchUserProfile } from 'State/AuthSlice';
import PaymentSuccess from './customer/pages/PaymentSuccess';
import Wishlist from './customer/Wishlist/Wishlist';
import { createHomeCategories } from 'State/customer/customerSlice';
import { homeCategories } from './data/HomeCategories';
import SearchProducts from './customer/pages/SearchProducts/SearchProducts';
import Footer from './customer/components/Footer/Footer';







const stripePublishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

function App() {
    const dispatch=useAppDispatch();
    const {seller, auth, sellerAuth}=useAppSelector(store=>store)
    const navigate=useNavigate()
    
    // Check if user is admin and redirect to admin dashboard if they are
    useEffect(() => {
      const isAdmin = localStorage.getItem('isAdmin') === 'true';
      const adminJwt = localStorage.getItem('adminJwt');
      
      if (isAdmin && adminJwt) {
        navigate('/admin');
      }
    }, []); // Empty dependency array ensures this runs only once on mount
useEffect(()=>{
   if (localStorage.getItem("jwt")) {
     dispatch(fetchSellerProfile(localStorage.getItem("jwt") || ""))
   }
   dispatch(createHomeCategories(homeCategories))
},[])

useEffect(()=>{
 if(seller.profile){
  navigate("/seller")
 }
},[seller.profile])

useEffect(()=>{
  dispatch(fetchUserProfile({jwt: auth.jwt || localStorage.getItem("jwt")}))
},[auth.jwt])
   


  return (
  
      <ThemeProvider theme={customeTheme}>
        <div>
          
      
         <Navbar/>
       <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Auth/>}/>
        
        <Route path='/products/:category' element={<Product/>}/>
        <Route path='/reviews/:productId' element={<Review reviews={[]} product={{}}/>}/>
        <Route path='/product-details/:categoryId/:name/:productId' element={<ProductDetails/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/wishlist'element={<Wishlist/>}/>
        <Route path='/checkout' element={<Checkout/>}/>
        <Route path='/payment-success/:orderId' element={<PaymentSuccess/>}/>
        <Route path='/become-seller' element={<BecomeSeller/>}/>
        <Route path='/account/*' element={<Account/>}/>
        {seller.profile && <Route path='/seller/*' element={<SellerDashboard/>} />}
        <Route path='/admin/*' element={<AdminDashboard/>}/>
        <Route path='/admin-login' element={<AdminAuth/>}/>
       
        <Route path="/stripe-checkout" element={
          stripePromise ? (
            <Elements stripe={stripePromise}>
              <StripeCheckoutForm />
            </Elements>
          ) : null
        }/>
        <Route path="/search" element={<SearchProducts />} />
        <Route path="/search-products" element={<SearchProducts />} />
        


        </Routes>
         {/* { <Footer/> } */}
      
       
        </div>
    
      </ThemeProvider>
        
    
  );
}

export default App;