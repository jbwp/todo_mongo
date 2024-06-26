const express = require('express');

const bodyParser = require('body-parser');

const cors = require('cors');

const path = require('path')

const { respondNotFound } = require('./helpers')

const todoApi = require('./todoApi.js')

const { connect } = require('./client');

connect();

const app = express();
app.use(bodyParser.json());
app.use(cors());
// const options = {
//   origin: 'http://localhost:3000',
// }
// app.use(cors(options))

app.set('x-powered-by', false);

app.use(express.json());

console.log('express static');

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get('/tasks/', todoApi.list);

app.post('/tasks/', todoApi.create);

app.put('/tasks/:id', todoApi.change);

app.delete('/tasks/:id', todoApi.delete);

app.post('/tasks/:id/toggle', todoApi.toggle);



app.get('*', (req, res) => {
  respondNotFound(res);
})

app.use((err, req, res, next) => {
  console.log(err);
  // console.log(err.stack);
  res.status(500);
  // res.send(err.stack); /* info nie dla użytkownika, to co ten błąd w sobie zawiera */
  res.send(`We have encountered an error and we were notified about it. We'll try to fix it as soon as possible`);
})

exports.app = app;