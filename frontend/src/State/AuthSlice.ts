import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../config/Api";
import { User } from "../types/userTypes";

// ✅ Fix: Use unique action types instead of URL paths
export const sendLoginSignupOtp = createAsyncThunk("auth/sendLoginSignupOtp",
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/sent/login-signup-otp", { email });
      console.log("login otp:", response.data);
      return response.data; // ✅ Return response data
    } catch (error: any) {
      console.error("Error in sendLoginSignupOtp:", error);
      return rejectWithValue(error.response?.data || "Something went wrong"); // ✅ Handle errors properly
    }
  }
)

export const signin = createAsyncThunk<any,any>("auth/signin", // ✅ Fix: Use proper action type
  async (loginRequest: { email: string; otp: string; navigate: any }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/signing", loginRequest);
      console.log("login otp:", response.data);
      localStorage.setItem("jwt",response.data.jwt)
      loginRequest.navigate("/");
      return response.data.jwt; // ✅ Return response data
    } catch (error: any) {
      console.error("Error in signin:", error);
      return rejectWithValue(error.response?.data || "Signin failed"); // ✅ Handle errors properly
    }
  }
)

export const adminSigninWithOtp = createAsyncThunk<any,any>("auth/adminSigninWithOtp",
  async (loginRequest: { email: string; otp: string; navigate: any }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/signing", loginRequest);
      console.log("admin login otp:", response.data);
      localStorage.setItem("jwt", response.data.jwt);
      localStorage.setItem("adminJwt", response.data.jwt);
      localStorage.setItem("isAdmin", "true");
      loginRequest.navigate("/admin");
      return response.data.jwt;
    } catch (error: any) {
      console.error("Error in admin signin:", error);
      return rejectWithValue(error.response?.data || "Admin login failed");
    }
  }
)

export const signup = createAsyncThunk<any,any>("auth/signup", // ✅ Fix: Use proper action type
  async (signupRequest: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/signup", signupRequest);
      console.log("login otp:", response.data);
      localStorage.setItem("jwt",response.data.jwt)
      return response.data.jwt; // ✅ Return response data
    } catch (error: any) {
      console.error("Error in signup:", error);
      return rejectWithValue(error.response?.data || "Signup failed"); // ✅ Handle errors properly
    }
  }
)

export const fetchUserProfile = createAsyncThunk<any,any>("users/fetchUserProfile", // ✅ Fix: Use proper action type
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/users/profile");
      console.log("user profile:", response.data);
      return response.data; // ✅ Return response data
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      return rejectWithValue(error.response?.data || "Profile fetch failed"); // ✅ Handle errors properly
    }
  }
)

export const adminDirectLogin = createAsyncThunk<any,any>("auth/adminDirectLogin",
  async (adminCredentials: { email: string; password: string; navigate: any }, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/login", {
        email: adminCredentials.email,
        password: adminCredentials.password
      });
      console.log("admin direct login:", response.data);
      localStorage.setItem("jwt", response.data.jwt);
      localStorage.setItem("adminJwt", response.data.jwt); // Store admin JWT separately
      localStorage.setItem("isAdmin", "true"); // Flag to identify admin user
      adminCredentials.navigate("/admin");
      return response.data.jwt;
    } catch (error: any) {
      console.error("Error in admin direct login:", error);
      return rejectWithValue(error.response?.data || "Admin login failed");
    }
  }
)

export const logout=createAsyncThunk<any,any>("auth/logout",
  async (navigate, {rejectWithValue}) => {
    try{
      localStorage.clear()
      console.log("logout success");
      navigate("/")
    }catch(error){
      console.log("error - - -",error);
    }
  }
)

interface AuthState {
  profileUpdated: any;
  error: any;
  jwt: string | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  user: User | null;
  loading: boolean;
  otpSent: boolean;
}
const initialState: AuthState = {
  jwt: null,
  otpSent: false,
  isLoggedIn: false,
  isAdmin: false,
  user: null,
  loading: false,
  profileUpdated: undefined,
  error: undefined
};


const authSlice=createSlice({
       name:"auth",
       initialState,
       reducers:{},
       extraReducers:(builder)=>{

        builder.addCase(sendLoginSignupOtp.pending,(state)=>{
          state.loading=true;

        })
        builder.addCase(sendLoginSignupOtp.fulfilled,(state)=>{
          state.loading=false;
          state.otpSent=true;


        })
        builder.addCase(sendLoginSignupOtp.rejected,(state)=>{
          state.loading=false;

        })

         builder.addCase(signin.fulfilled,(state,action)=>{
          state.jwt=action.payload
          state.isLoggedIn=true
         })
         builder.addCase(signup.fulfilled,(state,action)=>{
          state.jwt=action.payload
          state.isLoggedIn=true
         })

         builder.addCase(adminSigninWithOtp.pending,(state)=>{
          state.loading=true;
         })
         builder.addCase(adminSigninWithOtp.fulfilled,(state,action)=>{
          state.loading=false;
          state.jwt=action.payload;
          state.isLoggedIn=true;
          state.isAdmin=true;
         })
         builder.addCase(adminSigninWithOtp.rejected,(state)=>{
          state.loading=false;
         })

         builder.addCase(fetchUserProfile.fulfilled,(state,action)=>{
          state.user=action.payload
          state.isLoggedIn=true

         })

         builder.addCase(adminDirectLogin.pending,(state)=>{
          state.loading=true;
         })
         
         builder.addCase(adminDirectLogin.fulfilled,(state,action)=>{
          state.loading=false;
          state.jwt=action.payload;
          state.isLoggedIn=true;
          state.isAdmin=true;
         })
         
         builder.addCase(adminDirectLogin.rejected,(state)=>{
          state.loading=false;
         })

         builder.addCase(logout.fulfilled,(state)=>{
          state.jwt = null;
          state.isLoggedIn = false;
          state.isAdmin = false;
          state.user = null;
          // Clear admin-related localStorage items
          localStorage.removeItem('adminJwt');
          localStorage.removeItem('isAdmin');
         })
       }
})

export default authSlice.reducer;
