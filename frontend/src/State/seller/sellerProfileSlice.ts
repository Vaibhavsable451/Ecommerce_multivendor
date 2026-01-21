import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/Api";

export const fetchSellerProfile = createAsyncThunk(
  "sellerProfile/fetchSellerProfile",
  async (jwt: string, { rejectWithValue }) => {
    try {
      const response = await api.get("/sellers/profile", {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Profile fetch failed");
    }
  }
);

export interface SellerProfile {
  id: number;
  sellerName: string;
  email: string;
  mobile: string;
  accountStatus: string;
  gstin: string | null;
  businessDetails: {
    businessName: string;
    businessEmail: string | null;
    businessMobile: string | null;
    businessAddress: string | null;
    logo: string | null;
    banner: string | null;
  };
  // You can add other fields (bankDetails, pickupAddress, etc.) as needed
}

interface SellerProfileState {
  profile: SellerProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: SellerProfileState = {
  profile: null,
  loading: false,
  error: null,
};

const sellerProfileSlice = createSlice({
  name: "sellerProfile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchSellerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? String(action.payload) : null;
      });
  },
});

export default sellerProfileSlice.reducer;
