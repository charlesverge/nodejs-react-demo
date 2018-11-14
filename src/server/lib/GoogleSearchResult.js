const URL = require('url');

/**
 * A single result from Google custom search api.
 */
class GoogleSearchResult {
  constructor(item) {
    this.item = item;
  }

  getItem() {
    return this.item;
  }

  getDescription() {
    return this.item.snippet;
  }

  getTitle() {
    return this.item.title;
  }

  getDomain() {
    const url = URL.parse(this.item.link);
    return url.hostname;
  }
}

module.exports = GoogleSearchResult;
