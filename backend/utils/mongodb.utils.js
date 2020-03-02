const MongoClient = require('mongodb').MongoClient;

const host = process.env.MONGO_HOST;
const password = process.env.MONGO_PASSWORD;
const login = process.env.MONGO_LOGIN;
var _db = null;
function getDb() { return _db; }
const client = new MongoClient.connect(`mongodb://${login}:${password}@${host}:27017/guillaume?authSource=admin`, async function (err, client) {
    _db = client.db("guillaume");
    await _db.collection('users').insertOne({ login: 'admin', password: "1234" });
});
module.exports = getDb;
