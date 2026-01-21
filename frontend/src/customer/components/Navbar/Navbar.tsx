import { Avatar, Box, Button, IconButton, useMediaQuery, useTheme, Typography, Badge, InputBase, Paper } from '@mui/material'

import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

import { AddShoppingCart, FavoriteBorder, Storefront } from '@mui/icons-material';
import Categorysheet from './Categorysheet';
import { mainCategory } from '../../../data/mainCategory';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import store, { useAppSelector } from '../../../State/Store';
import Cart from '../../pages/Cart/Cart';

const Navbar = () => {
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"))
  const [selectedCategory, setSelectedCategory] = useState("men");
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const navigate = useNavigate()
  const { auth,seller } = useAppSelector(store => store);
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };



  const becomeSellerClick = () => {
    if (seller.profile?.id) {
      navigate("/seller")
    } else navigate("/become-seller")
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search-products?query=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
    }
  }

 


  return (
    <div>
      <Box className="sticky top-0 left-0 right-0 bg-white" sx={{ zIndex: 2 }}>
        <div className='flex items-center justify-between px-5 lg:px-20 h-[70px] border-b'>
          <div className='flex items-center gap-9'>
            <div className='flex items-center gap-2'>
              {!isLarge && <IconButton>
                <MenuIcon />
              </IconButton>}
              <div className='flex items-center gap-2'>
             {!isLarge &&<IconButton>
              <MenuIcon />
             </IconButton>}
             <h1 onClick={()=>navigate("")} className='logo cursor-pointer text-lg md:text-2xl text-primary-color'>
              vaibhav Bazzar
             </h1>
          </div>
            </div>
            <ul className='flex items-center font-medium text-gray-800'>
              {mainCategory.map((item) => <li
                onMouseLeave={() => {
                  setShowCategorySheet(false);

                }}
                onMouseEnter={() => {
                  setShowCategorySheet(true);
                  setSelectedCategory(item.categoryId);
                }}
                className='mainCategory hover:text-primary-color hover:border-b-2 h-[70px] px-4 border-primary-color flex items-center'>
                {item.name}</li>)}

            </ul>

          </div>
          <div className='flex gap-1 lg:gap-6 items-center'>
            {showSearch ? (
              <Paper
                component="form"
                onSubmit={handleSearchSubmit}
                sx={{ 
                  p: '2px 4px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  width: { xs: 200, sm: 300, md: 400 },
                  border: '1px solid #e0e0e0',
                  boxShadow: 'none'
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search products..."
                  inputProps={{ 'aria-label': 'search products' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                  <SearchIcon />
                </IconButton>
                <IconButton sx={{ p: '10px' }} aria-label="close search" onClick={() => setShowSearch(false)}>
                  <CloseIcon />
                </IconButton>
              </Paper>
            ) : (
              <IconButton onClick={() => setShowSearch(true)}>
                <SearchIcon className="text-gray-700" sx={{ fontSize: 29 }} />
              </IconButton>
            )}

            {
              auth.isLoggedIn ? <Button onClick={() => navigate("account/orders")} className='flex items-center gap-2'>
                <Avatar
                  sx={{ width: 29, height: 29 }}
                  src='https://cdn.pixabay.com/photo/2015/04/15/09/28/head-723540_640.jpg' />
                <h1 className='font-semibold hidden lg:block'>
                  {auth.user?.fullName}

                </h1>

              </Button> : <Button onClick={() => navigate("/login")} variant='contained'>Login</Button>
            }
            <IconButton onClick={() => navigate("/wishlist")}> 
              <Badge badgeContent={useAppSelector(store => store.wishlist.wishlist?.products.length || 0)} color="primary">
                <FavoriteBorder sx={{ fontSize: 29 }} />
              </Badge>
            </IconButton>
            <IconButton onClick={() => navigate("/cart")}> 
              <Badge badgeContent={useAppSelector(store => store.cart.cart?.cartItems.length || 0)} color="error">
                <AddShoppingCart className='text-gray-700' sx={{ fontSize: 29 }} />
              </Badge>
            </IconButton>
            {isLarge && <Button onClick={() => navigate("/become-seller")} startIcon={<Storefront />} variant='outlined'>
              Become Seller
            </Button>}

          </div>

        </div>
        {showCategorySheet && <div
          onMouseLeave={() => setShowCategorySheet(false)}
          onMouseEnter={() => setShowCategorySheet(true)}
          className='categorySheet absolute top-[4.41rem] left-20 right-20 border '>
          <Categorysheet selectedCategory={selectedCategory} />
        </div>}


      </Box>
    </div>
  )
}

export default Navbar
//electronics
//home_furniture
//men
//women