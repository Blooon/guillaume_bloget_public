import requestUtils from '../Utils/request.utils';
import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import AdminComponent from './AdminComponent.react';
import Onces from './Onces.react';
import AdminElem from './AdminElem.react';
import Login from './Login.react';
import Commands from '../Commands/Commands.react'
import Config from '../config'
const adminComponents = Config.adminComponents

export default class Admin extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            error: null,
            logged: false
        }
        this.adminComp = adminComponents.map(comp => {
            return <>
                <Route exact path={`/admin/${comp.name}`} render={(props) => {
                    return <AdminComponent
                    items={comp.items}
                    name={comp.name}
                    gotFileList={comp.params.gotFileList}
                    gotImagesList={comp.params.gotImagesList}
                    unique={comp.params.unique}
                    gotTypes={comp.params.gotTypes}
                    types={comp.types}
                    {...props}
                    />
                }}/>
                <Route exact path={`/admin/${comp.name}/:itemId`} render={(props) => {
                    return <AdminElem
                    items={comp.items}
                    name={comp.name}
                    gotFileList={comp.params.gotFileList}
                    gotImagesList={comp.params.gotImagesList}
                    unique={comp.params.unique}
                    gotTypes={comp.params.gotTypes}
                    types={comp.types}
                    {...props}/>
                }}/>
            </>
                 
        })
        this.getMe = this.getMe.bind(this);
        this.setLogged = this.setLogged.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        this.getMe();
    }
    
    componentDidCatch(err) {
        this.setState({ error: "Internal Error" })
    }

    async setLogged() {
        this.setState({ logged: true })
    }

    async logout() {
        await requestUtils.post('/logout',);
        this.setState({ logged: false });
    }
    
    async getMe() {
        try {
            await requestUtils.get('/me');
            this.setState({ logged: true });
        }
        catch (err) {
            console.log(err);
            this.setState({ error: err.message })
        }
    }

    render(match) {
        if (!this.state.logged) {
            return <Login setLogged={this.setLogged}/>
        }
        return <>
        <Link to="/admin">retour</Link>
            <Router>
                <main id="Admin">
                    <button className="disconnect w3-bar-item w3-border w3-btn w3-white" onClick={(e) => this.logout()}>Déconnexion</button>
                    <nav className="nav-back w3-center">
                        <h1 className="home-back">Backoffice administrateur</h1>
                        <div className="text-align-center">
                            {adminComponents.map((comp) => {
                                return  <Link key={comp.name} to={`/admin/${comp.name}`}><button className={(this.state.active === `${comp.name}`) ? 'w3-bar-item w3-border w3-btn w3-black': 'w3-bar-item w3-border w3-btn w3-white'} onClick={(e) => this.setState({active: `${comp.name}`})}>{comp.name.charAt(0).toUpperCase() + comp.name.substr(1,comp.name.length+1)}s</button></Link>
                            })}
                            <Link to={`/admin/once`}><button className={(this.state.active === 'once') ? 'w3-bar-item w3-border w3-btn w3-black': 'w3-bar-item w3-border w3-btn w3-white'} onClick={(e) => this.setState({active: 'once'})}>Once</button></Link>
                            <Link to={`/admin/commands`}><button className={(this.state.active === 'commands') ? 'w3-bar-item w3-border w3-btn w3-black': 'w3-bar-item w3-border w3-btn w3-white'} onClick={(e) => this.setState({active: 'commands'})}>Commands</button></Link>
                        </div>
                     </nav>
                    {this.adminComp}
                    <Route path="/admin/once" component={Onces}/>
                    <Route path="/admin/commands" component={Commands} />
                </main>
            </Router>
        </>
    }
}