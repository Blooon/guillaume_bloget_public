import React from "react";
import { UserContext } from "../Contexts/UserContext";
import requestUtils from "../Utils/request.utils";
import Countries from "./Countries.react";

const france = ["FR"];
const euro_zone1 = ["DE", "BE", "LU", "NL"];
const euro_zone2 = ["AT", "DK", "ES", "FI", "GB", "GR", "IT", "PT", "SE", "IE"];
const euro_zone3 = [
  "BG",
  "CY",
  "HR",
  "EE",
  "HU",
  "LT",
  "LV",
  "MT",
  "PL",
  "CZ",
  "RO",
  "SK",
  "SI"
];

function calcul_fees(item, country) {
  if (france.indexOf(country) !== -1) {
    return item.fee_france;
  }
  if (euro_zone1.indexOf(country) !== -1) {
    return item.fee_euro_zone1;
  }
  if (euro_zone2.indexOf(country) !== -1) {
    return item.fee_euro_zone2;
  }
  if (euro_zone3.indexOf(country) !== -1) {
    return item.fee_euro_zone3;
  }
  return item.fee_world;
}

class SimpleEntry extends React.Component {
  render() {
    return (
      <div className="order-bar w3-row">
        <label className="w3-col s6">
          {this.context.lang === "fr" ? this.props.fr : this.props.en}
        </label>
        <input
          className="w3-right w3-col s6 w3-input"
          type="text"
          value={this.context.user[this.props.entry]}
          name={this.props.name}
          onChange={this.props.onChange}
          required={this.props.required}
          autoFocus={this.props.autofocus}
        />
      </div>
    );
  }
}
SimpleEntry.contextType = UserContext;

export default class Step2 extends React.Component {
  constructor(props) {
    super(props);
    let subtotal = 0;
    let fee = 0;

    this.props.basket.forEach(item => (subtotal += item.price * item.amount));

    const items = [];
    this.props.basket.forEach(item =>
      items.push({
        name: item.name,
        price: item.price,
        description: item.description,
        quantity: item.amount,
        fee_france: item.fee_france,
        fee_euro_zone1: item.fee_euro_zone1,
        fee_euro_zone2: item.fee_euro_zone2,
        fee_euro_zone3: item.fee_euro_zone3,
        fee_world: item.fee_world,
        currency: "EUR"
      })
    );

    this.state = {
      token: null,
      subtotal: subtotal,
      total: subtotal + fee,
      fee: fee,
      items,
      printOtherAddress: false,
      user: {
        lastname: "",
        firstname: "",
        country: "",
        city: "",
        address1: "",
        address2: "",
        tel: "",
        email: "",
        postal_code: ""
      },
      user_livraison: {
        lastname: "",
        firstname: "",
        country: "",
        city: "",
        address1: "",
        address2: "",
        postal_code: ""
      },
      placing_order: false
    };
  }

  handleAction = (response, stripe) => {
    return stripe
      .handleCardAction(response.payment_intent_client_secret)
      .then((result) => {
        console.log({handleaction: result})
        if (result.error) {
            // Inform the customer that there was an error.
            var errorElement = document.getElementById("card-errors");
            errorElement.textContent = result.error.message;
            this.setState({ placing_order: false });
          } else {
            // Send the token to your server.
            this.sendToServer({payment_intent: result.paymentIntent.id}, {});
          }
      });
  }

  sendToServer = async (token, stripe) => {
    try {
      console.log(token)
      const responseBody = await requestUtils.post("/payment", {
        token,
        user: this.state.user,
        user_livraison: this.state.printOtherAddress
          ? this.state.user_livraison
          : null
      });
      console.log('here', responseBody)
      if (responseBody.requires_action) {
        console.log("meh nan pas ici")
        return this.handleAction(responseBody, stripe);
      }
      console.log("here2")
      this.props.setValidatedBasket(
        this.props.basket,
        this.state.user,
        this.state.printOtherAddress ? this.state.user_livraison : null
      );
    } catch (err) {
      console.log(err)
      console.log(err.message);
      this.setState({
        error: err.message[this.state.lang === "fr" ? "fr" : "en"]
      });
      setTimeout(
        () => this.setState({ error: null, placing_order: false }),
        3000
      );
    }
  };

