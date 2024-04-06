// test('adds 2 and 2', () => {
//   expect(2 + 2).toEqual(4)
// })
const request = require('supertest');
const { app } = require('./app.js');

test('works', async () => {
  const response = await request(app).get('/');
  expect(response.status).toEqual(200);
  expect(response.header['content-type']).toEqual('application/json; charset=utf-8')
})


test('updates a todo', async () => {
  const name = 'Supper';
  const createResponse = await request(app).post('/').send({ name });
  // console.log(createResponse);
  expect(createResponse.status).toEqual(200);
  expect(createResponse.header['content-type']).toEqual('application/json; charset=utf-8')
  const createdTodo = JSON.parse(createResponse.text);
  expect(createdTodo).toMatchObject({ name, done: false });

  const id = createdTodo.id;
  const nextName = "Lunch";
  const response = await request(app).put(`/${id}`).send({ name: nextName });
  expect(response.status).toEqual(200);
  expect(response.header['content-type']).toEqual('application/json; charset=utf-8');
  const todo = JSON.parse(response.text);
  expect(todo).toMatchObject({ name: nextName, done: false });
})

test('returns an error when creating a todo without a body', async () => {
  const response = await request(app).post('/');
  expect(response.status).toEqual(400);
})

test('handles pages that are not found', async () => {
  const response = await request(app).get('/whatever');
  expect(response.status).toEqual(404);
  expect(response.text).toEqual('Not found');
})