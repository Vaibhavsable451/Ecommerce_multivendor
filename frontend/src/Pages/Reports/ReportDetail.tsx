import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Alert, 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Chip, 
  CircularProgress, 
  Container, 
  Divider, 
  Grid, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography 
} from '@mui/material';
import { ArrowBack, Download, PictureAsPdf } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import { fetchReportById } from '../../../State/admin/adminReportSlice';

// Import chart components
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ReportDetail = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentReport, loading, error } = useAppSelector((state) => state.adminReport);

  useEffect(() => {
    if (reportId) {
      dispatch(fetchReportById(parseInt(reportId)));
    }
  }, [dispatch, reportId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const renderReportContent = () => {
    if (!currentReport || !currentReport.data) return null;

    // Different visualizations based on report type
    switch (currentReport.type) {
      case 'sales':
        return renderSalesReport(currentReport.data);
      case 'inventory':
        return renderInventoryReport(currentReport.data);
      case 'customers':
        return renderCustomerReport(currentReport.data);
      case 'revenue':
        return renderRevenueReport(currentReport.data);
      case 'products':
        return renderProductReport(currentReport.data);
      default:
        return (
          <Box p={3} textAlign="center">
            <Typography>No visualization available for this report type.</Typography>
          </Box>
        );
    }
  };

  const renderSalesReport = (data: any) => {
    // Mock data for demonstration
    const mockData = [
      { name: 'Jan', sales: 4000 },
      { name: 'Feb', sales: 3000 },
      { name: 'Mar', sales: 2000 },
      { name: 'Apr', sales: 2780 },
      { name: 'May', sales: 1890 },
      { name: 'Jun', sales: 2390 },
    ];

    return (
      <>
        <Typography variant="h6" gutterBottom>Sales Trend</Typography>
        <Box height={400} mb={4}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data.salesTrend || mockData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        <Typography variant="h6" gutterBottom>Top Selling Products</Typography>
        <TableContainer component={Paper} elevation={3} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Product</strong></TableCell>
                <TableCell><strong>Category</strong></TableCell>
                <TableCell align="right"><strong>Units Sold</strong></TableCell>
                <TableCell align="right"><strong>Revenue</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(data.topProducts || []).map((product: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell align="right">{product.unitsSold}</TableCell>
                  <TableCell align="right">${product.revenue.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  };

  const renderInventoryReport = (data: any) => {
    // Mock data for demonstration
    const mockData = [
      { name: 'Electronics', value: 400 },
      { name: 'Clothing', value: 300 },
      { name: 'Home & Kitchen', value: 300 },
      { name: 'Beauty', value: 200 },
      { name: 'Books', value: 100 },
    ];

    return (
      <>
        <Typography variant="h6" gutterBottom>Inventory by Category</Typography>
        <Box height={400} mb={4}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.inventoryByCategory || mockData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {(data.inventoryByCategory || mockData).map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        <Typography variant="h6" gutterBottom>Low Stock Items</Typography>
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Product</strong></TableCell>
                <TableCell><strong>Category</strong></TableCell>
                <TableCell align="right"><strong>Current Stock</strong></TableCell>
                <TableCell align="right"><strong>Reorder Level</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(data.lowStockItems || []).map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell align="right">{item.currentStock}</TableCell>
                  <TableCell align="right">{item.reorderLevel}</TableCell>
                  <TableCell>
                    <Chip 
                      label={item.currentStock === 0 ? 'Out of Stock' : 'Low Stock'} 
                      color={item.currentStock === 0 ? 'error' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  };

  const renderCustomerReport = (data: any) => {
    // Mock data for demonstration
    const mockData = [
      { name: 'New', value: 400 },
      { name: 'Returning', value: 300 },
      { name: 'Inactive', value: 300 },
    ];

    return (
      <>
        <Typography variant="h6" gutterBottom>Customer Segments</Typography>
        <Box height={400} mb={4}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.customerSegments || mockData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {(data.customerSegments || mockData).map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        <Typography variant="h6" gutterBottom>Customer Acquisition Trend</Typography>
        <Box height={400} mb={4}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data.acquisitionTrend || []}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="newCustomers" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </>
    );
  };

  const renderRevenueReport = (data: any) => {
    return (
      <>
        <Typography variant="h6" gutterBottom>Revenue by Month</Typography>
        <Box height={400} mb={4}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.revenueByMonth || []}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Total Revenue</Typography>
                <Typography variant="h4">${data.totalRevenue?.toFixed(2) || '0.00'}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Average Order Value</Typography>
                <Typography variant="h4">${data.averageOrderValue?.toFixed(2) || '0.00'}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Profit Margin</Typography>
                <Typography variant="h4">{data.profitMargin?.toFixed(2) || '0.00'}%</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </>
    );
  };

  const renderProductReport = (data: any) => {
    return (
      <>
        <Typography variant="h6" gutterBottom>Product Performance</Typography>
        <Box height={400} mb={4}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.productPerformance || []}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="sales" fill="#8884d8" name="Sales" />
              <Bar yAxisId="right" dataKey="views" fill="#82ca9d" name="Views" />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Typography variant="h6" gutterBottom>Product Ratings</Typography>
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Product</strong></TableCell>
                <TableCell><strong>Category</strong></TableCell>
                <TableCell align="right"><strong>Average Rating</strong></TableCell>
                <TableCell align="right"><strong>Total Reviews</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(data.productRatings || []).map((product: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell align="right">{product.averageRating.toFixed(1)}</TableCell>
                  <TableCell align="right">{product.totalReviews}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/admin/reports')} sx={{ mb: 2 }}>
          Back to Reports
        </Button>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!currentReport) {
    return (
      <Container>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/admin/reports')} sx={{ mb: 2 }}>
          Back to Reports
        </Button>
        <Alert severity="info">
          Report not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/admin/reports')}>
          Back to Reports
        </Button>
        {currentReport.downloadUrl && (
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<Download />}
            href={currentReport.downloadUrl}
          >
            Download Report
          </Button>
        )}
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>{currentReport.title}</Typography>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="textSecondary">Report Type</Typography>
            <Typography variant="body1">
              {currentReport.type.charAt(0).toUpperCase() + currentReport.type.slice(1)} Report
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="textSecondary">Generated On</Typography>
            <Typography variant="body1">{formatDate(currentReport.generatedAt)}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="textSecondary">Status</Typography>
            <Chip 
              label={currentReport.status.charAt(0).toUpperCase() + currentReport.status.slice(1)}
              color={currentReport.status === 'completed' ? 'success' : 
                     currentReport.status === 'processing' ? 'warning' : 'error'}
            />
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        {renderReportContent()}
      </Paper>
    </Container>
  );
};

export default ReportDetail;
