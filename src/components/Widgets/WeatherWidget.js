import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Grid,
} from '@mui/material';
import {
  WbSunny as SunIcon,
  Opacity as HumidityIcon,
  Air as WindIcon,
  Compress as PressureIcon,
  LocationOn as LocationIcon,
  Visibility as VisibilityIcon,
  Whatshot as UVIndexIcon,
  Cloud as CloudIcon,
  Water as PrecipitationIcon,
} from '@mui/icons-material';

export default function WeatherWidget({ weatherData }) {
  if (!weatherData) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Weather
          </Typography>
          <Typography color="text.secondary">
            Loading weather data...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const { location, current } = weatherData;

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Weather</Typography>
          <Typography variant="h4" fontWeight="bold" color="primary.main">
            {Math.round(current.temp_c)}°C
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box 
            component="img" 
            src={current.condition.icon} 
            alt={current.condition.text}
            sx={{ 
              width: 64, 
              height: 64,
              mr: 2 
            }} 
          />
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <LocationIcon sx={{ mr: 0.5, fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body1" fontWeight="medium">
                {location.name}
                {location.region && `, ${location.region}`}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {current.condition.text}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HumidityIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Humidity
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {current.humidity}%
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WindIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Wind
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {current.wind_kph} km/h
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PressureIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Pressure
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {current.pressure_mb} mb
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SunIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Feels Like
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {Math.round(current.feelslike_c)}°C
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Additional weather data from real API */}
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <UVIndexIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  UV Index
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {current.uv}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <VisibilityIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Visibility
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {current.vis_km} km
                </Typography>
              </Box>
            </Box>
          </Grid>

          {current.precip_mm > 0 && (
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PrecipitationIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Precipitation
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {current.precip_mm} mm
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}

          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CloudIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Cloud Cover
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {current.cloud}%
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          Updated: {new Date(current.last_updated).toLocaleTimeString()}
        </Typography>
      </CardContent>
    </Card>
  );
}