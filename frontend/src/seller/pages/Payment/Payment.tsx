import { Button, Card, Divider, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, Box, Snackbar, Alert } from '@mui/material';
import store, { useAppSelector } from '../../../State/Store';
import React, { useState } from 'react';
import TransactionTable from './Transaction';
import { generateBill, BillRequest } from '../../../services/billService';

type AlertType = 'success' | 'error' | 'info' | 'warning';

interface AlertState {
  open: boolean;
  message: string;
  severity: AlertType;
}

const Payment = () => {
  const [openBillDialog, setOpenBillDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [alert, setAlert] = useState<AlertState>({
    open: false,
    message: '',
    severity: 'info'
  });
  
  // Format date to YYYY-MM-DD (local timezone)
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Set default date range to current month
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const [startDate, setStartDate] = useState<string>(formatDate(firstDayOfMonth));
  const [endDate, setEndDate] = useState<string>(formatDate(today));
  
  const showAlert = (message: string, severity: AlertType = 'info') => {
    setAlert({ open: true, message, severity });
  };
  
  const handleCloseAlert = () => {
    setAlert(prev => ({ ...prev, open: false }));
  };

  const downloadMockBill = (request: BillRequest) => {
    const content = `
      BILL REPORT
      -----------
      Seller ID: ${request.sellerId || "seller-123"}
      Period: ${request.startDate} to ${request.endDate}
      Generated At: ${new Date().toLocaleString()}
      
      Summary:
      Total Orders: 0
      Total Amount: ₹0
      Status: PAID
      
      ----------------------------------------
      This is a computer generated document.
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bill_report_${request.startDate}_${request.endDate}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleGenerateBill = async () => {
    if (!startDate || !endDate) return;
    
    setIsGenerating(true);
    
    try {
      const billRequest: BillRequest = {
        startDate,
        endDate
      };
      
      console.log('Generating bill with request:', billRequest);
      
      // Call the bill generation API
      const response = await generateBill(billRequest);
      console.log('Bill generated successfully:', response);
      
      // Download the mock bill
      downloadMockBill(billRequest);
      
      // Show success message
      showAlert('Bill generated successfully! Downloading file...', 'success');
      
      // Close the dialog
      setOpenBillDialog(false);
      
    } catch (error) {
      console.error('Error generating bill:', error);
      showAlert(
        error instanceof Error ? error.message : 'Failed to generate bill. Please try again.',
        'error'
      );
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };
  
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  const { seller } = useAppSelector((store) => store);

  return (
    <div className='space-y-5'>
      <Card className='rounded-md space-y-4 p-5'>
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-gray-600 font-medium'>Total Earning</h1>
            <h1 className='font-bold text-xl pb-1'>₹{seller.report?.totalEarnings || 0}</h1>
            <p className='text-gray-600 font-medium pt-1'>Last Payment: <strong>₹0</strong></p>
          </div>
          <Button 
            variant='contained' 
            color='primary'
            onClick={() => setOpenBillDialog(true)}
          >
            Generate Bill
          </Button>
        </div>
        <Divider />
      </Card>

      {/* Bill Generation Dialog */}
      <Dialog open={openBillDialog} onClose={() => setOpenBillDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Generate Payment Bill</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Select Date Range
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Start Date"
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
              <TextField
                label="End Date"
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  max: formatDate(new Date())
                }}
                fullWidth
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              This will generate a bill for all transactions between the selected dates.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setOpenBillDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleGenerateBill} 
            variant="contained"
            color="primary"
            disabled={!startDate || !endDate || isGenerating}
            sx={{ minWidth: 120 }}
          >
            {isGenerating ? 'Generating...' : 'Generate Bill'}
          </Button>
        </DialogActions>
      </Dialog>

      <div className='pt-10 space-y-3'>
        <h2 className='text-xl font-semibold'>Transaction History</h2>
        <TransactionTable />
      </div>
      
      {/* Alert notification */}
      <Snackbar 
        open={alert.open} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alert.severity}
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default Payment