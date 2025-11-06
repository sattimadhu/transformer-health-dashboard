import React, { useMemo, useState } from 'react';
import {
  Typography,
  Box,
  Paper,
  Chip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';

// Generate wave data based on current transformer data
const generateWaveData = (baseValue, parameterName, unit, color) => {
  const now = Date.now();
  return Array.from({ length: 24 }, (_, index) => {
    const time = new Date(now - (23 - index) * 3600000);
    const hour = time.getHours();

    // Sinusoidal pattern with realistic variations
    const value = baseValue +
      Math.sin((hour - 6) * Math.PI / 12) * (baseValue * 0.12) +
      (Math.random() - 0.5) * (baseValue * 0.02);

    return {
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: time.getTime(),
      [parameterName]: Number(value.toFixed(2)),
      unit,
      color,
    };
  });
};

const BarChart = ({ points, line, getScaledY, barWidth, gap }) => {
  return (
    <g>
      {points.map((point, index) => {
        const x = (index / (points.length - 1)) * 100;
        const y = getScaledY(point[line.key]);
        const barHeight = 100 - y;
        
        return (
          <g key={index}>
            <rect
              x={`${x - barWidth/2}%`}
              y={`${y}%`}
              width={`${barWidth}%`}
              height={`${barHeight}%`}
              fill={line.color}
              opacity="0.7"
              rx="2"
              ry="2"
            />
            
            <rect
              x={`${x - barWidth/2}%`}
              y={`${y}%`}
              width={`${barWidth}%`}
              height={`${barHeight}%`}
              fill="none"
              stroke={line.color}
              strokeWidth="1"
              opacity="0.9"
              rx="2"
              ry="2"
            />
          </g>
        );
      })}
      
      <defs>
        <linearGradient id={`bar-gradient-${line.key}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={line.color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={line.color} stopOpacity="0.4" />
        </linearGradient>
      </defs>
    </g>
  );
};

const WaveBarChart = ({ title, data, lines }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const getTrendIcon = (currentValue, previousValue) => {
    if (currentValue > previousValue) return <TrendingUpIcon sx={{ fontSize: 16, color: '#10b981' }} />;
    if (currentValue < previousValue) return <TrendingDownIcon sx={{ fontSize: 16, color: '#ef4444' }} />;
    return <RemoveIcon sx={{ fontSize: 16, color: '#6b7280' }} />;
  };

  const allValues = useMemo(() => {
    const values = [];
    lines.forEach(line => {
      data.forEach(point => {
        values.push(point[line.key]);
      });
    });
    return values;
  }, [data, lines]);

  const globalMin = Math.min(...allValues);
  const globalMax = Math.max(...allValues);
  const range = globalMax - globalMin;
  const paddedMin = Math.max(0, globalMin - range * 0.1);
  const paddedMax = globalMax + range * 0.1;
  const scaledRange = paddedMax - paddedMin;

  const getScaledY = (value) => {
    if (scaledRange === 0) return 50;
    return 100 - ((value - paddedMin) / scaledRange) * 100;
  };

  const handlePointHover = (point, index) => {
    setHoveredPoint({ point, index });
  };

  const handlePointLeave = () => {
    setHoveredPoint(null);
  };

  const barWidth = 100 / data.length * 0.6;
  const gap = 100 / data.length * 0.4;

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 4,
        p: 3,
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent)',
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5" fontWeight="600" sx={{ color: 'text.primary' }}>
          {title}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {lines.map((line) => {
            const currentValue = data[data.length - 1]?.[line.key] || 0;
            const previousValue = data[0]?.[line.key] || 0;
            
            return (
              <Chip
                key={line.key}
                icon={getTrendIcon(currentValue, previousValue)}
                label={`${currentValue.toFixed(1)} ${line.unit}`}
                variant="outlined"
                size="small"
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'text.secondary',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  '& .MuiChip-icon': {
                    color: line.color,
                  }
                }}
              />
            );
          })}
        </Box>
      </Box>

      <Box sx={{ position: 'relative', height: 340, width: '100%' }}>
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(90deg, transparent 99%, rgba(255,255,255,0.03) 99%) 0 0 / 20% 100%,
            linear-gradient(0deg, transparent 99%, rgba(255,255,255,0.03) 99%) 0 0 / 100% 25%
          `,
          borderRadius: 1,
        }} />

        {hoveredPoint && (
          <Box
            sx={{
              position: 'absolute',
              top: 20,
              bottom: 30,
              left: `calc(${(hoveredPoint.index / (data.length - 1)) * 100}% + 10px)`,
              width: `${barWidth}%`,
              background: 'rgba(255, 255, 255, 0.1)',
              zIndex: 1,
              pointerEvents: 'none',
              borderRadius: '2px',
            }}
          />
        )}

        <Box sx={{ position: 'absolute', top: 20, left: 10, right: 10, bottom: 30 }}>
          <svg width="100%" height="100%" style={{ position: 'relative', overflow: 'visible' }}>
            {lines.map((line) => (
              <BarChart
                key={line.key}
                points={data}
                line={line}
                getScaledY={getScaledY}
                barWidth={barWidth}
                gap={gap}
              />
            ))}

            {data.map((point, index) => {
              const x = (index / (data.length - 1)) * 100;
              
              return (
                <rect
                  key={index}
                  x={`${x - barWidth/2}%`}
                  y="0%"
                  width={`${barWidth}%`}
                  height="100%"
                  fill="transparent"
                  style={{ cursor: 'pointer', zIndex: 5 }}
                  onMouseEnter={() => handlePointHover(point, index)}
                  onMouseLeave={handlePointLeave}
                />
              );
            })}

            {hoveredPoint && lines.map((line) => {
              const x = (hoveredPoint.index / (data.length - 1)) * 100;
              const y = getScaledY(hoveredPoint.point[line.key]);
              
              return (
                <g key={line.key}>
                  <rect
                    x={`${x - barWidth/2}%`}
                    y={`${y - 8}%`}
                    width={`${barWidth}%`}
                    height="16%"
                    fill="rgba(15, 23, 42, 0.9)"
                    stroke={line.color}
                    strokeWidth="1"
                    rx="2"
                    ry="2"
                  />
                  <text
                    x={`${x}%`}
                    y={`${y}%`}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={line.color}
                    fontSize="10"
                    fontWeight="600"
                    pointerEvents="none"
                  >
                    {hoveredPoint.point[line.key].toFixed(1)}
                  </text>
                </g>
              );
            })}
          </svg>
        </Box>

        {hoveredPoint && (
          <Box
            sx={{
              position: 'absolute',
              top: 20,
              left: `calc(${(hoveredPoint.index / (data.length - 1)) * 100}% + 20px)`,
              transform: (hoveredPoint.index / (data.length - 1)) > 0.8 
                ? 'translateX(calc(-100% - 20px))' 
                : 'translateX(0)',
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 2,
              p: 2,
              minWidth: 200,
              zIndex: 10,
              backdropFilter: 'blur(10px)',
              pointerEvents: 'none',
              transition: 'transform 0.1s ease-out',
            }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: '600', display: 'block', mb: 1 }}>
              {hoveredPoint.point.time}
            </Typography>
            
            {lines.map((line) => (
              <Box
                key={line.key}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 0.5,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 2,
                      backgroundColor: line.color,
                      borderRadius: 1,
                    }}
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {line.name}:
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: line.color, fontWeight: '600' }}>
                  {hoveredPoint.point[line.key].toFixed(1)} {line.unit}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        <Box sx={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 10, 
          right: 10, 
          display: 'flex', 
          justifyContent: 'space-between',
        }}>
          {data.map((point, index) => (
            index % 4 === 0 && (
              <Typography
                key={index}
                variant="caption"
                sx={{ 
                  color: 'text.secondary', 
                  fontSize: '0.7rem',
                  fontWeight: '500'
                }}
              >
                {point.time}
              </Typography>
            )
          ))}
        </Box>

        <Box sx={{ 
          position: 'absolute', 
          left: -10,
          top: 20, 
          bottom: 30, 
          width: 60,
          pointerEvents: 'none',
        }}>
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const value = paddedMin + (paddedMax - paddedMin) * ratio;
            if (ratio === 0 && Math.abs(value - paddedMin) < 0.01) return null;
            if (ratio === 1 && Math.abs(value - paddedMax) < 0.01) return null;
            
            return (
              <Typography
                key={ratio}
                variant="caption"
                sx={{
                  position: 'absolute',
                  top: `${(1 - ratio) * 100}%`,
                  left: 10,
                  transform: 'translateY(-50%)',
                  color: 'text.secondary',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  background: 'rgba(15, 23, 42, 0.9)',
                  px: 1,
                  borderRadius: 1,
                }}
              >
                {value.toFixed(1)}
              </Typography>
            );
          })}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, mt: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
        {lines.map((line) => (
          <Box 
            key={line.key} 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5,
              p: 1,
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 2,
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: line.color,
                borderRadius: 1,
              }}
            />
            <Typography variant="body2" sx={{ color: line.color, fontWeight: '600' }}>
              {line.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default function HistoricalCharts({ transformerData }) {
  const waveData = useMemo(() => {
    if (!transformerData) return [];

    const tr = transformerData;
    
    // Generate wave data for each parameter using actual data
    const temperatureData = generateWaveData(tr.Temperature || 35, 'Temperature', '°C', '#ef4444');
    const oilLevelData = generateWaveData(tr.OilLevel || 99, 'OilLevel', '%', '#3b82f6');
    const voltageData = generateWaveData(tr.OutputVoltage || 32, 'Voltage', 'V', '#10b981');
    const currentData = generateWaveData(tr.OutputCurrent || 0.14, 'Current', 'A', '#f59e0b');
    const h2Data = generateWaveData(tr.H2 || 0, 'H2', 'ppm', '#8b5cf6');
    const coData = generateWaveData(tr.CO || 0.02, 'CO', 'ppm', '#f97316');
    const ch4Data = generateWaveData(tr.CH4 || 0.04, 'CH4', 'ppm', '#06b6d4');

    // Merge all data into one array
    return temperatureData.map((tempPoint, index) => ({
      ...tempPoint,
      ...oilLevelData[index],
      ...voltageData[index],
      ...currentData[index],
      ...h2Data[index],
      ...coData[index],
      ...ch4Data[index],
    }));
  }, [transformerData]);

  if (!waveData || waveData.length === 0) {
    return (
      <Box sx={{ width: '100%' }}>
        <Typography variant="h4" fontWeight="700" gutterBottom sx={{ mb: 4, color: 'text.primary' }}>
          24h Trends & Analytics
        </Typography>
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 8 }}>
          {transformerData ? 'Generating historical data...' : 'Waiting for transformer data...'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" fontWeight="700" gutterBottom sx={{ mb: 4, color: 'text.primary' }}>
        24h Trends & Analytics
      </Typography>

      {/* Temperature & Oil Level */}
      <WaveBarChart
        title="Temperature & Oil Level Trends"
        data={waveData}
        lines={[
          { key: 'Temperature', name: 'Temperature', color: '#ef4444', unit: '°C' },
          { key: 'OilLevel', name: 'Oil Level', color: '#3b82f6', unit: '%' },
        ]}
      />

      {/* Electrical Parameters */}
      <WaveBarChart
        title="Electrical Parameters Trends"
        data={waveData}
        lines={[
          { key: 'Voltage', name: 'Output Voltage', color: '#10b981', unit: 'V' },
          { key: 'Current', name: 'Output Current', color: '#f59e0b', unit: 'A' },
        ]}
      />

      {/* Dissolved Gas Analysis */}
      <WaveBarChart
        title="Dissolved Gas Analysis Trends"
        data={waveData}
        lines={[
          { key: 'H2', name: 'Hydrogen (H₂)', color: '#8b5cf6', unit: 'ppm' },
          { key: 'CO', name: 'Carbon Monoxide (CO)', color: '#f97316', unit: 'ppm' },
          { key: 'CH4', name: 'Methane (CH₄)', color: '#06b6d4', unit: 'ppm' },
        ]}
      />
    </Box>
  );
}