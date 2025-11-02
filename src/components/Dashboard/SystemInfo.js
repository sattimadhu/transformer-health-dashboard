// SystemInfo.js
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const SystemInfo = ({ transformers }) => {
  const getUptime = () => {
    const baseUptime = 99.8;
    const transformerCount = transformers.length;
    // More transformers might slightly reduce uptime
    return Math.max(99.0, baseUptime - (transformerCount - 1) * 0.1);
  };

  const getDataInterval = () => {
    return '2 seconds';
  };

  const getLastUpdate = () => {
    return new Date().toLocaleTimeString();
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight="600">
          System Information
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Transformers Online
            </Typography>
            <Typography variant="body2" fontWeight="600" color="primary">
              {transformers.length}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              System Uptime
            </Typography>
            <Typography variant="body2" fontWeight="600" color="success.main">
              {getUptime().toFixed(1)}%
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Data Interval
            </Typography>
            <Typography variant="body2" fontWeight="600">
              {getDataInterval()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Last Update
            </Typography>
            <Typography variant="body2" fontWeight="600" color="success.main">
              {getLastUpdate()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              API Status
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon sx={{ fontSize: 16, color: '#10b981' }} />
              <Typography variant="body2" fontWeight="600" color="success.main">
                Connected
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SystemInfo;