const httpMocks = require('node-mocks-http');
const sinon = require('sinon');
const eventEmitter = require('events').EventEmitter;
const { searchContent, renderer, contentLoader, cache } = require('../index');
const { Readable } = require('stream');

describe('searchContent route', () => {
  let sandbox = sinon.createSandbox();
  let courseUrl = 'courseUrl';
  let courseWithoutCacheUrl = 'courseWithoutCacheUrl';
  let courseId = 'courseId';
  let notCachedCourseId = 'notCachedCourseId';
  let coursePublishedDate = new Date();
  let courseData = {
    id: courseId,
    createdOn: coursePublishedDate.toString()
  };
  let courseWithoutCacheData = {
    id: notCachedCourseId,
    createdOn: coursePublishedDate.toString()
  };
  let res = null;
  let req = null;
  let cacheStream = null;
  let courseHtml = 'courseHtml';

  describe('/ GET', () => {
    beforeEach(() => {
      req = httpMocks.createRequest({
        method: 'GET',
        url: `/`,

        query: {
          url: courseUrl
        }
      });

      res = httpMocks.createResponse({ eventEmitter });

      cacheStream = new Readable();

      sandbox
        .stub(contentLoader, 'getCourseData')
        .withArgs(`${courseUrl}/`)
        .resolves(courseData)
        .withArgs(`${courseWithoutCacheUrl}/`)
        .resolves(courseWithoutCacheData);

      sandbox
        .stub(contentLoader, 'populateContent')
        .withArgs(courseUrl, courseData)
        .resolves()
        .withArgs(courseWithoutCacheUrl, courseWithoutCacheData)
        .resolves();

      sandbox
        .stub(renderer, 'render')
        .withArgs('searchContent')
        .resolves(courseHtml);

      sandbox
        .stub(cache, 'get')
        .withArgs(courseId)
        .resolves(cacheStream)
        .withArgs(notCachedCourseId)
        .resolves(null);

      sandbox.stub(cache, 'add').resolves();
    });

    afterEach(() => {
      sandbox.restore();
    });

    describe('when url is not specified', () => {
      it('should return 404 response', async () => {
        req.query.url = null;

        res.on('send', () => {
          res.statusCode.should.equal(404);
          res._getData().should.equal('Course not found');
        });

        searchContent(req, res);
      });
    });

    describe('when cache exists', () => {
      it('should stream the cache with proper content type', async () => {
        res.on('end', () => {
          res.statusCode.should.equal(200);
          res._getData().should.equal('test');
          res.getHeader('Content-Type').should.equal('text/html');
        });

        cacheStream.push('test');
        cacheStream.push(null);
        searchContent(req, res);
      });
    });

    describe('when cache doesnt exist', () => {
      beforeEach(() => {
        req.query.url = courseWithoutCacheUrl;
      });

      describe('and url ends with /', () => {
        it('should call populateContent with same url', async () => {
          req.query.url = `${courseWithoutCacheUrl}/`;
          res.on('send', () => {
            contentLoader.populateContent
              .withArgs(`${courseWithoutCacheUrl}/`, courseWithoutCacheData)
              .calledOnce.should.be.true();
          });

          searchContent(req, res);
        });
      });

      describe('and url doesnt end with /', () => {
        it('should call populateContent with url + /', async () => {
          req.query.url = `${courseWithoutCacheUrl}`;
          res.on('send', () => {
            contentLoader.populateContent
              .withArgs(`${courseWithoutCacheUrl}/`, courseWithoutCacheData)
              .calledOnce.should.be.true();
          });

          searchContent(req, res);
        });
      });

      it('should render search content view', async () => {
        res.on('send', () => {
          renderer.render
            .withArgs('searchContent', courseWithoutCacheData)
            .calledOnce.should.be.true();
        });

        searchContent(req, res);
      });

      it('should add rendered view to the cache', async () => {
        res.on('send', () => {
          cache.add.withArgs(notCachedCourseId, courseHtml).calledOnce.should.be.true();
        });

        searchContent(req, res);
      });

      it('should return rendered content with 200 status', async () => {
        res.on('send', () => {
          res.statusCode.should.equal(200);
          res._getData().should.equal(courseHtml);
        });

        searchContent(req, res);
      });
    });
  });
});
