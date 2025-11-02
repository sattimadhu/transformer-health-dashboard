import React, { useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Box, Grid } from '@mui/material';

// Simple canvas-based sine wave implementation
const SineWaveCanvas = ({ data, color, title, unit, height = 200 }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const drawWave = () => {
      // Clear canvas
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, width, height);

      // Draw grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      
      // Horizontal grid lines
      for (let y = 0; y <= height; y += height / 4) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw sine wave
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;

      const amplitude = height / 4;
      const frequency = 0.02;
      const scaledAmplitude = amplitude * 0.8;

      for (let x = 0; x < width; x++) {
        const y = height / 2 + Math.sin((x * frequency) + timeRef.current) * scaledAmplitude;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();

      // Update time for animation
      timeRef.current += 0.1;

      animationRef.current = requestAnimationFrame(drawWave);
    };

    drawWave();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [data, color]);

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <canvas
        ref={canvasRef}
        width={400}
        height={height}
        style={{ 
          width: '100%', 
          height: `${height}px`,
          borderRadius: '8px',
          background: '#1e293b'
        }}
      />
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        Current: {data ? data.toFixed(2) : '0'} {unit}
      </Typography>
    </Box>
  );
};

export default function RealTimeWaveforms({ data }) {
  const voltageDataRef = useRef(Array(50).fill(0));
  const currentDataRef = useRef(Array(50).fill(0));

  useEffect(() => {
    if (!data) return;

    // Generate sine wave data based on actual values
    const voltageAmplitude = data.Voltage || 90;
    const currentAmplitude = data.Current || 0.38;
    
    const voltagePoint = voltageAmplitude + Math.sin(Date.now() / 1000) * 5;
    const currentPoint = currentAmplitude + Math.sin(Date.now() / 1000 + Math.PI) * 0.1;

    voltageDataRef.current = [...voltageDataRef.current.slice(1), voltagePoint];
    currentDataRef.current = [...currentDataRef.current.slice(1), currentPoint];
  }, [data]);

  if (!data) {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Voltage Waveform
              </Typography>
              <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">No data available</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Waveform
              </Typography>
              <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">No data available</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Voltage Waveform
            </Typography>
            <SineWaveCanvas
              data={data.Voltage}
              color="#3b82f6"
              title="AC Voltage"
              unit="kV"
              height={200}
            />
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Current Waveform
            </Typography>
            <SineWaveCanvas
              data={data.Current}
              color="#10b981"
              title="AC Current"
              unit="A"
              height={200}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}