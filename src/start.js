const rootLogger = require('pino')();
const express = require('express');
const math = require('mathjs');
const bodyParser = require('body-parser');
const electricity = require('./electricity');

const jsonParser = bodyParser.json();

const logger = rootLogger.child({ custom_logger: true });

logger.info('Starting up');

const app = express();
const port = 3000;

function onlyAcceptJson(req, res, next) {
  const contype = req.headers['content-type'];
  if (!contype || contype.indexOf('application/json') !== 0) {
    res.status(406).json({ error: 'content-type must be application/json' });
  } else {
    next();
  }
}

app.post('/emissions/electricity', onlyAcceptJson, jsonParser, (req, res) => {
  // const foo = req.accepts('application/json');
  // res.send(`Hello World! ${foo}`);
  const electricalQuantity = math.unit(req.body.quantity, req.body.unit);
  // logger.info(req.body);
  // logger.info(electricalQuantity.format());
  const emissions = electricity.emissionsForElectricalEnergy(electricalQuantity, electricity.plant.coal);
  res.json(emissions.to(req.body.response_unit));
});

// Actually... it would be kind of nice to have an option that showed the entire calculation chain

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).send('Something broke!');
  throw err; // for debugging mainly
  // process.exit(1);
});

app.listen(port, () => rootLogger.info(`Listening on port ${port}!`));
