import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Thermostat as TempIcon,
  OilBarrel as OilIcon,
  ElectricBolt as VoltageIcon,
  Bolt as CurrentIcon,
  Co2 as GasIcon,
} from '@mui/icons-material';

const ParameterCard = ({ title, value, unit, icon, max, color = 'primary' }) => {
  const theme = useTheme();
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  
  const getValueColor = () => {
    if (title === 'Temperature') {
      if (value === -127) return 'default';
      if (value > 80) return 'error';
      if (value > 60) return 'warning';
      return 'success';
    }
    if (title === 'Oil Level') {
      if (value < 20) return 'error';
      if (value < 50) return 'warning';
      return 'success';
    }
    if (title === 'Output Voltage') {
      if (value < 45 || value > 55) return 'error';
      if (value < 48 || value > 52) return 'warning';
      return 'success';
    }
    if (title === 'Output Current') {
      if (value > 0.15) return 'error';
      if (value > 0.1) return 'warning';
      return 'success';
    }
    if (title === 'H2 Gas') {
      if (value > 0.005) return 'error';
      if (value > 0.003) return 'warning';
      return 'success';
    }
    if (title === 'CO Gas') {
      if (value > 0.005) return 'error';
      if (value > 0.003) return 'warning';
      return 'success';
    }
    if (title === 'CH4 Gas') {
      if (value > 0.005) return 'error';
      if (value > 0.003) return 'warning';
      return 'success';
    }
    return 'success';
  };

  const formatValue = (val, paramTitle) => {
    if (paramTitle === 'Temperature' && val === -127) return 'N/A';
    if (paramTitle === 'Output Voltage') return val.toFixed(2);
    if (paramTitle === 'Output Current') return val.toFixed(5);
    if (['H2 Gas', 'CO Gas', 'CH4 Gas'].includes(paramTitle)) return val.toFixed(5);
    if (paramTitle === 'Oil Level') return val.toFixed(0);
    return val;
  };

  const displayValue = formatValue(value, title);
  const valueColor = getValueColor();

  return (
    <Card 
      sx={{ 
        height: '100%', 
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
        transition: 'all 0.3s ease',
        border: valueColor === 'error' ? `2px solid ${theme.palette.error.main}` : '1px solid transparent',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[8],
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              backgroundColor: value === -127 && title === 'Temperature' 
                ? theme.palette.grey[300] 
                : theme.palette[valueColor]?.light || theme.palette.primary.light,
              color: value === -127 && title === 'Temperature'
                ? theme.palette.grey[500]
                : theme.palette[valueColor]?.dark || theme.palette.primary.dark,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" sx={{ ml: 2, flexGrow: 1, fontSize: '1rem', fontWeight: 600 }}>
            {title}
          </Typography>
          <Chip 
            label={value === -127 && title === 'Temperature' ? 'N/A' : `${displayValue} ${unit}`}
            color={valueColor}
            size="small"
            variant="filled"
            sx={{ fontWeight: 600 }}
          />
        </Box>
        
        {value !== -127 ? (
          <>
            <LinearProgress
              variant="determinate"
              value={percentage}
              color={valueColor}
              sx={{ 
                height: 10, 
                borderRadius: 5,
                mb: 1.5,
                backgroundColor: theme.palette.grey[200],
                '& .MuiLinearProgress-bar': {
                  borderRadius: 5,
                }
              }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                Progress
              </Typography>
              <Typography variant="body2" color="text.primary" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                {percentage.toFixed(1)}%
              </Typography>
            </Box>
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              Sensor offline
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default function ParameterGrid({ data }) {
  if (!data) {
    return (
      <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
        No data available for selected transformer
      </Typography>
    );
  }

  console.log('ParameterGrid data:', data);

  // Updated parameters with correct max values for OutputCurrent and OutputVoltage
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
      max: 60 
    },
    {
      title: 'Output Current',
      value: data.OutputCurrent || 0,
      unit: 'A',
      icon: <CurrentIcon />,
      max: 0.2 
    },
    {
      title: 'H2 Gas',
      value: data.H2 || 0,
      unit: 'ppm',
      icon: <GasIcon />,
      max: 0.01
    },
    {
      title: 'CO Gas',
      value: data.CO || 0,
      unit: 'ppm',
      icon: <GasIcon />,
      max: 0.01
    },
    {
      title: 'CH4 Gas',
      value: data.CH4 || 0,
      unit: 'ppm',
      icon: <GasIcon />,
      max: 0.01
    }
  ];

  return (
    <Grid container spacing={3}>
      {parameters.map((param, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <ParameterCard {...param} />
        </Grid>
      ))}
    </Grid>
  );
}