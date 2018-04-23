const contentFolder = 'content';

function getContentResourceUrl(courseUrl, resourcePath) {
  return `${courseUrl + contentFolder}/${resourcePath}`;
}

module.exports = {
  getDataFileUrl(courseUrl) {
    return getContentResourceUrl(courseUrl, 'data.js');
  },
  getSettingsFileUrl(courseUrl) {
    return `${courseUrl}settings.js`;
  },
  getCourseIntroductionFileUrl(courseUrl) {
    return getContentResourceUrl(courseUrl, 'content.html');
  },
  getContentFileUrl(courseUrl, sectionId, questionId, contentId) {
    let contentFileName = contentId || 'content';
    return getContentResourceUrl(courseUrl, `${sectionId}/${questionId}/${contentFileName}.html`);
  }
};
