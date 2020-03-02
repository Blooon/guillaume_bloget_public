import React from 'react';
import requestUtils from '../Utils/request.utils'

import '../w3.css';
import '../stylesheet.css';

export default class Connection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: '',  
            mail: '',
            password: ''
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    async onSubmit(event) {
        event.preventDefault();
        try {
            const body = await requestUtils.post('/login', {
                mail: this.state.mail,
                password: this.state.password,
            });
            this.props.setUser(body.user)
        }
        catch (err) {
            console.log(err);
            this.setState({ error: err.message });
        }
    }

    onChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    render() {
        return <section>
            <div className="noto w3-center">{this.state.error}</div>
            <form id="SignIn" className="w3-panel w3-bar" onSubmit={ this.onSubmit }>
                <div className="w3-right">
                    <input value={this.state.mail} className="w3-input w3-bar-item w3-border" type="text" name="mail" onChange={ this.onChange } placeholder="email" required/>
                    <input  value={this.state.password} className="w3-input w3-bar-item w3-border" type="password" name="password" onChange={ this.onChange } placeholder="mot de passe" required/>
                    <input className="w3-input w3-bar-item w3-border" type="Submit" value="se connecter"/>
                </div>
            </form>
        </section>
    }
}
