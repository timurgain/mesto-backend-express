const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const config = require('./config');
const routes = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');

// connect mongo
mongoose.connect(config.db.uri);

// make app
const app = express();

// use logger
app.use(morgan('tiny'));

// use cookie parser
app.use(cookieParser());

// use routes
app.use('/', routes);

// input validation error handler (celebrate, joi)
app.use(errors());

// main error handler
app.use(errorHandler);

app.listen(config.app.port);
