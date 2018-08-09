const assert = require('assert');
const TestRail = require('testrail-api');

const MODULE_NAME = 'testrail-reporter';

const EStatuses = {
  Passed: 1,
  Blocked: 2,
  Untested: 3,
  Retest: 4,
  Failed: 5
};

const jasmineToTestrailStatusesMatching = {
  passed: EStatuses.Passed,
  disabled: EStatuses.Blocked,
  failed: EStatuses.Failed
};

class TestRailReporter {
  constructor( {
                 host = process.env.TESTRAIL_HOST,
                 user = process.env.TESTRAIL_USER,
                 email = process.env.TESTRAIL_EMAIL,
                 password = process.env.TESTRAIL_PASSWORD,
                 projectId = process.env.TESTRAIL_PROJECT_ID,
                 runId = process.env.TESTRAIL_RUN_ID
               } = {} ) {
    this.projectId = projectId;
    this.runId = runId;

    this.specResults = [];
    this.jasmineResults = {};

    this.asyncFlow = null;

    assert(user, `${MODULE_NAME}: user parameter should not be empty!`);
    assert(host, `${MODULE_NAME}: host parameter should not be empty!`);
    assert(password, `${MODULE_NAME}: password parameter should not be empty!`);
    assert(projectId, `${MODULE_NAME}: projectId parameter should not be empty!`);

    if ( !password ) throw(new Error(`${MODULE_NAME}: password parameter should not be empty!`));

    this.testrail = new TestRail({
      host,
      user,
      password
    });

  }


  createRun( testcaseIds ) {
    if ( this.runId ) {
      console.log(`Use existing runId: ${this.runId}`);
      return Promise.resolve(this.runId);
    }
    console.log(`Creating new runId with case ids: [${testcaseIds}]...`);
    return this.testrail.addRun(this.projectId, {
      name: `Run - ${new Date().toString()}`,
      include_all: false,
      case_ids: testcaseIds
    })
      .then(( res ) => {
        const data = res.body;
        this.runId = data.id;
        console.log(`runId successfully created. runId: ${this.runId}`);
        return this.runId;
      });
  }

  jasmineStarted( suiteInfo ) {

    /* Wait for async tasks triggered by `specDone`. */
    beforeEach(() => {
      if ( this.asyncFlow )
        return this._asyncFlow
          .then(() => {
            this._asyncFlow = null;
          });
    });

  }

  specDone( result ) {

    this.specResults.push(result);
    this._asyncFlow = this._asyncSpecDone(result);

  }

  suiteDone( result ) {

    this.jasmineResults[ result.id ] = result;
    this.jasmineResults[ result.id ].specs = this.specResults;
    this.specResults = [];

  }

  _asyncSpecDone( result ) {
    // for additional async calls
  }

  publishResults() {
    console.log('Gathering results for TestRail...');
    const allSpecsFromAllSuites = Object.values(this.jasmineResults).reduce(( acc, suite ) => [ ...acc, ...suite.specs ], []);
    const resultsForCases = allSpecsFromAllSuites.reduce(( results, spec ) => {
      spec.failedExpectations = spec.failedExpectations || [];
      spec.status = spec.status || '';
      let caseId;
      const matchArray = spec.description.match(/\((\d+):\)/);
      if ( matchArray && matchArray.length && matchArray.length > 1 ) {
        caseId = Number(matchArray[ 1 ]);
        const caseResult = {
          case_id: caseId,
          status_id: jasmineToTestrailStatusesMatching[ spec.status ],
          comment: `${spec.id}: ${spec.fullName}`,
          defects: spec.failedExpectations.map(
            el => `matcherName = ${el.matcherName}\nmessage = ${el.message}\nexpected = ${el.expected}\nactual=${el.actual}`
          ).join('\n\n')
        };
        return [ ...results, caseResult ];
      } else {
        console.log(`Case ID not found in spec ${spec.fullName}. This spec will NOT be send to TestRail`);
        return results;
      }
    }, []);
    const caseIds = resultsForCases.map(( item ) => item.case_id);
    if ( caseIds.length > 0 ) {
      console.log('Publishing results to TestRail...');
      return this.createRun(caseIds)
        .then(( runId ) => this.testrail.addResultsForCases(runId, resultsForCases))
        .then(( res ) => res.body);
    }
    return Promise.reject(new Error('There are no case IDs to send to TestRail. Publish results was aborted.'));
  }
}

module.exports = TestRailReporter;
