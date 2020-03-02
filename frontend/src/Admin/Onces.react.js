import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Once from './Once.react';
import config from '../config'
const OncesElems = config.Onces;

export default class Onces extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {

        return <Router>
        <div>
            <nav className="nav-back w3-center">
                {
                    OncesElems.map((once => {
                    return <Link key={once.name} to={this.props.match.url + `/${once.name}`}><button className={(this.state.active === once.name) ? 'w3-bar-item w3-border w3-btn w3-black': 'w3-bar-item w3-border w3-btn w3-white'} onClick={(e) => this.setState({active: once.name})}>{once.name.charAt(0).toUpperCase() + once.name.substr(1,once.name.length+1)}</button></Link>
                }))}
            </nav>
            <div className="w3-row-padding">
                {
                    OncesElems.map(once => {
                        return <>
                            <Route path={this.props.match.url + `/${once.name}`} render={(props) => 
                            <Once keyValue={once.name} properties={once.entries} {...props}/>}/>
                        </>
                    })
                }
            </div>
        </div>
    </Router>
    }
}