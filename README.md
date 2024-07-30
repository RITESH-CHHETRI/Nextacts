# Nextacts

**Nextacts** is a next-generation contacts app designed to revolutionize the way you manage your contacts. This application offers advanced features such as real-time chat, video calling, and secure user authentication.

## Features

- **User Authentication with OTP**: Ensures secure access to your account through One-Time Password (OTP) verification. Users must authenticate their identity via OTP sent to their email or phone number before gaining access to the app.
  
- **Real-Time Chat with Pusher**: Supports real-time chat functionality, allowing users to send and receive messages instantly. Pusher enables seamless, live communication within the app, ensuring that conversations are always up-to-date.

- **Video Calling with Twilio**: Integrates Twilio's video calling service for high-quality video communication. Users can initiate video calls with their contacts directly from the app, providing a reliable and efficient way to connect face-to-face.

- **Contact Management**: Users can add, view, update, and delete contacts. Contacts are displayed in a user-friendly interface with detailed information, including profile pictures, email, phone numbers, and categories.

- **Search and Filter**: Allows users to search for contacts by name and filter them based on categories such as Family, Friends, Work, and Others.

- **Responsive Design**: The app is designed to work seamlessly on both desktop and mobile devices, ensuring a consistent user experience across different platforms.

## Technologies Used

- **Frontend**: Built with React and Material-UI for a responsive and modern user interface.
- **Backend**: Developed using Flask to handle API requests and manage data.
- **Database**: Utilizes a database to store contact information and user data.
- **Real-Time Communication**: Pusher for real-time chat functionality.
- **Video Calling**: Twilio for video call integration.
- **Authentication**: OTP-based authentication for secure user verification.

## Installation and Setup

1. **Clone this Repository**:

2. **Frontend Setup**:
   - Navigate to the `frontend` directory:
     ```bash
     cd nextacts/frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the development server:
     ```bash
     npm start
     ```

3. **Backend Setup**:
   - Navigate to the `backend` directory:
     ```bash
     cd nextacts/backend
     ```
   - Create a virtual environment and activate it:
     ```bash
     python -m venv venv
     source venv/bin/activate  # On Windows use `venv\Scripts\activate`
     ```
   - Install dependencies:
     ```bash
     pip install -r requirements.txt
     ```
   - Start the Flask server:
     ```bash
     flask run
     ```

4. **Environment Variables**:
   - Create a `.env` file in the `backend` directory and add the necessary environment variables for Pusher, Twilio, and database configuration.

## Usage

- Open the application in your browser to access the main interface.
- Use the search bar to find contacts and click on a contact to view details or initiate a chat/video call.
- Click the "+" button to add a new contact.
- Click on contact name to open details, from where editing and deletion is possible

