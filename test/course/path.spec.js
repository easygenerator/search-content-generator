const { path } = require('../index');

describe('path', () => {
  let courseUrl = 'courseUrl/';

  context('getDataFileUrl', () => {
    it('should return proper url', () => {
      path.getDataFileUrl(courseUrl).should.equal(`${courseUrl}content/data.js`);
    });
  });

  context('getSettingsFileUrl', () => {
    it('should return proper url', () => {
      path.getSettingsFileUrl(courseUrl).should.equal(`${courseUrl}settings.js`);
    });
  });

  context('getCourseIntroductionFileUrl', () => {
    it('should return proper url', () => {
      path.getCourseIntroductionFileUrl(courseUrl).should.equal(`${courseUrl}content/content.html`);
    });
  });

  context('getContentFileUrl', () => {
    let sectionId = 'sectionId';
    let questionId = 'questionId';
    let contentId = 'contentId';

    describe('when content id is specified', () => {
      it('should return url to the concrete content', () => {
        path
          .getContentFileUrl(courseUrl, sectionId, questionId, contentId)
          .should.equal(`${courseUrl}content/${sectionId}/${questionId}/${contentId}.html`);
      });
    });

    describe('when content id is not specified', () => {
      it('should return url to the general content', () => {
        path
          .getContentFileUrl(courseUrl, sectionId, questionId)
          .should.equal(`${courseUrl}content/${sectionId}/${questionId}/content.html`);
      });
    });
  });
});
