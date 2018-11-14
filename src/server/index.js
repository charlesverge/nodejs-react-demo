const express = require('express');
const os = require('os');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressAccessToken = require('express-access-token');
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
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const accessTokens = [
  "test1",
  "110546ae-627f-48d4-9cf8-fd8850e0ac7f",
  "04b90260-3cb3-4553-a1c1-ecca1f83a381"
];

const firewall = (req, res, next) => {
  const authorized = accessTokens.includes(req.accessToken);
  if (!authorized) {
    return res.status(403).send('Forbidden');
  }
  return next();
};

app.get('/api/getUsername', expressAccessToken, firewall, (req, res) => res.send({ username: os.userInfo().username }));
app.listen(8080, () => console.log('Listening on port 8080!'));

app.get('/api/company', expressAccessToken, firewall, (req, res) => {
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

app.get('/api/companies', expressAccessToken, firewall, (req, res) => {
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
