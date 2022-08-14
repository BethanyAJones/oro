import { Router } from 'express';
import axios from 'axios';
import path from 'path';
// import dotenv from 'dotenv';
require('dotenv').config();
import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});






const songFinderRouter = Router();
// let publicId = '';
// const audioId = '';

songFinderRouter.get('/', (req, res) => {
  const {artistName, song} = req.query;

  axios.get(`https://api.lyrics.ovh/v1/${artistName}/${song}`)
    .then((data) => {
      // console.log(data.data.lyrics.split('\n'));
      res.status(200).send(data.data.lyrics.split('\n'));
    })
    .catch((err) => {
      res.sendStatus(500);
    });
});

songFinderRouter.post('/', async (req, res) => {
  // cloudinary.uploader.destroy(publicId, (error, result) => { console.log(result, error); });
  try {
    // console.log(req.body.data);
    const fileStr = req.body.data;
    await cloudinary.uploader.upload(fileStr, {resource_type: 'video', upload_preset: 'VibeSocietyAudio', return_delete_token: 1})
      .then((uploadResponse) => {
        // publicId = uploadResponse.public_id;
        // audioId = uploadResponse.asset_id;
        // console.log(uploadResponse);
        axios.post('https://api.audd.io/', {

          'api_token': process.env.AUDD_TOKEN,
          'url': uploadResponse.secure_url,
          'return': 'apple_music,spotify',

        })
          .then((data) => {
            // data.data.result.delete_by_token = uploadResponse.delete_token;
            // console.log(data.data.result);
            res.status(200).send(data.data.result);
          })
          .catch((err) => res.sendStatus(500));
      })
      .catch((err) => res.sendStatus(500));
  } catch (error) {
    res.sendStatus(500);
  }
});

// songFinderRouter.delete('/', (req, res) => {
//   // console.log(audioId);
//   // cloudinary.uploader.destroy(audioId, () => res.sendStatus(200));
//   // cloudinary.delete_by_token(req.body.delete_token)
//     // .then(() => { res.sendStatus(200); })
//     // .catch((err) => res.sendStatus(500));
// });



export default songFinderRouter;
