import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, IconButton, CircularProgress, Typography } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import store, { useAppDispatch, useAppSelector } from '../../../State/Store';
import { deleteDeal, getAllDeals } from '../../../State/admin/DealSlice';
import { getErrorMessage } from '../../../Util/errorHandler';


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

export default function DealTable() {
  const dispatch = useAppDispatch();
  const { deal } = useAppSelector(store => store);
  const { loading, error, deals } = deal;

  React.useEffect(() => {
    dispatch(getAllDeals());
  }, [dispatch])
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        <Typography variant="h6">Error loading deals: {typeof error === 'object' ? 'Failed to load data' : error}</Typography>
      </div>
    );
  }

  if (!deals || deals.length === 0) {
    return (
      <div className="p-4">
        <Typography variant="h6">No deals available</Typography>
      </div>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Typography variant="h5" className="mb-4 p-4">Available Deals</Typography>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>No</StyledTableCell>
         
            <StyledTableCell >Image</StyledTableCell>
            <StyledTableCell >Category</StyledTableCell>
            <StyledTableCell align="right">Discount</StyledTableCell>
            <StyledTableCell align="right">Update</StyledTableCell>
            <StyledTableCell align="right">Delete</StyledTableCell>
     
          </TableRow>
        </TableHead>
        <TableBody>
          {deals.map((item,index) => (
            <StyledTableRow key={item.id}>
              <StyledTableCell component="th" scope="row">
                {index+1}
              </StyledTableCell>
              <StyledTableCell>
                <img className='w-20 rounded-md' src={item.category.image} alt=''/>
              </StyledTableCell>
              <StyledTableCell >{item.category.categoryId}</StyledTableCell>
              <StyledTableCell align="right">{item.discount}%</StyledTableCell>
              <StyledTableCell align="right">
                <Button>
                  <Edit/>
                </Button>
              </StyledTableCell>
              <StyledTableCell align="right">
                <IconButton onClick={() => item.id !== undefined && dispatch(deleteDeal(item.id))}>
                  <Delete sx={{color:"red"}}/>
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}