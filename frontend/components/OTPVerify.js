import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';
import './OTPVerify.css'; // Assuming you have a CSS file for styling

const OTPVerify = () => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous error messages
    setMessage(''); // Clear previous success messages
    try {
      const response = await axios.post('http://127.0.0.1:5000/otpverify', { otp });
      if (response.data.message) {
        setMessage(response.data.message);
        navigate('/login'); // Redirect to login page
      }  else {
        setMessage(response.data);
      }
    } catch (err) {
      setError(err.response.data.error || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="otp-container">
      <Box className="otp-form" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          OTP Verification
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="Enter OTP"
            variant="outlined"
            fullWidth
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            margin="normal"
          />
          {message && (
            <Typography color="primary" variant="body2" gutterBottom>
              {message}
            </Typography>
          )}
          {error && (
            <Typography color="error" variant="body2" gutterBottom>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Verify OTP
          </Button>
        </form>
      </Box>
    </div>
  );
};

export default OTPVerify;
