const Evaluator = require('./Evaluator.js');

/**
 * Search description text for company name.
 */
class EvaluateDescription extends Evaluator {
  constructor(keywords) {
    super(keywords);
    this.weight = 0.5;
  }

  check(item) {
    return this.checkText(item.getDescription());
  }
}

module.exports = EvaluateDescription;
