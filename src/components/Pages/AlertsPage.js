import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
  Chip,
  Grid,
} from '@mui/material';
import { AlertService } from '../../services/alertService';

export default function AlertsPage({ transformerData, predictions }) {
  const alerts = AlertService.checkAlerts(transformerData);

  const criticalAlerts = alerts.filter(alert => alert.severity === 'error');
  const warningAlerts = alerts.filter(alert => alert.severity === 'warning');

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Alerts & Notifications
      </Typography>
      
      <Grid container spacing={3}>
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
                  <Chip 
                    label={predictions?.status || 'Unknown'} 
                    color={
                      predictions?.status?.toLowerCase() === 'healthy' ? 'success' : 
                      predictions?.status?.toLowerCase() === 'warning' ? 'warning' : 'error'
                    } 
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

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
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 400, overflow: 'auto' }}>
                  {alerts.map((alert, index) => (
                    <Alert
                      key={index}
                      severity={alert.severity}
                      sx={{ width: '100%' }}
                    >
                      <Box>
                        <Typography fontWeight="medium">
                          {alert.message}
                        </Typography>
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