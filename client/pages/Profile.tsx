import React, { useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { styled } from '@mui/material/styles';
import { ArrowForwardIosSharpIcon, MuiAccordion, MuiAccordionSummary, MuiAccordionDetails, Typography, List, ListItem, Button } from '../styles/material';

const Accordion = styled((props) => (
  <MuiAccordion children={''} disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const Profile: React.FC = () => {
  const { userEvents, getUserEvents } = useContext(UserContext);
  const [expanded, setExpanded] = React.useState('panel1');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  useEffect(() => {
    getUserEvents();
  }, []);

  return (
    <div>
      <div>Hello Profile</div>
      <div>
        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography>{userEvents.eventName}</Typography>
            <Typography>{userEvents.eventDate}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              <ListItem>Venue: {userEvents.venue}</ListItem>
              <ListItem>
                Location: {userEvents.address}, {userEvents.city}, {userEvents.state}, {userEvents.postalCode}
              </ListItem>
              <ListItem>Ticket sale starts: {userEvents.saleStart}</ListItem>
              <ListItem>Ticket sale ends: {userEvents.saleEnd}</ListItem>
              <Button onClick={() => {location.href = userEvents.link}}>Purchase Tickets</Button>
            </List>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
};

export default Profile;
