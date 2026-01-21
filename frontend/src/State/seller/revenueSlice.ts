// In revenueSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../config/Api';

interface RevenueData {
  date: string;
  revenue: number;
}

interface RevenueState {
  data: RevenueData[];
  loading: boolean;
  error: string | null;
}

const initialState: RevenueState = {
  data: [],
  loading: false,
  error: null,
};

const processRevenueData = (data: any[]): RevenueData[] => {
  return data.map(item => {
    // Convert scientific notation to regular number
    let revenue = item.revenue;
    if (typeof revenue === 'string' && revenue.includes('E')) {
      revenue = Number(revenue).toFixed(2);
    }
    return {
      date: item.date,
      revenue: Number(revenue) || 0
    };
  });
};

export const fetchRevenueData = createAsyncThunk<
  RevenueData[],
  { type: string; jwt: string }
>(
  'revenue/fetchRevenueData',
  async ({ type, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/sellers/revenue/chart?type=${type}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      
      console.log('Raw API Response:', response.data);
      const processedData = processRevenueData(response.data);
      console.log('Processed Data:', processedData);
      
      return processedData;
    } catch (error: any) {
      console.error('Error:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch revenue data'
      );
    }
  }
);

const revenueSlice = createSlice({
  name: 'revenue',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRevenueData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRevenueData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchRevenueData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default revenueSlice.reducer;