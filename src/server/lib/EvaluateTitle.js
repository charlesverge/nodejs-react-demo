const Evaluator = require('./Evaluator.js');

/**
 * Search title text for company name.
 */
class EvaluateTitle extends Evaluator {
  constructor(keywords) {
    super(keywords);
    this.weight = 1;
  }

  check(item) {
    return this.checkText(item.getDescription());
  }
}

module.exports = EvaluateTitle;
