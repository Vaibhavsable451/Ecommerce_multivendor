import React, { useState } from 'react'
import ProfileFieldCard from '../../../component/ProfileFieldCard'
import { Divider, Button, TextField } from '@mui/material'
import { useAppSelector } from '../../../State/Store'
import { validateEmail, validateMobile } from '../../../Util/validation'

const UserDetails = () => {
  const {auth}=useAppSelector(store =>store);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: auth.user?.fullName || '',
    email: auth.user?.email || '',
    mobile: auth.user?.mobile || ''
  });
  const [errors, setErrors] = useState({
    email: '',
    mobile: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'email') {
      setErrors(prev => ({
        ...prev,
        email: validateEmail(value) ? '' : 'Invalid email format'
      }));
    }

    if (name === 'mobile') {
      setErrors(prev => ({
        ...prev,
        mobile: validateMobile(value) ? '' : 'Invalid mobile number'
      }));
    }
  };

  const handleSave = () => {
    // TODO: Add save logic
    setEditMode(false);
  };

  return (
    <div className='flex justify-center py-10'>
      <div className='w-full lg:w-[70%]'>
        <div className='flex items-center pb-3 justify-between'>
          <h1 className='text-2xl font-bold text-gray-600'>Personal Details</h1>
          {editMode ? (
            <Button variant='contained' onClick={handleSave} disabled={!!errors.email || !!errors.mobile}>
              Save
            </Button>
          ) : (
            <Button variant='outlined' onClick={() => setEditMode(true)}>
              Edit
            </Button>
          )}
        </div>
        <div className=''>
          {editMode ? (
            <>
              <TextField
                fullWidth
                label='Name'
                name='fullName'
                value={formData.fullName}
                onChange={handleChange}
                margin='normal'
              />
              <TextField
                fullWidth
                label='Email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                margin='normal'
              />
              <TextField
                fullWidth
                label='Mobile'
                name='mobile'
                value={formData.mobile}
                onChange={handleChange}
                error={!!errors.mobile}
                helperText={errors.mobile}
                margin='normal'
              />
            </>
          ) : (
            <>
              <ProfileFieldCard keys='Name' value={auth.user?.fullName || ""} />
              <Divider/>
              <ProfileFieldCard keys='Email' value={auth.user?.email || " "} />
              <Divider/>
              <ProfileFieldCard keys='Mobile' value={auth.user?.mobile || " "}/>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserDetails