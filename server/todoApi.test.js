const { connect, disconnect, drop } = require('./client');
const { getTodos, createTodo } = require('./db');
const { ObjectId } = require('mongodb');

const todoApi = require('./todoApi.js');

let req;
let res;
let next;

function expectStatus(status) {
  if (status === 200) {
    return;
  }
  expect(res.status).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(status);
}

function expectResponse(json) {
  expect(res.json).toHaveBeenCalledTimes(1);
  expect(res.json).toHaveBeenCalledWith(json);
  expect(res.send).not.toHaveBeenCalled();
}

function expectTextResponse(text) {
  expect(res.send).toHaveBeenCalledTimes(1);
  expect(res.send).toHaveBeenCalledWith(text);
  expect(res.json).not.toHaveBeenCalled();
}

beforeAll(connect);
afterAll(disconnect);
beforeEach(drop);


beforeEach(() => {
  req = {
    params: {}
  }
  res = {
    json: jest.fn(),
    send: jest.fn(),
    status: jest.fn(),
  };
});

describe('list', () => {
  test('works', async () => {
    await todoApi.list(req, res);
    const todos = await getTodos();
    expectStatus(200);
    expectResponse(todos);
  })
})

describe('create', () => {
  test('works', async () => {
    const name = 'Supper';
    const { length } = await getTodos();

    req.body = { name }
    await todoApi.create(req, res);
    const todos = await getTodos();
    expectStatus(200);
    expectResponse(todos[todos.length - 1]);
    expect(todos).toHaveLength(length + 1);
    expect(todos[todos.length - 1]).toMatchObject({
      name,
      done: false
    });
  });

  test('handles missing body', () => {
    todoApi.create(req, res);
    expectStatus(400);
    expectResponse({ error: 'Name is missing' });
  });

  test('handles missing name in the body', () => {
    req.body = {}
    todoApi.create(req, res);
    expectStatus(400);
    expectResponse({ error: 'Name is missing' });
  });

  test('handles an empty name', () => {
    req.body = { name: '' }
    todoApi.create(req, res);
    expectStatus(400);
    expectResponse({ error: 'Name should not be empty' });
  });

  test('handles en empty name (after triming', () => {
    req.body = { name: '    ' }
    todoApi.create(req, res);
    expectStatus(400);
    expectResponse({ error: 'Name should not be empty' });
  });

  test('handles wrong name type', () => {
    req.body = { name: 42 }
    todoApi.create(req, res);
    expectStatus(400);
    expectResponse({ error: 'Name should be a string' })
  })
});

describe('change', () => {
  const id = 42;
  const name = 'Supper';
  const nextName = 'Lunch';

  test('works', async () => {
    const { _id } = await createTodo(name);

    const { length } = await getTodos();

    req.params.id = _id.toString();
    req.body = { name: nextName };

    await todoApi.change(req, res);
    const todos = await getTodos();
    const todo = todos.find(todo => todo._id.equals(_id));

    expectStatus(200);
    expectResponse(todo);
    expect(todos).toHaveLength(length);
    expect(todo).toMatchObject({ name: nextName });
  });

  test('handles missing todo', async () => {
    req.params.id = 'whatever';
    req.body = { name: nextName };
    await todoApi.change(req, res);
    expectStatus(404);
    expectTextResponse('Not found');
  });

  test('handles ObjectId id', async () => {
    const newObjectId = new ObjectId('0123456789abcdef01234567');
    req.params.id = newObjectId.toString();
    req.body = { name: nextName };
    await todoApi.change(req, res);
    expectStatus(404);
    expectTextResponse('Not found')

  })

  test('handles missing body', async () => {
    req.params.id = id;
    await todoApi.change(req, res);
    expectStatus(400);
    expectResponse({ error: 'Name is missing' });
  });

  test('handles missing name in the body', async () => {
    req.params.id = id;
    req.body = {}
    await todoApi.change(req, res);
    expectStatus(400);
    expectResponse({ error: 'Name is missing' });
  });

  test('handles an empty name', async () => {
    req.params.id = id;
    req.body = { name: '' }
    await todoApi.change(req, res);
    expectStatus(400);
    expectResponse({ error: 'Name should not be empty' });
  });

  test('handles an empty name (after triming)', async () => {
    req.params.id = id;
    req.body = { name: '   ' }
    await todoApi.change(req, res);
    expectStatus(400);
    expectResponse({ error: 'Name should not be empty' })
  });

  test('handles wrong name type', async () => {
    req.params.id = id;
    req.body = { name: 42 }
    await todoApi.change(req, res);
    expectStatus(400);
    expectResponse({ error: 'Name should be a string' });
  });
})

describe('delete', () => {
  const name = 'Supper';

  test('works', async () => {
    const todo = await createTodo(name);
    const { length } = await getTodos();
    req.params.id = todo._id.toString();
    await todoApi.delete(req, res);
    const todos = await getTodos();
    expectStatus(200);
    expectResponse(todo);
    expect(todos).toHaveLength(length - 1);
  })

  test('handles missing todo', async () => {
    req.params.id = 'whatever';
    await todoApi.delete(req, res);
    expectStatus(404);
    expectTextResponse('Not found');
  });
});

describe('toggle', () => {
  const name = 'Supper';

  test('works with toggling to true', async () => {
    const { _id } = await createTodo(name, false);
    const { length } = await getTodos();
    req.params.id = _id.toString();
    req.body = { done: true };
    await todoApi.toggle(req, res);
    const todos = await getTodos();
    const todo = todos.find(todo => todo._id.equals(_id));
    expectStatus(200);
    expectResponse(todo);
    expect(todos).toHaveLength(length);
    expect(todo.done).toEqual(true);
  });

  test('works with toggling back', async () => {
    const { _id } = await createTodo(name, true);
    const { length } = await getTodos();
    req.params.id = _id.toString();
    req.body = { done: false };
    await todoApi.toggle(req, res);
    const todos = await getTodos();
    const todo = todos.find(todo => todo._id.equals(_id));
    expectStatus(200);
    expectResponse(todo);
    expect(todos).toHaveLength(length);
    expect(todo.done).toEqual(false);
  });

  test('handles missing todo', async () => {
    req.params.id = 'whatever';
    req.body = { done: true };
    await todoApi.toggle(req, res);
    expectStatus(404);
    expectTextResponse('Not found');
  });

  test('handles missing body', async () => {
    await todoApi.toggle(req, res);
    expectStatus(400);
    expectResponse({ error: 'Done is missing' });
  })

  test('handles missing done in the body', async () => {
    req.body = {}
    await todoApi.toggle(req, res);
    expectStatus(400);
    expectResponse({ error: 'Done is missing' });
  })

  test('handles wrong done type', async () => {
    req.body = { done: 42 }
    await todoApi.toggle(req, res);
    expectStatus(400);
    expectResponse({ error: 'Done should be a boolean' });
  })
});