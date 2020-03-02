import {UserContext} from '../Contexts/UserContext'
import React from 'react';
import Step1 from './Step1.react'
import Step2 from './Step2.react'
import Step3 from './Step3.react'

export default class Basket extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            step: 1,
            validatedBasket: {
                items: [],
                typologies: []
            }
        }

    }

    setStep = (value) => {
        this.setState({ step: this.state.step + value})
    }

    setValidatedBasket = (basket, user, user_livraison) => {
        this.setState({
            validatedBasket: basket,
            validatedUser: user,
            validatedUserLivraison: user_livraison,
            step: 3
        });
        this.props.updateBasket({
            items: [],
            typologies: []
        })
    }

    render() {
        let rendered;
        if (this.state.step === 1) {
            rendered = <Step1
                setStep={this.setStep}
                />
        }

        else if (this.state.step === 2) {
            rendered = <Step2 
                setStep={this.setStep}
                basket={this.context.basket}
                setValidatedBasket={this.setValidatedBasket}
                lang={this.props.lang}
                />
        }
        else if (this.state.step === 3) {
            
            rendered = <Step3
                basket= {this.state.validatedBasket}
                user={this.state.validatedUser}
                user_livraison={this.state.validatedUserLivraison}
                setStep={this.setStep}
                />
        }
        return <>
            <div className="noto w3-center">{this.state.error}</div>
            {rendered}
        </>
    }
}

Basket.contextType = UserContext