const path = require('path');
const express = require('express');

const PORT = process.env.PORT || 8080;

express()
  .use(express.static(path.join(__dirname, 'dist')))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
