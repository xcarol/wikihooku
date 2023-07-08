const express = require('express');
const path = require('path');

const PORT = import.meta.env.PORT || 8080;

express()
  .use(express.static(path.join(__dirname, 'dist')))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
