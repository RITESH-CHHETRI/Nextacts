import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Pusher from 'pusher-js';
import { TextField, Button, List, ListItem, ListItemText, Typography, Box, Paper } from '@mui/material';
import Navbar from './Navbar'; // Import the Navbar component

const Chat = () => {
  const { id } = useParams(); // Contact's name from the URL
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState("none");
  const [search, setSearch] = useState('');
  const userName = localStorage.getItem('user_name'); // Get the current user's name from localStorage

  const getToken = () => {
    return localStorage.getItem('access_token'); // Adjust based on where you store your token
  };

  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:5000/chat', { chat: id }, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        setMessages(response.data.messages);
        setFilteredMessages(response.data.messages); // Initialize filtered messages
        setUid(response.data.uid); // Set uid from response
        setLoading(false);
      } catch (error) {
        console.error('There was an error fetching the messages!', error);
      }
    };

    fetchMessages();
  }, [id]);

  useEffect(() => {
    const pusher = new Pusher('', {
      cluster: '',
      authEndpoint: 'http://127.0.0.1:5000/pusher/auth',
      auth: {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      },
    });

    if (uid !== "none") {
      console.log(`Subscribing to private-user_${uid}`);
      const channel = pusher.subscribe(`private-user_${uid}`);
      channel.bind('new_message', (data) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: data.sender, message: data.message, timestamp: data.timestamp },
        ]);
        console.log('New message received!', data);
      });

      return () => {
        pusher.unsubscribe(`private-user_${uid}`);
        console.log(`Unsubscribed from private-user_${uid}`);
      };
    }
  }, [uid]);

  useEffect(() => {
    const filtered = messages.filter(msg =>
      msg.message.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredMessages(filtered);
  }, [search, messages]);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [filteredMessages]);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;
    try {
      const response = await axios.post('http://127.0.0.1:5000/message', { message: newMessage, user_id: id }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (response.data.status === 'success') {
        setNewMessage('');
        setUid(response.data.uid); // Update uid after sending message
      }
    } catch (error) {
      console.error('There was an error sending the message!', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission if inside a form
      handleSendMessage();
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Navbar searchValue={search} onSearchChange={handleSearchChange} placeholder="Filter messages..." />
      
      <List style={{ flexGrow: 1, overflowY: 'auto', padding: '10px' }}>
        {filteredMessages.map((msg, index) => (
          <ListItem key={index} style={{ justifyContent: msg.sender === userName ? 'flex-end' : 'flex-start' }}>
            <Box style={{ 
              backgroundColor: msg.sender === userName ? '#DCF8C6' : '#F1F0F0', 
              borderRadius: '10px', 
              padding: '10px', 
              maxWidth: '60%',
              wordWrap: 'break-word'
            }}>
              <ListItemText primary={`${msg.sender}: ${msg.message}`} secondary={msg.timestamp} />
            </Box>
          </ListItem>
        ))}
        <div ref={endOfMessagesRef} /> {/* Empty div to scroll into view */}
      </List>
      
      <Paper style={{ padding: '10px', borderTop: '1px solid #ddd', backgroundColor: '#fff', display: 'flex', alignItems: 'center' }}>
        <TextField
          variant="outlined"
          size="small"
          style={{ flexGrow: 1, marginRight: '10px', width: '80%' }}
          label="Type your message"
          value={newMessage}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress} // Handle Enter key press
        />
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSendMessage} 
          style={{ whiteSpace: 'nowrap', width: '20%' }}
        >
          Send
        </Button>
      </Paper>
    </div>
  );
};

export default Chat;
