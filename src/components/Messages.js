// src/components/Messages.js

import React from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const Messages = ({ messages, input, setInput, handleSend, isInputDisabled }) => {
  return (
    <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
      {messages.map((message, index) => (
        <Box key={index} sx={{ display: 'flex', justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start', p: 1 }}>
          <Box sx={{ bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.300', color: message.sender === 'user' ? 'primary.contrastText' : 'black', borderRadius: 2, p: 2 }}>
            <Typography variant="body1">{message.text}</Typography>
            {message.image && <img src={message.image} alt="" style={{ maxWidth: '100%', marginTop: '10px' }} />}
          </Box>
        </Box>
      ))}
      <Box ref={scrollViewRef} />
      <Box sx={{ display: 'flex', p: 1 }}>
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Escribe un mensaje..."
          disabled={isInputDisabled}
          fullWidth
          variant="outlined"
        />
        <IconButton color="primary" onClick={handleSend} disabled={isInputDisabled}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Messages;
