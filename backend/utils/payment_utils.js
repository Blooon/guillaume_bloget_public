const Stripe = require("stripe")(process.env.STRIPE_SECRET);
const express = require("express");
const CommandsModel = require("./command_model");
const calcul_fees = require("./calc_fees");
const email = require("./mail");

const generate_payment_response = intent => {
  if (
    intent.status === "requires_source_action" &&
    intent.next_action.type === "use_stripe_sdk"
  ) {
    // Tell the client to handle the action
    return {
      requires_action: true,
      payment_intent_client_secret: intent.client_secret
    };
  } else if (intent.status === "succeeded") {
    // The payment didn’t need any additional actions and completed!
    // Handle post-payment fulfillment
    return {
      success: true
    };
  } else {
    // Invalid status
    return {
      error: "Invalid PaymentIntent status"
    };
  }
};

class LivraisonHandler {
  constructor(database) {
    this.router = express.Router();
    this.mailService = email;
    this.paiement = Stripe;
    this.commandsModel = new CommandsModel(database.config);
    this.generateRouter();
  }

  generateRouter() {
    this.router.post(`/payment`, (req, res) => this.handlePaiement(req, res));
    this.router.get(`/admin/command/:commandId`, (req, res) =>
      this.getCommand(req, res)
    );
    this.router.get("/admin/commands", (req, res) =>
      this.getCommands(req, res)
    );
    this.router.put(`/admin/command/:commandId`, (req, res) =>
      this.updateCommand(req, res)
    );
  }

  async getCommand(req, res) {
    const command = await this.commandsModel.getCommand(req.params.commandId);
    await res.send({ data: command });
  }

  async getCommands(req, res) {
    const commands = await this.commandsModel.getAllCommands();
    await res.send({ data: commands });
  }

  async updateCommand(req, res) {
    await this.commandsModel.updateCommand(req.params.commandId, {
      status: req.body.status
    });
    await this.getCommand(req, res);
  }

  async chargeCustomer(user, token, amount, basket) {
    try {
      if (token.payment_intent) {
       return this.paiement.paymentIntents.confirm(token.payment_intent) 
      }
      const intent = await this.paiement.paymentIntents.create({
        amount: amount * 100,
        currency: "eur",
        payment_method: token.payment_method,
        receipt_email: user.email,
        description: "Commande typologie",
        confirmation_method: 'manual',
        confirm: true
        // metadata: JSON.stringify(basket)
      });
      return generate_payment_response(intent);
    } catch (err) {
      console.log(err);
      throw new Error("Error while processing your command");
    }
  }

  async getAllItems(basket) {
    let items;
    // for (elem of basket) {
    //     let object = await this.knex(elem.table).where({
    //         id: elem.id
    //     });
    //     let object = object[0]
    //     if (elem.count > object.amount) {
    //         throw new Error(`We can't provide this quantity ${elem.count}, max is ${object.amount}`);
    //     }
    //     elem.item = object;
    //     // items.push(elem);
    // }
    return basket;
  }

  async handlePaiement(req, res) {
    if (req.session.basket.length === 0) {
      throw new Error("Empty basket");
    }
    try {
      if (req.session.isPaying) {
        return res.send(200);
      }
      req.session.isPaying = true;
      const items = await this.getAllItems(req.session.basket);
      const user = req.body.user;
      const user_informations = req.body.user_informations;
      const total = this.calcTotal(
        req.session.basket,
        user_informations ? user_informations : user
      );
      // we first save the command, in case there is an error in paiement (so no paiment charged and nothing in db)
      const commandId = await this.commandsModel.addCommand(
        user,
        items,
        total,
        user_informations
      );
      const actionNeeded = await this.chargeCustomer(
        user,
        req.body.token,
        total,
        req.session.basket
      );
      if (actionNeeded.requires_action === true) {
        req.session.isPaying = false;
        return res.send({
          requires_action: true,
          payment_intent_client_secret: actionNeeded.payment_intent_client_secret
        });
      } else if (actionNeeded.error) {
        throw new Error("Invalid PaymentIntent status");
      }
      // set the command as paid
      await this.commandsModel.updateCommand(commandId, { paid: true });
      await this.mailService.sendNotifMail();
      delete req.session.basket;
      req.session.isPaying = false;
      return res.send({ status: "ok" });
    } catch (err) {
      console.log(err);
      req.session.isPaying = false;
      return res
        .status(500)
        .send({ message: "Error while processing your command" });
    }
  }

  calcTotal(basket, user) {
    let total = 0;
    for (let elem of basket) {
      const fee = calcul_fees(elem, user.country);
      elem.fee = fee;
      total += elem.amount * (parseFloat(elem.price) + parseFloat(fee));
    }
    console.log(total);
    return total;
  }

  async renderResponse(data, res) {
    await res.send({ status: 200, data });
  }
}

module.exports = LivraisonHandler;
