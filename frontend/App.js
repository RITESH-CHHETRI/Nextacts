import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import OtpVerify from './components/OTPVerify';
import Chat from './components/Chat';
import VideoCall from './components/VideoCall';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/otpverify" element={<OtpVerify />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/video-call/:roomName" element={<VideoCall />} />
                  </Routes>
      </div>
    </Router>
  );
}

export default App;
