import React from 'react'

import AddressCard from '../Checkout/AddressCard'
import UserAddressCard from './UserAddressCard'
import { useAppSelector } from '../../../State/Store'

const Addresses = () => {
    const { user } = useAppSelector(store => store.auth);
    return (
        <>
            <div className='space-y-3'>
                {user?.addresses && user.addresses.length > 0 ? (
                    user.addresses.map((item: any) =>
                        <UserAddressCard
                            key={item.id}
                            item={item} />
                    )
                ) : (
                    <div>No addresses found.</div>
                )}
            </div>
        </>
    )
}

export default Addresses