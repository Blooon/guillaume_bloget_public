import React from 'react';
import {UserContext} from '../Contexts/UserContext';

const france = ["FR"]
const euro_zone1 = ["DE", "BE", "LU", "NL"]
const euro_zone2 = ["AT", "DK", "ES", "FI", "GB", "GR", "IT", "PT", "SE", "IE"];
const euro_zone3 = ["BG", "CY", "HR", "EE", "HU", "LT", "LV", "MT", "PL", "CZ", "RO", "SK", "SI"];

function calcul_fees(item, country) {
    if (france.indexOf(country) !== -1) {
        return item.fee_france
    }
    if (euro_zone1.indexOf(country) !== -1){
        return item.fee_euro_zone1;
    }
    if (euro_zone2.indexOf(country) !== -1){
        return item.fee_euro_zone2;
    }
    if (euro_zone3.indexOf(country) !== -1){
        return item.fee_euro_zone3;
    }
    return (item.fee_world)
}

export default class Step3 extends React.Component{
    constructor(props) {
        super(props);
        let subtotal = 0;
        let fee = 0;
       
        this.props.basket.forEach((item) => subtotal += item.price * item.amount);
        const country = this.props.user_livraison ? this.props.user_livraison.country : this.props.user.country
        this.props.basket.forEach((item) => fee += item.amount * calcul_fees(item, country));

        this.state = {
            subtotal: subtotal,
            fee: fee,
            total: subtotal+fee,
            printOtherAddress: this.props.user_livraison!==null,
            user: {
                lastname: '',
                firstname: '',
                country: '',
                city: '',
                address1: '',
                address2: '',
                tel: '',
                email: '',
                postal_code: '',
            }
        }
    }

    componentDidMount() {
        this.context.updateBasket()
    }

