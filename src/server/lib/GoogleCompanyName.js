const GoogleSearch = require('google-search');
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

function* results(items) {
  for (let i = 0; i < items.length; i += 1) {
    yield new GoogleSearchResult(items[i]);
  }
}

class GoogleCompanyName {
  constructor(config, query) {
    this.query = query;
    this.googleSearch = new GoogleSearch(config);
    this.start = 1;
    this.num = 10;
  }

  search() {
    const self = this;
    if (!this.query) {
      return Promise.resolve();
    }
    const promise = new Promise((resolve, reject) => {
      self.googleSearch.build({
        q: self.query,
        start: self.start,
        num: self.num
      }, (error, response) => {
        self.handle(resolve, reject, error, response);
      });
    });
    return promise;
  }

  handle(resolve, reject, error, response) {
    try {
      console.log('handle ', this.query);
      if (error) {
        resolve({
          items: results([]),
          companyname: this.query
        });
      }
      if (!response.items) {
        resolve({
          items: results([]),
          companyname: this.query
        });
      }
      resolve({
        items: results(response.items),
        companyname: this.query
      });
    } catch (yielderror) {
      reject(yielderror);
    }
  }
}

module.exports = GoogleCompanyName;
