import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Chip,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountIcon,
} from '@mui/icons-material';
import { authService } from '../../services/firebase';
import { useNavigate } from 'react-router-dom';

export default function DashboardHeader({
  onMenuToggle,
  selectedTransformer,
  prediction,
  weatherData,
  currentPage,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    if (!status) return 'default';
    
    // Handle different prediction data structures
    const statusText = typeof status === 'object' ? status?.Status || status?.status : status;
    
    switch (statusText?.toLowerCase()) {
      case 'healthy': return 'success';
      case 'warning': return 'warning';
      case 'fault': return 'error';
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

  const getPageTitle = () => {
    const titles = {
      dashboard: 'Dashboard',
      alerts: 'Alerts',
      charts: 'Analytics',
      download: 'Data Export',
      weather: 'Weather'
    };
    return titles[currentPage] || 'Dashboard';
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuToggle}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {getPageTitle()}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {selectedTransformer && (
            <Chip
              label={selectedTransformer}
              variant="outlined"
              size="small"
            />
          )}
          
          {prediction && (
            <Chip
              label={getStatusText(prediction)}
              color={getStatusColor(prediction)}
              size="small"
            />
          )}

          {weatherData && (
            <Chip
              icon={<span>🌡️</span>}
              label={`${weatherData.tempC} • ${weatherData.desc}`}
              variant="outlined"
              size="small"
            />
          )}

          <Tooltip title="Account settings">
            <IconButton onClick={handleMenu} size="small">
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                <AccountIcon fontSize="small" />
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} fontSize="small" />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}