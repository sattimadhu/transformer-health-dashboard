// src/components/Pages/ChartsPage.js
import React, { useMemo, useState } from 'react';
import { Card, CardContent, Typography, Box, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import CustomLineChart from '../Charts/LineChart';
import RealTimeWaveforms from '../Charts/RealTimeWaveforms';

export default function ChartsPage({ historicalData, transformerData, selectedTransformer }) {
  const [timeRange, setTimeRange] = useState('24h');

  const ranges = [
    { value: '6h', label: '6 Hours' },
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
  ];

  const chartData = useMemo(() => {
    const now = Date.now();
    let points = 24, interval = 3600000;
    if (timeRange === '6h') { points = 12; interval = 1800000; }
    else if (timeRange === '7d') { points = 28; interval = 6 * 3600000; }
    else if (timeRange === '30d') { points = 30; interval = 24 * 3600000; }

    return Array.from({ length: points }).map((_, i) => {
      const ts = now - (points - 1 - i) * interval;
      return {
        time: new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        Temperature: 65 + Math.random() * 20,
        'Oil Level': 75 + Math.random() * 20,
        H2: 40 + Math.random() * 40,
        CO: 250 + Math.random() * 150,
        CH4: 40 + Math.random() * 80,
        'Output Voltage': 10.5 + Math.random() * 1.5,
        'Output Current': 0.2 + Math.random() * 0.6,
      };
    });
  }, [timeRange]);

  const temperatureOilData = chartData.map((d) => ({ time: d.time, Temperature: d.Temperature, 'Oil Level': d['Oil Level'] }));
  const gasData = chartData.map((d) => ({ time: d.time, H2: d.H2, CO: d.CO, CH4: d.CH4 }));
  const electricalData = chartData.map((d) => ({ time: d.time, 'Output Voltage': d['Output Voltage'], 'Output Current': d['Output Current'] }));

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Analytics Charts
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Transformer {selectedTransformer} — Real-time monitoring and historical trends
          </Typography>
        </Box>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Time Range</InputLabel>
          <Select value={timeRange} label="Time Range" onChange={(e) => setTimeRange(e.target.value)}>
            {ranges.map((r) => (
              <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 2 }}>
          Real-time Waveforms
        </Typography>
        <RealTimeWaveforms data={transformerData} />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: 320 }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>Temperature & Oil Level</Typography>
              <Box sx={{ flexGrow: 1 }}>
                <CustomLineChart data={temperatureOilData} dataKeys={['Temperature', 'Oil Level']} colors={['#ef4444', '#3b82f6']} height={220} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: 320 }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>Dissolved Gas Analysis</Typography>
              <Box sx={{ flexGrow: 1 }}>
                <CustomLineChart data={gasData} dataKeys={['H2', 'CO', 'CH4']} colors={['#f59e0b', '#8b5cf6', '#10b981']} height={220} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: 320 }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>Electrical Parameters</Typography>
              <Box sx={{ flexGrow: 1 }}>
                <CustomLineChart data={electricalData} dataKeys={['Output Voltage', 'Output Current']} colors={['#6366f1', '#ec4899']} height={220} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: 320 }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>Combined Parameters</Typography>
              <Box sx={{ flexGrow: 1 }}>
                <CustomLineChart data={chartData} dataKeys={['Temperature', 'Oil Level', 'H2']} colors={['#ef4444', '#3b82f6', '#f59e0b']} height={220} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mb: 2 }}>
            Current Parameters — {selectedTransformer}
          </Typography>
          {transformerData && (
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4} md={2}>
                <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #e2e8f0', borderRadius: 2, bgcolor: '#fef2f2' }}>
                  <Typography variant="h5" color="#ef4444" fontWeight="bold">
                    {transformerData.temperature?.toFixed(1) ?? 'NA'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Temperature</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #e2e8f0', borderRadius: 2, bgcolor: '#eff6ff' }}>
                  <Typography variant="h5" color="#3b82f6" fontWeight="bold">
                    {transformerData.oilLevel?.toFixed(1) ?? 'NA'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Oil Level</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #e2e8f0', borderRadius: 2, bgcolor: '#fff7ed' }}>
                  <Typography variant="h5" color="#f59e0b" fontWeight="bold">
                    {transformerData.h2?.toFixed(1) ?? 'NA'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">H2 (ppm)</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #e2e8f0', borderRadius: 2, bgcolor: '#faf5ff' }}>
                  <Typography variant="h5" color="#8b5cf6" fontWeight="bold">
                    {transformerData.co?.toFixed(1) ?? 'NA'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">CO (ppm)</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #e2e8f0', borderRadius: 2, bgcolor: '#f0fdf4' }}>
                  <Typography variant="h5" color="#10b981" fontWeight="bold">
                    {transformerData.ch4?.toFixed(1) ?? 'NA'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">CH4 (ppm)</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #e2e8f0', borderRadius: 2, bgcolor: '#f8fafc' }}>
                  <Typography variant="h5" color="#6366f1" fontWeight="bold">
                    {(((transformerData.outputVoltage || 0) * (transformerData.outputCurrent || 0)) || 0).toFixed(1)}W
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Power</Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
