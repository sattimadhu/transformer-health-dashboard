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
  const percentage = Math.min((value / max) * 100, 100);
  
  const getValueColor = () => {
    if (title === 'Temperature' && value > 80) return 'error';
    if (title === 'Oil Level' && value < 85) return 'warning';
    if (title === 'Voltage' && (value < 85 || value > 110)) return 'error';
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
            label={`${value} ${unit}`}
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
  if (!data) return null;

  const parameters = [
    {
      title: 'Temperature',
      value: data.Temperature,
      unit: '°C',
      icon: <TempIcon color="error" />,
      max: 120
    },
    {
      title: 'Oil Level',
      value: data.OilLevel,
      unit: '%',
      icon: <OilIcon color="info" />,
      max: 100
    },
    {
      title: 'Voltage',
      value: data.Voltage,
      unit: 'kV',
      icon: <VoltageIcon color="warning" />,
      max: 120
    },
    {
      title: 'Current',
      value: data.Current,
      unit: 'A',
      icon: <CurrentIcon color="success" />,
      max: 300
    },
    {
      title: 'H2 Gas',
      value: data.H2,
      unit: 'ppm',
      icon: <GasIcon sx={{ color: '#8b5cf6' }} />,
      max: 200
    },
    {
      title: 'CO Gas',
      value: data.CO,
      unit: 'ppm',
      icon: <GasIcon sx={{ color: '#f59e0b' }} />,
      max: 500
    },
    {
      title: 'CH4 Gas',
      value: data.CH4,
      unit: 'ppm',
      icon: <GasIcon sx={{ color: '#10b981' }} />,
      max: 250
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