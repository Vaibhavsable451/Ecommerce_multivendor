import React, { useEffect } from 'react'
import OrderItemCard from './OrderItemCard'
import { useAppDispatch, useAppSelector } from '../../../State/Store'
import { fetchUserOrderHistory } from '../../../State/customer/OrderSlice'
import LoadingSpinner from '../../../component/LoadingSpinner'
import { Order, OrderItem } from '../../../types/orderTypes'

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

const Orders = () => {
  const dispatch = useAppDispatch()
  const { order } = useAppSelector(store => store)
  
  useEffect(() => {
    const jwt = localStorage.getItem("jwt") || ""
    dispatch(fetchUserOrderHistory(jwt))
  }, [dispatch])

  if (order.loading) {
    return <LoadingSpinner />
  }

  if (order.error) {
    return (
      <div className='text-sm min-h-screen flex items-center justify-center'>
        <p className='text-red-500'>Error loading orders: {order.error}</p>
      </div>
    )
  }

  if (!order.orders || order.orders.length === 0) {
    return (
      <div className='text-sm min-h-screen flex items-center justify-center'>
        <p>No orders found</p>
      </div>
    )
  }

  return (
    <div className='text-sm min-h-screen'>
      <div className='pb-5'> 
        <h1 className='font-semibold'>All Orders</h1> 
        <p>from anytime</p>
      </div>
      <div className='space-y-2'>
        {order.orders.map((order: Order) => (
          order.orderItems.map((item: OrderItem) => (
            <OrderItemCard key={`${order.id}-${item.id}`} order={order} item={item} />
          ))
        ))}
      </div>
    </div>
  )
}

export default Orders