const MongoClient = require('mongodb').MongoClient;

const host = process.env.MONGO_HOST;
const password = process.env.MONGO_PASSWORD;
const login = process.env.MONGO_LOGIN;
var _db = null;
const mongo = MongoClient.connect(`mongodb://${login}:${password}@${host}:27017/?authSource=admin`, function (err, client) {
    console.log(err);
    _db = client.db("guillaume");
});

const knex = require('./knex.utils');

class OnceModel {

    static async addOnce(keyvalue) {
        try {
            await _db.collection("once").insertOne({
                keyvalue,
            }).then(data => data);
        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }

    static async updateOnce(newOnce, keyvalue) {
        try {
            delete newOnce._id
            await _db.collection("once").updateOne({
                keyvalue
            }, {
                $set: newOnce
            },
            { upsert : true }).then(data => data);
        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }

    static async getOnce(keyvalue) {
        try {
            const once = await _db.collection('once').findOne({
                keyvalue
            }).then(data => data);
            return once;
        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }
}

module.exports = OnceModel
