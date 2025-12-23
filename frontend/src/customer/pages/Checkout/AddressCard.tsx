import { Radio } from '@mui/material'
import React from 'react'

interface Address {
  id: string;
  name: string;
  streetAddress: string;
  city: string;
  state: string;
  pincode: string;
  mobile: string;
}

interface AddressCardProps {
  address: Address;
  selected: boolean;
  onClick: () => void;
}

const AddressCard = ({ address, selected, onClick }: AddressCardProps) => {
  const handleChange=(event:any)=>{
    onClick();
  }
  return (
    <div className='p-5 border rounded-md flex'>

      <div>
        <Radio
        checked={selected}
        onChange={handleChange}
        value=""
        name='radio-button'
        />
      </div>

      <div className='space-y-3 pt-3'>
        <h1>{address.name}</h1>
        <p className='w-[320px]'>{address.streetAddress}, {address.city}, {address.state} - {address.pincode}</p>
        <p><strong>Mobile: </strong>{address.mobile}</p>
      </div>

    </div>
  )
}

export default AddressCard