import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OTPVerify = () => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/otpverify', { otp });
      if (response.data === 'Success') {
        navigate('/'); // Redirect to home page
      } else {
        setMessage(response.data);
      }
    } catch (err) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="otp-container">
      <h2>OTP Verification</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>
        <button type="submit">Verify OTP</button>
      </form>
    </div>
  );
};

export default OTPVerify;
