import { Box, Button, Grid2, TextField } from '@mui/material'
import { useFormik } from 'formik'
import React from 'react'
import * as Yup from 'yup'
import { useAppDispatch } from '../../../State/Store'
import { createOrder } from '../../../State/customer/OrderSlice'

const AddressFormSchema = Yup.object().shape({

  name: Yup.string().required('Name is Required'),
  mobile: Yup.string().required("Mobile number is required").matches(/^[6-9]\d{9}$/,"Invaild mobile number"),
  pinCode: Yup.string().required('Pin code is Required').matches(/^[1-9][0-9]{5}$/,"Invaild pin code"),
  address: Yup.string().required('Address is Required'),
  city:Yup.string().required("City is required"),
  state:Yup.string().required("State is required"),
  locality: Yup.string().required("Locality is required"),



})



interface AddressFormValues {
  name: string
  mobile: string
  pinCode: string
  address: string
  city: string
  state: string
  locality: string
}

interface AddressFormProps {
  paymentGateway: string
}

const AddressForm = ({paymentGateway}: AddressFormProps) => {
  const dispatch = useAppDispatch()
  const formik = useFormik<AddressFormValues>({
    initialValues: {
      name: '',
      mobile: "",
      pinCode: "",
      address: "",
      city: "",
      state: "",
      locality: ""
    },
    validationSchema: AddressFormSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values: AddressFormValues) => {
      dispatch(createOrder({
        address: values,
        jwt: localStorage.getItem("jwt") || "",
        paymentGateway: paymentGateway
      }))
    },
  })

  return (
    <Box sx={{ max:"auto"}}>
      <p className='text-xl font-bold text-center pb-5'>Contact Details</p>

      <form onSubmit={formik.handleSubmit}>
        <Grid2 container spacing={3}>
          <Grid2 size={{xs:12}}>
            <TextField
             fullWidth
             name="name"
             label="Name"
             value={formik.values.name}
             onChange={formik.handleChange}
             error={formik.touched.name && Boolean(formik.errors.name)}
             helperText={formik.touched.name && formik.errors.name}
            />
         

          </Grid2>
          <Grid2 size={{xs:6}}>
            <TextField
             fullWidth
             name="mobile"
             label="Mobile"
             value={formik.values.mobile}
             onChange={formik.handleChange}
             error={formik.touched.mobile && Boolean(formik.errors.mobile)}
             helperText={formik.touched.mobile && formik.errors.mobile}
            />
         

          </Grid2>
          <Grid2 size={{xs:6}}>
            <TextField
             fullWidth
             name="pinCode"
             label="Pin Code"
             value={formik.values.pinCode}
             onChange={formik.handleChange}
             error={formik.touched.pinCode && Boolean(formik.errors.pinCode)}
             helperText={formik.touched.pinCode && formik.errors.pinCode}
            />
         

          </Grid2>
          <Grid2 size={{xs:12}}>
            <TextField
             fullWidth
             name="address"
             label="Address"
             value={formik.values.address}
             onChange={formik.handleChange}
             error={formik.touched.address && Boolean(formik.errors.address)}
             helperText={formik.touched.address && formik.errors.address}
            />
         

          </Grid2>
          <Grid2 size={{xs:12}}>
            <TextField
             fullWidth
             name="locality"
             label="locality"
             value={formik.values.locality}
             onChange={formik.handleChange}
             error={formik.touched.locality && Boolean(formik.errors.locality)}
             helperText={formik.touched.locality && formik.errors.locality}
            />
         

          </Grid2>
          <Grid2 size={{xs:6}}>
            <TextField
             fullWidth
             name="city"
             label="city"
             value={formik.values.city}
             onChange={formik.handleChange}
             error={formik.touched.city && Boolean(formik.errors.city)}
             helperText={formik.touched.city && formik.errors.city}
            />
         

          </Grid2>
          <Grid2 size={{xs:6}}>
            <TextField
             fullWidth
             name="state"
             label="state"
             value={formik.values.state}
             onChange={formik.handleChange}
             error={formik.touched.state && Boolean(formik.errors.state)}
             helperText={formik.touched.state && formik.errors.state}
            />
         

          </Grid2>
          <Grid2 size={{xs:12}}>
            <Button fullWidth type='submit' variant='contained' sx={{py:"14px"}}>
              Add Address
            </Button>
          </Grid2>

        </Grid2>

      </form>

    </Box>
  )
}

export default AddressForm