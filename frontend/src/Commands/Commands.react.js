import React from 'react';
import requestUtils from '../Utils/request.utils';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import CommandsByStatus from './CommandsByStatus.react'
import Command from './Command.react';

export default class Commands extends React.Component{
    constructor(props) {
        super(props);
        this.state= {
            error :null,
            commands: []
        }
        this.loadCommands = this.loadCommands.bind(this);
    }

    async loadCommands() {
        try {
            const body = await requestUtils.get('/admin/commands');
            this.setState({
                commands: body.data
            });
        }
        catch(err) {
            console.log(err);
            this.setState({error: err.message})
        }
    }

    componentDidCatch(err) {
        console.log(err)
    }

    render() {
        return <Router>
            <>
                <nav className="nav-back w3-center">
                    <Link to={this.props.match.url + '/reserved'}><button className={(this.state.active === 'reserved') ? 'w3-bar-item w3-border w3-btn w3-black': 'w3-bar-item w3-border w3-btn w3-white'} onClick={(e) => this.setState({active: 'reserved'})}>Réservées</button></Link>
                    <Link to={this.props.match.url + '/validated'}><button className={(this.state.active === 'validated') ? 'w3-bar-item w3-border w3-btn w3-black': 'w3-bar-item w3-border w3-btn w3-white'} onClick={(e) => this.setState({active: 'validated'})}>Validées</button></Link>
                    <Link to={this.props.match.url + '/sended'}><button className={(this.state.active === 'sended') ? 'w3-bar-item w3-border w3-btn w3-black': 'w3-bar-item w3-border w3-btn w3-white'} onClick={(e) => this.setState({active: 'sended'})}>Envoyées</button></Link>
                    <Link to={this.props.match.url + '/finished'}><button className={(this.state.active === 'finished') ? 'w3-bar-item w3-border w3-btn w3-black': 'w3-bar-item w3-border w3-btn w3-white'} onClick={(e) => this.setState({active: 'finished'})}>Terminées</button></Link>
                </nav>
                <div className="noto w3-center">{this.state.error}</div>
                <Route path={this.props.match.url + '/reserved'} render={(props) => <CommandsByStatus status='reserved' {...props}/>}/>
                <Route path={this.props.match.url + '/validated'} render={(props) => <CommandsByStatus status='validated' {...props}/>}/>
                <Route path={this.props.match.url + '/sended'} render={(props) => <CommandsByStatus status='sended' {...props}/>}/>
                <Route path={this.props.match.url + '/finished'} render={(props) => <CommandsByStatus status='finished' {...props}/>}/>
                <Route path={this.props.match.url + '/command/:commandId'} render={(props) => <Command {...props}/>}/>
            </>
        </Router>
    }
}