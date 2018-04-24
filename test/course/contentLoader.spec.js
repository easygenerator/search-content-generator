const sinon = require('sinon');
const { contentLoader, path, http, constants } = require('../index');

describe('contentLoader', () => {
  let sandbox = sinon.createSandbox();
  let courseUrl = 'courseUrl';
  let courseJson = '{}';
  let settings = { logo: { url: 'logoUrl' } };
  let courseData = {};
  let introductionContent = 'introductionContent';
  let sectionIds = ['section1', 'section2'];
  let questionIds = ['question1', 'question2', 'question3', 'question4'];
  let contentIds = ['content1', 'content2', 'content3'];
  let fillInTheBlankContent = 'fillInTheBlankContent';

  beforeEach(() => {
    sandbox
      .stub(http, 'getJson')
      .resolves({})
      .withArgs(path.getDataFileUrl(courseUrl))
      .resolves(courseJson);

    sandbox
      .stub(http, 'getJsonIfExists')
      .resolves(null)
      .withArgs(path.getSettingsFileUrl(courseUrl))
      .resolves(settings);

    sandbox
      .stub(http, 'getHtmlIfExists')
      .withArgs(path.getCourseIntroductionFileUrl(courseUrl))
      .resolves(introductionContent)
      .withArgs(path.getContentFileUrl(courseUrl, sectionIds[0], questionIds[0], contentIds[0]))
      .resolves(contentIds[0])
      .withArgs(path.getContentFileUrl(courseUrl, sectionIds[0], questionIds[0], contentIds[1]))
      .resolves(contentIds[1])
      .withArgs(path.getContentFileUrl(courseUrl, sectionIds[1], questionIds[3], contentIds[2]))
      .resolves(contentIds[2])
      .withArgs(path.getContentFileUrl(courseUrl, sectionIds[0], questionIds[0]))
      .resolves(fillInTheBlankContent);
  });

  afterEach(() => {
    sandbox.restore();
  });

  context('getCourseData', () => {
    it('should get and return course data', async () => {
      let result = await contentLoader.getCourseData(courseUrl);
      http.getJson.withArgs(path.getDataFileUrl(courseUrl)).calledOnce.should.be.true();
      result.should.equal(courseJson);
    });
  });

  context('populateContent', () => {
    describe('when course settings has a logo', () => {
      it('should set logoUrl with logo from settings', async () => {
        await contentLoader.populateContent(courseUrl, courseData);
        courseData.logoUrl.should.equal('logoUrl');
      });
    });

    describe('when course settings doesnt have a logo', () => {
      it('should set default logoUrl', async () => {
        await contentLoader.populateContent('fakeCourseUrl', courseData);
        courseData.logoUrl.should.equal(constants.defaultLogo);
      });
    });

    describe('when courseData hasIntroductionContent property is true', () => {
      it('should populate course introductionContent', async () => {
        let courseDataWithContent = {
          hasIntroductionContent: true
        };

        await contentLoader.populateContent(courseUrl, courseDataWithContent);
        courseDataWithContent.introductionContent.should.equal(introductionContent);
      });
    });

    describe('when course has sections with questions', () => {
      let courseDataWithSections = {};

      beforeEach(() => {
        courseDataWithSections.sections = [
          {
            id: sectionIds[0],
            questions: [{ id: questionIds[0] }, { id: questionIds[1] }]
          },
          {
            id: sectionIds[1],
            questions: [{ id: questionIds[2] }, { id: questionIds[3] }]
          }
        ];
      });

      describe('when questions have learningContents', () => {
        beforeEach(() => {
          courseDataWithSections.sections[0].questions[0].learningContents = [
            { id: contentIds[0] },
            { id: contentIds[1] }
          ];
          courseDataWithSections.sections[1].questions[1].learningContents = [
            { id: contentIds[2] }
          ];
        });

        it('should populate courseData with learningContents', async () => {
          await contentLoader.populateContent(courseUrl, courseDataWithSections);
          courseDataWithSections.sections[0].questions[0].learningContents[0].html.should.equal(
            contentIds[0]
          );
          courseDataWithSections.sections[0].questions[0].learningContents[1].html.should.equal(
            contentIds[1]
          );
          courseDataWithSections.sections[1].questions[1].learningContents[0].html.should.equal(
            contentIds[2]
          );
        });

        describe('when learningContents have children', () => {
          beforeEach(() => {
            courseDataWithSections.sections[0].questions[0].learningContents = [
              {
                id: contentIds[0],
                children: [{ id: contentIds[1] }]
              }
            ];
          });

          it('should populate children contents', async () => {
            await contentLoader.populateContent(courseUrl, courseDataWithSections);
            courseDataWithSections.sections[0].questions[0].learningContents[0].children[0].html.should.equal(
              contentIds[1]
            );
          });
        });
      });

      describe('when questions have questionInstructions', () => {
        beforeEach(() => {
          courseDataWithSections.sections[0].questions[0].questionInstructions = [
            { id: contentIds[0] },
            { id: contentIds[1] }
          ];
          courseDataWithSections.sections[1].questions[1].questionInstructions = [
            { id: contentIds[2] }
          ];
        });

        it('should populate courseData with questionInstructions', async () => {
          await contentLoader.populateContent(courseUrl, courseDataWithSections);
          courseDataWithSections.sections[0].questions[0].questionInstructions[0].html.should.equal(
            contentIds[0]
          );
          courseDataWithSections.sections[0].questions[0].questionInstructions[1].html.should.equal(
            contentIds[1]
          );
          courseDataWithSections.sections[1].questions[1].questionInstructions[0].html.should.equal(
            contentIds[2]
          );
        });

        describe('when questionInstructions have children', () => {
          beforeEach(() => {
            courseDataWithSections.sections[0].questions[0].questionInstructions = [
              {
                id: contentIds[0],
                children: [{ id: contentIds[1] }]
              }
            ];
          });

          it('should populate children contents', async () => {
            await contentLoader.populateContent(courseUrl, courseDataWithSections);
            courseDataWithSections.sections[0].questions[0].questionInstructions[0].children[0].html.should.equal(
              contentIds[1]
            );
          });
        });
      });

      describe('when question type is FillInTheBlank', () => {
        describe('when question has content', () => {
          beforeEach(() => {
            courseDataWithSections.sections[0].questions[0].type =
              constants.fillInTheBlankQuestionType;
            courseDataWithSections.sections[0].questions[0].hasContent = true;
          });

          it('should populate question with the content', async () => {
            await contentLoader.populateContent(courseUrl, courseDataWithSections);
            courseDataWithSections.sections[0].questions[0].content.should.equal(
              fillInTheBlankContent
            );
          });
        });
      });
    });
  });
});
