import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { ListItemText, Avatar, ListItemButton, Grid } from '../styles/material';

const Contacts = ({changeChat, currentContact}) => {
  const [isMobile, setMobile] = useState(window.innerWidth < 1026);
  const updateMedia = () => {
    setMobile(window.innerWidth < 1026);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });

  const userContext = useContext(UserContext);
  const { currentUserInfo, userContacts } = userContext;
  const currentUser = currentUserInfo;
  const [currentUserName, setCurrentUserName ] = useState('');
  const [ currentUserImage, setCurrentUserImage ] = useState('');
  const [ currentSelected, setCurrentSelected ] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [currentChat, setCurrentChat] = useState([]);
  useEffect(() => {
    if (currentUser) {
      setCurrentUserName(currentUser.fullName);
      if(currentUser.profileURL){
        setCurrentUserImage(currentUser.profileURL);
      }
    }
  }, [currentUser]);

  const getMessages = async (sender, receiver) => {
      const response = await axios.post('/api/messages/getmsg', {
        senderId: sender.id,
        receiverId: receiver.id
      });
      setCurrentChat(response.data);
  }


  const changeCurrentChat = (index:number, contact) => {

    getMessages(currentUser, contact);
    setCurrentSelected(index);
    changeChat(contact);
  };

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
  };

if(currentContact === undefined){
  return (
  <Grid maxWidth='100%' overflow='auto' maxHeight='70vh'>
      {
        userContacts.map((contact, index) => {
          return (
            <Grid xs={12} mb='10px' pl='0px'>
              <ListItemButton
              sx={{ align:'left', pl:'0px' }}
              key={'listitembutton' + index}
              alignItems="flex-start"
              selected={selectedIndex === index}
              onClick={(event) => {
                handleListItemClick(event, index);
                changeCurrentChat(index, contact);
              } }
            >
              <Grid xs={1} sx={{mr:'30px', pl:'0px'}}>
              {isMobile ? <Avatar key={'avatar' + index} src={contact.profileURL} sx={{mr:'5px', pl:'0px'}}/> : <Avatar key={'avatar' + index} src={contact.profileURL} sx={{mr:'30px', pl:'0px'}}/> }
                </Grid>
                <Grid xs={8}>
              {isMobile ? <ListItemText
                primary=''/> : <ListItemText
                primary={contact.fullName}/> }
            </Grid>
            </ListItemButton>
            </Grid>
              );
            })
          }

          </Grid>
  );

} else {

  return (
    <Grid maxWidth='100%' container>
        {
          [currentContact].map((contact, index) => {
            return (
              <Grid xs={12}>
                <ListItemButton
                sx={{ align:'center' }}
                key={'listitembutton' + index}
                alignItems="flex-start"
                selected={selectedIndex === index}
                onClick={(event) => {
                  handleListItemClick(event, index);
                  changeCurrentChat(index, contact);
                } }
              >
                <Grid xs={1} sx={{mr:'30px'}}>
                {isMobile ? <Avatar key={'avatar' + index} src={contact.profileURL} sx={{mr:'5px'}}/> : <Avatar key={'avatar' + index} src={contact.profileURL} sx={{mr:'30px'}}/> }
                  </Grid>
                  <Grid xs={8}>
                  {isMobile ? <ListItemText
                primary=''/> : <ListItemText
                primary={contact.fullName}/> }
              </Grid>
              </ListItemButton>
              </Grid>
                );
              })
            }

            </Grid>
    );
}
};



export default Contacts;
