const Testrail = require('testrail-api');
const config = require('./confg/config');

const testrail = new Testrail(config);
module.exports = testrail;

function testrailReqHelper( req ) {
  return req.then(res  => res.body);
}


async function start() {
  // const cases = await transformRequest(testrail.getCases(1));
  // console.log(cases);
  // const runs = await testrailReqHelper(testrail.getRuns(1));
  // console.log(runs);

  // const results = await testrailReqHelper(testrail.getResultsForRun(1));
  // console.log(results);
  // const case1 = await testrail.getCase(595);
  // console.log(case1.body);
  // const projects = await testrail.getProjects();
  // console.log(projects.body);

  // const run1 = await testrail.getRun(10);
  // console.log(run1.body);


  // console.log(await testrail.getStatuses().then(( res ) => res.body));

  // const res = await testrail.closeRun(10);
  // console.log(res.body);

  // const newRun = await testrailReqHelper(testrail.addRun(1, { name: `SUPER RUN ${new Date().toString()}` }));
  // const sections = await testrailReqHelper(testrail.getSections(1));
  // console.log(sections);

  // const newCase = await (testrailReqHelper(testrail.addCase()))
  // console.log(newRun);

  // await testrailReqHelper(testrail.deleteRun(20));
  // const newRun = await testrailReqHelper(testrail.addRun(1, {
  //   name: `SUPER DUPER RUN ${new Date().toString()}`,
  //   include_all: false,
  //   case_ids: [ 595, 596 ]
  // }));
  // console.log(newRun);
  // const { id: runId } = newRun;
  // const result = await testrailReqHelper(testrail.addResultForCase(21, 595, { status_id: 1 }));
  // console.log(result);
}

start()
  .catch(( err ) => {
    console.log(err);
  });

/*
1 passed
2 blocked
4 retest
5 failed
* */
console.log('asda'.match(/sd/));
