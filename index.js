require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const boydParser = require('body-parser');
const dns = require('node:dns');

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

app.post('/api/shorturl', (req, res) => {
  // const urlValidator = /(((http|https):\/\/)|(\/)|(..\/))(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  // console.log(req.body.url);

  const url = req.body.url;

  const cleanedUrl = url.replace(/^https?:\/\//, '');

  dns.lookup(cleanedUrl, (err, address, family) => {
    console.log('address: %j family: IPv%s', address, family);

    if (!address) {
      res.json({
        error: 'invalid url'
      })
    } else {
      res.json({
        original_url: url,
        short_url: 1
      });
    }
  });

  console.log('headers '+JSON.stringify(req.headers, null, 2))
  console.log('body '+JSON.stringify(req.body, null, 2))

  //next();
//}, (req, res) => {

});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
