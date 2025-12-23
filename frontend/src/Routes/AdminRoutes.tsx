import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import SellersTable from '../admin/Pages/Sellers/SellersTable'
import Coupon from '../admin/Pages/Coupon/Coupon'
import AddNewCouponForm from '../admin/Pages/Coupon/AddNewCouponForm'
import GridTable from '../admin/Pages/HomePage/GridTable'
import ElectronicTable from '../admin/Pages/HomePage/ElectronicTable'
import ShopByCategoryTable from '../admin/Pages/HomePage/ShopByCategoryTable'
import Deal from '../admin/Pages/HomePage/Deal'

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