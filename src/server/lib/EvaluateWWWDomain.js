const Evaluator = require('./Evaluator.js');

/**
 * Prefer domains with www.
 */
class EvaluateDomain extends Evaluator {
  constructor(keywords) {
    super(keywords);
    this.keywords = [];
    for (let i = 0; i < keywords.length; i += 1) {
      this.keywords.push(`www.${keywords[i]}`);
    }
    this.weight = 3;
  }

  check(item) {
    const text = item.getDomain();
    return this.checkText(text);
  }
}

module.exports = EvaluateDomain;
