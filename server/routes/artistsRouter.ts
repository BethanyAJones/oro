import { Router } from 'express';
import axios from 'axios';
const artistsRouter = Router();
import prisma from '../database/db';

artistsRouter.get('/events', (req, res) => {
  const { keyword } = req.query;
  // console.log(keyword);
  axios.get(`https://app.ticketmaster.com/discovery/v2/events.json?size=10&keyword=${keyword}&apikey=${process.env.TICKETMASTER_API_KEY}`)
    .then((responseObj) => {
      // console.log('responseObj 22:', responseObj);
      // const events = responseObj.data._embedded.events.filter((event) => {
      //   const date = new Date();
      //   date.setMonth(date.getMonth() + 6);
      //   console.log(date);
      //   if (event.dates.start.dateTime <= date) {
      //     return event;
      //   }
      // });
      // console.log(events);
      res.status(200).send(responseObj.data._embedded);
    })
    .catch(err => console.error(err));
});

artistsRouter.get('/', (req, res) => {
  prisma.artistFollowing.findMany()
    .then((artistData) => {
      // console.info(artistData);
      res.status(200).send(artistData);
    })
    .catch((err) => {
      // console.error(err);
      res.status(500);
      res.end();
    });

  artistsRouter.get('/artist', (req, res) => {
    prisma.artistFollowing.findMany({
      where: {
        artistName: req.query.artistName,
        userId: 1
      }
    })
      .then((data) => {
        // console.log(data);
        res.status(200).send(data);
      })
      .catch((err) => res.sendStatus(500));
  });


  artistsRouter.post('/', (req, res) => {
    const {artistName} = req.body;
    const obj = {
      userId: 1,
      artistName: artistName,
      bio: '',
      ticketId: '',
      youtube: '',
      twitter: '',
      facebook: '',
      instagram: '',
      itunes: '',
      wiki: '',
      homepage: '',
      image: ''
    };
    axios.get(`https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artistName}&api_key=${process.env.LASTFM_API_KEY}&format=json`)
      .then((artistData) => {
        if (artistData.data.artist.bio.summary) {
          obj.bio = artistData.data.artist.bio.summary;
        }
        // console.info(artistData.data.artist.bio.summary);
        axios.get(`https://app.ticketmaster.com/discovery/v2/attractions.json?apikey=${process.env.TICKETMASTER_API_KEY}&keyword=${artistName}`)
          .then(async (attractionData) => {
            if (attractionData.data._embedded.attraction) {
              obj.ticketId = attractionData.data._embedded.attractions[0].id;
              obj.youtube = attractionData.data._embedded.attractions[0].externalLinks.youtube[0].url;
              obj.twitter = attractionData.data._embedded.attractions[0].externalLinks.twitter[0].url;
              obj.facebook = attractionData.data._embedded.attractions[0].externalLinks.facebook[0].url;
              obj.instagram = attractionData.data._embedded.attractions[0].externalLinks.instagram[0].url;
              obj.itunes = attractionData.data._embedded.attractions[0].externalLinks.itunes[0].url;
              obj.wiki = attractionData.data._embedded.attractions[0].externalLinks.wiki[0].url;
              obj.homepage = attractionData.data._embedded.attractions[0].externalLinks.homepage[0].url;
              obj.image = attractionData.data._embedded.attractions[0].images[0].url;
              console.info(obj);
            }

            await prisma.artistFollowing.create({
              data: obj
            })
              .then((data) => {
                // console.log(data);
                res.status(200).send(data);
              })
              .catch((err) => res.sendStatus(500));
          })
          .catch((err) => {
            console.error(err);
            res.status(500);
            res.end();
          });
        // res.status(200).send(artistData.data.artist.bio);
      })
      .catch((err) => {
        console.error(err);
        res.status(500);
        res.end();
      });
  });

  artistsRouter.delete('/', (req, res) => {
    const {artistName} = req.body;
    console.log(artistName);
    prisma.artistFollowing.deleteMany({
      where: {
        userId: 1,
        artistName,
      }
    })
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  });

});

export default artistsRouter;
