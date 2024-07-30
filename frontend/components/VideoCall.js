import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Video from 'twilio-video';
import { Button } from '@mui/material';

const VideoCall = () => {
  const { roomName } = useParams(); // Assuming roomName is passed via URL
  const [token, setToken] = useState('');
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    // Fetch the access token from your backend
    const fetchToken = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:5000/join-room', { video: roomName }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        setToken(response.data.token);
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    fetchToken();
  }, [roomName]);

  const joinRoom = async () => {
    if (!token) {
      console.error('Token is not available');
      return;
    }

    try {
      const room = await Video.connect(token, {
        name: roomName,
        audio: true,
        video: { width: 640 }
      });

      setIsJoined(true);

      // Handle participant events, e.g., new participant joined
      room.on('participantConnected', participant => {
        console.log(`A remote Participant connected: ${participant.identity}`);
      });

      // Create local video track and attach it to the DOM
      const localTrack = Array.from(room.localParticipant.videoTracks.values())[0].track;
      const videoElement = document.getElementById('local-video');
      videoElement.appendChild(localTrack.attach());

      // Handle room disconnection
      room.on('disconnected', () => {
        setIsJoined(false);
        console.log('Disconnected from room');
      });
    } catch (error) {
      console.error('Error connecting to room:', error);
    }
  };

  return (
    <div>
      <h1>Video Call</h1>
      <Button onClick={joinRoom} disabled={isJoined}>
        Join Room
      </Button>
      <div>
        <div id="local-video"></div>
      </div>
    </div>
  );
};

export default VideoCall;
