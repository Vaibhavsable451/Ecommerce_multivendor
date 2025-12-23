import {
  Box,
  Button,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
} from "@mui/material";
import React, { useEffect } from "react";
import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";
import PricingCard from "../Cart/PricingCard";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { fetchUserCart } from "../../../State/customer/cartSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};
const paymentGatewayList=[
  {
    value:"RAZORPAY",
    image:"https://razorpay.com/newsroom-content/uploads/2020/12/output-onlinepngtools-1-1.png",
    label:""
  },
  {
    value:"STRIPE",
    image:"stripe_logo.png",
    label:""

  }
]

const Checkout = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [paymentGateway, setPaymentGateway] = React.useState("RAZORPAY");
  const dispatch = useAppDispatch();
  const { cart } = useAppSelector(state => state.cart);

  useEffect(() => {
    dispatch(fetchUserCart(localStorage.getItem("jwt") || ""));
  }, [dispatch]);
  interface Address {
  id: string;
  name: string;
  streetAddress: string;
  city: string;
  state: string;
  pincode: string;
  mobile: string;
}

const [selectedAddress, setSelectedAddress] = React.useState<string | null>(null);
const [addresses, setAddresses] = React.useState<Address[]>([]);
  
  React.useEffect(() => {
    // TODO: Fetch user addresses from API
    // setAddresses(fetchedAddresses);
  }, []);

  const handlePaymentChange = (event:any)=>{
    setPaymentGateway(event.target.value);
  }

  return (
    <>
      <div className="pt-10 px-5 sm:px-10 md:px-44 lg:px-60 min-h-screen">
        <div className="space-y-5 lg:space-y-0 lg:grid grid-cols-3 lg:gap-9">
          <div className="col-span-2 space-y-5">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold">Select Address </h1>
              <Button onClick={handleOpen}>Add new Address</Button>
            </div>

            <div className="text-xs font-medium space-y-5">
              <p>Saved Addresses</p>
              <div className="space-y-3">
                {addresses.map((address) => (
                  <AddressCard 
                    key={address.id}
                    address={address}
                    selected={selectedAddress === address.id}
                    onClick={() => setSelectedAddress(address.id)}
                  />
                ))}
              </div>
            </div>

            <div className="py-4 px-5 rounded-md border">
              <Button onClick={handleOpen}>Add New Address</Button>
            </div>
          </div>
          <div>
            <div>
            <div className="space-y-3 border p-5 rounded-md">
              <h1 className="text-primary-color font-medium pb-2 text-center">Choose Payment Gateway</h1>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="radio-buttons-group"
                  className="flex justify-between pr-0"
                  onChange={handlePaymentChange}
                  value={paymentGateway}
                >
                  {paymentGatewayList.map((item)=> 
                  <FormControlLabel
                    className="border w-[45%] pr-2 rounded-md flex justify-center"
                    value={item.value}
                    control={<Radio />}
                    label={
                      <img
                     className={`${item.value=="stripe"?"w-14":""}object-cover`}
                      src={item.image}alt=""/>
                    }
                  />)}
                  
                </RadioGroup>
              </div>
            </div>
            <div className="border rounded-md">
             
              <PricingCard 
                subtotal={cart?.totalMrpPrice || 0} 
                discount={cart ? (cart.totalMrpPrice - cart.totalSellingPrice) : 0} 
                shipping={cart?.totalSellingPrice && cart.totalSellingPrice > 500 ? 0 : 40} 
                platformFee={0} 
                total={cart?.totalSellingPrice ? (cart.totalSellingPrice + (cart.totalSellingPrice > 500 ? 0 : 40)) : 0}
              />
              <div className="p-5">
                <Button fullWidth variant="contained" sx={{ py: "11px" }}>
                  Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <AddressForm  paymentGateway={paymentGateway}/>
        </Box>
      </Modal>
    </>
  );
};

export default Checkout;
