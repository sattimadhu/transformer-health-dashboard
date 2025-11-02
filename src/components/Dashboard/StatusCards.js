// src/components/Dashboard/StatusCards.js
import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import {
  Thermostat as TemperatureIcon,
  OilBarrel as OilIcon,
  Bolt as PowerIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import AlertService from '../../services/alertService';

function StatusCard({ title, value, unit, status, icon: Icon, color }) {
  // Safely ensure status is a string
  const normalizedStatus =
    typeof status === 'object'
      ? JSON.stringify(status)
      : String(status ?? 'Unknown');

  const statusColor = AlertService.getStatusColor(normalizedStatus);

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 3,
        boxShadow: '0 4px 6px -1px rgba(0 0 0 / 0.1)',
        border: '1px solid #e2e8f0',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 10px 15px -3px rgba(0 0 0 / 0.1)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="overline"
              sx={{ fontSize: '12px', fontWeight: 600 }}
            >
              {title}
            </Typography>

            <Typography variant="h4" component="div" fontWeight="bold" sx={{ mb: 1 }}>
              {/* Value check to avoid rendering objects */}
              {typeof value === 'object'
                ? JSON.stringify(value)
                : value ?? 'N/A'}
              <Typography
                variant="h6"
                component="span"
                color="textSecondary"
                sx={{ ml: 0.5 }}
              >
                {unit}
              </Typography>
            </Typography>

            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                backgroundColor: `${statusColor}15`,
                border: `1px solid ${statusColor}30`,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: statusColor,
                  mr: 1,
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: statusColor,
                  fontWeight: 600,
                  fontSize: '12px',
                }}
              >
                {normalizedStatus}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ color: color || statusColor, fontSize: 40, opacity: 0.8 }}>
            <Icon />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function StatusCards({ data, predictions }) {
  if (!data) return null;

  // Ensure predictions.status is string-safe
  const overall =
    typeof predictions?.status === 'object'
      ? predictions?.status?.status ?? 'Healthy'
      : predictions?.status ?? 'Healthy';

  const cards = [
    {
      title: 'Overall Status',
      value: overall,
      unit: '',
      status: overall,
      icon: AnalyticsIcon,
      color: AlertService.getStatusColor(overall),
    },
    {
      title: 'Temperature',
      value: data.temperature?.toFixed(1) ?? 'N/A',
      unit: '°C',
      status: AlertService.getParameterStatus('Temperature', data.temperature ?? 0),
      icon: TemperatureIcon,
      color: '#ef4444',
    },
    {
      title: 'Oil Level',
      value: data.oilLevel?.toFixed(1) ?? 'N/A',
      unit: '%',
      status: AlertService.getParameterStatus('Oil Level', data.oilLevel ?? 0),
      icon: OilIcon,
      color: '#3b82f6',
    },
    {
      title: 'Output Power',
      value: ((data.outputVoltage || 0) * (data.outputCurrent || 0)).toFixed(1),
      unit: 'W',
      status: 'Healthy',
      icon: PowerIcon,
      color: '#10b981',
    },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((c, i) => (
        <Grid item xs={12} sm={6} md={3} key={i}>
          <StatusCard {...c} />
        </Grid>
      ))}
    </Grid>
  );
}
