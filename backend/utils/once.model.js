const knex = require('./knex.utils');

class OnceModel {
    

    static async addOnce(newOnce, keyvalue) {
        try {
            await knex("once").insert({
                keyvalue,
                data: newOnce
            });
        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }

    static async updateOnce(newOnce, keyvalue) {
        try {
            await knex("once").where({
                keyvalue
            }).update({
                data: newOnce
            });
        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }

    static async getOnce(keyvalue) {
        try {
            const once = await knex('once').where({
                keyvalue
            });
            return once[0]
        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }
}

module.exports = OnceModel