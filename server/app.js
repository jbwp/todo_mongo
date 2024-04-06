
const express = require('express');
const cors = require('cors');

const { respondNotFound } = require('./helpers')

const todoApi = require('./todoApi.js')

const app = express();

app.set('x-powered-by', false);
app.use(express.json());
/* dla wszystkich */
// app.use(cors());

const options = {
  origin: 'http://localhost:3000',
}
app.use(cors(options))


app.get('/', todoApi.list);

app.post('/', todoApi.create);

app.put('/:id', todoApi.change);

app.delete('/:id', todoApi.delete);

app.post('/:id/toggle', todoApi.delete);

app.get('*', (req, res) => {
  // res.status(404);
  // res.send('Not found');
  respondNotFound(res);
})

app.use((err, req, res, next) => {
  // console.log(err)
  console.log(err.stack);
  res.status(500);
  // res.send(err.stack); /* info nie dla użytkownika, to co ten błąd w sobie zawiera */
  res.send(`We have encountered an error and we were notified about it. We'll try to fix it as soon as possible`);
})


exports.app = app;