import React, { useState } from 'react';
import ChatBot from '../ChatBot/ChatBot';
import { IconButton } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

const ChatBotToggle = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton 
        onClick={() => setOpen(true)}
        style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
        size="large"
        color="primary"
      >
        <ChatIcon />
      </IconButton>
      {open && (
        <div style={{ position: 'fixed', bottom: 100, right: 32, zIndex: 1100 }}>
          <ChatBot handleClose={() => setOpen(false)} />
        </div>
      )}
    </>
  );
};

export default ChatBotToggle;
