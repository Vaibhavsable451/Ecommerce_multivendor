import React, { useState } from 'react'
import { useAppDispatch } from 'State/Store'
import { useFormik } from 'formik'
import { sendLoginSignupOtp, signup } from 'State/AuthSlice'
import { Button, TextField, Snackbar, Alert, CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const RegisterForm = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [otpSent, setOtpSent] = useState(false)

    const formik = useFormik({
        initialValues: {
            email: "",
            otp: "",
            fullName: ""
        },
        onSubmit: async (values) => {
            setLoading(true)
            try {
                await dispatch(signup({ email: values.email, otp: values.otp })).unwrap()
                setShowSuccess(true)
                setTimeout(() => {
                    navigate("/")
                }, 2000)
            } catch (error) {
                console.error("Signup failed:", error)
            } finally {
                setLoading(false)
            }
        }
    })

    const handleSendOtp = async () => {
        setLoading(true)
        try {
            await dispatch(sendLoginSignupOtp({ email: formik.values.email })).unwrap()
            setOtpSent(true)
        } catch (error) {
            console.error("Failed to send OTP:", error)
        } finally {
            setLoading(false)
        }
    }
  return (
    <div>
       <h1 className='text-center font-bold text-xl text-primary-color pb-8'>Signup</h1>

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
        {otpSent && (
          <div className='space-y-5'>
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
                helperText={formik.touched.otp && (formik.errors.otp as string)}
              />
            </div>
            <TextField
              fullWidth
              name="fullName"
              label="Full Name"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.fullName && Boolean(formik.errors.fullName)}
              helperText={formik.touched.fullName && (formik.errors.fullName as string)}
            />
          </div>
        )}
        
        {!otpSent ? (
          <Button 
            onClick={handleSendOtp} 
            fullWidth 
            variant='contained' 
            sx={{py:"11px"}}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Send OTP"}
          </Button>
        ) : (
          <Button 
            onClick={() => formik.handleSubmit()} 
            fullWidth 
            variant='contained' 
            sx={{py:"11px"}}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Signup"}
          </Button>
        )}
              
      </div>

      <Snackbar
        open={showSuccess}
        autoHideDuration={2000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Signup successful! Welcome to our marketplace.
        </Alert>
      </Snackbar>
    </div>
  )
}

export default RegisterForm