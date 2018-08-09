const TReporter = require('./reporters/testrail-reporter');

const tReporter = new TReporter({
  host: '--YOUR_HOST--',
  user: '--YOUR_EMAIL--',
  password: '--YOUR_PASSWORD--',
  projectId: 1
  // runId: 46
});

exports.config = {
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: [ 'e2e/**/*.spec.js' ],
  jasmineNodeOpts: {
    defaultTimeoutInterval: 300000
  },
  allScriptsTimeout: 110000,
  // SELENIUM_PROMISE_MANAGER: false,
  multiCapabilities: [ {
    browserName: 'chrome',
    chromeOptions: {
      args: [ '--headless', '--disable-gpu', '--window-size=800,600' ]
    }
  } ],
  onPrepare() {
    jasmine.getEnv().addReporter(tReporter);
  },
  beforeLaunch() {
  },
  onComplete() {
    return tReporter.publishResults()
      .then(() => {
        console.log('Results successfully published to TestRail');
      })
      .catch(( err ) => {
        if ( err instanceof Error ) {
          return console.log(err.message);
        }
        console.log(err);
      });
  }
};
