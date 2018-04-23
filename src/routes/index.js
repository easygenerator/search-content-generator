const express = require('express');
const searchContent = require('./searchContent');

let router = express.Router();

router.get('/', (req, res) => {
  res.status(200).send('Easygenerator search content generator successfully started');
});

router.use('/search-content', searchContent);

module.exports = router;
