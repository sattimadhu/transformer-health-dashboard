import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Chip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Warning as AlertIcon,
  BarChart as ChartIcon,
  Download as DownloadIcon,
  WbSunny as WeatherIcon,
  ElectricBolt as TransformerIcon, // Using ElectricBolt instead of Transformer
} from '@mui/icons-material';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { id: 'alerts', label: 'Alerts', icon: <AlertIcon /> },
  { id: 'charts', label: 'Charts', icon: <ChartIcon /> },
  { id: 'download', label: 'Downloads', icon: <DownloadIcon /> },
  { id: 'weather', label: 'Weather', icon: <WeatherIcon /> },
];

export default function Sidebar({
  open,
  onToggle,
  transformers,
  selectedTransformer,
  onTransformerChange,
  currentPage,
  onPageChange,
}) {
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <TransformerIcon sx={{ color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h6" fontWeight="bold">
            Transformer Monitor
          </Typography>
        </Box>

        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          TRANSFORMERS
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          {transformers.map((transformer) => (
            <Chip
              key={transformer}
              label={transformer}
              onClick={() => onTransformerChange(transformer)}
              color={selectedTransformer === transformer ? 'primary' : 'default'}
              variant={selectedTransformer === transformer ? 'filled' : 'outlined'}
              sx={{ m: 0.5 }}
              clickable
            />
          ))}
        </Box>
      </Box>

      <Divider />

      <List sx={{ px: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={currentPage === item.id}
              onClick={() => onPageChange(item.id)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ 
                color: currentPage === item.id ? 'white' : 'text.secondary',
                minWidth: 40 
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: currentPage === item.id ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}