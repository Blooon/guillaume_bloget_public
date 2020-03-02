import React from 'react';
import { Link } from "react-router-dom";
import { UserContext } from '../Contexts/UserContext';
import { loadDataIfNeeded } from '../Utils/loadDataIfNeeded.utils'

class Basket extends React.Component {
    render() {
        let itemNum = 0;
        this.context.basket.forEach(item => itemNum += item.amount);
        return <Link to="/cart">
            <button className="basket-button w3-bar-item w3-display-container">
                <img src={process.env.REACT_APP_S3_BUCKET_BASE_URL + "pictos/basket.svg"} alt="cart"/>
                <b className="w3-display-middle">{itemNum}</b>
            </button>
        </Link>
    }
}
Basket.contextType = UserContext

export default class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            navbar: {
                name: "",
                title: "",
                index: "",
                about: "",
                shop: ""
            }
        }
    }

    componentDidUpdate() {
        if (this.state.active !== '' && window.location.pathname === '/') {
            this.setState({active: ''})
        }
        if (window.location.pathname === '/shop' || window.location.pathname === '/cart' || window.location.pathname.includes('/items')) {
            document.getElementsByClassName("nav-basket")[0].style.display = ''
            document.getElementsByClassName("nav-shop")[0].style.paddingRight = ''
        } else {
            document.getElementsByClassName("nav-basket")[0].style.display = 'none'
            document.getElementsByClassName("nav-shop")[0].style.paddingRight = '0px'
        }
        // console.log(document.body.clientWidth, document.body.clientHeight)
    }

    render() {

        loadDataIfNeeded(this, '/once/navbar',  { lang: this.context.lang }, 'navbar');

        return <nav className="navbar navbar-default fixed-top" role="navigation">
            <div className="container-fluid">
                <div className="navbar-header">
                    <Link to="/" className="navbar-brand" onClick={(e) => this.setState({active: ''})}>{this.state.navbar['name_'+this.context.lang]}</Link>
                    <Link to="/" className="navbar-brand last-brand" onClick={(e) => this.setState({active: ''})}>{this.state.navbar['title_'+this.context.lang]}</Link>
                </div>
                <ul className="nav navbar-nav navbar-right">
                    <li className="navbar-text nav-lang"><button onClick={(e) => this.props.changeLang() } className="w3-bar-item"><u>{(this.props.lang === 'fr') ? 'En' : 'Fr'}</u></button></li>
                    <li className="navbar-text"><Link to="/index" className="" onClick={(e) => this.setState({active: 'index'})}><u className={(this.state.active === 'index') ? 'active': null}>{this.state.navbar['index_'+this.context.lang]}</u></Link></li>
                    <li className="navbar-text nav-about"><Link to="/about" className="" onClick={(e) => this.setState({active: 'about'})}><u className={(this.state.active === 'about') ? 'active': null}>{this.state.navbar['about_'+this.context.lang]}</u></Link></li>
                    <li className="navbar-text nav-shop"><Link to="/shop" className="" onClick={(e) => this.setState({active: 'shop'})}><u className={(this.state.active === 'shop') ? 'active': null}>{this.state.navbar['shop_'+this.context.lang]}</u></Link></li>
                    <li id="Cart" className="navbar-text nav-basket"><Basket onClick={(e) => this.setState({active: 'shop'})}/></li>
                </ul>
            </div>
        </nav>
    }
}


Navbar.contextType = UserContext;