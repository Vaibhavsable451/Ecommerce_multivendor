import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";

export const sellerLogin = createAsyncThunk<any, any>("/seller/login",
  async(loginRequest, {rejectWithValue}) => {
    try {
      const response = await api.post("/sellers/login", loginRequest);
      console.log("seller login response", response.data);
      const jwt = response.data.jwt;
      if (jwt) {
        localStorage.setItem("jwt", jwt);
        return response.data;
      }
      return rejectWithValue("Invalid login response");
    } catch(error: any) {
      console.log("seller login error:", error);
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

interface SellerAuthState {
  jwt: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: any;
}

const initialState: SellerAuthState = {
  jwt: localStorage.getItem("jwt"),
  isLoggedIn: !!localStorage.getItem("jwt"),
  loading: false,
  error: null
};

const sellerAuthSlice = createSlice({
  name: "sellerAuth",
  initialState,
  reducers: {
    sellerLogout: (state) => {
      localStorage.removeItem("jwt");
      state.jwt = null;
      state.isLoggedIn = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sellerLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sellerLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.jwt = action.payload.jwt;
        state.isLoggedIn = true;
      })
      .addCase(sellerLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { sellerLogout } = sellerAuthSlice.actions;
export default sellerAuthSlice.reducer;