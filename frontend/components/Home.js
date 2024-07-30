import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Card, CardContent, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChatIcon from '@mui/icons-material/Chat';
import EmailIcon from '@mui/icons-material/Email';
import CallIcon from '@mui/icons-material/Call';
import VideoCallIcon from '@mui/icons-material/Videocam';
import Navbar from './Navbar'; // Import the Navbar component

function Home() {
  const [contacts, setContacts] = useState([]);
  const [open, setOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [newContact, setNewContact] = useState({
    email: '',
    phone: '',
    name: '',
    category: '',
    added_by: 'email'
  });
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem('access_token'); // Adjust based on where you store your token

  const fetchContacts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/contacts', {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      console.log('Fetched contacts:', response.data); // Debug log
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error.message); // Enhanced error logging
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact(prevContact => ({
      ...prevContact,
      [name]: value
    }));
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/contacts', newContact, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setContacts(prevContacts => [...prevContacts, response.data]);
      setNewContact({ email: '', phone: '', name: '', category: '', added_by: 'email' });
      setOpen(false);
    } catch (error) {
      console.error('Error adding contact:', error.message);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCardClick = (contact) => {
    setSelectedContact(contact);
    setDetailOpen(true);
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
    setSelectedContact(null);
  };

  const handleDeleteContact = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/contacts/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setContacts(contacts.filter(contact => contact.id !== id));
      setDetailOpen(false);
    } catch (error) {
      console.error('Error deleting contact:', error.message);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleUpdateContact = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:5000/contacts/${selectedContact.id}`, { name: selectedContact.name }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setContacts(contacts.map(contact => contact.id === selectedContact.id ? selectedContact : contact));
      setDetailOpen(false);
    } catch (error) {
      console.error('Error updating contact:', error.message);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleDetailInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedContact(prevContact => ({
      ...prevContact,
      [name]: value
    }));
  };

  const handleChat = (contact) => navigate(`/chat/${contact.name}`);

  const handleVideoCall = async (contact) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/join-room', { video: contact.name }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      navigate(`/video-call/${response.data.room_name}`, { state: { token: response.data.token } });
    } catch (error) {
      console.error('Error initiating video call:', error.message);
    }
  };

  const handleSearchChange = (e) => setSearch(e.target.value);

  const filteredContacts = contacts.filter(contact =>
    (contact.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Navbar searchValue={search} onSearchChange={handleSearchChange} placeholder="Search contacts.." />
      {filteredContacts.map((contact, index) => (
        <Card key={index} style={{ margin: '10px 0', width: 'calc(100% - 40px)', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '16px' }}>
          <CardContent style={{ display: 'flex', alignItems: 'center' }}>
            {/* Round Image */}
            <img
              src={`http://127.0.0.1:5000/uploads/${contact.pic || 'default.jpg'}`} // Replace with your default image path
              alt={contact.name}
              style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '16px' }}
            />
            {/* Contact Details */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" onClick={() => handleCardClick(contact)} style={{ cursor: 'pointer' }}>
                {contact.name}
              </Typography>
              <div style={{ display: 'flex', alignItems: 'center', marginRight: contact.added_by === 'unknown' ? '20%' : '40%' }}>
                <IconButton
                  color="primary"
                  onClick={() => window.location.href = `mailto:${contact.email}`}
                  style={{ marginRight: '10px' }}
                >
                  <EmailIcon />
                </IconButton>
                <IconButton
                  color="primary"
                  onClick={() => window.location.href = `tel:${contact.phone}`}
                  style={{ marginRight: '10px' }}
                >
                  <CallIcon />
                </IconButton>
                {contact.added_by !== 'unknown' && (
                  <IconButton
                    color="primary"
                    onClick={() => handleVideoCall(contact)}
                    style={{ marginRight: '10px' }}
                  >
                    <VideoCallIcon />
                  </IconButton>
                )}
                {contact.added_by !== 'unknown' && (
                  <IconButton
                    color="primary"
                    onClick={() => handleChat(contact)}
                    style={{ marginLeft: 'auto' }}
                  >
                    <ChatIcon />
                  </IconButton>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      <IconButton color="primary" aria-label="add contact" onClick={handleClickOpen} style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
        <AddIcon />
      </IconButton>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Contact</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill out the form to add a new contact.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={newContact.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={newContact.email}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="phone"
            label="Phone"
            type="text"
            fullWidth
            value={newContact.phone}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="category"
            label="Category"
            select
            SelectProps={{
              native: true,
            }}
            fullWidth
            value={newContact.category}
            onChange={handleInputChange}
          >
            <option value="Family">Family</option>
            <option value="Friends">Friends</option>
            <option value="Work">Work</option>
            <option value="Others">Others</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddContact} color="primary">
            Add Contact
          </Button>
        </DialogActions>
      </Dialog>

      {selectedContact && (
        <Dialog open={detailOpen} onClose={handleDetailClose} fullWidth>
          <DialogTitle>Contact Details</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Name"
              type="text"
              fullWidth
              value={selectedContact.name}
              onChange={handleDetailInputChange}
            />
            <TextField
              margin="dense"
              name="email"
              label="Email"
              type="email"
              fullWidth
              value={selectedContact.email}
              InputProps={{
                readOnly: true
              }}
            />
            <TextField
              margin="dense"
              name="phone"
              label="Phone"
              type="text"
              fullWidth
              value={selectedContact.phone}
              InputProps={{
                readOnly: true
              }}
            />
            <TextField
              margin="dense"
              name="category"
              label="Category"
              select
              SelectProps={{
                native: true,
              }}
              fullWidth
              value={selectedContact.category}
              InputProps={{
                readOnly: true
              }}
            >
              <option value="Family">Family</option>
              <option value="Friends">Friends</option>
              <option value="Work">Work</option>
              <option value="Others">Others</option>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDetailClose} color="primary">
              Close
            </Button>
            <Button onClick={handleUpdateContact} color="primary">
              Save Changes
            </Button>
            <Button onClick={() => handleDeleteContact(selectedContact.id)} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}

export default Home;
