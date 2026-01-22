import { Button, TextField, Snackbar, Alert, CircularProgress } from '@mui/material'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendLoginSignupOtp } from 'State/AuthSlice'
import { useAppDispatch } from 'State/Store'
import { sellerLogin } from 'State/seller/sellerAuthSlice'

const SellerLoginForm = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  React.useEffect(() => {
    const token = localStorage.getItem('sellerToken');
    if (token) {
      navigate('/seller', { replace: true });
    }
  }, [navigate]);

  const formik = useFormik({
    initialValues: {
      email: "",
      otp: ""
    },
    validate: (values) => {
      const errors: { email?: string; otp?: string } = {};
      if (!values.email) errors.email = 'Email is required';
      if (isOtpSent && !values.otp) errors.otp = 'OTP is required'; // Only validate OTP if sent
      return errors;
    },
    onSubmit: async (values) => {
      setLoading(true)
      try {
        const result = await dispatch(sellerLogin({email:values.email, otp:values.otp})).unwrap()
        if (result?.jwt) {
          localStorage.setItem('sellerToken', result.jwt);
          setShowSuccess(true)
          formik.resetForm();
          setTimeout(() => navigate('/seller', { replace: true }), 1500);
        }
      } catch (error: any) {
        setErrorMsg(error?.message || 'Login failed. Please try again.');
        setShowError(true);
        formik.setErrors({ otp: error?.message || 'Login failed. Please try again.' })
      } finally {
        setLoading(false)
      }
    }
  })

  const handleSendOtp = () => {
    setIsOtpSent(true);
    dispatch(sendLoginSignupOtp({email:formik.values.email}))
  }

  return (
    <div>
      <h1 className='text-center font-bold text-xl text-primary-color pb-5'>
        Login As Seller
      </h1>
      <div className='space-y-5'>
        <TextField
          fullWidth
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        
        {isOtpSent && (
          <div className='space-y-2'>
            <p className='font-medium text-sm opacity-60'>Enter OTP sent to your email</p>
            <TextField
              fullWidth
              name="otp"
              label="Otp"
              value={formik.values.otp}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.otp && Boolean(formik.errors.otp)}
              helperText={formik.touched.otp && formik.errors.otp}
            />
          </div>
        )}

        {!isOtpSent ? (
          <Button 
            onClick={handleSendOtp} 
            fullWidth 
            variant='contained' 
            sx={{py:"11px"}}
            disabled={loading}
          >
            Send OTP
          </Button>
         ) : (
          <Button 
            onClick={() => formik.handleSubmit()} 
            fullWidth 
            variant='contained' 
            sx={{py:"11px"}}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        )}
      </div>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={1500}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Login successful! Redirecting to dashboard...
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={showError}
        autoHideDuration={2000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {errorMsg}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default SellerLoginForm