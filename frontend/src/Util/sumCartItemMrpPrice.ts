import { CartItems } from '../types/cartTypes';
export  const sumCartItemMrpPrice =(cartItems:CartItems[])=>{
  
  return cartItems.reduce((acc, item) => acc+item.mrpPrice*item.quantity,0)

}

export const sumCartItemSellingPrice=(cartItems:CartItems[])=>{
  return cartItems.reduce((acc, item) => acc+item.sellingPrice*item.quantity,0)

}

