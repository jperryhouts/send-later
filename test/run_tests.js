global.SLTests = {
  UnitTests: [],

  AddTest: function(test_name, test_function, test_args) {
    SLTests.UnitTests.push([test_name, test_function, test_args]);
  },

  RunTests: async function(event, names) {
    let n_fail = 0;
    let n_pass = 0;
    for (const params of SLTests.UnitTests) {
      const name = params[0];
      const func = params[1];
      const args = params[2];

      if (names && names.indexOf(name) === -1) {
        continue;
      }

      await Promise.resolve(func.apply(null, args)).then(result => {
        if (result === true) {
          console.info(`+ TEST ${name} PASS`);
          n_pass += 1;
        } else if (result === false) {
          console.warn(`- TEST ${name} FAIL`);
          n_fail += 1;
        } else {
          console.warn(`- TEST ${name} FAIL ${result}`);
          n_fail += 1;
        }
      }).catch(ex => {
        console.warn(`- TEST ${name} EXCEPTION: ${ex.message}`);
        n_fail += 1;
      });
    }
    if (n_fail === 0) {
      console.info(`\n  All ${n_pass} tests are passing!\n`);
    } else {
      console.info(`\n  ${n_fail}/${n_pass+n_fail} tests failed.\n`);
    }
  }
}

require('../utils/static.js');

const testPaths = [
  "./adjustdaterestrictionstests.js",
  "./formatrecurtests.js",
  "./nextrecurtests.js",
  "./parserecurtests.js",
  "./mimetests.js",
  "./miscellaneoustests.js"
];

for (let i=0; i<testPaths.length; i++) {
  const tests = require(testPaths[i]);
  tests.init();
}

SLTests.RunTests().catch(console.error);
