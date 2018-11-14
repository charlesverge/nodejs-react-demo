const Evaluator = require('./Evaluator.js');

/**
 * Give domains to exclude minus scores.
 */
class ExcludeDomains extends Evaluator {
  constructor(keywords) {
    super(keywords);
    this.weight = -1000;
  }

  check(item) {
    const text = item.getDomain();
    return this.checkText(text);
  }
}

module.exports = ExcludeDomains;
