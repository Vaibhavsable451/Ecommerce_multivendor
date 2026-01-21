import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { api } from '../../config/Api';


// Define the API endpoint
const API_ENDPOINT = '/api/seller/revenue/chart';
interface RevenueChart{
    date: string;
    revenue:number;
}
// Define interfaces for the state
interface RevenueState {
  chart:RevenueChart[];
  loading: boolean;
  error: string | null;
}

// Initial state for the slice
const initialState: RevenueState = {
  chart: [],
  loading: false,
  error: null,
};

export const fetchRevenueChart = createAsyncThunk(
    'revenue/fetchRevenueChart',
    async ({ type, jwt }: { type: string; jwt: string }, { rejectWithValue }) => {
      try {
        const response = await api.get(`${API_ENDPOINT}?type=${type}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
          }
        });
        return response.data;
      } catch (error: any) {
        console.error('Revenue chart fetch error:', error);
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch revenue chart');
      }
    }
  );








// Create RevenueSlice
const revenueSlice = createSlice({
  name: 'revenue',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRevenueChart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRevenueChart.fulfilled, (state, action) => {
        state.loading = false;
        state.chart = action.payload;
      })
      .addCase(fetchRevenueChart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

  },
});

export default revenueSlice.reducer;
