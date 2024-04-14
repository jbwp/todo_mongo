const { respondNotFound, respondWithError } = require('./helpers')
const { getTodos, createTodo, findAndUpdateTodo, findAndDeleteTodo } = require('./db');

function verifyName(req, res) {
  if (!req.body || !req.body.hasOwnProperty('name')) {
    return respondWithError(res, 'Name is missing')
  }
  let { name } = req.body;
  if (typeof name !== 'string') {
    return respondWithError(res, 'Name should be a string')
  }
  name = name.trim();
  if (name === '') {
    return respondWithError(res, 'Name should not be empty')
  }
  return { name }
}


function verifyDone(req, res) {
  if (!req.body || !req.body.hasOwnProperty('done')) {
    return respondWithError(res, 'Done is missing')
  }
  let { done } = req.body;
  if (typeof done !== 'boolean') {
    return respondWithError(res, 'Done should be a boolean')
  }
  return { done }
}

exports.list = async (req, res) => {
  const todos = await getTodos();
  console.log(list);
  res.json(todos);
}

exports.create = async (req, res) => {
  const cleanName = verifyName(req, res);
  if (!cleanName) {
    return
  }
  const todo = await createTodo(cleanName.name)
  res.json(todo);
};

exports.change = async (req, res) => {
  const cleanName = verifyName(req, res);
  if (!cleanName) {
    return
  }
  const todo = await findAndUpdateTodo(req.params.id, { $set: { 'name': cleanName.name } },);

  if (todo === null) {
    return respondNotFound(res);
  }
  res.json(todo)
};

exports.delete = async (req, res) => {
  const todo = await findAndDeleteTodo(req.params.id)
  if (todo === null) {
    return respondNotFound(res);
  }
  res.json(todo);
}

exports.toggle = async (req, res) => {
  const cleanDone = verifyDone(req, res);
  if (!cleanDone) {
    return
  }

  const todo = await findAndUpdateTodo(req.params.id, { $set: { 'done': cleanDone.done } },);

  if (todo === null) {
    return respondNotFound(res);
  }

  res.json(todo);
}
