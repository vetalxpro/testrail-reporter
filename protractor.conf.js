const TReporter = require('./reporters/testrail-reporter');

const tReporter = new TReporter({
  host: 'HOST',
  user: 'EMAIL',
  password: 'PASSWORD',
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
    console.log('before launch');
  },
  onComplete() {
    console.log('Publishing results to TestRail...');
    return tReporter.publishResults()
      .then(() => {
        console.log('Results successfully published to TestRail');
        // console.log(JSON.stringify(results,null,2));
      })
      .catch(( err ) => {
        console.log(err);
      });
  }
};
