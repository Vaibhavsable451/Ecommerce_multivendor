import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export interface BillRequest {
  startDate: string;
  endDate: string;
  sellerId?: string;
}

export interface BillResponse {
  billId: string;
  sellerId: string;
  periodStart: string;
  periodEnd: string;
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'FAILED';
  items: BillItem[];
  createdAt: string;
}

export interface BillItem {
  orderId: string;
  orderDate: string;
  amount: number;
  status: string;
}

// Mock implementation to simulate successful bill generation
export const generateBill = async (billRequest: BillRequest): Promise<BillResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return a dummy success response
  return {
    billId: `BILL-${Date.now()}`,
    sellerId: billRequest.sellerId || "seller-123",
    periodStart: billRequest.startDate,
    periodEnd: billRequest.endDate,
    totalAmount: 0,
    status: 'PAID',
    items: [],
    createdAt: new Date().toISOString()
  };
};

export const downloadBill = async (billId: string): Promise<Blob> => {
  try {
    const token = localStorage.getItem('jwt');
    const response = await axios.get(`${API_URL}/bills/${billId}/download`, {
      responseType: 'blob',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error downloading bill:', error);
    throw error;
  }
};
