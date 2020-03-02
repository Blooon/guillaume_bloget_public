var ObjectId = require('mongodb').ObjectID;

class CommmandsModel {
    constructor(getDb, mongo) {
        this.table = "payments",
        this.setMongo(getDb);
    }

    setMongo(getDb) {
        if (!this.mongo) {
            console.log("retrying mongo connection");
            this.mongo = getDb();
            setTimeout(() => this.setMongo(getDb), 200)
        }
        else {
            console.log("mongo successfully connected");
        }
    }

    async getCommand(id) {
        const command = await this.mongo.collection('commands').findOne({
            _id: ObjectId(id)
        }).then(data => data);
        return command
    }    

    async getAllCommands() {
        const commands = await this.mongo.collection('commands').find({}).sort({date: -1}).toArray().then(data => data)
        return commands;
    }

    async addCommand(user, basket, total,user_informations) {
        try {
            const inserted = await this.mongo.collection('commands').insertOne({
                user,
                basket,
                date: Date.now(),
                total,
                status: "reserved",
                user_informations,
                paid: false
            })
            return inserted.insertedId;
        }
        catch(err) {
            console.log(err);
            throw new Error('Internal error');
        }
    }

    async updateCommand(id, update) {
        try {
            await this.mongo.collection("commands").findOneAndUpdate({
                _id: ObjectId(id),
            }, { $set: update})
        }
        catch(err) {
            console.log(err);
            throw new Error('Internal error');
        }
    }
}

module.exports = CommmandsModel