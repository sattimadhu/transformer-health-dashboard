import React, { useEffect, useMemo, useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  CircularProgress,
  Typography,
  Button,
} from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Services
import { authService, firebaseService } from './services/firebase';
import { WeatherApiService } from './services/weatherApi';

// Auth Components
import LoginPage from './components/Auth/LoginPage';
import SignupPage from './components/Auth/SignupPage';

// Layout Components
import Sidebar from './components/Layout/Sidebar';
import DashboardHeader from './components/Dashboard/DashboardHeader';

// Dashboard Components
import ParameterCards from './components/Dashboard/ParameterCards';
import RealTimeWaveforms from './components/Charts/RealTimeWaveforms';
import HistoricalCharts from './components/Dashboard/HistoricalCharts';
import AlertsPanel from './components/Dashboard/AlertsPanel';
import WeatherWidget from './components/Widgets/WeatherWidget';

// Page Components
import AlertsPage from './components/Pages/AlertsPage';
import DownloadPage from './components/Pages/DownloadPage';
import WeatherPage from './components/Pages/WeatherPage';

// Theme Configuration
const THEME_CONFIG = {
  palette: {
    mode: 'dark',
    primary: { main: '#3b82f6', light: '#60a5fa', dark: '#1d4ed8' },
    secondary: { main: '#10b981', light: '#34d399', dark: '#047857' },
    error: { main: '#ef4444', light: '#f87171', dark: '#dc2626' },
    warning: { main: '#f59e0b', light: '#fbbf24', dark: '#d97706' },
    info: { main: '#06b6d4', light: '#22d3ee', dark: '#0891b2' },
    success: { main: '#22c55e', light: '#4ade80', dark: '#16a34a' },
    background: { 
      default: '#0f172a', 
      paper: '#1e293b',
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#94a3b8',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: { fontWeight: 800 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
  },
};

// Protected Route Component
const ProtectedRoute = ({ user, children, requireAdmin = false }) => {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userRole, setUserRole] = useState('normal');

  useEffect(() => {
    const checkAuth = async () => {
      if (user) {
        const role = await firebaseService.getUserRole(user.uid);
        setUserRole(role);
      }
      setCheckingAuth(false);
    };

    checkAuth();
  }, [user]);

  if (checkingAuth) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Redirect to login if no user
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to access denied if admin access required but user is not admin
  if (requireAdmin && userRole !== 'admin') {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};

// Access Denied Component
const AccessDenied = () => {
  const navigate = useNavigate();
  
  const handleReturnToLogin = () => {
    authService.logout().then(() => navigate('/login'));
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <Container sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h3" color="error" gutterBottom>
        Access Denied
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        You don't have permission to access this page.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button variant="contained" onClick={handleGoToDashboard}>
          Go to Dashboard
        </Button>
        <Button variant="outlined" onClick={handleReturnToLogin}>
          Return to Login
        </Button>
      </Box>
    </Container>
  );
};

// Loading Component
const AppLoading = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
    <CircularProgress />
  </Box>
);

// Main Dashboard Component
const Dashboard = ({ user }) => {
  const [selectedTransformer, setSelectedTransformer] = useState('');
  const [transformers, setTransformers] = useState([]);
  const [transformerData, setTransformerData] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Fetch transformer list
  useEffect(() => {
    const unsubscribe = firebaseService.subscribeToTransformerList(setTransformers);
    return unsubscribe;
  }, []);

  // Auto-select first transformer
  useEffect(() => {
    if (transformers.length > 0 && !selectedTransformer) {
      setSelectedTransformer(transformers[0]);
    }
  }, [transformers, selectedTransformer]);

  // Subscribe to transformer data
  useEffect(() => {
    if (!selectedTransformer) return;

    console.log('Subscribing to transformer:', selectedTransformer);

    const unsubscribeData = firebaseService.subscribeToTransformerData(
      selectedTransformer, 
      async (data) => {
        console.log('Received transformer data:', data);
        setTransformerData(data);
        if (data?.city) {
          try {
            const weather = await WeatherApiService.getCurrentWeather(data.city);
            setWeatherData(weather);
          } catch (error) {
            console.error('Failed to fetch weather data:', error);
          }
        }
      }
    );

    const unsubscribePred = firebaseService.subscribeToPredictionData(
      selectedTransformer, 
      (prediction) => {
        console.log('Received prediction data:', prediction);
        setPredictionData(prediction);
      }
    );

    return () => {
      unsubscribeData?.();
      unsubscribePred?.();
    };
  }, [selectedTransformer]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const renderPageContent = () => {
    switch (currentPage) {
      case 'alerts':
        return <AlertsPage transformerData={transformerData} prediction={predictionData} />;
      case 'download':
        return <DownloadPage transformerData={transformerData} transformers={transformers} />;
      case 'weather':
        return <WeatherPage weatherData={weatherData} />;
      case 'dashboard':
      default:
        return (
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Transformer Monitoring Dashboard
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Monitoring {selectedTransformer} • {transformerData?.city || 'Unknown Location'}
            </Typography>

            {/* Parameter Cards */}
            <Box sx={{ mb: 4 }}>
              <ParameterCards data={transformerData} />
            </Box>

            {/* Main Content Grid */}
            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
              
              {/* Left Column - Main Content */}
              <Box sx={{ flex: 1 }}>
                <Box sx={{ mb: 4 }}>
                  <RealTimeWaveforms data={transformerData} />
                </Box>
                
                <Box sx={{ mb: 4 }}>
                  <HistoricalCharts transformerData={transformerData} />
                </Box>
              </Box>

              {/* Right Column - Widgets */}
              <Box sx={{ width: { xs: '100%', lg: 350 } }}>
                <Box sx={{ mb: 3 }}>
                  <WeatherWidget weatherData={weatherData} />
                </Box>
                
                <Box>
                  <AlertsPanel data={transformerData} prediction={predictionData} />
                </Box>
              </Box>
            </Box>
          </Box>
        );
    }
  };

  const theme = useMemo(() => createTheme(THEME_CONFIG), []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        
        {/* Sidebar */}
        <Sidebar
          open={sidebarOpen}
          onToggle={toggleSidebar}
          transformers={transformers}
          selectedTransformer={selectedTransformer}
          onTransformerChange={setSelectedTransformer}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          user={user}
        />

        {/* Main Content */}
        <Box sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          transition: 'margin 0.3s',
          marginLeft: sidebarOpen ? 0 : '-280px',
        }}>
          
          {/* Header */}
          <DashboardHeader
            onMenuToggle={toggleSidebar}
            selectedTransformer={selectedTransformer}
            prediction={predictionData}
            weatherData={
              weatherData ? { 
                tempC: `${weatherData.current.temp_c}°C`, 
                desc: weatherData.current.condition.text 
              } : null
            }
            currentPage={currentPage}
            user={user}
          />

          {/* Page Content */}
          <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
            <Container maxWidth="xl">
              {renderPageContent()}
            </Container>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

// Public Route Component (for login/signup when user is already authenticated)
const PublicRoute = ({ user, children }) => {
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

// Main App Component
const AppRoot = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const theme = useMemo(() => createTheme(THEME_CONFIG), []);

  if (loading) return <AppLoading />;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={
              <PublicRoute user={user}>
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute user={user}>
                <SignupPage />
              </PublicRoute>
            } 
          />
          <Route path="/access-denied" element={<AccessDenied />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={user}>
                <Dashboard user={user} />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/admin"
            element={
              <ProtectedRoute user={user} requireAdmin={true}>
                <Dashboard user={user} />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default AppRoot;