  componentDidMount() {
    var fontSize = "19px";
    if (window.innerWidth > 1920) {
      fontSize = "32px";
    }
    const stripe = window.Stripe(process.env.REACT_APP_STRIPE_PUBLISHABLE);

    var options = {
      locale: this.context.lang
    };
    const elements = stripe.elements(options);
    var style = {
      base: {
        fontSize: fontSize,
        color: "#32325d",
        src: "fonts/NeueHaasUnicaW06-MediumRegular.ttf"
      }
    };

    // Create an instance of the card Element.
    var card = elements.create("card", { style: style });

    // Add an instance of the card Element into the `card-element` <div>.
    card.mount("#card-element");
    card.addEventListener("change", event => {
      var displayError = document.getElementById("card-errors");
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = "";
      }
    });
    var form = document.getElementById("payment-form");
    form.addEventListener("submit", event => {
      event.preventDefault();
      this.setState({ placing_order: true });
      stripe
        .createPaymentMethod('card', card)
        .then(result => {
          console.log({result})
          if (result.error) {
            // Inform the customer that there was an error.
            var errorElement = document.getElementById("card-errors");
            errorElement.textContent = result.error.message;
            this.setState({ placing_order: false });
          } else {
            // Send the token to your server.
            var form = document.getElementById("payment-form");
            var hiddenInput = document.createElement("input");
            hiddenInput.setAttribute("type", "hidden");
            hiddenInput.setAttribute("name", "stripeToken");
            hiddenInput.setAttribute("value", result.paymentMethod.id);
            form.appendChild(hiddenInput);
            console.log({beoresendind: result})
            this.sendToServer({payment_method: result.paymentMethod.id}, stripe);
          }
        });
    });
  }

  calc_fees = bool => {
    if (bool) {
      const fee = calcul_fees(
        this.state.items,
        this.state.user_livraison.country
      );
      const total = this.state.subtotal + fee;
      this.setState({ fee, total });
    } else {
      const fee = calcul_fees(this.state.items, this.state.user.country);
      const total = this.state.subtotal + fee;
      this.setState({ fee, total });
    }
  };

  onChange = event => {
    const user = this.state.user;
    user[event.target.name] = event.target.value;
    // if (event.target.name === 'country') {
    //     const fee = PaiementUtils.getFees(this.state.items);
    //     const total = this.state.subtotal + fee;
    //     this.setState({ total });
    // }
    this.setState({ user });
  };

  onChangeLivraison = event => {
    const user_livraison = this.state.user_livraison;
    user_livraison[event.target.name] = event.target.value;
    // if (event.target.name === 'country') {
    //     const fee = PaiementUtils.getFees(this.state.items);
    //     const total = this.state.subtotal + fee;
    //     this.setState({ fee, total });
    // }
    this.setState({ user_livraison });
  };

  render() {
    let otherAddress = null;
    let fee = 0;
    if (this.state.user.country || this.state.user_livraison.country) {
      fee = this.state.items.reduce((value, item) => {
        return (
          value +
          item.quantity *
            calcul_fees(
              item,
              this.state.printOtherAddress
                ? this.state.user_livraison.country
                : this.state.user.country
            )
        );
      }, 0);
      fee = parseFloat(fee);
    }
    const items = this.props.basket.map(item => {
      let shop_cover = process.env.REACT_APP_S3_BUCKET_BASE_URL;
      let id = null;

      if (item.type !== undefined) {
        shop_cover += item.type.shop_cover;
        id = item.type._id;
      } else {
        shop_cover += item.cover;
        id = item.id;
      }

      return (
        <div key={id} className="order-item w3-bar">
          <div className="w3-hide-large w3-hide-medium w3-hide-small">
            <div className="order-item-fig w3-left w3-show-inline-block">
              <img className="w3-image" src={shop_cover} alt={item.name} />
              <h1 className="">
                <i>{item["name_" + this.context.lang]}</i>
              </h1>
            </div>
            <div className="order-item-detail w3-right w3-show-inline-block">
              <p>{item.price}€</p>
              <p className="order-item-price">x{item.amount}</p>
            </div>
          </div>
          <div className="w3-hide-xlarge">
            <div className="w3-bar">
              <h1 className="order-item-title w3-left">
                <i>{item["name_" + this.context.lang]}</i>
              </h1>
              <p className="w3-right-align w3-right">{item.price}€</p>
            </div>
            <div className="w3-bar">
              <img
                className="order-item-fig w3-left w3-image"
                src={process.env.REACT_APP_S3_BUCKET_BASE_URL + item.cover}
                alt={item.name}
              />
              <p className="order-item-amount w3-right-align w3-right">
                x{item.amount}
              </p>
            </div>
          </div>
        </div>
      );
    });

    if (this.state.printOtherAddress) {
      otherAddress = (
        <>
          <div id="Other-Address">
            <div className="order-heading">
              <p className="">
                {this.context.lang === "fr"
                  ? "Détails d'expédition"
                  : "Shipping details"}
              </p>
            </div>
            <SimpleEntry
              onChange={this.onChangeLivraison}
              fr="Prénom"
              en="First name"
              required={true}
              name="firstname"
              entry="firstname"
              autofocus={true}
            />
            <SimpleEntry
              onChange={this.onChangeLivraison}
              fr="Nom"
              en="Last name"
              required={true}
              name="lastname"
              entry="lastname"
              autofocus={false}
            />
            <Countries
              onChange={this.onChangeLivraison}
              fr="Pays"
              en="Country"
              required={true}
              name="country"
              entry="country"
              autofocus={false}
            />
            <SimpleEntry
              onChange={this.onChangeLivraison}
              fr="Ville"
              en="Town/City"
              required={true}
              name="city"
              entry="city"
              autofocus={false}
            />
            <SimpleEntry
              onChange={this.onChangeLivraison}
              fr="Adresse ligne 1"
              en="Address line 1"
              required={true}
              name="address1"
              entry="address1"
              autofocus={false}
            />
            <SimpleEntry
              onChange={this.onChangeLivraison}
              fr="Adresse ligne 2"
              en="Address line 2"
              required={false}
              name="address2"
              entry="address2"
              autofocus={false}
            />
            <SimpleEntry
              onChange={this.onChangeLivraison}
              fr="Code postal"
              en="Postcode"
              required={true}
              name="postal_code"
              entry="postal_code"
              autofocus={false}
            />
          </div>
        </>
      );
    }

    return (
      <>
        <main id="Order" className="w3-row">
          <div className="noto w3-center">{this.state.error}</div>

          <form
            action="/charge"
            method="post"
            id="payment-form"
            autoComplete="on"
          >
            <div className="billing-form w3-panel w3-col l6">
              <div className="order-heading">
                <p className="">
                  {this.context.lang === "fr"
                    ? "Détails de facturation"
                    : "Billing details"}
                </p>
              </div>
              <SimpleEntry
                onChange={this.onChange}
                fr="Prénom"
                en="First name"
                name="firstname"
                entry="firstname"
                required={true}
                autofocus={true}
              />
              <SimpleEntry
                onChange={this.onChange}
                fr="Nom"
                en="Last name"
                name="lastname"
                entry="lastname"
                required={true}
                autofocus={false}
              />
              <Countries
                onChange={this.onChange}
                fr="Pays"
                en="Country"
                name="country"
                entry="country"
                required={true}
                autofocus={false}
              />
              <SimpleEntry
                onChange={this.onChange}
                fr="Ville"
                en="Town/City"
                name="city"
                entry="city"
                required={true}
                autofocus={false}
              />
              <SimpleEntry
                onChange={this.onChange}
                fr="Adresse ligne 1"
                en="Address line 1"
                name="address1"
                entry="address1"
                required={true}
                autofocus={false}
              />
              <SimpleEntry
                onChange={this.onChange}
                fr="Adresse ligne 2"
                en="Address line 2"
                name="address2"
                entry="address2"
                required={false}
                autofocus={false}
              />
              <SimpleEntry
                onChange={this.onChange}
                fr="Code postal"
                en="Postcode"
                name="postal_code"
                entry="postal_code"
                required={true}
                autofocus={false}
              />
              <SimpleEntry
                onChange={this.onChange}
                fr="Téléphone"
                en="Phone"
                name="tel"
                entry="tel"
                required={true}
                autofocus={false}
              />
              <SimpleEntry
                onChange={this.onChange}
                fr="Adresse mail"
                en="Email Address"
                name="email"
                entry="email"
                required={true}
                autofocus={false}
              />

              <div
                className={
                  "order-other-address " +
                  (this.state.printOtherAddress ? "border-bottom" : null)
                }
              >
                {/* <input className="" onClick={() => {this.setState({ printOtherAddress: !this.state.printOtherAddress}); this.calc_fees(!this.state.printOtherAddress)}} type="button" name="other-address" value={(this.context.lang === 'fr') ? "Livraison à une autre adresse ?" : "Deliver to a different address ?"}/>*/}
                <input
                  className=""
                  onClick={() => {
                    this.setState({
                      printOtherAddress: !this.state.printOtherAddress
                    });
                  }}
                  type="button"
                  name="other-address"
                  value={
                    this.context.lang === "fr"
                      ? "Livraison à une autre adresse ?"
                      : "Deliver to a different address ?"
                  }
                />
              </div>
              {otherAddress}
            </div>
            <div className="order-recap w3-panel w3-col l6">
              <div className="order-heading">
                <p className="">
                  {this.context.lang === "fr" ? "Votre commande" : "Your order"}
                </p>
              </div>
              {items}
              <div className="total-bar w3-bar">
                <p className="w3-left">
                  {this.context.lang === "fr" ? "Sous-total" : "Subtotal"}
                </p>
                <p className="w3-right">{this.state.subtotal}€</p>
              </div>
              <div className="total-bar w3-bar">
                <p className="w3-left">
                  {this.context.lang === "fr" ? "Expédition" : "Shipping"}
                </p>
                <p className="w3-right">{fee}€</p>
              </div>
              <div className="total-bar w3-bar">
                <p className="w3-left">Total</p>
                <p className="w3-right">{this.state.subtotal + fee}€</p>
              </div>

              {/* <p>{(this.state.printOtherAddress) ? PaiementUtils.getDeliveryTime(this.state.user_livraison.country) : PaiementUtils.getDeliveryTime(this.state.user.country)}</p> */}

              <div id="Delivery-Time" className="total-bar w3-bar">
                <p>
                  {this.context.lang === "fr"
                    ? "Délai de livraison estimé entre 1 et 2 mois."
                    : "Estimated delivery time between 1 and 2 months."}
                </p>
                <p className="margin-bot">
                  {this.context.lang === "fr"
                    ? "Chaque article est individuellement produit pour la commande."
                    : "Each product is individually made to order."}
                </p>
              </div>

              {/* Finalizing order button */}

              <div className="payment-heading total-bar">
                <p>
                  <label htmlFor="card-element">
                    {this.context.lang === "fr"
                      ? "Carte de crédit"
                      : "Credit card"}
                  </label>
                </p>
              </div>
              <div className="total-bar card-input">
                <div id="card-element"></div>
                <div id="card-errors" role="alert"></div>
              </div>
              <div className="order-cgv border-top-0">
                <p className="">
                  {this.context.lang === "fr"
                    ? "En passant votre commande, vous acceptez les "
                    : "By placing your order, you agree to the "}
                  <a href="/legalnotices#CGV">
                    {this.context.lang === "fr"
                      ? "Conditions Générales de Vente"
                      : "terms and conditions"}
                  </a>
                  {this.context.lang === "fr"
                    ? " de Guillaume Bloget Industrial Design."
                    : " of Guillaume Bloget Industial Design."}
                </p>
              </div>
              <button
                className={
                  "order-button w3-right w3-padding-16" +
                  (this.state.placing_order ? " disabled" : "")
                }
                value="submit"
                disabled={this.state.placing_order}
              >
                {!this.state.placing_order
                  ? this.context.lang === "fr"
                    ? "Commander"
                    : "Place order"
                  : this.context.lang === "fr"
                  ? "Commande en cours..."
                  : "Placing order..."}
              </button>
            </div>
          </form>
        </main>
        <button
          className="back-button w3-left"
          onClick={() => this.props.setStep(-1)}
        >
          {this.context.lang === "fr" ? "Retour" : "Return"}
        </button>
      </>
    );
  }
}

Step2.contextType = UserContext;
