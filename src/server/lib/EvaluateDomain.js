const Evaluator = require('./Evaluator.js');

/**
 * Give keywords found in domain triple points.
 */
class EvaluateDomain extends Evaluator {
  constructor(keywords) {
    super(keywords);
    this.weight = 3;
  }

  check(item) {
    const text = item.getDomain();
    return this.checkText(text);
  }
}

module.exports = EvaluateDomain;
