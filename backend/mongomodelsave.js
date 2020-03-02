var ObjectId = require('mongodb').ObjectID;

module.exports = class MongoModel {
    constructor(getDb, table) {
        this.table = table;
        this.setMongo(getDb)
    }

    setMongo(getDb) {
        if (!this.mongo) {
            console.log("retrying");
            this.mongo = getDb();
            setTimeout(() => this.setMongo(getDb), 200)
        }
    }

    async getItem(table, itemId) {
        try {
            const item = await this.mongo.collection(this.table).findOne({
                _id: ObjectId(itemId)
            }).then(doc => doc);
            if (!item) return null
            item.id = item._id
            return item
        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }
    async getItems(table) {
        try {
            const items = await this.mongo.collection(this.table).find({}).toArray().then(docs => docs)
            items.forEach(item => item.id = item._id)
            return items
        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }
    async addItem(table, body) {
        try {
            const result = await this.mongo.collection(this.table).insertOne(body).then(data => data);
            console.log(result);
            return result.ops[0]._id

        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }
    async updateItem(table, body, itemId) {
        try {
            delete body.types
            delete body._id
            const ret = await this.mongo.collection(this.table)
                .findOneAndUpdate(
                { _id: ObjectId(itemId)},
                { $set: body}
            ).then(doc => doc);
            return ret;
        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }
    async deleteItem(table, itemId) {
        try {
            await this.mongo.collection(this.table).deleteOne({
                _id: ObjectId(itemId)
            })
        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }
    async getFilesAssociatedToItem(table, itemId) {updateOne
        try {
            const ret = this.mongo.collection("file").find({
            }).then(doc => doc);
            return ret
        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }
    async addFileToItem(table, itemId, filename, ordered) {
        try {
            const result = await this.mongo.collection(this.table).insertOne({
                tableName: this.table,
                itemId,
                filename,
                ordered,
                ...body
            }).then(data => data);
            return result;
        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }
    async deleteFileAssociatedToItem(table, fileId) {
        try {
            // await this.mongo.collection(this)
        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }
    async getImagesAssociatedToItem(table, itemId) {
        try {
            const imgs = await this.mongo.collection("images").findOne({
                tableName: this.table,
                itemId,
            }).then(doc => doc);
            return imgs
        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }
    async addImagesToItem(table, itemId, small, medium, large, ordered) {
        try {
            const inserted = await this.mongo.collection("images").insertOne({
                tableName: this.table,
                itemId,
                small,
                medium,
                large,
                ordered
            })
        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }
    async updateImageOrder(table, imageId, newValue) {
        try {
            await this.mongo.collection("images").findAndModify({
                query: { tableName: table, _id: ObjectId(imageId) },
                update:{ ordered: newValue }
            })
        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }
    async deleteImagesAssociatedToItem(table, imagesId) {
        try {
            await this.mongo.collection("images").deleteOne({
                tableName: this.table,
                _id: ObjectId(imagesId)
            })
        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }
    async getType(typeId) {
        try {
            const type = await this.mongo.collection("types").findOne({
                _id: ObjectId(typeId)
            }).then(doc => doc);
            return type
        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }
    async getTypesAssociatedToItem(table, itemId) {
        try {
            const types = await this.mongo.collection("types").find({itemId}).toArray().then(doc => doc)
            return types
        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }
    async updateTypesOrder(table, typeId, newValue) {
        try {
            await this.mongo.collection('types').findAndModify({
                query: { tableName: this.table, typeId },
                update: { ordered: newValue }
            }).then(doc => doc);
        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }
    async addTypeToItem(tableName, itemId, values) {
        try {
            const item = await this.mongo.collection("types").insertOne({
                tableName,
                itemId,
                ...values
            }).then(doc => doc);
            return item
        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }
    async removeTypefromItem(tableName, itemId, id) {
        try {
            await this.mongo.collection("types").deleteOne({
                tableName,
                itemId,
                _id: ObjectId(id)
            });
        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }
}