import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Box, TextField, Button, InputAdornment, IconButton, Typography, Paper, Avatar } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import Logo from './assets/img2.png'; // Ensure the correct path to the logo image
import SenderAvatar from './assets/img3.png'; // Ensure the correct path to the sender avatar image
import ReceiverAvatar from './assets/img4.png'; // Ensure the correct path to the receiver avatar image

const Message = ({ text, isUser }) => (
  <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2, alignItems: 'center' }}>
    <Avatar src={isUser ? SenderAvatar : ReceiverAvatar} sx={{ width: 40, height: 40, mr: 2 }} />
    <Paper sx={{
      padding: '10px 15px',
      borderRadius: '10px',
      maxWidth: '70%',
      boxShadow: 'none', // Remove background and box shadow
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center' // Center-align text
    }}>
      <Typography variant="body1" sx={{ textAlign: 'center' }}>{text}</Typography>
    </Paper>
  </Box>
);

function App() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [documentId, setDocumentId] = useState(null);
  const [pdfName, setPdfName] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setPdfName(selectedFile.name);
      await uploadFile(selectedFile);
    }
  };

  const uploadFile = async (selectedFile) => {
    const formData = new FormData();
    formData.append('file', selectedFile);
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setDocumentId(response.data.document_id);
      console.log(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      setLoading(false);
    }
  };

  const askQuestion = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/ask/', {
        document_id: documentId,
        question,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const answer = response.data.answer;
      setMessages([...messages, { text: question, isUser: true }, { text: answer, isUser: false }]);
      setQuestion('');
      setLoading(false);
    } catch (error) {
      console.error('Error asking question:', error);
      setLoading(false);
    }
  };

  const lightGrey = '#E4E8EE';

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100vh', background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: 1000
      }}>
        <img src={Logo} alt="Logo" style={{ width: '150px' }} />
      </Box>
      <Box sx={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center'
      }}>
        <input
          type="file"
          accept="application/pdf"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <Button
          variant="contained"
          onClick={() => fileInputRef.current.click()}
          style={{
            backgroundColor: lightGrey,  // Light grey background for the button
            color: 'black',  // Black text
            padding: '10px 20px',
            borderRadius: '8px',  // Slightly rounded shape
            fontSize: '16px',
            border: '1px solid black',  // Black border
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Box
            sx={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: 'white',
              color: 'black',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '10px',
              border: '1px solid black'  // Black border for the circle
            }}
          >
            +
          </Box>
          {pdfName ? (
            <>
              <InsertDriveFileIcon style={{ color: 'green', marginRight: '10px' }} />
              <Typography sx={{ color: 'green' }}>{pdfName}</Typography>
            </>
          ) : (
            "Upload PDF"
          )}
        </Button>
      </Box>
      <Box sx={{ flex: 1, overflowY: 'auto', padding: '20px', marginTop: '80px', marginBottom: '100px' }}>
        {messages.map((message, index) => (
          <Message key={index} text={message.text} isUser={message.isUser} />
        ))}
      </Box>
      <Box sx={{
        position: 'fixed',
        width: '80%',  // Cover 70% of the bottom screen
        padding: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: '30px',  // Floating above the bottom
        background: lightGrey,  // Light grey background
        borderRadius: '20px',  // Slightly rounded rectangular shape
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box'
      }}>
        <TextField
          fullWidth
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Send a message..."
          disabled={!documentId || loading}
          variant="outlined"
          sx={{
            background: lightGrey,  // Set grey background inside the text box
            borderRadius: '20px',  // Slightly rounded shape
            '& .MuiOutlinedInput-root': {
              background: lightGrey,  // Set grey background inside the input area
              '& fieldset': {
                border: 'none',  // Remove border for a cleaner look
              },
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={askQuestion} disabled={!documentId || loading}>
                  <ArrowForwardIcon style={{ color: 'green' }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Box>
  );
}

export default App;
