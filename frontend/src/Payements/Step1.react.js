import React from 'react';
import {UserContext} from '../Contexts/UserContext'

export default class Step1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            random: true,
            update: false
        }
    }

    onItemChange = async (event, item) => {
        item.amount = event.target.value;
   
        this.context.addToBasket(item.table, item.id, (event.target.value.length > 0) ? parseInt(event.target.value): 0, (item.type)?item.type._id: null);
        this.setState({update: !this.state.update})
    }

    changeStep = async () => {
        let nbItems= 0;
        this.context.basket.forEach((item) => nbItems += item.amount);
        if (nbItems === 0) {
            return this.setState({ error: (this.context.lang === 'fr') ? 'Votre panier est vide' : 'Your shopping cart is empty'})
        }
        this.props.setStep(1);
    }

    removeItem = async (item) => {
        this.context.removeFromBasket(item.table, item.id, (item.type) ? item.type.id: null);
    }

    isEmpty = () => {
        let nbItems= 0;
        this.context.basket.forEach((item) => nbItems += item.count);
        if (nbItems === 0) {
            // eslint-disable-next-line
            this.state.error = (this.context.lang === 'fr') ? 'Votre panier est vide' : 'Your shopping cart is empty'
        } else {
            // eslint-disable-next-line
            this.state.error = null
        }
    }

    render() {
        let total = 0;
        this.isEmpty();
        const items = this.context.basket.map((item) => {
            total += item.amount * item.price

            let shop_cover = process.env.REACT_APP_S3_BUCKET_BASE_URL;
            let id = null;

            if (item.type !== undefined) {
                shop_cover += item.type.shop_cover
                id = item.type._id
            } else if (item.shop_cover !== undefined) {
                shop_cover += item.cover
                id = item.id
            }

            return <tr key={id} className="basket-row">
                <td className="basket-product">
                    <button onClick={(e) => this.removeItem(item)} className="remove-button w3-display-container w3-hide-small w3-hide-medium">
                        <img src={process.env.REACT_APP_S3_BUCKET_BASE_URL + "pictos/TYPOLOGIE_CROIX_RESPONSIVE_28x28px.svg"} alt="del"/>
                    </button>
                    <div className="basket-item w3-show-inline-block w3-display-container">
                        <img className="item-sticker w3-image" src={shop_cover} alt={item.name}/>
                        <button onClick={(e) => this.removeItem(item)} className="remove-button w3-display-container w3-display-left w3-hide-large w3-hide-xlarge">
                            <img src={process.env.REACT_APP_S3_BUCKET_BASE_URL + "pictos/TYPOLOGIE_CROIX_RESPONSIVE_28x28px.svg"} alt="del"/>
                        </button>
                        <h1 className="basket-description w3-hide-small w3-hide-medium"><i>{item['name_'+this.context.lang]}</i></h1>
                    </div>
                    <h1 className="basket-description w3-hide-xlarge w3-hide-large"><i>{item['name_'+this.context.lang]}</i></h1>
                </td>
                <td className="basket-quantity">
                    <input className="w3-bar-item w3-border" type="number" min="0" max="99" maxLength="2" size="2" name="Quantité" value={item.amount}  onChange={(e) => this.onItemChange(e, item)} required />
                </td>
                <td className="basket-price">
                    <p>{item.price}€</p>
                </td>
            </tr>
        })            
        let emptyError = null
        if (this.state.error){
            emptyError = <>
                <tr className="basket-row">
                    <td className="basket-product">
                    </td>
                    <td className="basket-quantity">
                        <p className="w3-bar-item">{this.state.error}</p>
                    </td>
                    <td className="basket-price w3-right">
                    </td>
                </tr>
            </>
        }
        return  <main id="Basket" className="w3-responsive">
            <table className="w3-table">
                <thead>
                    <tr id="Headings">
                        <th className="product">{(this.context.lang === 'fr') ? 'Produit' : 'Product'}</th>
                        <th className="quantity">{(this.context.lang === 'fr') ? 'Quantité' : 'Quantity'}</th> 
                        <th className="w3-right">{(this.context.lang === 'fr') ? 'Prix' : 'Price'}</th>
                    </tr>
                </thead>
                <tbody>
                    {emptyError}
                    {items}
                    <tr id="Basket-Total">
                        <td className="basket-product"></td>
                        <td className="basket-quantity">{(this.context.lang === 'fr') ? 'Sous-total' : 'Subtotal'}</td>
                        <td className="basket-price w3-right">{total}€</td>
                    </tr>
                </tbody>
            </table>
            <div id="NextStep-Button">
                <button className="order-button w3-right w3-padding-16" onClick={() => this.changeStep()}>{(this.context.lang === 'fr') ? 'Commander' : 'Order'}</button>
            </div>
        </main>
    }
}

Step1.contextType = UserContext;