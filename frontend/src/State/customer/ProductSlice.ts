import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../config/Api';
import { Product } from 'types/ProductTypes';
import { PaginatedResponse } from 'types/ApiResponseTypes';

const API_URL = "/products";

export const fetchProductById = createAsyncThunk<Product, string>(
  "products/fetchProductById",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/${productId}`);
      const data = response.data;
      console.log("data: ", data)
      return data;
    }
    catch (error: any) {
      console.log("error:" + error)
      return rejectWithValue(error.message);
    }
  }
);

export const searchProduct = createAsyncThunk<Product[], string>("products/searchProduct", async (query, { rejectWithValue }) => {
  try {
    // Normalize the search query - trim whitespace
    const normalizedQuery = query.trim();
    
    // Log the search query for debugging
    console.log("Searching for products with query:", normalizedQuery);
    
    // IMPORTANT: Skip the /search endpoint and directly fetch all products
    // This ensures we always get products to search through
    console.log("Fetching all products for local search");
    
    // Fetch all products directly
    const allProductsResponse = await api.get(`${API_URL}`);
    
    // Check if we got a valid response
    if (!allProductsResponse.data || !allProductsResponse.data.content) {
      console.error("Invalid product data response:", allProductsResponse.data);
      return [];
    }
    
    const allProducts = allProductsResponse.data.content;
    console.log(`Fetched ${allProducts.length} products for local search`);
    
    if (Array.isArray(allProducts) && allProducts.length > 0) {
      // Perform client-side search
      const searchTerms = normalizedQuery.toLowerCase().split(/\s+/);
      
      // Improved filtering logic for better search results
      const filteredProducts = allProducts.filter((product: Product) => {
        // Get all searchable text fields from the product based on the actual Product type
        const title = (product.title || "").toLowerCase();
        const category = (product.category?.name || "").toLowerCase();
        const categoryId = (product.category?.categoryId || "").toLowerCase();
        const description = (product.description || "").toLowerCase();
        const color = (product.color || "").toLowerCase();
        const sizes = (product.sizes || "").toLowerCase();
        const sellerName = (product.seller?.businessDetails?.businessName || "").toLowerCase();
        
        // Special handling for women's products
        const isWomensProduct = 
          category.includes('women') || 
          category.includes('woman') || 
          category.includes('female') || 
          categoryId.includes('women') || 
          title.includes('women') || 
          title.includes('woman') || 
          title.includes('female') || 
          description.includes('women') || 
          description.includes('woman');
        
        // Combine all searchable text into one string for easier searching
        const searchableText = `${title} ${category} ${categoryId} ${description} ${color} ${sizes} ${sellerName} ${isWomensProduct ? 'women womens woman female' : ''}`;
        
        // Log for debugging specific categories
        if (normalizedQuery.toLowerCase().includes('women') || normalizedQuery.toLowerCase().includes('woman')) {
          console.log(`Product ${product.title} - Is Women's Product: ${isWomensProduct}`);
          console.log(`SearchableText: ${searchableText}`);
        }
        
        // For category searches like 'Men T-Shirts', try different combinations
        // Some terms might need to be combined (e.g., 't-shirts' or 'tshirts')
        if (searchTerms.length > 1) {
          // Try exact phrase match first
          const exactPhrase = normalizedQuery.toLowerCase();
          if (searchableText.includes(exactPhrase)) {
            return true;
          }
          
          // Try with different separators (e.g., t-shirts, tshirts)
          const withoutDash = exactPhrase.replace(/-/g, '');
          if (searchableText.includes(withoutDash)) {
            return true;
          }
          
          // Try without spaces
          const withoutSpaces = exactPhrase.replace(/\s+/g, '');
          if (searchableText.includes(withoutSpaces)) {
            return true;
          }
        }
        
        // Check if all search terms are found in product data
        // For partial matches, check if the search term is sufficiently long (>=3 chars) 
        // to avoid too many false positives, OR if it's a short exact match
        return searchTerms.every(term => {
            if (searchableText.includes(term)) return true;
            
            // Allow partial matching if term is at least 4 characters long
            // e.g. "clo" matches "clothing" or "cloths" matches "clothing" (fuzzy logic simulation)
            if (term.length >= 4) {
                 // Check if any word in searchable text starts with the term
                 // or if the term is a significant substring
                 return searchableText.split(' ').some(word => 
                     word.includes(term) || (term.includes(word) && word.length >= 4)
                 );
            }
            return false;
        });
      });
      
      console.log("Client-side search results:", filteredProducts.length);
      return filteredProducts;
    }
    
    // If we get here, no products were found
    return [];
  }
  catch (error: any) {
    console.log("Search error:", error);
    return rejectWithValue(error.message);
  }
}
)

interface FetchProductsParams {
  category?: string;
  pageNumber?: number;
  [key: string]: any;
}

export const fetchAllProducts = createAsyncThunk<PaginatedResponse<Product>, FetchProductsParams>("products/fetchAllProducts", async (params, { rejectWithValue }) => {
  try {
    const response = await api.get(`/products`, {
      params: {
        ...params,
        pageNumber: params.pageNumber || 0
      }
    });
    const data: PaginatedResponse<Product> = response.data;
    console.log("All product data: ", data);
    return data;
  }
  catch (error: any) {
    console.log("error:" + error);
    return rejectWithValue(error.message);
  }
}
)

interface ProductState {
  product: Product | null;
  products: Product[];
  totalPages: number;
  loading: boolean;
  error: string | null | undefined | any;
  searchProduct: Product[]
}

const initialState: ProductState = {
  product: null,
  products: [],
  totalPages: 1,
  loading: false,
  error: null,
  searchProduct: []

}

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProductById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchProductById.fulfilled, (state, action) => {
      state.loading = false;
      state.product = action.payload;
    });
    builder.addCase(fetchProductById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });


    builder.addCase(fetchAllProducts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAllProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload.content;
    });
    builder.addCase(fetchAllProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });


    builder.addCase(searchProduct.pending, (state) => {
      state.loading = true;
      // Don't clear previous results until new ones arrive
      // This prevents flashing empty content
    });
    builder.addCase(searchProduct.fulfilled, (state, action) => {
      state.loading = false;
      
      // Debug logging
      console.log('Search fulfilled with payload:', action.payload);
      
      // Handle null or undefined payload
      if (!action.payload) {
        console.warn('Search returned null or undefined payload');
        state.searchProduct = [];
        return;
      }
      
      // Ensure the payload is an array
      if (Array.isArray(action.payload)) {
        state.searchProduct = action.payload;
        console.log(`Set searchProduct with ${action.payload.length} items`);
      } else {
        console.warn('Search payload is not an array:', action.payload);
        // Try to convert to array if possible
        try {
          // Handle different response formats safely
          let arrayData: Product[] = [];
          
          if (typeof action.payload === 'object' && action.payload !== null) {
            // Check if payload has content property that is an array
            const payloadObj = action.payload as Record<string, unknown>;
            if (payloadObj && 'content' in payloadObj && Array.isArray(payloadObj.content)) {
              arrayData = payloadObj.content as Product[];
            } else {
              // Otherwise treat the payload itself as a single item
              arrayData = [action.payload as unknown as Product];
            }
          }
          
          state.searchProduct = arrayData;
          console.log(`Converted payload to array with ${arrayData.length} items`);
        } catch (e) {
          console.error('Failed to convert payload to array:', e);
          state.searchProduct = [];
        }
      }
    });
    builder.addCase(searchProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      console.error('Search rejected with error:', action.payload);
    });


  }

})


export default productSlice.reducer;








