// const knex = require('./knex.utils');

class DatabaseModel {
    constructor(knex) {
        this.knex = knex;
    }
    async getItem(table, itemId) {
        let item;
        try {
            item = await this.knex(table).where({
                id: itemId,
                archived: 0
            });
            item.id = item._id;
        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
        if (item.length === 0) {
            throw new Error('No such elem');
        }
        return item[0];
    }

    async getItems(table) {
        try {
            const items = await this.knex(table).where({
                archived: 0
            });
            items.forEach(item => item.id = id._id)
            return items;
        }
        catch (err) {
            console.log(err);
            throw new Error("Intenal Error");
        }
    }
    
    async addItem(table, body) {
        try {
            body.archived = 0;
            body.date = this.knex.fn.now();
            const itemId = await this.knex(table).insert(body).returning('id');
            return itemId;
        }
        catch (err) {
            console.log(err);
            throw new Error("Intenal Error");
        }
    }

    async updateItem(table, body, itemId) {
        try {
            body.date=this.knex.fn.now();
            await this.knex(table).update(body).where({
                id: itemId
            });
        }
        catch (err) {
            console.log(err);
            throw new Error("Intenal Error");
        }
    }

    async deleteItem(table, itemId) {
        try {

            await this.knex(table).update({
                archived: 1
            }).where({
                id: itemId
            });
        }
        catch (err) {
            console.log(err);
            throw new Error("Intenal Error");
        }
    }

    async getFilesAssociatedToItem(table, itemId) {
        try {
            const files = await this.knex('files').where({
                table_name: table,
                item_id: itemId,
                archived: 0
            }).orderBy('ordered');
            return files;
        }
        catch(err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }

    async addFileToItem(table, itemId, filename, ordered) {
        try {
            await this.knex('files').insert({
                table_name: table,
                item_id: itemId,
                filename,
                ordered,
                date: this.knex.fn.now(),
                archived: 0,
            });
        }
        catch(err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }

    async deleteFileAssociatedToItem(table, fileId) {
        try {
            await this.knex('files').update({
                archived: 1
            }).where({
                id: fileId,
                table_name: table,
            });
        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }

    async getImagesAssociatedToItem(table, itemId) {
        try {
            const files = await this.knex('images').where({
                table_name: table,
                item_id: itemId,
                archived: 0
            }).orderBy('ordered');
            return files;
        }
        catch(err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }

    async addImagesToItem(table, itemId, small, medium, large, ordered) {
        try {
            await this.knex('images').insert({
                table_name: table,
                item_id: itemId,
                small,
                medium,
                large,
                ordered,
                archived: 0
            });
        }
        catch(err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }

    async updateImageOrder(table, imageId, newValue) {
        try {
            await this.knex('images')
            .where({
                id: imageId,
                table_name: table,
            })
            .update({
                ordered: newValue
            })
        }
        catch(err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }

    async deleteImagesAssociatedToItem(table, imagesId) {
        try {
            await this.knex('images').update({
                archived: 1
            }).where({
                id: imagesId,
                table_name: table,
            });
        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }


    async getType(typeId) {
        try {
            const type = await this.knex('types').where({
                id: typeId,
            });
            return type[0];
        }
        catch(err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }

    async getTypesAssociatedToItem(table, itemId) {
        try {
            const files = await this.knex('types').where({
                table_name: table,
                item_id: itemId,
            });
            files.forEach(file => {

                const params = JSON.parse(file.value);
                file = Object.assign(file, params);
            })
            return files;
        }
        catch(err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }

    async updateTypesOrder(table, typeId, newValue) {
        try {
            await this.knex('types')
            .where({
                id: typeId,
                table_name: table,
            })
            .update({
                ordered: newValue
            })
        }
        catch(err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }


    async addTypeToItem(table_name, itemId, values) {
        try {
            await this.knex('types').insert({
                table_name,
                item_id: itemId,
                value: JSON.stringify(values)
            });
        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }

    async removeTypefromItem(table_name, itemId, id) {
        try {
            await this.knex('types').where({
                id,
                table_name,
                item_id: itemId,
            }).delete();
        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }

}

module.exports = DatabaseModel