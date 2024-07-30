import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, InputAdornment, IconButton, Button } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import './Signup.css'; // Assuming you have a CSS file for styling

const Signup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [profile, setProfile] = useState(null);
  const [phone, setPhone] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('email', email);
    formData.append('name', name);
    formData.append('profile', profile);
    formData.append('phone', phone);
    formData.append('password1', password1);
    formData.append('password2', password2);
    setError(''); // Clear previous error messages
    setMessage(''); // Clear previous success messages

    try {
      const response = await axios.post('http://127.0.0.1:5000/sign-up', formData);
      if (response.data.message) {
        setMessage(response.data.message);
        navigate('/otpverify'); // Redirect to login page
      }  else {
        setMessage(response.data);
      }
    } catch (err) {
      setError(err.response.data.error || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <TextField
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
        </div>
        <div className="form-group">
          <label>Name</label>
          <TextField
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <TextField
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            required
          />
        </div>
        <div className="form-group">
          <label>Profile</label>
          <TextField
            type="file"
            onChange={(e) => setProfile(e.target.files[0])}
            fullWidth
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <TextField
            type={showPassword1 ? 'text' : 'password'}
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            fullWidth
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword1(!showPassword1)}
                    edge="end"
                  >
                    {showPassword1 ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <TextField
            type={showPassword2 ? 'text' : 'password'}
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            fullWidth
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword2(!showPassword2)}
                    edge="end"
                  >
                    {showPassword2 ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Sign Up
        </Button>
      </form>
    </div>
  );
};

export default Signup;
