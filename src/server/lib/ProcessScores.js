/**
 * Evaulate results to find item with highest score.
 */
class ProcessScores {
  constructor(evaluators) {
    this.evaluators = evaluators;
    this.num = 10;
  }

  /**
   * Process a list of items giving each a score based on evaluators.
   * @param iterator items Items to process
   * @return object Item with the top score
   */
  process(items) {
    let maxscore = 0;
    let toppick = null;
    let position = 0;
    for (const item of items) {
      // Start off score with one point for first item and 0 points for last.
      // This gives weight to googles ranking.
      let score = (this.num - position) / this.num;
      position += 1;
      for (let i = 0; i < this.evaluators.length; i += 1) {
        score += this.evaluators[i].check(item);
      }
      if (score > maxscore) {
        maxscore = score;
        toppick = item;
      }
    }
    return toppick;
  }
}

module.exports = ProcessScores;
