import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
} from '@mui/material';

const RealTimeWaveforms = ({ data }) => {
  const [waveData, setWaveData] = useState([]);
  const canvasRef1 = useRef(null);
  const canvasRef2 = useRef(null);

  useEffect(() => {
    if (!data) return;

    const newPoint = {
      timestamp: Date.now(),
      OutputVoltage: data.OutputVoltage || 0,
      OutputCurrent: data.OutputCurrent || 0,
    };

    setWaveData(prev => {
      const updated = [...prev, newPoint];
      // Keep only last 200 points for smoother waveforms
      return updated.slice(-200);
    });
  }, [data]);

  // Draw voltage waveform
  useEffect(() => {
    const canvas = canvasRef1.current;
    if (!canvas || waveData.length === 0) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = (i * height) / 5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw voltage waveform
    if (waveData.length > 1) {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();

      const maxVoltage = Math.max(...waveData.map(d => d.OutputVoltage));
      const minVoltage = Math.min(...waveData.map(d => d.OutputVoltage));
      const voltageRange = maxVoltage - minVoltage || 1;

      waveData.forEach((point, index) => {
        const x = (index / (waveData.length - 1)) * width;
        const normalizedVoltage = (point.OutputVoltage - minVoltage) / voltageRange;
        const y = height - (normalizedVoltage * height * 0.8 + height * 0.1);

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Draw current value indicator
      const currentVoltage = waveData[waveData.length - 1].OutputVoltage;
      const currentX = width;
      const currentY = height - (((currentVoltage - minVoltage) / voltageRange) * height * 0.8 + height * 0.1);
      
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(currentX, currentY, 4, 0, 2 * Math.PI);
      ctx.fill();

      // Draw value text
      ctx.fillStyle = '#10b981';
      ctx.font = '12px monospace';
      ctx.fillText(`${currentVoltage.toFixed(2)}V`, width - 60, currentY - 10);
    }
  }, [waveData]);

  // Draw current waveform
  useEffect(() => {
    const canvas = canvasRef2.current;
    if (!canvas || waveData.length === 0) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = (i * height) / 5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw current waveform
    if (waveData.length > 1) {
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();

      const maxCurrent = Math.max(...waveData.map(d => d.OutputCurrent));
      const minCurrent = Math.min(...waveData.map(d => d.OutputCurrent));
      const currentRange = maxCurrent - minCurrent || 1;

      waveData.forEach((point, index) => {
        const x = (index / (waveData.length - 1)) * width;
        const normalizedCurrent = (point.OutputCurrent - minCurrent) / currentRange;
        const y = height - (normalizedCurrent * height * 0.8 + height * 0.1);

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Draw current value indicator
      const currentValue = waveData[waveData.length - 1].OutputCurrent;
      const currentX = width;
      const currentY = height - (((currentValue - minCurrent) / currentRange) * height * 0.8 + height * 0.1);
      
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(currentX, currentY, 4, 0, 2 * Math.PI);
      ctx.fill();

      // Draw value text
      ctx.fillStyle = '#f59e0b';
      ctx.font = '12px monospace';
      ctx.fillText(`${currentValue.toFixed(4)}A`, width - 70, currentY - 10);
    }
  }, [waveData]);

  if (!data) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Real-time Waveforms
          </Typography>
          <Typography color="text.secondary">
            Waiting for transformer data...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Real-time Electrical Waveforms
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Voltage Waveform */}
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#10b981', fontWeight: '600' }}>
                Output Voltage Waveform
              </Typography>
              <Typography variant="body2" sx={{ color: '#10b981', fontFamily: 'monospace' }}>
                Voltage: {(data.OutputVoltage || 0).toFixed(2)} V
              </Typography>
            </Box>
            <Box sx={{ position: 'relative', height: 200, background: 'rgba(0, 0, 0, 0.2)', borderRadius: 1 }}>
              <canvas
                ref={canvasRef1}
                width={800}
                height={200}
                style={{
                  width: '100%',
                  height: '200px',
                  borderRadius: '4px'
                }}
              />
              {/* Y-axis label */}
              <Typography 
                variant="caption" 
                sx={{ 
                  position: 'absolute', 
                  left: 8, 
                  top: '50%', 
                  transform: 'rotate(-90deg) translateX(-50%)',
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '10px'
                }}
              >
                Voltage (V)
              </Typography>
              {/* X-axis label */}
              <Typography 
                variant="caption" 
                sx={{ 
                  position: 'absolute', 
                  bottom: 8, 
                  right: 8,
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '10px'
                }}
              >
                Time →
              </Typography>
            </Box>
          </Paper>

          {/* Current Waveform */}
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#f59e0b', fontWeight: '600' }}>
                Output Current Waveform
              </Typography>
              <Typography variant="body2" sx={{ color: '#f59e0b', fontFamily: 'monospace' }}>
                Current: {(data.OutputCurrent || 0).toFixed(4)} A
              </Typography>
            </Box>
            <Box sx={{ position: 'relative', height: 200, background: 'rgba(0, 0, 0, 0.2)', borderRadius: 1 }}>
              <canvas
                ref={canvasRef2}
                width={800}
                height={200}
                style={{
                  width: '100%',
                  height: '200px',
                  borderRadius: '4px'
                }}
              />
              {/* Y-axis label */}
              <Typography 
                variant="caption" 
                sx={{ 
                  position: 'absolute', 
                  left: 8, 
                  top: '50%', 
                  transform: 'rotate(-90deg) translateX(-50%)',
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '10px'
                }}
              >
                Current (A)
              </Typography>
              {/* X-axis label */}
              <Typography 
                variant="caption" 
                sx={{ 
                  position: 'absolute', 
                  bottom: 8, 
                  right: 8,
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '10px'
                }}
              >
                Time →
              </Typography>
            </Box>
          </Paper>

          {/* Additional Info */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Voltage Range
              </Typography>
              <Typography variant="body2" fontWeight="600">
                {waveData.length > 0 ? Math.min(...waveData.map(d => d.OutputVoltage)).toFixed(1) : '0.0'} - {waveData.length > 0 ? Math.max(...waveData.map(d => d.OutputVoltage)).toFixed(1) : '0.0'} V
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Current Range
              </Typography>
              <Typography variant="body2" fontWeight="600">
                {waveData.length > 0 ? Math.min(...waveData.map(d => d.OutputCurrent)).toFixed(4) : '0.0000'} - {waveData.length > 0 ? Math.max(...waveData.map(d => d.OutputCurrent)).toFixed(4) : '0.0000'} A
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Data Points
              </Typography>
              <Typography variant="body2" fontWeight="600">
                {waveData.length}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Power
              </Typography>
              <Typography variant="body2" fontWeight="600">
                {((data.OutputVoltage || 0) * (data.OutputCurrent || 0)).toFixed(2)} W
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RealTimeWaveforms;