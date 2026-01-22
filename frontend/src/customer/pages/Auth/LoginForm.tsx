import React, { useEffect, useState } from 'react'
import store, { useAppDispatch, useAppSelector } from 'State/Store'
import { useFormik } from 'formik'
import { Button, CircularProgress, FormControlLabel, Radio, RadioGroup, TextField, Snackbar, Alert } from '@mui/material'
import { sendLoginSignupOtp, signin } from 'State/AuthSlice'
import { useNavigate } from 'react-router-dom'
import OTPInput from '../../components/otpfiled/OTPInput'
import { sellerLogin } from 'State/seller/sellerAuthSlice'

const LoginForm = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState<number>(30); 
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [userType, setUserType] = useState<string>("customer");
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [showOtpSentMessage, setShowOtpSentMessage] = useState(false); // Added this line
  const [showLoginSuccess, setShowLoginSuccess] = useState(false); // Added this line
  const dispatch=useAppDispatch()
  const {auth}=useAppSelector(store=>store)
    const formik=useFormik({
      initialValues:{
        email: "",
        otp: ""
    },
    onSubmit:(values:any)=>{
      console.log("form data", values)
      //values.otp=Number(values.otp)
      dispatch(signin({email:values.email,otp,navigate}))
     
    }
    })
    
    const handleOtpChange = (otp: any) => {

      setOtp(otp);

  };

    const handleResendOTP = () => {
            // Implement OTP resend logic
            dispatch(sendLoginSignupOtp({ email: "signing_"+formik.values.email }))
            console.log('Resend OTP');
            setTimer(30);
            setIsTimerActive(true);
        };
     const handleSendOtp = async () => {
        const resultAction = await dispatch(sendLoginSignupOtp({email: formik.values.email}));
        if (sendLoginSignupOtp.fulfilled.match(resultAction)) {
          setShowOtpSentMessage(true);
          // Hide the message after 5 seconds
          setTimeout(() => setShowOtpSentMessage(false), 5000);
          // Start the resend timer
          setTimer(30);
          setIsTimerActive(true);
        }
      }
      const handleLogin = async () => {
        setLoading(true)
        if (userType === "seller") {
            try {
                await dispatch(sellerLogin({ email: formik.values.email, otp })).unwrap()
                setShowLoginSuccess(true)
                setTimeout(() => navigate("/seller"), 2000)
            } catch (error) {
                console.error("Seller login failed:", error)
            }
        } else {
            try {
                await dispatch(signin({ email: formik.values.email, otp, navigate })).unwrap()
                setShowLoginSuccess(true)
                // navigate is already called inside signin action, but we might want to delay it or handle it here
                // Actually signin action in AuthSlice calls navigate("/") immediately.
                // I should probably remove navigate from signin action to handle it here if I want to show success message first.
            } catch (error) {
                console.error("Customer login failed:", error)
            }
        }
        setLoading(false)
    }
    
    useEffect(() => {
      let interval: NodeJS.Timeout | undefined;

      if (isTimerActive) {
          interval = setInterval(() => {
              setTimer(prev => {
                  if (prev === 1) {
                      clearInterval(interval);
                      setIsTimerActive(false);
                      return 30; // Reset timer for next OTP request
                  }
                  return prev - 1;
              });
          }, 1000);
      }

      return () => {
          if (interval) clearInterval(interval);
      };
  }, [isTimerActive]);

  return (
    <>
    <div>
        <h1 className='text-center font-bold text-xl text-primary-color pb-8'>Login</h1>
        
        <RadioGroup
            row
            aria-label="user-type"
            name="user-type"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="mb-4 flex justify-center"
        >
            {/* <FormControlLabel value="customer" control={<Radio />} label="Customer" />
            <FormControlLabel value="seller" control={<Radio />} label="Seller" /> */}
        </RadioGroup>

        <div className='space-y-5'>
       <TextField
               fullWidth
               name="email"
               label="Email"
               value={formik.values.email}
               onChange={formik.handleChange}
               onBlur={formik.handleBlur}
               error={formik.touched.email && Boolean(formik.errors.email)}
               helperText={formik.touched.email ? formik.errors.email as string:undefined}
             />
        {auth.otpSent && <div className="space-y-2">
                    <p className="font-medium text-sm">
                        * Enter OTP sent to your mobile number
                    </p>
                    <OTPInput
                        length={6}
                        onChange={handleOtpChange}
                        error={false}
                    />
                    <p className="text-xs space-x-2">
                        {isTimerActive ? (
                            <span>Resend OTP in {timer} seconds</span>
                        ) : (
                            <>
                                Didn’t receive OTP?{" "}
                                <span
                                    onClick={handleResendOTP}
                                    className="text-teal-600 cursor-pointer hover:text-teal-800 font-semibold"
                                >
                                    Resend OTP
                                </span>
                            </>
                        )}
                    </p>
                    {formik.touched.otp && formik.errors.otp && <p>{formik.errors.otp as string}</p>}
                </div>}
         
      {auth.otpSent && <div>
                          <Button disabled={auth.loading} onClick={handleLogin}
                              fullWidth variant='contained' sx={{ py: "11px" }}>{
                                  auth.loading ? <CircularProgress  />: "Login"}</Button>
                      </div>}
      
                      {!auth.otpSent && (
          <div className="space-y-2">
            <Button
              disabled={auth.loading}
              fullWidth
              variant='contained'
              onClick={handleSendOtp}
              sx={{ py: "11px" }}
            >
              {auth.loading ? <CircularProgress size={24} /> : "Send OTP"}
            </Button>
            {showOtpSentMessage && (
              <div className="text-green-600 text-sm text-center p-2 bg-green-100 rounded-md">
                ✓ OTP has been sent successfully to your email!
              </div>
            )}
            {auth.error && !showOtpSentMessage && (
              <div className="text-red-600 text-sm text-center p-2 bg-red-100 rounded-md">
                {typeof auth.error === 'string' ? auth.error : 'Failed to send OTP. Please try again.'}
              </div>
            )}
          </div>
        )}
      
             
      </div>
    </div>

    <Snackbar
        open={showLoginSuccess}
        autoHideDuration={2000}
        onClose={() => setShowLoginSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Login successful! Welcome back.
        </Alert>
      </Snackbar>
    </>
  )
}

export default LoginForm