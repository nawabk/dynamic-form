const express = require('express');
const cors = require('cors');

const formRouter = require('./routes/formRoutes');
const fieldRouter = require('./routes/fieldRoutes');
const globalExceptionHandler = require('./controllers/errorController');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10kb' }));

app.use('/api/forms', formRouter);
app.use('/api/fields', fieldRouter);

app.use(globalExceptionHandler);

module.exports = app;
