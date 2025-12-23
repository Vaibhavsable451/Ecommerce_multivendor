import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/Api";


// Define the initial state using an interface
interface AiChatBotState {
  response: string | null;
  loading: boolean;
  error: string | null;
  messages: any[]
}

const initialState: AiChatBotState = {
  response: null,
  loading: false,
  error: null,
  messages:[]
};

// Define the async thunk for sending the message to the chatbot
export const chatBot = createAsyncThunk<
  any,
  { prompt: any; productId: number | null | undefined; userId: number | null }
>(
  "aiChatBot/generateResponse",
  async ({ prompt, productId, userId }, { rejectWithValue }) => {
    try {
      // JWT validation
      const jwt = localStorage.getItem("jwt");
      if (!jwt || jwt.split('.').length !== 3) {
        return rejectWithValue("You are not logged in or your session has expired. Please log in again.");
      }
      // Ensure prompt is always a string
      const chatPrompt = typeof prompt === 'string' ? prompt : prompt?.prompt || '';
      console.log('Sending prompt to backend:', chatPrompt);
      const response = await api.post("/ai/chat", { prompt: chatPrompt }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization":`Bearer ${localStorage.getItem("jwt")}`
        },
        params: {
          userId,
          productId,
        },
      });
      console.log("response from backend:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("ChatBot API error:", error);
      let backendMsg = error?.response?.data?.message || error?.message || "Failed to generate chatbot response";
      return rejectWithValue(backendMsg);
    }
  }
);

// Create the slice
const aiChatBotSlice = createSlice({
  name: "aiChatBot",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(chatBot.pending, (state,action) => {
        state.loading = true;
        state.error = null;
        const { prompt } = action.meta.arg;
        
        // You can log or use the data here
        // console.log('Pending request:', { prompt, productId, userId });
        const userPrompt={message:prompt.prompt,role:"user"}
        state.messages=[...state.messages,userPrompt]
      })
      .addCase(chatBot.fulfilled, (state, action) => {
        state.loading = false;
        state.response = action.payload;
        state.messages=[...state.messages,action.payload]
      })
      .addCase(chatBot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export the reducer
export default aiChatBotSlice.reducer;
