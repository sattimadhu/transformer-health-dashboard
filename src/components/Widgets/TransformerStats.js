// src/components/Widgets/TransformerStats.js
import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';
import { TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon, Equalizer as EqualizerIcon } from '@mui/icons-material';
import AlertService from '../../services/alertService';

export default function TransformerStats({ data, predictions }) {
  if (!data) return null;

  const calculateEfficiency = () => {
    const base = 95;
    const tempFactor = Math.max(0, 100 - Math.abs((data.temperature ?? 0) - 65) * 0.5);
    const oilFactor = Math.min(100, (data.oilLevel ?? 0));
    const gasPenalty = Math.max(0, (data.h2 ?? 0) / 10 + (data.co ?? 0) / 50 + (data.ch4 ?? 0) / 20);
    return Math.min(98, (base + tempFactor + oilFactor - gasPenalty) / 3);
  };

  const calculateLoadFactor = () => {
    const baseLoad = 75;
    const voltageVar = Math.abs((data.outputVoltage ?? 0) - 11.8) * 10;
    const currentLoadPct = ((data.outputCurrent ?? 0) / 3.5) * 100;
    return Math.min(100, Math.max(20, baseLoad + (currentLoadPct - baseLoad) - voltageVar));
  };

  const calculateHealthScore = () => {
    const statusWeights = { Healthy: 90, Warning: 65, Fault: 40, 'Critical Fault': 15 };
    let base = statusWeights[predictions?.status || 'Healthy'] ?? 85;
    if ((data.temperature ?? 0) >= 80) base -= 15;
    if ((data.oilLevel ?? 0) <= 85) base -= 20;
    if ((data.h2 ?? 0) >= 100) base -= 10;
    if ((data.co ?? 0) >= 200) base -= 8;
    if ((data.ch4 ?? 0) >= 80) base -= 7;
    return Math.max(0, Math.min(100, base));
  };

  const calculateReliability = () => {
    const health = calculateHealthScore();
    const eff = calculateEfficiency();
    const loadStability = 100 - Math.abs(calculateLoadFactor() - 75);
    return 0.4 * health + 0.3 * eff + 0.3 * loadStability;
  };

  const stats = [
    { label: 'Operational Efficiency', value: calculateEfficiency(), unit: '' },
    { label: 'Load Factor', value: calculateLoadFactor(), unit: '' },
    { label: 'Health Score', value: calculateHealthScore(), unit: '' },
    { label: 'System Reliability', value: calculateReliability(), unit: '' },
  ];

  const getTrendIcon = (val) => {
    if (val >= 90) return <TrendingUpIcon sx={{ fontSize: 18, color: '#10b981' }} />;
    if (val <= 60) return <TrendingDownIcon sx={{ fontSize: 18, color: '#ef4444' }} />;
    return <EqualizerIcon sx={{ fontSize: 18, color: '#6b7280' }} />;
    };

  const performanceLabel = (score) => (score >= 90 ? 'Excellent' : score >= 80 ? 'Good' : score >= 70 ? 'Fair' : 'Poor');

  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)', height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight={600}>Performance Analytics</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {stats.map((s, i) => (
            <Box key={i}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>{s.label}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getTrendIcon(s.value)}
                  <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.85rem' }}>
                    {s.value.toFixed(1)}{s.unit}
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.max(0, Math.min(100, s.value))}
                sx={{ height: 6, borderRadius: 3, backgroundColor: '#f1f5f9' }}
              />
            </Box>
          ))}
        </Box>
        <Box sx={{ mt: 3, p: 2, backgroundColor: '#f8fafc', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">Overall Performance</Typography>
            <Typography variant="body2" fontWeight={600} color={calculateReliability() >= 85 ? '#10b981' : calculateReliability() >= 70 ? '#f59e0b' : '#ef4444'}>
              {performanceLabel(calculateReliability())}
            </Typography>
          </Box>
          <Typography variant="h6" color={AlertService.getStatusColor(predictions?.status || 'Healthy')} fontWeight={600}>
            {predictions?.status || 'Healthy'}
          </Typography>
          <Typography variant="caption" color="text.secondary">Updated {new Date().toLocaleTimeString()}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
