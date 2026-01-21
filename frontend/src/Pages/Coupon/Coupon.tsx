import { Delete } from '@mui/icons-material';
import { Button, FormControl, InputLabel, MenuItem, Paper, Select, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow } from '@mui/material'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { fetchAllCoupons, deleteCoupon } from '../../../State/admin/AdminCouponSlice'
import { useAppDispatch } from '../../../State/Store'

const accountStatu = [
  { status: 'PENDING_VERIFICATION', title: 'Pending Verification', description: 'Account is created but not yet verified' },
  { status: 'ACTIVE', title: 'Active', description: 'Account is active and in good standing' },
  { status: 'SUSPENDED', title: 'Suspended', description: 'Account is temporarily suspended, possibly due to violations' },
  { status: 'DEACTIVATED', title: 'Deactivated', description: 'Account is deactivated, user may have chosen to deactivate it' },
  { status: 'BANNED', title: 'Banned', description: 'Account is permanently banned due to severe violations' },
  { status: 'CLOSED', title: 'Closed', description: 'Account is permanently closed, possibly at user request' }
];
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
) {
  return { name, calories, fat, carbs, protein };
}


const Coupon = () => {
  const dispatch = useAppDispatch();
  // Use state.adminCoupon for admin coupons slice based on your store setup
  const { coupons = [], loading = false, error = null } = useSelector((state: any) => (state.adminCoupon ? state.adminCoupon : {}));

  useEffect(() => {
    const jwt = localStorage.getItem('jwt') || '';
    dispatch(fetchAllCoupons(jwt));
  }, [dispatch]);

  const handleDelete = (id: number) => {
    const jwt = localStorage.getItem('jwt') || '';
    dispatch(deleteCoupon({ id, jwt }));
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Coupon Code</StyledTableCell>
            <StyledTableCell>Account Type</StyledTableCell>
            <StyledTableCell>Start Date</StyledTableCell>
            <StyledTableCell>End Date</StyledTableCell>
            <StyledTableCell align="right">Minimum Order Value</StyledTableCell>
            <StyledTableCell align="right">Discount (%)</StyledTableCell>
            <StyledTableCell align="right">Active</StyledTableCell>
            <StyledTableCell align="right">Delete</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading && (
            <StyledTableRow>
              <StyledTableCell colSpan={8}>Loading...</StyledTableCell>
            </StyledTableRow>
          )}
          {error && (
            <StyledTableRow>
              <StyledTableCell colSpan={8} style={{ color: 'red' }}>
                {typeof error === 'string' 
                  ? error 
                  : error?.message || 'An error occurred while loading coupons'}
              </StyledTableCell>
            </StyledTableRow>
          )}
          {coupons.length === 0 ? (
            <StyledTableRow>
              <StyledTableCell colSpan={8} align="center">
                No coupons found.
              </StyledTableCell>
            </StyledTableRow>
          ) : (
            coupons.map((coupon: any) => (
              <StyledTableRow key={coupon.id}>
                <StyledTableCell component="th" scope="row">
                  {coupon.code}
                </StyledTableCell>
                <StyledTableCell>{coupon.accountType}</StyledTableCell>
                <StyledTableCell align="right">{coupon.validityStartDate}</StyledTableCell>
                <StyledTableCell align="right">{coupon.validityEndDate}</StyledTableCell>
                <StyledTableCell align="right">{coupon.minimumOrderValue}</StyledTableCell>
                <StyledTableCell align="right">{coupon.discountPercentage}</StyledTableCell>
                <StyledTableCell align="right">{coupon.active ? 'Yes' : 'No'}</StyledTableCell>
                <StyledTableCell align="right">
                  <Button color="error" onClick={() => handleDelete(coupon.id)}>
                    <Delete />
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}


export default Coupon