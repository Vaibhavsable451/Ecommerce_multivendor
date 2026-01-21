import { Box, Button, Paper, Typography } from '@mui/material'
import React, { useState } from 'react'
import DealTable from './DealTable'
import DealCategoryTable from './DealCategoryTable'
import CreateDealFrom from './CreateDealFrom'

const tabs = [
  "Deals",
  "Categories",
  "Create Deal"
]
const Deal = () => {
  const [activeTab, setActiveTab] = useState("Deals");
  
  return (
    <Paper className="p-4">
      <Typography variant="h4" className="mb-4">Deal Management</Typography>
      
      <Box className='flex gap-4 mb-6'>
        {tabs.map((item) => (
          <Button 
            key={item}
            onClick={() => setActiveTab(item)} 
            variant={activeTab === item ? "contained" : "outlined"}
            sx={{ minWidth: '120px' }}
          >
            {item}
          </Button>
        ))}
      </Box>
      
      <Box className='mt-5'>
        {activeTab === "Deals" && <DealTable />}
        {activeTab === "Categories" && <DealCategoryTable />}
        {activeTab === "Create Deal" && (
          <Box className='mt-5 flex flex-col justify-center items-center'>
            <CreateDealFrom /> 
          </Box>
        )}
      </Box>
    </Paper>
  )
}

export default Deal