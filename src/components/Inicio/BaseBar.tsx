import { Box } from '@mui/material'
import { BarChart } from '@mui/x-charts'
const BaseBar = () => {
  return (
    
    <Box>
         <BarChart
             colors={['#FB6376']} 
                    xAxis={[
                        {
                            id: 'barCategories',
                            data: ['bar A', 'bar B', 'bar C'],
                            scaleType: 'band',
                        },
                    ]}
                    series={[
                        {
                            data: [2, 5, 3],
                        },
                    ]}
                    width={500}
                    height={300}
                />

    </Box>
  )
}

export default BaseBar