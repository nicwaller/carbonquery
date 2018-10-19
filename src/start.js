const logger = require('pino')();
const express = require('express');

logger.info('Starting up');

const child = logger.child({ a: 'property' });
child.info('hello child!');


const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => logger.info(`Example app listening on port ${port}!`));