    render() {
        let otherAddress = null; 

        const items = this.props.basket.map((item) => {

            let shop_cover = process.env.REACT_APP_S3_BUCKET_BASE_URL;
            let id = null;

            if (item.type !== undefined) {
                shop_cover += item.type.shop_cover
                id = item.type._id
            } else {
                shop_cover += item.cover
                id = item.id
            }

            return <div key={id} className="order-item w3-bar">
                <div className="w3-hide-large w3-hide-medium w3-hide-small">
                    <div className="order-item-fig w3-left w3-show-inline-block">
                        <img className="w3-image" src={shop_cover} alt={item.name}/>
                        <h1 className=""><i>{item['name_'+this.context.lang]}</i>{item['caption_'+this.context.lang]}</h1>
                    </div>
                    <div className="order-item-detail w3-right w3-show-inline-block w3-hide-large w3-hide-medium w3-hide-small">
                        <p>{item.price}€</p>
                        <p className="order-item-price">x{item.amount}</p>
                    </div>
                </div>
                <div className="w3-hide-xlarge">
                    <div className="w3-bar">
                        <h1 className="order-item-title w3-left"><i>{item['name_'+this.context.lang]}</i>{item['caption_'+this.context.lang]}</h1>
                        <p className="w3-right-align w3-right">{item.price}€</p>
                    </div>
                    <div className="w3-bar">
                        <img className="order-item-fig w3-left w3-image" src={process.env.REACT_APP_S3_BUCKET_BASE_URL + item.cover} alt={item.name}/>
                        <p className="order-item-amount w3-right-align w3-right">x{item.amount}</p>
                    </div>
                </div>
            </div>
        })

        /* Si l'adresse d'expéditon est différente de l'adresse de facturation */
        if (this.state.printOtherAddress) {
            otherAddress = <>
            <div id="Other-Address">
                <div className="order-heading">
                        <p className="">{(this.context.lang === 'fr') ? "Détails d'expédition" : "Shipping details"}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-col s6">{(this.context.lang) ? "Prénom" : "First name"}</p>
                    <p className="w3-right-align w3-right w3-col s6">{this.props.user_livraison.lastname}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-col s6">{(this.context.lang) ? "Nom" : "Last name"}</p>
                    <p className="w3-right-align w3-right w3-col s6">{this.props.user_livraison.firstname}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-col s6">{(this.context.lang) ? "Pays" : "Country"}</p>
                    <p className="w3-right-align w3-right w3-col s6">{this.props.user_livraison.country}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-col s6">{(this.context.lang) ? 'Ville' : 'Town/City'}</p>
                    <p className="w3-right-align w3-right w3-col s6">{this.props.user_livraison.city}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-col s6">{(this.context.lang) ? 'Adresse ligne 1' : 'Address line 1'}</p>
                    <p className="w3-right-align w3-right w3-col s6">{this.props.user_livraison.address1}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-col s6">{(this.context.lang) ? 'Adresse ligne 2' : 'Address line 2'}</p>
                    <p className="w3-right-align w3-right w3-col s6">{this.props.user_livraison.address2}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-col s6">{(this.context.lang) ? 'Code postal' : 'Postcode'}</p>
                    <p className="w3-right-align w3-right w3-col s6">{this.props.user_livraison.postal_code}</p>
                </div>
            </div>
            </>
        }

        return  <main id="Receipt" className="w3-row">
            <h1 id="test" className="noto w3-center w3-container">
                {(this.context.lang === 'fr') ? "Votre commande a bien été envoyée, vous recevrez un mail contenant le résumé de votre commande !" : "Your order has been placed, you will receive a mail containing the review of your order !"}
            </h1>
            <div id="Order-Form" className="billing-form w3-panel w3-col l6">
                <div className="order-heading">
                    <p className="">{(this.context.lang === 'fr') ? 'Détails de facturation' : 'Billing details'}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-col s6">{(this.context.lang) ? 'Prénom' : 'First name'}</p>
                    <p className="w3-right-align w3-right w3-col s6">{this.props.user.firstname}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-col s6">{(this.context.lang) ? 'Nom' : 'Last name'}</p>
                    <p className="w3-right-align w3-right w3-col s6">{this.props.user.lastname}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-col s6">{(this.context.lang) ? 'Pays' : 'Country'}</p>
                    <p className="w3-right-align w3-right w3-col s6">{this.props.user.country}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-col s6">{(this.context.lang) ? 'Ville' : 'Town/City'}</p>
                    <p className="w3-right-align w3-right w3-col s6">{this.props.user.city}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-col s6">{(this.context.lang) ? 'Adresse ligne 1' : 'Address line 1'}</p>
                    <p className="w3-right-align w3-right w3-col s6">{this.props.user.address1}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-col s6 l5">{(this.context.lang) ? 'Adresse ligne 2' : 'Address line 2'}</p>
                    <p className="w3-right-align w3-right w3-col s6 l7">{this.props.user.address2}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-col s6">{(this.context.lang) ? 'Code postal' : 'Postcode'}</p>
                    <p className="w3-right-align w3-right w3-col s6">{this.props.user.postal_code}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-col s6">{(this.context.lang) ? 'Téléphone' : 'Phone'}</p>
                    <p className="w3-right-align w3-right w3-col s6">{this.props.user.tel}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-col s6 l5">{(this.context.lang) ? 'Adresse mail' : 'Email Address'}</p>
                    <p className="w3-right-align w3-right w3-col s6 l7">{this.props.user.email}</p>
                </div>
                {otherAddress}
            </div>

            <div className="order-recap w3-panel w3-col l6">
                <div className="order-heading">
                    <p className="">{(this.context.lang === 'fr') ? 'Votre commande' : 'Your order'}</p>
                </div>
                {items}
                <div className="total-bar w3-bar">
                    <p className="w3-left">{(this.context.lang === 'fr') ? 'Sous-total' : 'Subtotal'}</p>
                    <p className="w3-right">{this.state.subtotal}€</p>
                </div>
                <div className="total-bar w3-bar">
                    <p className="w3-left">{(this.context.lang === 'fr') ? 'Expédition' : 'Shipping'}</p>
                    <p className="w3-right">{this.state.fee}€</p>
                </div>
                <div className="total-bar w3-bar">
                    <p className="w3-left">Total</p>
                    <p className="w3-right">{this.state.total}€</p>
                </div>

                {/* <p>{(this.state.printOtherAddress) ? this.getDeliveryTime(this.props.user_livraison.country) : this.getDeliveryTime(this.props.user.country)}</p> */}

                <div id="Delivery-Time" className="total-bar w3-bar">
                    <p>{(this.context.lang === 'fr') ? "Délai de livraison estimé entre 1 et 2 mois." : "Estimated delivery time between 1 and 2 months." }</p>
                    <p className="margin-bot">{(this.context.lang === 'fr') ? "Chaque article est individuellement produit pour la commande." : "Each product is individually made to order." }</p>
                </div>
            </div>
        </main>
    }
}
Step3.contextType = UserContext;
