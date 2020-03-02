const stripe = require("stripe")(process.env.STRIPE_SECRET);
const mongo = require('./mongo_model');
const email = require('./mail')

setMongo();

module.exports = class Paiement {
    
}