/**
 * Give score for keywords in text.
 */
class Evaluator {
  constructor(keywords) {
    this.keywords = keywords.split(/[ ,-]/).map(Evaluator.cleankeywords);
    this.weight = 1;
  }

  /**
   * Escape keyword for use in regexp.
   */
  static cleankeywords(keyword) {
    return keyword.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  }

  checkText(text) {
    let score = 0;
    for (let i = 0; i < this.keywords.length; i += 1) {
      const regx = new RegExp(this.keywords[i], 'i');
      if (regx.test(text)) {
        score += this.weight;
      }
    }
    return score;
  }
}

module.exports = Evaluator;
