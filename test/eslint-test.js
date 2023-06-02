import glob from 'glob';
import ESLint from 'eslint';
import { assert } from 'chai';
import mocha from 'mocha';

const paths = glob.sync('./+(app|test|companion)/**/*.js');
const engine = new ESLint.ESLint({
  useEslintrc: true
});
let results;
async function main() {
  results = await engine.lintFiles(paths);
  results.forEach(result => {
    console.log(`File: ${result.filePath}`);
    console.log(`Error Count: ${result.errorCount}`);
    console.log(`Warning Count: ${result.warningCount}`);
  });
  console.log(results);

  mocha.describe('ESLint', function () {
    results.forEach((result) => generateTest(result));
  });
}

main();

function generateTest(result) {
  const { filePath, messages } = result;

  mocha.it(`validates ${filePath}`, function () {
    if (messages.length > 0) {
      assert.fail(false, true, formatMessages(messages));
    }
  });
}

function formatMessages(messages) {
  const errors = messages.map((message) => {
    return `${message.line}:${message.column} ${message.message.slice(0, -1)} - ${message.ruleId}\n`;
  });

  return `\n${errors.join('')}`;
}
