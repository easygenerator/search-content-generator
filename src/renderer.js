const ejs = require('ejs');
const path = require('path');

module.exports = {
  render(viewName, viewData) {
    let pagePath = path.join(__dirname, `views/${viewName}.ejs`);
    return new Promise((resolve, reject) => {
      ejs.renderFile(pagePath, viewData, {}, (err, html) => {
        if (err) {
          reject(new Error('Failed to render page'));
          return;
        }

        resolve(html);
      });
    });
  }
};
