import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import Contacts from '../components/Contacts';
import ChatContainer from '../components/ChatContainer';
import { io } from 'socket.io-client'
import { Box, Typography, Grid } from '../styles/material';

const UserChat: React.FC = () => {
  const socket = useRef()

  const userContext = useContext(UserContext);
  const { currentUserInfo } = userContext;
  const currentUser = currentUserInfo;
  const [ currentChat, setCurrentChat ] = useState(undefined);
  const navigate = useNavigate();
  useEffect(() => {
    if(currentUser){
        socket.current = io('/');
        socket.current.emit('add-user', currentUser.id)
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUserInfo?.id) {
      navigate('/login');
      }
    }, [currentUserInfo]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <div className="page-body">
      <div>
      <Typography
    variant="h2">Chats</Typography>
      </div>
      <Box>
        <Grid container columnSpacing={0} maxWidth="100%">
          <Grid item xs={1} md={1} lg={3} key='contactscontainer' maxWidth='15%' maxHeight='70vh'>
              <Contacts key='contacts' changeChat={handleChatChange} />
          </Grid>
          <Grid item xs={11} md={11} lg={9} key='chatcontainer' maxWidth= '85%' marginLeft='auto'>
              <ChatContainer currentUser={currentUser} currentChat={currentChat} socket={socket} />
          </Grid>
            </Grid>
            </Box>
            </div>
)
};


export default UserChat;