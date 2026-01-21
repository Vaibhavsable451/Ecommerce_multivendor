import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import SellersTable from '../Pages/Sellers/SellersTable'
import Coupon from '../Pages/Coupon/Coupon'
import AddNewCouponForm from '../Pages/Coupon/AddNewCouponForm'
import GridTable from '../Pages/HomePage/GridTable'
import ElectronicTable from '../Pages/HomePage/ElectronicTable'
import ShopByCategoryTable from '../Pages/HomePage/ShopByCategoryTable'
import Deal from '../Pages/HomePage/Deal'

const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path='dashboard' element={<div>Dashboard Content</div>} />
      <Route path='sellers' element={<SellersTable/>} />
      <Route path='coupon' element={<Coupon/>} />
      <Route path='add-coupon' element={<AddNewCouponForm/>} />
      <Route path='home-grid' element={<GridTable/>} />
      <Route path='electronics-category' element={<ElectronicTable/>} />
      <Route path='shop-by-category' element={<ShopByCategoryTable/>} />
      <Route path='deals' element={<Deal/>} />
    </Routes>
  )
}

export default AdminRoutes