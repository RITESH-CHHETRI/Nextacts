import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function Home() {
  const [contacts, setContacts] = useState([]);
  const [open, setOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    email: '',
    phone: '',
    category: '',
    added_by: 'email' // Default to email, can be changed to phone if needed
  });

  // Retrieve JWT token from localStorage or any other secure place
  const getToken = () => {
    return localStorage.getItem('access_token'); // Adjust based on where you store your token
  };

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/contacts', {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        setContacts(response.data);
      } catch (error) {
        console.error('There was an error fetching the contacts!', error);
      }
    };

    fetchContacts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact({
      ...newContact,
      [name]: value
    });
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/contacts', newContact, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setContacts([...contacts, response.data]); // Add new contact to the list
      setNewContact({ email: '', phone: '', category: '', added_by: 'email' }); // Reset the form
      setOpen(false); // Close the dialog
    } catch (error) {
      console.error('There was an error adding the contact!', error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Typography variant="h4" component="h2">
        Home
      </Typography>
      <Typography variant="body1">
        Welcome to the Home page!
      </Typography>
      <Typography variant="h5" component="h3" style={{ marginTop: '20px' }}>
        Your Contacts
      </Typography>
      <List>
        {contacts.map((contact, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={contact.name}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="textPrimary">
                    Email: {contact.email}
                  </Typography><br />
                  <Typography component="span" variant="body2" color="textPrimary">
                    Phone: {contact.phone}
                  </Typography><br />
                  <Typography component="span" variant="body2" color="textPrimary">
                    Category: {contact.category}
                  </Typography><br />
                  <Typography component="span" variant="body2" color="textPrimary">
                    Added by: {contact.added_by}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>

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
            type="text"
            fullWidth
            value={newContact.category}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="added_by"
            label="Added by"
            select
            SelectProps={{
              native: true,
            }}
            fullWidth
            value={newContact.added_by}
            onChange={handleInputChange}
          >
            <option value="email">Email</option>
            <option value="phone">Phone</option>
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
    </div>
  );
}

export default Home;
