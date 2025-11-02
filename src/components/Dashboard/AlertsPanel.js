import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  Chip,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { AlertService } from '../../services/alertService';

export default function AlertsPanel({ data, predictions }) {
  const [expanded, setExpanded] = React.useState(true);
  const alerts = AlertService.checkAlerts(data);

  const getAlertIcon = (severity) => {
    switch (severity) {
      case 'error': return <ErrorIcon />;
      case 'warning': return <WarningIcon />;
      default: return <InfoIcon />;
    }
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  if (alerts.length === 0) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Alerts</Typography>
            <Chip label="All Clear" color="success" size="small" />
          </Box>
          <Alert severity="success" sx={{ mt: 1 }}>
            All parameters operating within normal ranges
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Alerts</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={`${alerts.length} active`} 
              color="error" 
              size="small" 
            />
            <IconButton
              onClick={handleExpandClick}
              size="small"
            >
              <ExpandMoreIcon 
                sx={{ 
                  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s'
                }} 
              />
            </IconButton>
          </Box>
        </Box>

        <Collapse in={expanded}>
          <Box sx={{ mt: 1, maxHeight: 300, overflow: 'auto' }}>
            {alerts.map((alert, index) => (
              <Alert
                key={index}
                severity={alert.severity}
                icon={getAlertIcon(alert.severity)}
                sx={{ mb: 1 }}
              >
                <Typography variant="body2" fontWeight="medium">
                  {alert.message}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {alert.timestamp.toLocaleTimeString()}
                </Typography>
              </Alert>
            ))}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}