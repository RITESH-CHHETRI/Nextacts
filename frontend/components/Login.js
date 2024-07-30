import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import './Login.css'; // Assuming you have a CSS file for styling

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous error messages
    try {
      const response = await axios.post('http://127.0.0.1:5000/login', {
        email,
        password,
      });
      
      if (response.data.error) {
        setError(response.data.error);
      } else {
        const access_token = response.data.access_token;
        const user_name = response.data.username;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('user_name', user_name);
        navigate('/'); // Redirect to home or other page after login
      }
    } catch (err) {
      setError(err.response.data.error || 'An error occurred. Please try again.');
    }
  };

  const handleSignUpRedirect = () => {
    navigate('/signup'); // Redirect to signup page
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <TextField
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <TextField
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Login</button>
        <p className="signup-link" onClick={handleSignUpRedirect}>
          New user? Want to sign up?
        </p>
      </form>
    </div>
  );
}

export default Login;
