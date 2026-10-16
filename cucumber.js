module.exports = {
  default: {
    paths: ['src/test/resources/features/**/*.feature'],
    require: ['src/test/js/support/**/*.js', 'src/test/js/step_definitions/**/*.js'],
    format: [
      'progress-bar',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json',
    ],
    tags: process.env.CUCUMBER_TAGS || 'not @ignore',
    publishQuiet: true,
  },
};
