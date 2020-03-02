const commandsModels = require('./commands.models');

function parseJson(data) {
    JSON.parse(data);
}

class CommandsUtils {
    static async addCommand(userInformations, basket, transaction_id, transaction, total, fee) {
        // Update les stocks
        // Ajouter une commande en JSON
        for (let i = 0; i < basket.items.length; i++) {
            const item = basket.items[i];
            await commandsModels.updateStockItem('item', item.id, item.amount);
        }
        for (let i = 0; i < basket.typologies.length; i++) {
            const typologie = basket.typologies[i];
            await commandsModels.updateStockTypologie('typologie', typologie.id, typologie.amount, typologie.lang);
        }
        const commandId = await commandsModels.addCommand(
            JSON.stringify(userInformations),
            JSON.stringify(basket),
            transaction_id,
            JSON.stringify(transaction),
            total,
            fee
        );
        // await res.send({ status: 200, data})

    }

    static async acceptCommand(req, res) {
        // Accept into paypal
        // Update Commande
        await res.send({ status: 200, data})
        
    }

    static async updateCommand(req, res) {
        await commandsModels.updateCommand(req.params.commandId, {
            status: req.body.status
        });
        await res.send({ status: 200, message: "Success" })
    }

    static async deleteCommand(req, res) {
        await commandsModels.updateCommand(req.params.commandId,{
            archived: 1
        })
        await res.send({ status: 200, data});

    }


    static async getCommand(req, res) {
        const data = await commandsModels.getCommand(req.params.commandId);
        data.user_information = JSON.parse(data.user_information);
        data.basket = JSON.parse(data.basket);
        await res.send({ status: 200, data})

    }

    static async getCommands(req, res) {
        let data;
        if (req.query.status) {
            data = await commandsModels.getCommandsbyStatus(req.query.status, req.query.order);
        }
        else {
            data = await commandsModels.getCommands();
        }
        data.forEach(element => {
            element.user_information = JSON.parse(element.user_information);
            element.basket = JSON.parse(element.basket);
        });
        await res.send({ status: 200, data })

    }


}

module.exports = CommandsUtils;