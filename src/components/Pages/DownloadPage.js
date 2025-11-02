import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  TextField,
} from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';

export default function DownloadPage({ transformerData, transformers }) {
  const [selectedTransformer, setSelectedTransformer] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const handleDownload = () => {
    if (!selectedTransformer) return;

    const data = {
      transformerId: selectedTransformer,
      timestamp: new Date().toISOString(),
      parameters: transformerData,
      metadata: {
        exportDate: new Date().toISOString(),
        dataPoints: 1
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transformer-${selectedTransformer}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Data Export
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Export Transformer Data
          </Typography>

          <Alert severity="info" sx={{ mb: 3 }}>
            Download transformer monitoring data in JSON format for analysis and reporting.
          </Alert>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 400 }}>
            <FormControl fullWidth>
              <InputLabel>Select Transformer</InputLabel>
              <Select
                value={selectedTransformer}
                label="Select Transformer"
                onChange={(e) => setSelectedTransformer(e.target.value)}
              >
                {transformers.map((transformer) => (
                  <MenuItem key={transformer} value={transformer}>
                    {transformer}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Start Date"
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="End Date"
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />

            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              disabled={!selectedTransformer}
              size="large"
            >
              Download JSON Data
            </Button>
          </Box>

          {transformerData && selectedTransformer && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="body2" fontFamily="monospace" whiteSpace="pre-wrap">
                {JSON.stringify({
                  transformerId: selectedTransformer,
                  data: transformerData,
                  exportTime: new Date().toISOString()
                }, null, 2)}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}