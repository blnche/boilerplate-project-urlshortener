require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const boydParser = require('body-parser');
const dns = require('dns');
const dnsPromises = dns.promises;
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl')

const mySecret = process.env['MONGO_URI'];
mongoose.connect(mySecret, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(boydParser.json());
app.use(boydParser.urlencoded({extended: false}));

// Basic Configuration
const port = process.env.PORT || 3001;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// const createAndSaveUrl = (url) => {

//   let newUrl = new Url({
//     original_url: url,
//     //short_url: _id use _id from mongogoose
//   });

//   newUrl.save()
//     .then(data => {
      
//       let short_url = data.id;

//       Url.findByIdAndUpdate({_id: data._id}, {short_url: short_url}, {new: true})
//         .then(updatedData => {
//           console.log('updated data => '+updatedData);
//           return updatedData;
//         })
//         .catch (err => {
//           console.log(err);
//         })
//     })
//     .catch(err => {
//       console.log(err);
//     })
// }

app.post('/api/shorturl', async (req, res) => {

  const url = req.body.url;
  const cleanedUrl = url.replace(/^https?:\/\//, '');

  // console.log('url=>'+url);
  // console.log('urlFormatted=>'+cleanedUrl);

  // const { address } = await dnsPromises.lookup(cleanedUrl, (err, address, family) => {
  //   if(err) return res.json({
  //     error: 'invalid url'
  //   });
  // }); //{} allows us to access directly address property from object result
  // console.log('address => '+address);

  // if (!address) {
    
  //   return res.json({
  //     error: 'invalid url'
  //   });
  // } else {

    const newUrl = await ShortUrl.create({original_url: url});

    res.json({
      original_url: newUrl.original_url,
      short_url: newUrl.short_url
    });
  //}
});

app.get('/api/shorturl/:shorturl', async (req, res) => {
  console.log(req.params.shorturl);
  const url = await ShortUrl.findOne({short_url: req.params.shorturl});

  console.log(url);

  res.redirect(url.original_url);
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
