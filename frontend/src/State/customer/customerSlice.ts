import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { HomeCategory, HomeData } from '../../types/HomeCategoryTypes';
import { api } from '../../config/Api';

export const fetchHomePageData = createAsyncThunk(
  'home/fetchHomePageData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/home/data', {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`
        }
      });
      console.log("home page data fetched --- ", response.data);
      return response.data;
    } catch (error: any) {
      // Extract a simple string error message to avoid object rendering issues
      let errorMessage = 'Failed to fetch home page data';
      if (error.response?.data?.message && typeof error.response.data.message === 'string') {
        errorMessage = error.response.data.message;
      } else if (error.message && typeof error.message === 'string') {
        errorMessage = error.message;
      }
      console.log("error fetching home page data ", errorMessage, error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const createHomeCategories = createAsyncThunk<HomeData, HomeCategory[]>(
  'home/createHomeCategories',
  async (homeCategories, { rejectWithValue }) => {
    try {
      const response = await api.post('/home/categories', homeCategories);
      console.log("home categories created --- ",response.data)
      return response.data;
    } catch (error: any) {
      // Handle the error and return it to be used in rejected action
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create home categories';
      console.log("errr ",errorMessage,error)
      return rejectWithValue(errorMessage);
    }
  }
);
interface HomeState {
  homePageData: HomeData | null;
  homeCategories: HomeCategory[];
  loading: boolean;
  error: string | null;
}

const initialState: HomeState = {
  homePageData:null,
  homeCategories: [],
  loading: false,
  error: null,
};

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle fetchHomePageData lifecycle
    builder.addCase(fetchHomePageData.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchHomePageData.fulfilled, (state, action) => {
      state.loading = false;
      state.homePageData = action.payload;
    });
    builder.addCase(fetchHomePageData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch home page data';
    });

    // Handle createHomeCategories lifecycle
    builder.addCase(createHomeCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createHomeCategories.fulfilled, (state, action) => {
      state.loading = false;
      state.homePageData = action.payload;
    });
    builder.addCase(createHomeCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to create home categories';
    });
  },
});

export default homeSlice.reducer;