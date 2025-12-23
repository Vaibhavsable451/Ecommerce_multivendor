import { Button, Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import { teal } from '@mui/material/colors'
import React, { useState, useEffect } from 'react'
import { colors } from '../../../data/Filter/color'
import { useSearchParams } from "react-router-dom";
import { price } from '../../../data/Filter/price';
import { discount } from '../../../data/Filter/discount';

interface FilterChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

const FilterSection = () => {
  const [expendColor, setExpandColor] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const updateFilterParams = (event: FilterChangeEvent) => {
    const { value, name } = event.target;
    const updatedParams = new URLSearchParams(searchParams);
    
    if (value) {
      updatedParams.set(name, value);
      setActiveFilters(prev => ({ ...prev, [name]: value }));
    } else {
      updatedParams.delete(name);
      setActiveFilters(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
    
    setSearchParams(updatedParams);
  };

  useEffect(() => {
    // Initialize active filters from URL params
    const newActiveFilters: Record<string, string> = {};
    ['color', 'price', 'discount'].forEach(param => {
      const value = searchParams.get(param);
      if (value) newActiveFilters[param] = value;
    });
    setActiveFilters(newActiveFilters);
  }, [searchParams]);

  const handleColorToggle = () => {
    setExpandColor(!expendColor);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
    setActiveFilters({});
  };

  return (
    <div className='space-y-5 bg-white p-5'>

      <div className='flex items-center justify-between h-[40px] px-9 lg:border-r'>
        <p className='text-lg font-semibold'>Filters</p>
        <Button onClick={clearAllFilters} size='small' sx={{ color: teal[600], fontWeight: 'bold', cursor: 'pointer' }}>
          Clear All
        </Button>
      </div>

      <Divider />

     <div className='px-9 space-y-6'>
     <section>
        <FormControl>
          <FormLabel
            sx={{ fontSize: '16px', fontWeight: 'bold', color: teal[500], pb: '14px' }}
            id='color'
          >
            Color
          </FormLabel>
          <RadioGroup
            aria-labelledby='color'
            defaultValue=""
            name='color'
            onChange={updateFilterParams}
          >
            {colors.slice(0,expendColor?colors.length:5).map((item)=>
               <FormControlLabel value={item.name} control={<Radio />} label={
                <div className='flex items-center gap-3'>
                  <p>{item.name}</p>
                  <p style={{backgroundColor:item.hex}}
                  className={`h-5 w-5 rounded-full ${item.name==="White"?"border":""}`}>

                  </p>
                </div>
               } />
            )}
           
            
          </RadioGroup>
        </FormControl>
        <div>
          <button onClick={handleColorToggle}
          className='text-primary-color cursor-pointer hover:text-teal-900 flex items-center'>
            {expendColor?"hide": `+${colors.length-5} more`}
          </button>
        </div>

      </section>
      <section>
                <FormControl>
                  <FormLabel
                    sx={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      pb: "14px",
                      color: teal[600],
                    }}
                    className="text-2xl font-semibold"
                    id="price"
                  >
                    Price
                  </FormLabel>
                  <RadioGroup
                    name="price"
                    onChange={updateFilterParams}
                    aria-labelledby="price"
                    defaultValue=""
                  >
                    {price.map((item, index) => (
                      <FormControlLabel
                        key={item.name}
                        value={item.value}
                        control={<Radio size="small" />}
                        label={item.name}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </section>
              <Divider />
              <section>
                <FormControl>
                  <FormLabel
                    sx={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      pb: "14px",
                      color: teal[600],
                    }}
                    className="text-2xl font-semibold"
                    id="brand"
                  >
                    Discount
                  </FormLabel>
                  <RadioGroup
                    name="discount"
                    onChange={updateFilterParams}
                    aria-labelledby="brand"
                    defaultValue=""
                  >
                    {discount.map((item, index) => (
                      <FormControlLabel
                        key={item.name}
                        value={item.value}
                        control={<Radio size="small" />}
                        label={item.name}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </section>
     </div>

    </div>
  )
}

export default FilterSection
