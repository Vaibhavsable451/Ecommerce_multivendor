import { Delete } from '@mui/icons-material';
import { Avatar, Box, Grid2, IconButton, Rating} from '@mui/material';
import { red } from '@mui/material/colors';
import React from 'react'

interface ReviewCardProps {
  totalReview: number;
  userName?: string;
  date?: string;
  rating?: number;
  comment?: string;
  imageUrl?: string;
}

const ReviewCard = ({ totalReview, userName, date, rating, comment, imageUrl }: ReviewCardProps) => {
  if (totalReview !== undefined) {
    return (
      <div className='flex items-center gap-2'>
        <p className='font-semibold'>All Reviews ({totalReview})</p>
      </div>
    )
  }

  return (
    <div className='flex justify-between '>
      <Grid2 container spacing={8}>
        <Grid2 size={{xs:1}}>
            <Box>
              <Avatar className='text-white' sx={{width:56, height:56, bgcolor:"#9155FD"}}>
                  V
              </Avatar>
            </Box>
        </Grid2>
        <Grid2 size={{xs:9}}>
          <div className='space-y-2'>
            <div>
                <p className='font-semibold text-lg'>{userName}</p>
                <p className='opacity-70'>{date}</p>
            </div>
          </div>
          {rating !== undefined && <Rating readOnly value={rating} precision={1}/>}
          <p>{comment}</p>
          <div>
            {imageUrl && <img className='w-24 h-24 object-cover' src={imageUrl} alt=''/>}
          </div>
        </Grid2>
      </Grid2>
      <IconButton>
          <Delete sx={{color:red[700]}}/>
      </IconButton>
    </div>
  )
}

export default ReviewCard