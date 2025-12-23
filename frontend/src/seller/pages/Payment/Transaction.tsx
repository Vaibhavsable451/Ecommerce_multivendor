import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import store, { useAppDispatch, useAppSelector } from '../../../State/Store';
import { fetchTransactionsBySeller } from '../../../State/seller/transactionSlice';


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

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function TransactionTable() {
  const dispatch = useAppDispatch();
  const transactionsState = useAppSelector(store => store.transactions);
  React.useEffect(() => {
    dispatch(fetchTransactionsBySeller(localStorage.getItem("jwt") || ""));
  }, [dispatch]);
  // Debug log for all transaction data
  console.log('All transactions:', transactionsState.transactions);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Txn ID</StyledTableCell>
            <StyledTableCell>Date</StyledTableCell>
            <StyledTableCell align="right">Customer Email</StyledTableCell>
            <StyledTableCell align="right">Order ID</StyledTableCell>
            <StyledTableCell align="right">Order Date</StyledTableCell>
            <StyledTableCell align="right">Amount</StyledTableCell>
            <StyledTableCell align="right">Payment Details</StyledTableCell>
            <StyledTableCell align="right">Order Status</StyledTableCell>
            <StyledTableCell align="right">Total Items</StyledTableCell>
            <StyledTableCell align="right">Deliver Date</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactionsState.transactions.length === 0 ? (
            <StyledTableRow>
              <StyledTableCell colSpan={10} align="center">
                No transactions found.
              </StyledTableCell>
            </StyledTableRow>
          ) : (
            transactionsState.transactions.map((item) => (
              <StyledTableRow key={item.id}>
                <StyledTableCell>{item.id}</StyledTableCell>
                <StyledTableCell>{item.date}</StyledTableCell>
                <StyledTableCell align="right">{item.customer.email}</StyledTableCell>
                <StyledTableCell align="right">{item.order.id}</StyledTableCell>
                <StyledTableCell align="right">{item.order.orderDate}</StyledTableCell>
                <StyledTableCell align="right">{item.order.totalSellingPrice}</StyledTableCell>
                <StyledTableCell align="right">{JSON.stringify(item.order.paymentDetails)}</StyledTableCell>
                <StyledTableCell align="right">{item.order.orderStatus}</StyledTableCell>
                <StyledTableCell align="right">{item.order.totalItem}</StyledTableCell>
                <StyledTableCell align="right">{item.order.deliverDate}</StyledTableCell>
              </StyledTableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}