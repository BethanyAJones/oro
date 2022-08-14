import React, { useState, useEffect } from 'react';
import MicRecorder from 'mic-recorder-to-mp3';
import axios from 'axios';
import { Accordion, AccordionSummary, AccordionDetails, Button, Grid, Fab} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Star, Person, MusicNote, LibraryMusic, Lyrics, RemoveCircleOutline} from '@mui/icons-material';
window.oncontextmenu = function (event: any) {
  // eslint-disable-next-line no-console
  console.log(event); // prints [object PointerEvent]

  const pointerEvent = event as PointerEvent;
  // eslint-disable-next-line no-console
  // console.log(`window.oncontextmenu: ${pointerEvent.pointerType}`);

  if (pointerEvent.pointerType === 'touch') {
    // context menu was triggerd by long press
    return false;
  }

  // just to show that pointerEvent.pointerType has another value 'mouse' aka right click
  if (pointerEvent.pointerType === 'mouse') {
    // context menu was triggered by right click
    return true;
  }

  // returning true will show a context menu for other cases
  return true;
};

const Mp3Recorder = new MicRecorder({ bitRate: 128});
const SongFinder: React.FC = () => {

  // const [isRecording, setIsRecording] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [previewSource, setPreviewSource] = useState();
  const [song, setSong] = useState('');
  const [artist, setArtist] = useState('');
  // const [artistImage, setArtistImage] = useState('');
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumImage, setAlbumImage] = useState('');
  const [favorited, setFavorited] = useState(false);
  const [lyrics, setLyrics] = useState([]);
  // const [deleteToken, setDeleteToken] = useState('');

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({audio: true},
      () => {
        // console.log('Permission Granted');
        setIsBlocked(true);
      },
      () => {
        // console.log("Permission Denied");
        setIsBlocked(false);
      });
  }, []);

  useEffect(() => {
    if (song && artist) {
      axios.get('/songs', {
        params: {
          artistName: artist,
          song,
        }
      })
        .then((results) => {
          // console.log(results.data)
          setLyrics(results.data);
        })
        .catch((err) => console.error(err));
    }
  }, [artist, song]);

  useEffect(() => {
    if (artist) {
      axios.get('/favArtists/artist', {
        params: {
          artistName: artist,
        }
      })
        .then((results) => {
          // console.log(results.data);
          // console.log(results.data);
          if (results.data.length) {
            setFavorited(true);
          } else {
            setFavorited(false);
          }
        })
        .catch((err) => console.error(err));

    }
  }, [artist]);

  useEffect(() => {
    if (previewSource) {
      axios.post('/songs', {
        data: previewSource,
      })
        .then((results) => {
          // console.log(results);
          setSong(results.data.title);
          setArtist(results.data.apple_music.artistName);
          setAlbumTitle(results.data.apple_music.albumName);
          setAlbumImage(results.data.spotify.album.images[0].url);
          // console.log(results.data.spotify.album.images);
          // console.log(results.data);
          // axios.delete('/songs', {
          //   data: {
          //     delete_token: results.data.delete_token;
          //   }
          // })
          // console.log('SUCCESS', results);
        })
        .catch((err) => console.error(err));

    }

  }, [previewSource]);

  const start = () => {
    if (isBlocked) {
      // console.log('Permission Denied');
    } else {
      Mp3Recorder.start()
        .catch((e) => console.error(e));
    }
  };

  const stop = () => {
    Mp3Recorder.stop().getMp3()
      .then(([buffer, blob]) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          setPreviewSource(reader.result);

        };
        // setSong('');
        setArtist('');
        setAlbumTitle('');
        setAlbumImage('');
        setLyrics([]);
      })
      .catch((e) => console.log(e));
  };

  const getLyrics = () => {
    if (lyrics && Array.isArray(lyrics)) {
      return lyrics.map((line, index) => {
        return (
          <div key={index + 1}>
            {line + '\n'}
          </div>
        );
      });
    } else {
      return null;
    }
  };

  const addToFavorites = () => {
    // console.log(artist);
    axios.post('/favArtists', {
      artistName: artist
    })
      .then((data) => {
        setFavorited(true);
        // console.log('success', data)
      })
      .catch((err) => console.error(err));
  };

  const removeFavorites = () => {
    axios.delete('/favArtists', {
      data: {
        artistName: artist
      }
    })
      .then(() => {
        // console.log('removed')
        setFavorited(false);
      })
      .catch((err) => console.error(err));
  };

  const favoriteButton = () => {
    if (artist && favorited === true) {
      return (
        <div>
          <Button variant='contained' size='small' onClick={removeFavorites}>{<RemoveCircleOutline></RemoveCircleOutline>} remove from favorites</Button>
        </div>
      );
    } else if (artist && favorited === false) {
      return (
        <div>
          <Button variant='contained' size='small' onClick={addToFavorites}>{<Star></Star>} add to favorites</Button>
        </div>
      );
    }
  };




  return (
    <div>
      <div>Hello SongFinder</div>
      
      <div>
        <Grid container>
          <Grid item xs = {0} md = {4}></Grid>
          <Grid item xs ={12} md = {4}>
            <Accordion expanded={true} >
              <AccordionSummary>{<MusicNote></MusicNote>} Song Name
              </AccordionSummary>
              <AccordionDetails>
                {song}
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon/>}>{<Person></Person>} Artist
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  <div id='artistName'>
                    {artist}
                  </div>

                  <div id='favoriteButton'>
                    {favoriteButton()}  
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon/>}>{<Lyrics></Lyrics>} Lyrics
              </AccordionSummary>
              <AccordionDetails>
                <div id='lyrics'>
                  {getLyrics()} 
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon/>}>{<LibraryMusic></LibraryMusic>} Album 
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  {albumTitle}
                </div>
                <img height='100px' width='auto' src={albumImage}/>
              </AccordionDetails>
            </Accordion>
          </Grid>
          {/* <Grid item xs = {4}></Grid> */}
        </Grid>
      </div>

      <div style={{marginTop: '10px'}}>
        <Fab variant='circular' onMouseDown={start} onMouseUp={stop}><MusicNote></MusicNote></Fab>
      </div>
    </div>
  );
};

export default SongFinder;
