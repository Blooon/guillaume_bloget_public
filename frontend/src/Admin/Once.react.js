import React from 'react';
import requestUtils from '../Utils/request.utils';

export default class Once extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            data: {},
        }
        this.loadData();
        
    }

    loadData = async () => {
        try {
            const body = await requestUtils.get(`/admin/once/${this.props.keyValue}`);
            // if body empty, create a bug
            if (body) this.setState({ data: body.data });
        }
        catch (err) {
            console.log(err);
            // this.setState({ error: err.message });
        }
    }

    onChange = (event) => {
        const data = this.state.data;
        data[event.target.name]= event.target.value;
        this.setState({ data });
    }

    onSubmit = async (event) => {
        event.preventDefault();
        try {
            await requestUtils.put(`/admin/once/${this.props.keyValue}`,this.state.data);
            this.loadData();
        }
        catch (err) {
            console.log(err);
            this.setState({ error: err.message });
        }
    }

    render() {
        const once = this.props.properties.map((property) => {
            if (property.lang) {
                return <div key={property.name}>               
                <div>
                    <p className="helvetica w3-show-inline-block">{property.name} EN</p>
                    <input placeholder={property.name + ' en Anglais'} type='text' name={property.name + "_en"} value={this.state.data[property.name + "_en"]} onChange={this.onChange}/>
                </div>
                <div>
                    <p className="helvetica w3-show-inline-block">{property.name} FR</p>
                    <input placeholder={property.name + ' en Français'} type='text' name={property.name + "_fr"} value={this.state.data[property.name + "_fr"]} onChange={this.onChange}/>
                </div>
            </div>
            }
            else {
                return <div key={property.name}>               
                    <div>
                        <p className="helvetica w3-show-inline-block">{property.name}</p>
                        <input placeholder={property.name} type='text' name={property.name} value={this.state.data[property.name]} onChange={this.onChange}/>
                    </div>
                </div>
            }
           
        });
        return <article className="w3-col l4">
            <div className="noto w3-center">{this.state.error}</div>
            <h2 className="noto">Modifier le {this.props.keyValue}</h2>
            <form onSubmit={this.onSubmit}>
                {once}
                <input readOnly className="w3-panel" type="submit" value ="Modifier" />
            </form>
        </article>
    }
}