const sinon = require('sinon');
const { cache, bucket } = require('../index');

describe('cache', () => {
  let sandbox = sinon.createSandbox();
  let courseId = 'courseId';
  let nonExistingCourseId = 'nonExistingCourseId';
  let fileCache = {
    headers: {
      'last-modified': new Date()
    }
  };
  let fileInfo = {
    LastModified: new Date()
  };

  beforeEach(() => {
    sandbox
      .stub(bucket, 'getFileStream')
      .withArgs(`${courseId}.html`)
      .resolves(fileCache)
      .withArgs(`${nonExistingCourseId}.html`)
      .resolves(null);

    sandbox
      .stub(bucket, 'getFileInfo')
      .withArgs(`${courseId}.html`)
      .resolves(fileInfo)
      .withArgs(`${nonExistingCourseId}.html`)
      .resolves(null);

    sandbox.stub(bucket, 'putBuffer');
  });

  afterEach(() => {
    sandbox.restore();
  });

  context('get', () => {
    it('should request course file from the bucket', async () => {
      await cache.get(courseId, new Date());
      bucket.getFileStream.withArgs(`${courseId}.html`).calledOnce.should.be.true();
    });

    it('should return undefined if file doesnt exist', async () => {
      let result = await cache.get(nonExistingCourseId, new Date());
      (result === undefined).should.be.true();
    });

    describe('when course file exists in bucket', () => {
      it('should return it if cache is up to date', async () => {
        let pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 1);
        let result = await cache.get(courseId, pastDate);
        result.should.equal(fileCache);
      });

      it('should return undefined if cache is outdated', async () => {
        let futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);
        let result = await cache.get(courseId, futureDate);
        (result === undefined).should.be.true();
      });
    });
  });

  context('add', () => {
    it('should put cache to the bucket', async () => {
      let courseHtml = 'courseHtml';
      await cache.add(courseId, courseHtml);
      bucket.putBuffer
        .withArgs(Buffer.from(courseHtml), `${courseId}.html`)
        .calledOnce.should.be.true();
    });
  });
});
