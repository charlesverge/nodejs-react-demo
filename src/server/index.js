const express = require('express');
const os = require('os');
const Config = require('./config.js');
const ProcessScores = require('./lib/ProcessScores.js');
const EvaluateDomain = require('./lib/EvaluateDomain.js');
const EvaluateWWWDomain = require('./lib/EvaluateWWWDomain.js');
const EvaluateTitle = require('./lib/EvaluateTitle.js');
const EvaluateDescription = require('./lib/EvaluateDescription.js');
const ExcludeDomains = require('./lib/ExcludeDomains.js');
const GoogleCompanyName = require('./lib/GoogleCompanyName.js');

const app = express();
app.use(express.static('dist'));
app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));
app.listen(8080, () => console.log('Listening on port 8080!'));

app.get('/api/company', (req, res) => {
  console.log(req.query);
  const { companyname } = req.query;
  const evaluators = [];
  evaluators.push(new EvaluateDomain(companyname));
  evaluators.push(new EvaluateTitle(companyname));
  evaluators.push(new EvaluateDescription(companyname));
  evaluators.push(new ExcludeDomains('youtube.com,google.com,indeed.com'));
  const processor = new ProcessScores(evaluators);
  const source = new GoogleCompanyName(Config.googlesearchconfig, companyname);
  source.search().then((items) => {
    const toppick = processor.process(items);
    console.log('toppick', toppick.getDomain());
    res.header('Content-Type', 'application/json');
    const results = {
      toppick: toppick.getDomain()
    };
    res.send(JSON.stringify(results, null, 4));
  });
});

app.get('/api/companies', (req, res) => {
  const { companies } = req.query;
  const toppicks = [];

  // Send completed top picks list in format [{companyname: String, domain: String}].
  const sendTopPicks = (results) => {
    res.header('Content-Type', 'application/json');
    const send = {
      data: results,
      length: results.length,
    };
    return res.send(JSON.stringify(send, null, 4));
  };

  if (!companies || companies.length === 0) {
    return sendTopPicks([]);
  }

  const process = (result) => {
    if (!result) {
      return false;
    }
    const { items, companyname } = result;
    const evaluators = [];
    evaluators.push(new EvaluateDomain(companyname));
    evaluators.push(new EvaluateWWWDomain(companyname));
    evaluators.push(new EvaluateTitle(companyname));
    evaluators.push(new EvaluateDescription(companyname));
    evaluators.push(new ExcludeDomains('youtube.com,google.com,indeed.com'));
    const processor = new ProcessScores(evaluators);
    const toppick = processor.process(items);
    console.log('companyname ', companyname, toppick.getDomain());
    toppicks.push({
      name: companyname,
      domain: toppick.getDomain(),
    });
    if (companies.length === 0) {
      sendTopPicks(toppicks);
      return true;
    }
    const company = companies.pop();
    const locate = new GoogleCompanyName(Config.googlesearchconfig, company);
    // Super simple rate limitered to prevent blocking by api.
    setTimeout(() => {
      locate.search()
        .then(process)
        .catch((error) => {
          console.error('GoogleCompanyError:', error);
          return sendTopPicks(toppicks);
        });
    }, 250);
    return true;
  };

  // Chaining promises to prevent concurrent connections from hitting api limits.
  const company = companies.pop();
  const locate = new GoogleCompanyName(Config.googlesearchconfig, company);
  locate.search()
    .then(process)
    .catch((error) => {
      console.error('GoogleCompanyError:', error);
      return sendTopPicks(toppicks);
    });
  return true;
});
