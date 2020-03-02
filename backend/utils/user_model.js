const property = [
    "username"
]

class mongoModel {
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

    async add(params) {
        try {
            const user = await this.mongo.collection('users').insertOne({
                username: params.username,
                email: params.email,
                password: this.knex.raw(`MD5('${params.password}')`)
            });
            return user._id;
        }
        catch(err) {
            console.log(err);
            throw new Error("Internal Serveur erreur")
        }
    }

    // async update(params, id) {
    //     try {
    //         const id = await this.mongo.collection('users').update({
    //             username: params.username,
    //             email: params.email,
    //             password: this.knex.raw(`MD5('${params.password}')`)
    //         }).where({
    //             id
    //         }).returning('id');
    //         const user = await this.get({ id });
    //         return user[0];
    //     }
    //     catch(err) {
    //         console.log(err);
    //         throw new Error("Internal Serveur erreur")
    //     }
    // }

    // async delete(id) {
    //     try {
    //         await this.knex('users').where({
    //             id
    //         }).delete();
    //     }
    //     catch(err) {
    //         console.log(err);
    //         throw new Error("Internal Serveur erreur")
    //     }
    //     return id;
    // }

    async get(params) {
        try {
            const user = await this.mongo.collection('users').find({}).toArray().then(docs => docs);
            return user
        }
        catch(err) {
            console.log(err)
            throw new Error("Internal Serveur erreur")
        }
    }

    
}

module.exports = mongoModel