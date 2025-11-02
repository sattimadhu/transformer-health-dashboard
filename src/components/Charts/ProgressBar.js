// src/components/Common/ProgressBar.js
import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import AlertService from '../../services/alertService'; // corrected import (no braces)

const ProgressBar = ({ parameter, value, unit, maxValue }) => {
  // Normalize and protect values from being objects
  const safeValue = typeof value === 'number' ? value : 0;

  const rawStatus = AlertService.getParameterStatus(parameter, safeValue);
  const status =
    typeof rawStatus === 'object'
      ? rawStatus.status || JSON.stringify(rawStatus)
      : String(rawStatus ?? 'Unknown');

  const rawColor = AlertService.getStatusColor(status);
  const color = typeof rawColor === 'string' ? rawColor : '#2196f3'; // default fallback

  const percentage = Math.min((safeValue / maxValue) * 100, 100);

  const getValueColor = (val, param) => {
    const st = AlertService.getParameterStatus(param, val);
    const c = AlertService.getStatusColor(st);
    return typeof c === 'string' ? c : '#6b7280';
  };

  return (
    <Box sx={{ mb: 2 }}>
      {/* Header Row */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" fontWeight="medium">
          {parameter}
        </Typography>
        <Typography
          variant="body2"
          fontWeight="bold"
          sx={{ color: getValueColor(safeValue, parameter) }}
        >
          {safeValue.toFixed(2)} {unit}
        </Typography>
      </Box>

      {/* Progress Bar */}
      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: '#e0e0e0',
          '& .MuiLinearProgress-bar': {
            backgroundColor: color,
            borderRadius: 4,
          },
        }}
      />

      {/* Text Status */}
      <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
        Status:{' '}
        {typeof status === 'object' ? JSON.stringify(status) : status}
      </Typography>
    </Box>
  );
};

export default ProgressBar;
