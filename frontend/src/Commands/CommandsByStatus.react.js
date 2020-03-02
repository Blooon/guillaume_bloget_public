import React from 'react';
import requestUtils from '../Utils/request.utils';
import {  Link } from "react-router-dom";

export default class Commands extends React.Component{
    constructor(props) {
        super(props);
        this.state= {
            error :null,
            order: 'id',
            commands: [],
            message: null,
        }
        this.statusList = [
            'reserved', 'validated', 'sended', 'finished'
        ]
        this.loadCommands = this.loadCommands.bind(this);
        this.selectChange = this.selectChange.bind(this);
        this.loadCommands();
    }

    async loadCommands() {
        try {
            const body = await requestUtils.get('/admin/commands', {
                status: this.props.status,
                order: this.state.order
            })
            this.setState({
                commands: body.data
            })
        }
        catch (err) {
            console.log(err);
            this.setState({ error: 'internal error' });
        }
    }

    componentDidCatch(err) {
        console.log(err)
    }
    
    async selectChange(event, command) {
        this.setState({ [event.target.name]: event.target.value });
        try {
            const body = await requestUtils.put(`/admin/command/${command._id}`, {
                status: event.target.value
            });
            this.state.message = body.message;
            await this.loadCommands();
        }
        catch(err) {
            console.log(err)
        }
    }

    render() {
        const commands = this.state.commands.map((command) => {
            let quantite = 0;
            command.basket.map(item => quantite += item.amount)
            if (command.status !== this.props.status) 
                return null;
            return <tr key={command.id} className="basket-item">
                <td className="">
                    <p>{command._id}</p>
                </td>
                <td className="">
                    <p>{new Date(command.date).toUTCString()}</p>
                </td>
                <td className="">
                    <p>{command.user.email}</p>
                </td>
                <td className="">
                    <p>{quantite}</p>
                </td>
                <td className="">
                    <p>{command.total}€</p>
                </td>
                <td>
                    <p><select id="monselect" onChange={(e) => this.selectChange(e, command)}>
                        {this.statusList.map(statusElem => {
                            if (statusElem === this.props.status) {
                                return <option value={this.statusElem} selected="selected">{statusElem}</option> 
                            }
                            else {
                                return <option value={this.statusElem}>{statusElem}</option>                             
                            }
                        })}
                    </select></p>
                </td>
                <td>
                    <Link to={'/admin/commands/command/' + command._id} className="w3-right sidebar-button w3-bar-item"><button>Voir détail</button></Link>
                </td>
            </tr>
        });

        return <>
            <section className="basket-section w3-responsive">
                <div className="noto w3-center">{this.state.error}</div>
                <table className="w3-table w3-bordered">
                    <thead>
                        <tr id="Headings">
                            <th className="basket-product">N° de commande</th>
                            <th>Date</th>
                            <th>Email</th>
                            <th>Quantité</th>
                            <th>Prix</th>
                            <th>Statut</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {commands}
                    </tbody>
                </table>
            </section>
        </>
    }
}