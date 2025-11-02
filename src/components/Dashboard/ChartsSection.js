// ChartsSection.js
import React from 'react';
import { Grid, Card, CardContent } from '@mui/material';
import CustomLineChart from '../Charts/LineChart';

const ChartsSection = ({ historicalData }) => {
  const temperatureOilData = historicalData.map(item => ({
    time: item.time,
    Temperature: item.temperature,
    'Oil Level': item.oilLevel
  }));

  const gasData = historicalData.map(item => ({
    time: item.time,
    H2: item.h2,
    CO: item.co,
    CH4: item.ch4
  }));

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <CustomLineChart
              data={temperatureOilData}
              dataKeys={['Temperature', 'Oil Level']}
              colors={['#FF6B6B', '#4ECDC4']}
              title="Temperature & Oil Level - Last 24 Hours"
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <CustomLineChart
              data={gasData}
              dataKeys={['H2', 'CO', 'CH4']}
              colors={['#FFE66D', '#6A0572', '#1A535C']}
              title="Dissolved Gas Analysis (ppm) - Last 24 Hours"
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ChartsSection;