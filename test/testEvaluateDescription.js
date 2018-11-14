const expect = require('chai').expect;
const EvaluateDescription = require('../src/server/lib/EvaluateDescription.js');
const GoogleSearchResult = require('../src/server/lib/GoogleSearchResult.js');

describe('EvaluateDescription()', function () {
  it('should score one point', function () {
    const item = {
      snippet: 'This is test snippet',
      title: 'This is test title',
    };
    const test = new EvaluateDescription('test snippet').check(new GoogleSearchResult(item));
    expect(1).to.be.equal(test);
  });
});
