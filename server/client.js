const { MongoClient } = require('mongodb');

// const url = 'mongodb://localhost:27017';

require('./loadEnvironment.js');

const url = process.env.ATLAS_URI || " ";

console.log(url);

const dbName = process.env.DBNAME || 'test-todos';

let client = null;

function resetClient() {
  client = null;
}

function getClient() {
  if (client === null) {
    throw new Error('Not connected to the database');
  } else {
    return client
  }
}

exports.connect = async () => {
  client = await MongoClient.connect(url);
  console.log('connect')
};

exports.getDb = () => {
  const client = getClient();
  return client.db(dbName);
}

exports.drop = async () => {
  const client = getClient();
  const db = client.db(dbName);
  await db.dropDatabase();
}

exports.disconnect = async () => {
  const client = getClient();
  await client.close();
  resetClient();
}

async function main() {
  await exports.connect();
  const db = exports.getDb();
  const collection = db.collection('todos');
  await exports.drop();
  // await collection.insertOne({ name: 'Foo106', done: false });

}

// main();