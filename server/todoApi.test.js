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


beforeEach(() => {
  req = {
    params: {}
  }
  res = {
    json: jest.fn(),
    send: jest.fn(),
    status: jest.fn(),
  };
}
)

describe('list', () => {
  test('works', () => {
    // const req = {}
    // const res = {
    //   json: jest.fn(),
    //   send: jest.fn(),
    //   status: jest.fn(),
    // };

    todoApi.list(req, res);

    const todos = todoApi.getTodos();

    expectStatus(200);
    expectResponse(todos);

  })
})

describe('create', () => {
  test('works', () => {
    const name = 'Supper';
    const { length } = todoApi.getTodos();

    req.body = { name }
    todoApi.create(req, res);
    const todos = todoApi.getTodos();

    expectStatus(200);
    expectResponse(todos[todos.length - 1]);
    expect(todos).toHaveLength(length + 1);
    expect(todos[todos.length - 1]).toMatchObject({
      name,
      done: false
    });
    expect(new Set(todos.map(todo => todo.id)).size).toEqual(todos.length);
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

  test('works', () => {
    todoApi.addTodo(todoApi.createTodo(name, id));
    const { length } = todoApi.getTodos();
    req.params.id = id;
    req.body = { name: nextName };
    todoApi.change(req, res);
    const todos = todoApi.getTodos();
    const todo = todos.find(todo => todo.id === id);
    expectStatus(200);
    expectResponse(todo);
    expect(todos).toHaveLength(length);
    expect(todo).toMatchObject({ name: nextName });
  });

  test('handles missing todo', () => {
    req.params.id = 'whatever';
    req.body = { name: nextName };
    todoApi.change(req, res);
    expectStatus(404);
    expectTextResponse('Not found');
  });

  test('handles missing body', () => {
    req.params.id = id;
    todoApi.change(req, res);
    expectStatus(400);
    expectResponse({ error: 'Name is missing' });
  });

  test('handles missing name in the body', () => {
    req.params.id = id;
    req.body = {}
    todoApi.change(req, res);
    expectStatus(400);
    expectResponse({ error: 'Name is missing' });
  });

  test('handles an empty name', () => {
    req.params.id = id;
    req.body = { name: '' }
    todoApi.change(req, res);
    expectStatus(400);
    expectResponse({ error: 'Name should not be empty' });
  });

  test('handles an empty name (after triming)', () => {
    req.params.id = id;
    req.body = { name: '   ' }
    todoApi.change(req, res);
    expectStatus(400);
    expectResponse({ error: 'Name should not be empty' })
  });

  test('handles wrong name type', () => {
    req.params.id = id;
    req.body = { name: 42 }
    todoApi.change(req, res);
    expectStatus(400);
    expectResponse({ error: 'Name should be a string' });
  });
})

describe('delete', () => {
  const id = 42;

  test('works', () => {
    todoApi.addTodo(todoApi.createTodo('Supper', id));
    const { length } = todoApi.getTodos();
    const todo = todoApi.getTodos().find(todo => todo.id === id);
    req.params.id = id;
    todoApi.delete(req, res);
    const todos = todoApi.getTodos();
    expectStatus(200);
    expectResponse(todo);
    expect(todos).toHaveLength(length - 1);
  })

  test('handles missing todo', () => {
    req.params.id = 'whatever';
    todoApi.delete(req, res);
    expectStatus(404);
    expectTextResponse('Not found');
  });
});

describe('toggle', () => {
  const id = 42;

  test('works', () => {
    todoApi.addTodo(todoApi.createTodo('Supper', id));
    const { length } = todoApi.getTodos();
    req.params.id = id;
    todoApi.toggle(req, res);
    const todos = todoApi.getTodos();
    const todo = todoApi.getTodos().find(todo => todo.id === id);
    expectStatus(200);
    expectResponse(todo);
    expect(todos).toHaveLength(length);
    expect(todo.done).toEqual(true);
  });

  test('works with toggling back', () => {
    todoApi.addTodo(todoApi.createTodo('Supper', id, true));
    const { length } = todoApi.getTodos();
    req.params.id = id;
    todoApi.toggle(req, res);
    const todos = todoApi.getTodos();
    const todo = todoApi.getTodos().find(todo => todo.id === id);
    expectStatus(200);
    expectResponse(todo);
    expect(todos).toHaveLength(length);
    expect(todo.done).toEqual(false);
  });

  test('handles missing todo', () => {
    req.params.id = 'whatever';
    todoApi.toggle(req, res);
    expectStatus(404);
    expectTextResponse('Not found');
  });
});