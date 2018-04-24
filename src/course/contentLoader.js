const http = require('../http');
const constants = require('../constants');
const path = require('./path');

module.exports = {
  async getCourseData(courseUrl) {
    return http.getJson(path.getDataFileUrl(courseUrl));
  },

  async populateContent(courseUrl, courseData) {
    let settings = await http.getJsonIfExists(path.getSettingsFileUrl(courseUrl));
    let loadContentPromises = [];

    courseData.logoUrl =
      settings && settings.logo && settings.logo.url ? settings.logo.url : constants.defaultLogo;

    if (courseData.hasIntroductionContent) {
      courseData.introductionContent = await http.getHtmlIfExists(
        path.getCourseIntroductionFileUrl(courseUrl)
      );
    }

    if (courseData.sections) {
      courseData.sections.forEach(section => {
        if (section.questions) {
          section.questions.forEach(question => {
            let contentsToLoad = [
              ...(question.learningContents || []),
              ...(question.questionInstructions || [])
            ];
            contentsToLoad.forEach(content => {
              loadContentPromises.push(
                (async () => {
                  content.html = await http.getHtmlIfExists(
                    path.getContentFileUrl(courseUrl, section.id, question.id, content.id)
                  );
                })()
              );

              if (content.children) {
                content.children.forEach(childContent => {
                  loadContentPromises.push(
                    (async () => {
                      childContent.html = await http.getHtmlIfExists(
                        path.getContentFileUrl(courseUrl, section.id, question.id, childContent.id)
                      );
                    })()
                  );
                });
              }
            });

            if (question.type === constants.fillInTheBlankQuestionType && question.hasContent) {
              loadContentPromises.push(
                (async () => {
                  question.content = await http.getHtmlIfExists(
                    path.getContentFileUrl(courseUrl, section.id, question.id)
                  );
                })()
              );
            }
          });
        }
      });
    }

    await Promise.all(loadContentPromises);
  }
};
