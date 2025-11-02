// src/components/Auth/SignupPage.js
import React, { useState } from 'react';
import { Box, Button, Card, CardContent, Container, TextField, Typography, Link, Alert } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { authService } from '../../services/firebase';

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', displayName: '' });
  const [err, setErr] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    const res = await authService.register(form);
    if (!res.success) {
      setErr(res.error || 'Signup failed');
      return;
    }
    navigate('/dashboard');
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" fontWeight={700} gutterBottom>Create Account</Typography>
          <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {err && <Alert severity="error">{err}</Alert>}
            <TextField label="Name" value={form.displayName} onChange={(e) => setForm((p) => ({ ...p, displayName: e.target.value }))} fullWidth />
            <TextField label="Email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} fullWidth required />
            <TextField label="Password" type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} fullWidth required />
            <Button type="submit" variant="contained" fullWidth>Sign up</Button>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Already have an account? <Link component={RouterLink} to="/login">Login</Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
