import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { InfoIcon } from '../styles/material';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import PushPinIcon from '@mui/icons-material/PushPin';
import axios from 'axios';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

// const useStyles = makeStyles((theme: Theme) =>
//     createStyles({
//             selected: {
//                 background: 'blue',
//             },
//             default:{
//                 background: 'default',
//             }
//         }
//     ),
// );

const EventCardDetails = ({events, event}) => {

  useEffect(() => {
    getPins();
  }, []);
  // const classes = useStyles();

  const getPins = () => {
    axios.get('/events/list/pins')
      .then(responseObj => {
        setPins(responseObj.data.map(event => event.eventAPIid));
      })
      .catch(err => console.error('GET PINS', err))
  }

  const [ pins, setPins ] = useState(['foo', 'bar'])

  const postEvent = () => {
    axios.post('/events/list/pins', {
      userId: 1,
      eventAPIid: event.eventId
    })
    .then(response => {
      console.log('POST SUCCESS', response);
    })
    .then(getPins)
    .catch(err => console.error('POST ERROR', err));
  }

  const deleteEvent = () => {
    axios.delete('/events/list/pins', { data: { eventAPIid: event.eventId } })
    .then(() => {
      console.log('DELETE SUCCESS')
      getPins();
    })
    .catch(err => console.error('axios delete error', err))
  }

  const handleClick = (e) => {
  if (pins.includes(event.eventId)) {
    return deleteEvent();
  } else if (pins == ['foo', 'bar']){
      setPins(event.eventId);
      return postEvent();
    } else if (!pins.includes(event.eventId)){
      return postEvent();
    }
  }

    const navigate = useNavigate();
    let date = event.eventDate;
    date = moment(date).add(1, 'day').format('MMMM Do YYYY');
    const image = event.artistInfo[0].artistImages[Math.floor(Math.random()*(event.artistInfo[0].artistImages.length))].url
    const id = events.id;
    const {
      name,
      url,
      info,
    } = events;

  const getDetails = () => {
    console.log('navigate', event.eventId);
    navigate(`/eventDetails/?id=${event.eventId}`);
  };

  return (
    <div>
    <Paper
    sx={{
      p: 2,
      margin: 'auto',
      maxWidth: 500,
      flexGrow: 1,
      backgroundColor: (theme) =>
        theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      }}
      >

      <Grid container spacing={4}>
        <Grid item>
          <ButtonBase sx={{ width: 128, height: 128 } } onClick={()=> getDetails(event.eventId)}>
            <InfoIcon/> More details
            <Img alt="alt tag" src={image} />
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography variant="body2" gutterBottom>
                {event.artistInfo.map(artist => (
                  <div>
                  {artist.artistName}
                  </div>
                ))}
                {event.eventName}<br/>
                {date}<br/>
                {event.venueInfo.map(venue => (
                  <div>
                    {Object.values(venue.address)}<br/>
                    {venue.city}, {venue.state} {venue.postalCode}
                  </div>
                ))
                }<br/>
                {event.venueInfo.city}, {event.venueInfo.state}<br/>
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <PushPinIcon id={event.eventId} color={pins.includes(event.eventId) ? 'secondary' : 'action'} onClick={(e) => {
              handleClick(e);
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  </div>
  );
};

export default EventCardDetails;
