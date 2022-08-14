import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserContext = React.createContext({});

const UserContextProvider = ({ children }) => {
  const [userEvents, setUserEvents] = useState([]);

  const getUserEvents = () => {
    axios.get('/profile/events')
      .then(events => {
        const { data } = events;
        const eventInfo = {
          eventName: data.name,
          eventDate: data.dates.start.localDate,
          venue: data._embedded.venues[0].name,
          postalCode: data._embedded.venues[0].postalCode,
          city: data._embedded.venues[0].city.name,
          state: data._embedded.venues[0].state.name,
          address: data._embedded.venues[0].address.line1,
          link: data.url,
          saleStart: data.sales.public.startDateTime,
          saleEnd: data.sales.public.endDateTime
        }
        setUserEvents(eventInfo);
      })
      .catch(err => {
        console.error(err);
      })
  }

  const appProps = {
    userEvents,
    setUserEvents,
    getUserEvents,
  };


  return (
    <UserContext.Provider value={appProps}>{children}</UserContext.Provider>
  );
};
export { UserContextProvider, UserContext };
