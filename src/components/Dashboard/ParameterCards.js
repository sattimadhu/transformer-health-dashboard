import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  Thermostat as TempIcon,
  OilBarrel as OilIcon,
  ElectricBolt as VoltageIcon,
  Bolt as CurrentIcon,
  Co2 as GasIcon,
  Opacity as MoistureIcon,
} from '@mui/icons-material';

const ParameterCard = ({ title, value, unit, icon, max, color = 'primary' }) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const getValueColor = () => {
    if (title === 'Temperature' && value > 80) return 'error';
    if (title === 'Oil Level' && value < 85) return 'warning';
    if (title === 'Oil Moisture' && value > 15) return 'error';
    if (title === 'Voltage' && (value < 10 || value > 13)) return 'error';
    return color;
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
            {title}
          </Typography>
          <Chip 
            label={`${value.toFixed(2)} ${unit}`}
            color={getValueColor()}
            size="small"
          />
        </Box>
        
        <LinearProgress
          variant="determinate"
          value={percentage}
          color={getValueColor()}
          sx={{ 
            height: 8, 
            borderRadius: 4,
            mb: 1 
          }}
        />
        
        <Typography variant="body2" color="text.secondary">
          {percentage.toFixed(1)}% of max
        </Typography>
      </CardContent>
    </Card>
  );
};

export default function ParameterCards({ data }) {
  if (!data) {
    return (
      <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
        No transformer data available
      </Typography>
    );
  }

  console.log('ParameterCards data:', data);

  const parameters = [
    {
      title: 'Temperature',
      value: data.Temperature || 0,
      unit: '°C',
      icon: <TempIcon color="error" />,
      max: 120
    },
    {
      title: 'Oil Level',
      value: data.OilLevel || 0,
      unit: '%',
      icon: <OilIcon color="info" />,
      max: 100
    },
    {
      title: 'Oil Moisture',
      value: data.OilMoisture || 0,
      unit: '%',
      icon: <MoistureIcon color="warning" />,
      max: 20
    },
    {
      title: 'Output Voltage',
      value: data.Voltage || 0,
      unit: 'kV',
      icon: <VoltageIcon color="success" />,
      max: 15
    },
    {
      title: 'Output Current',
      value: data.Current || 0,
      unit: 'A',
      icon: <CurrentIcon color="primary" />,
      max: 5
    },
    {
      title: 'H2 Gas',
      value: data.H2 || 0,
      unit: 'ppm',
      icon: <GasIcon sx={{ color: '#8b5cf6' }} />,
      max: 50
    },
    {
      title: 'CO Gas',
      value: data.CO || 0,
      unit: 'ppm',
      icon: <GasIcon sx={{ color: '#f59e0b' }} />,
      max: 100
    },
    {
      title: 'CH4 Gas',
      value: data.CH4 || 0,
      unit: 'ppm',
      icon: <GasIcon sx={{ color: '#10b981' }} />,
      max: 50
    }
  ];

  return (
    <Grid container spacing={2}>
      {parameters.map((param, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <ParameterCard {...param} />
        </Grid>
      ))}
    </Grid>
  );
}