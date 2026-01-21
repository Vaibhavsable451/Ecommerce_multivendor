import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import { Product } from "../../types/ProductTypes";

export const fetchSellerProducts=createAsyncThunk<Product[],any>( "/sellerProduct/fetchSellerProducts",
  async(jwt,{rejectWithValue})=>{
    try {
      const response=await api.get<Product[]>(`/sellers/products`,{
        headers:{
          Authorization: `Bearer ${jwt}`,

        },
      })
      console.log("seller products ",response.data)
      return response.data;
  } catch (error:any) {
      console.log("error ", error.response)
      return rejectWithValue(error.response.data);
  }
  }
);

export const createProduct = createAsyncThunk< Product, { request:any; jwt:string | null }>(
  "/sellerProduct/createProduct",
  async ({ request, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.post<Product>(`/sellers/products`, request, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      console.log("product created ", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error ", error.response);
      return rejectWithValue(error.response.data);
    }
  }
)


interface SellerProductState {
  products: Product[];
  loading: boolean;
  error: string | null | undefined;
 
}

const initialState: SellerProductState = {
  products: [],
  loading: false,
  error: null,
  
}
const sellerProductSlice=createSlice({
  name:"sellerProduct",
  initialState,
  reducers:{},
  extraReducers: (builder) =>{
    builder.addCase(fetchSellerProducts.pending,(state)=>{
      state.loading=true;
    })
    builder.addCase(fetchSellerProducts.fulfilled,(state,action)=>{
      state.loading=false;
      state.products=action.payload;
    })
    builder.addCase(fetchSellerProducts.rejected,(state,action)=>{
      state.loading=false;
      state.error=action.error.message;
      })
      builder.addCase(createProduct.pending,(state)=>{
        state.loading=true;
      })
      builder.addCase(createProduct.fulfilled,(state,action)=>{
        state.loading=false;
        state.products.push(action.payload)
      })
      builder.addCase(createProduct.rejected,(state,action)=>{
        state.loading=false;
        state.error=action.error.message;
        })
      
    }
});

export default sellerProductSlice.reducer