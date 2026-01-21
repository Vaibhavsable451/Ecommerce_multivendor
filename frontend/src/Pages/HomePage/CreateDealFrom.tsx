import { Alert, Box, Button, CircularProgress, FormControl, FormHelperText, InputLabel, MenuItem, Select, Snackbar, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import { createDeal } from '../../../State/admin/DealSlice';
import { fetchHomePageData } from '../../../State/customer/customerSlice';
import * as Yup from 'yup';

const CreateDealFrom = () => {
  const dispatch = useAppDispatch();
  const { customer } = useAppSelector(store => store);
  const { deal } = useAppSelector(store => store);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Fetch home page data if not already loaded
  useEffect(() => {
    if (!customer.homePageData) {
      dispatch(fetchHomePageData());
    }
  }, [dispatch, customer.homePageData]);

  // Show success message when deal is created
  useEffect(() => {
    if (deal.dealCreated) {
      setSnackbarMessage('Deal created successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      formik.resetForm();
    }
    if (deal.error) {
      const errorMessage = typeof deal.error === 'object' ? 'Failed to create deal' : deal.error;
      setSnackbarMessage(`Error: ${errorMessage}`);
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  }, [deal.dealCreated, deal.error]);

  // Validation schema
  const validationSchema = Yup.object({
    discount: Yup.number()
      .required('Discount is required')
      .min(1, 'Discount must be at least 1%')
      .max(99, 'Discount cannot exceed 99%'),
    category: Yup.string().required('Category is required')
  });

  const formik = useFormik({
    initialValues: {
      discount: 0,
      category: ""
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("submit", values);
      const reqData = {
        discount: values.discount,
        category: {
          id: values.category
        }
      };
      dispatch(createDeal(reqData));
    }
  })
  // Handle loading state
  if (customer.loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <CircularProgress />
      </div>
    );
  }

  // Handle error state
  if (customer.error) {
    return (
      <div className="text-red-500 p-4">
        <Typography variant="h6">Error loading categories: {customer.error}</Typography>
      </div>
    );
  }

  // Handle no categories available
  if (!customer.homePageData?.dealCategories || customer.homePageData.dealCategories.length === 0) {
    return (
      <div className="p-4">
        <Typography variant="h6">No categories available for deals</Typography>
      </div>
    );
  }

  return (
    <Box component={"form"} onSubmit={formik.handleSubmit} className='space-y-6' >
      <Typography variant='h4' className='text-center'>
        Create Deal
      </Typography>
      <TextField
        fullWidth
        name="discount"
        label="Discount (%)"
        type="number"
        value={formik.values.discount}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.discount && Boolean(formik.errors.discount)}
        helperText={formik.touched.discount && formik.errors.discount}
      />

      <FormControl fullWidth error={formik.touched.category && Boolean(formik.errors.category)}>
        <InputLabel id="category-select-label">Category</InputLabel>
        <Select
          labelId="category-select-label"
          id="category-select"
          name="category"
          value={formik.values.category}
          label="Category"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          {customer.homePageData?.dealCategories.map((item) => (
            <MenuItem key={item.id} value={item.id}>{item.name || item.categoryId}</MenuItem>
          ))}
        </Select>
        {formik.touched.category && formik.errors.category && (
          <FormHelperText>{formik.errors.category}</FormHelperText>
        )}
      </FormControl>

      <Button 
        fullWidth 
        sx={{py:".9rem"}} 
        type='submit' 
        variant="contained"
        disabled={deal.loading || !formik.isValid}
      >
        {deal.loading ? <CircularProgress size={24} color="inherit" /> : 'Create Deal'}
      </Button>

      {/* Success/Error Snackbar */}
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default CreateDealFrom