import React from 'react';
import { Box, Typography, Card, CardContent, Alert, Chip, Grid } from '@mui/material';
import { AlertService } from '../../services/alertService';

export default function AlertsPage({ transformerData, prediction, selectedTransformer }) {
  const alerts = AlertService.checkAlerts(transformerData);
  const criticalAlerts = alerts.filter(a => a.severity === 'error');
  const warningAlerts = alerts.filter(a => a.severity === 'warning');

  // --- identical helpers from DashboardHeader ---
  const getStatusColor = (status) => {
    if (!status) return 'default';
    
    // Handle object or string type prediction
    const statusText = typeof status === 'object' ? status?.Status || status?.status : status;
    
    switch (statusText?.toLowerCase()) {
      case 'healthy': return 'success';
      case 'warning': return 'warning';
      case 'fault':
      case 'danger': return 'error';
      default: return 'default';
    }
  };

 const getStatusText = (prediction) => {
    if (!prediction) return 'Unknown';
    
    if (typeof prediction === 'object') {
      return prediction.Status || prediction.status || 'Unknown';
    }
    
    return prediction;
  };
    

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Alerts & Notifications
      </Typography>

      <Grid container spacing={3}>
        {/* Summary Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Alert Summary
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography>Critical Alerts</Typography>
                  <Chip label={criticalAlerts.length} color="error" />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography>Warnings</Typography>
                  <Chip label={warningAlerts.length} color="warning" />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography>Transformer Status</Typography>
                  {prediction && (
            <Chip
              label={getStatusText(prediction)}
              color={getStatusColor(prediction)}
              size="small"
            />
          )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Active Alerts List */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Alerts ({alerts.length})
              </Typography>

              {alerts.length === 0 ? (
                <Alert severity="success">
                  No active alerts. All systems operating normally.
                </Alert>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    maxHeight: 400,
                    overflow: 'auto',
                  }}
                >
                  {alerts.map((alert, index) => (
                    <Alert key={index} severity={alert.severity} sx={{ width: '100%' }}>
                      <Box>
                        <Typography fontWeight="medium">{alert.message}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {alert.timestamp.toLocaleString()}
                        </Typography>
                      </Box>
                    </Alert>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
