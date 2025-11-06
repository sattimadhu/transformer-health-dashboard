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
} from '@mui/icons-material';

const ParameterCard = ({ title, value, unit, icon, max, color = 'primary' }) => {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  
  const getValueColor = () => {
    if (title === 'Temperature') {
      if (value > 80) return 'error';
      if (value > 60) return 'warning';
      return 'success';
    }
    if (title === 'Oil Level') {
      if (value < 70) return 'error';
      if (value < 85) return 'warning';
      return 'success';
    }
    if (title === 'Output Voltage') {
      if (value < 25 || value > 40) return 'error';
      if (value < 30 || value > 35) return 'warning';
      return 'success';
    }
    if (title === 'Output Current') {
      if (value > 0.2) return 'error';
      if (value > 0.15) return 'warning';
      return 'success';
    }
    if (title === 'H2 Gas') {
      if (value > 0.05) return 'error';
      if (value > 0.02) return 'warning';
      return 'success';
    }
    if (title === 'CO Gas') {
      if (value > 0.06) return 'error';
      if (value > 0.03) return 'warning';
      return 'success';
    }
    if (title === 'CH4 Gas') {
      if (value > 0.06) return 'error';
      if (value > 0.03) return 'warning';
      return 'success';
    }
    return color;
  };

  const formatValue = (val, paramTitle) => {
    if (paramTitle === 'Output Voltage') return val.toFixed(2);
    if (paramTitle === 'Output Current') return val.toFixed(5);
    if (['H2 Gas', 'CO Gas', 'CH4 Gas'].includes(paramTitle)) return val.toFixed(5);
    if (paramTitle === 'Oil Level') return val.toFixed(0);
    return val.toFixed(1);
  };

  const displayValue = formatValue(value, title);
  const displayPercentage = percentage.toFixed(1);
  const valueColor = getValueColor();

  return (
    <Card sx={{ 
      height: '100%', 
      transition: 'all 0.3s ease', 
      border: valueColor === 'error' ? '1px solid #f44336' : '1px solid transparent',
      '&:hover': { 
        transform: 'translateY(-4px)', 
        boxShadow: 3 
      } 
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {React.cloneElement(icon, { 
            color: valueColor 
          })}
          <Typography variant="h6" sx={{ ml: 1, flexGrow: 1, fontSize: '0.9rem' }}>
            {title}
          </Typography>
          <Chip 
            label={`${displayValue} ${unit}`}
            color={valueColor}
            size="small"
            variant="filled"
          />
        </Box>
        
        <LinearProgress
          variant="determinate"
          value={percentage}
          color={valueColor}
          sx={{ 
            height: 8, 
            borderRadius: 4,
            mb: 1,
            backgroundColor: 'grey.100'
          }}
        />
        
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
          {displayPercentage}% of max ({max} {unit})
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

  // Updated parameters with correct values from your Firebase data
  const parameters = [
    {
      title: 'Temperature',
      value: data.Temperature || 0,
      unit: '°C',
      icon: <TempIcon />,
      max: 100
    },
    {
      title: 'Oil Level',
      value: data.OilLevel || 0,
      unit: '%',
      icon: <OilIcon />,
      max: 100
    },
    {
      title: 'Output Voltage',
      value: data.OutputVoltage || 0,
      unit: 'V',
      icon: <VoltageIcon />,
      max: 50
    },
    {
      title: 'Output Current',
      value: data.OutputCurrent || 0,
      unit: 'A',
      icon: <CurrentIcon />,
      max: 0.3
    },
    {
      title: 'H2 Gas',
      value: data.H2 || 0,
      unit: 'ppm',
      icon: <GasIcon />,
      max: 0.1
    },
    {
      title: 'CO Gas',
      value: data.CO || 0,
      unit: 'ppm',
      icon: <GasIcon />,
      max: 0.1
    },
    {
      title: 'CH4 Gas',
      value: data.CH4 || 0,
      unit: 'ppm',
      icon: <GasIcon />,
      max: 0.1
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