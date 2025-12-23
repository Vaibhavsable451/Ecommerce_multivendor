// types/payoutsTypes.ts

import { Transaction } from "../State/seller/transactionSlice";
import { Order } from "./orderTypes";
import { Seller } from "./SellerTypes";

import { User } from "./userTypes";

export interface Payouts {
  id: number;
  transactions: Transaction[];
  seller: Seller;
  amount: number;
  status: "PENDING" | "SUCCESS" | "REJECTED";
  date: string;
}
