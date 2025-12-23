
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { thunk } from "redux-thunk";
import sellerSlice from "./seller/sellerSlice";
import sellerProductSlice from './seller/sellerProductSlice'
import productSlice from './customer/ProductSlice'
import authSlice from './AuthSlice';
import cartSlice from './customer/cartSlice';
import orderSlice from './customer/OrderSlice';
import wishlistSlice from './customer/wishlistSlice';
import sellerOrderSlice from './seller/sellerOrderSlice';
import transactionSlice from './seller/transactionSlice';
import adminSlice from './admin/adminSlice'
import adminCouponReducer from './admin/AdminCouponSlice'
import customerSlice from './customer/customerSlice'
import dealSlice from './admin/DealSlice';
import reviewSlice from './customer/ReviewSlice';
import revenueChartSlice from "./seller/revenueChartSlice";
import revenueSlice from "./seller/revenueSlice";
import payoutSlice from "./seller/payoutSlice";
import sellerProfileSlice from './seller/sellerProfileSlice'
import AiChatBotSlice from "./customer/AiChatBotSlice";
import sellerAuthReducer from './seller/sellerAuthSlice';
import adminReportReducer from './admin/adminReportSlice';


const rootReducer=combineReducers({
seller:sellerSlice,
adminCoupon: adminCouponReducer,
sellerProduct:sellerProductSlice,
sellerProfile: sellerProfileSlice,
product:productSlice,
auth:authSlice,
cart:cartSlice,
order:orderSlice,
wishlist:wishlistSlice,
customer:customerSlice,
review: reviewSlice,
user: authSlice,
aiChatBot: AiChatBotSlice,
sellerAuth: sellerAuthReducer,

sellerOrder:sellerOrderSlice,
transactions:transactionSlice,
payouts: payoutSlice,
revenueChart: revenueChartSlice,
revenue: revenueSlice,


//admin
admin: adminSlice,
deal:dealSlice,
adminReport: adminReportReducer,
});

const store=configureStore({
  reducer:rootReducer,
  middleware:(getDefaultMiddleware)=>getDefaultMiddleware().concat(thunk)
});

export type AppDispatch=typeof store.dispatch;
export type RootState=ReturnType<typeof rootReducer>;
export const useAppDispatch=()=> useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState>=useSelector;

export default store;