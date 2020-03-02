import React from 'react';
import { UserContext } from '../../Contexts/UserContext';

export default class Cookies extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            printCookies: true
        }
        this.createCookie = this.createCookie.bind(this);
        this.readCookie = this.readCookie.bind(this);
        this.eraseCookie = this.eraseCookie.bind(this);
    }

    createCookie(name,value,days) {
        var expires = ""
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            expires = "; expires="+date.toGMTString();
        }
        document.cookie = name+"="+value+expires+"; path=/";
    }
    
    readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)===' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }
    
    eraseCookie(name) {
        this.createCookie(name,"",-1);
    }

    render() {
        let cookiesAlert = null;
        if (this.readCookie('printCookie') !== 'false') {
            cookiesAlert = <div className="cookies-alert w3-bottom">
                <div className="cookies-alert-inner">
                    <p className="noto w3-show-inline-block">
                        {(this.context.lang === 'fr') ? "En continuant d'utiliser notre site, vous acceptez l’utilisation des cookies comme prévu dans notre " : "By navigating the site, you agree to collection of information on and off our site through cookies as mentioned into the "}
                        <a href="/legalnotices#Cookies">{(this.context.lang === 'fr') ? "politique en matière de cookies" : "terms and conditions regarding cookies"}</a>.
                    </p>
                    <button className="cookies-button w3-show-inline-block w3-bar-item" onClick={() => {this.createCookie('printCookie', 'false', 360); this.setState({printCookies: false})}}>
                        OK
                    </button>
                </div>
            </div>
        }

        return <>{cookiesAlert}</>
    }
}

Cookies.contextType = UserContext;