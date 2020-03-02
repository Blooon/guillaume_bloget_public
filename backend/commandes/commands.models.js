const knex = require('../utils/knex.utils');

class commandModels {
    static async addCommand(userInformations, basket, transactionId, transaction, price, fee) {
        try {
            const commandId = await knex('commands').insert({
                user_information: userInformations,
                basket,
                status: 'reserved',
                transaction_id: transactionId,
                transaction,
                price,
                fee,
                date: knex.fn.now(),
                archived: 0
            }).returning('id');
            return commandId;
        }
        catch(err) {
            console.log(err);
            throw new Error('Internal Error')
        }
    }

    static async updateCommand(commandId, updateObject) {
        try {
            await knex('commands').update(updateObject).where({
                id: commandId
            })
        }
        catch(err) {
            console.log(err);
            throw new Error('Internal Error');
        }
    }

    static async getCommand(commandId) {
       try {
            const command = await knex('commands').where({
                id: commandId
            });
            return command[0];
       } 
       catch(err) {
            console.log(err);
            throw new Error('Internal Error');
        }
    }

    static async getCommands() {
        try {
             const commands = await knex('commands');
             return commands;
        } 
        catch(err) {
             console.log(err);
             throw new Error('Internal Error');
         }
     }
     static async getCommandsbyStatus(status, order) {
        try {
             const commands = await knex('commands').where({
                 status
             }).orderBy(order);
             return commands;
        } 
        catch(err) {
             console.log(err);
             throw new Error('Internal Error');
         }
     }

     static async updateStockItem(table, id, amount) {
        try {
           await knex(table)
               .decrement('stock', amount)
               .where({ id});

        }
        catch(err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    } 
    
    static async updateStockTypologie(table, id, amount, langage) {
        try {
           await knex(table)
               .decrement(`stock${langage}`, amount)
               .where({ id});
        }
        catch(err) {
            console.log(err);
            throw new Error("Inteal Error");
        }
    }
}

module.exports = commandModels;