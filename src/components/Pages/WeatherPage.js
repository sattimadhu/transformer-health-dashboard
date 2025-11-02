import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import WeatherWidget from '../Widgets/WeatherWidget';
import WeatherApiService from '../../services/weatherApi';
import { firebaseService } from '../../services/firebase';

export default function WeatherPage() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [cities, setCities] = useState([]);
  const [transformers, setTransformers] = useState([]);

  // Memoized fetchWeatherData function to avoid dependency issues
  const fetchWeatherData = useCallback(async (city) => {
    setLoading(true);
    setError(null);
    try {
      const data = await WeatherApiService.getCurrentWeather(city);
      setWeatherData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch transformer data from Firebase to get cities
  useEffect(() => {
    const unsubscribe = firebaseService.subscribeToTransformerList((transformerIds) => {
      if (transformerIds.length > 0) {
        const transformerDataPromises = transformerIds.map(id => 
          new Promise((resolve) => {
            firebaseService.subscribeToTransformerData(id, (data) => {
              if (data && data.city) {
                resolve({ id, city: data.city });
              } else {
                resolve(null);
              }
            });
          })
        );

        Promise.all(transformerDataPromises).then(results => {
          const validResults = results.filter(result => result !== null);
          const uniqueCities = [...new Set(validResults.map(result => result.city))];
          
          setTransformers(validResults);
          setCities(uniqueCities);
          
          // Set default city to the first available city
          if (uniqueCities.length > 0 && !selectedCity) {
            setSelectedCity(uniqueCities[0]);
            fetchWeatherData(uniqueCities[0]);
          }
        });
      }
    });

    return () => unsubscribe();
  }, [selectedCity, fetchWeatherData]); // Added dependencies

  // Fetch weather data when selected city changes
  useEffect(() => {
    if (selectedCity) {
      fetchWeatherData(selectedCity);
    }
  }, [selectedCity, fetchWeatherData]); // Added fetchWeatherData dependency

  const handleCityChange = (event) => {
    const newCity = event.target.value;
    setSelectedCity(newCity);
  };

  const handleRefresh = () => {
    if (selectedCity) {
      fetchWeatherData(selectedCity);
    }
  };

  // Get transformers in the selected city
  const transformersInSelectedCity = transformers.filter(t => t.city === selectedCity);

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Weather Information
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Real-time weather conditions from WeatherAPI for transformer locations
      </Typography>

      {/* City Selector and Refresh */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          select
          label="Select Transformer City"
          value={selectedCity}
          onChange={handleCityChange}
          sx={{ minWidth: 200 }}
          size="small"
          disabled={cities.length === 0}
        >
          {cities.length === 0 ? (
            <MenuItem value="" disabled>
              Loading cities...
            </MenuItem>
          ) : (
            cities.map((city) => (
              <MenuItem key={city} value={city}>
                {city.charAt(0).toUpperCase() + city.slice(1)}
              </MenuItem>
            ))
          )}
        </TextField>
        
        <Button 
          variant="outlined" 
          onClick={handleRefresh}
          disabled={loading || !selectedCity}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          {loading ? (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Loading weather data for {selectedCity}...
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <WeatherWidget weatherData={weatherData} />
          )}
        </Grid>
        
        <Grid item xs={12} md={6} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Weather Impact on Transformers
              </Typography>
              
              {selectedCity && (
                <Typography variant="body2" color="text.secondary" paragraph>
                  Real weather conditions from {selectedCity} affecting {transformersInSelectedCity.length} transformer(s):
                </Typography>
              )}

              {/* Show transformers in this city */}
              {transformersInSelectedCity.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Transformers in {selectedCity}:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {transformersInSelectedCity.map(transformer => (
                      <Box
                        key={transformer.id}
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          backgroundColor: 'primary.light',
                          color: 'white',
                          borderRadius: 1,
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}
                      >
                        {transformer.id}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              <Typography variant="body2" color="text.secondary" paragraph>
                Weather conditions impact transformer performance:
              </Typography>
              
              <Box component="ul" sx={{ mt: 1, pl: 2 }}>
                <li>
                  <Typography variant="body2">
                    <strong>Temperature ({weatherData ? Math.round(weatherData.current.temp_c) + '°C' : '--'})</strong> - 
                    High temperatures reduce cooling efficiency and increase load losses
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    <strong>Humidity ({weatherData ? weatherData.current.humidity + '%' : '--'})</strong> - 
                    Affects insulation properties and can cause condensation
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    <strong>Wind ({weatherData ? weatherData.current.wind_kph + ' km/h' : '--'})</strong> - 
                    Assists in natural cooling but strong winds can cause physical damage
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    <strong>Precipitation ({weatherData ? (weatherData.current.precip_mm || 0) + ' mm' : '--'})</strong> - 
                    Rain helps in dust suppression but heavy rain can cause flashovers
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    <strong>Cloud Cover ({weatherData ? weatherData.current.cloud + '%' : '--'})</strong> - 
                    Affects solar radiation and ambient temperature
                  </Typography>
                </li>
              </Box>

              {/* Weather alerts or warnings */}
              {weatherData && weatherData.current.condition.text.toLowerCase().includes('rain') && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  <strong>Rain Alert:</strong> Monitor transformer insulation and check for any moisture ingress.
                </Alert>
              )}

              {weatherData && weatherData.current.temp_c > 35 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  <strong>High Temperature Alert:</strong> Transformer cooling efficiency may be reduced. Monitor load levels.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}