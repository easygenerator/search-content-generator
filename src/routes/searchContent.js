const express = require('express');
const run = require('./routeWrapper');
const renderer = require('../renderer');
const contentLoader = require('../course/contentLoader');
const cache = require('../course/cache');

let router = express.Router();

router.get(
  '/',
  run(async (req, res) => {
    let { url } = req.query;

    if (!url) {
      res.status(404).send('Course not found');
      return;
    }

    if (!url.endsWith('/')) {
      url += '/';
    }

    let courseData = await contentLoader.getCourseData(url);
    let cacheStream = await cache.get(courseData.id, new Date(courseData.createdOn));
    if (cacheStream) {
      res.set('Content-Type', 'text/html');
      cacheStream.pipe(res);
      return;
    }

    await contentLoader.populateContent(url, courseData);

    let html = await renderer.render('searchContent', courseData);

    await cache.add(courseData.id, html);

    res.set('Content-Type', 'text/html');
    res.status(200).send(html);
  })
);

module.exports = router;
