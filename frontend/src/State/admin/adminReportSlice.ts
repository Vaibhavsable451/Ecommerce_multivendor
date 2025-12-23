import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../config/Api';

// Define report types
export interface ReportData {
  id?: number;
  title: string;
  type: string;
  generatedAt: string;
  data: any;
  status: 'completed' | 'processing' | 'failed';
  downloadUrl?: string;
}

export interface ReportFilter {
  startDate?: string;
  endDate?: string;
  category?: string;
  reportType: string;
}

// Async thunks for report operations
export const generateReport = createAsyncThunk<ReportData, ReportFilter>(
  'adminReport/generateReport',
  async (reportFilter, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/reports/generate', reportFilter, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error generating report:', error);
      return rejectWithValue(error.response?.data || 'Failed to generate report');
    }
  }
);

export const fetchReports = createAsyncThunk<ReportData[]>(
  'adminReport/fetchReports',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/reports', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching reports:', error);
      return rejectWithValue(error.response?.data || 'Failed to fetch reports');
    }
  }
);

export const fetchReportById = createAsyncThunk<ReportData, number>(
  'adminReport/fetchReportById',
  async (reportId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/reports/${reportId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        }
      });
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching report ${reportId}:`, error);
      return rejectWithValue(error.response?.data || 'Failed to fetch report');
    }
  }
);

// Define the state interface
interface AdminReportState {
  reports: ReportData[];
  currentReport: ReportData | null;
  loading: boolean;
  generating: boolean;
  error: string | null;
}

// Initial state
const initialState: AdminReportState = {
  reports: [],
  currentReport: null,
  loading: false,
  generating: false,
  error: null
};

// Create the slice
const adminReportSlice = createSlice({
  name: 'adminReport',
  initialState,
  reducers: {
    clearCurrentReport: (state) => {
      state.currentReport = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Generate report cases
    builder.addCase(generateReport.pending, (state) => {
      state.generating = true;
      state.error = null;
    });
    builder.addCase(generateReport.fulfilled, (state, action) => {
      state.generating = false;
      state.reports.unshift(action.payload); // Add to the beginning of the array
      state.currentReport = action.payload;
    });
    builder.addCase(generateReport.rejected, (state, action) => {
      state.generating = false;
      state.error = action.payload as string;
    });

    // Fetch reports cases
    builder.addCase(fetchReports.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchReports.fulfilled, (state, action) => {
      state.loading = false;
      state.reports = action.payload;
    });
    builder.addCase(fetchReports.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch report by ID cases
    builder.addCase(fetchReportById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchReportById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentReport = action.payload;
    });
    builder.addCase(fetchReportById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  }
});

export const { clearCurrentReport, clearError } = adminReportSlice.actions;
export default adminReportSlice.reducer;
