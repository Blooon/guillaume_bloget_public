import React from 'react';
import { Route, Link } from "react-router-dom";
import requestUtils from '../Utils/request.utils';
import AdminElem from './AdminElem.react';


export default class Admin extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            error: null,
            data: [],
            newElem: {}
        }
        this.fileReader = {}
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.loadData = this.loadData.bind(this);
        this.createItems = this.createItems.bind(this);
        this.fileChange = this.fileChange.bind(this);
        this.handleFileRead = this.handleFileRead.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.loadData();
        this.props.items.forEach(item => {
            // eslint-disable-next-line
            this.state.newElem[item.name] = '';
        });
    }

    componentDidCatch(err) {
        this.setState({ error: "Internal Error" })
    }

    async loadData() {
        try {
            const body = await requestUtils.get(`/admin/${this.props.name}s`);
            this.setState({data: body.data});
        }
        catch (err) {
            console.log(err.message);
            this.setState({error: err.message })

        }
    }

    handleFileRead(e, filename, itemName) {
        // eslint-disable-next-line
        this.state.newElem[itemName] = {name: filename, data: e.target.result}
    }

    async fileChange(e, itemName) {
        if (!e.target.files[0]) {
            return;
        }
        const filename = e.target.files[0].name
        this.fileReader = new FileReader();
        this.fileReader.onloadend = (e) => {this.handleFileRead(e, filename, itemName )};
        this.fileReader.readAsDataURL(e.target.files[0]);
    }

    async deleteItem(itemId) {
        try {
            await requestUtils.delete(`/admin/${this.props.name}/${itemId}`);
            this.loadData();
        }
        catch(err) {
            console.log(err);
            this.setState({ error: err.message })
        }

    }

    createRender() {
        const newItem = this.props.items.map((item) => {
            if (item.type === 'text') {
                if (item.lang) {
                    return <div key={item.name}>
                        <p className="helvetica w3-show-inline-block">{item.name}_fr</p> 
                        <input className="form-back" type="text" name={item.name + "_fr"} value={this.state.newElem[item.name + "_fr"]} onChange={this.onChange}/>
                        <p className="helvetica w3-show-inline-block">{item.name}_en</p> 
                        <input className="form-back" type="text" name={item.name + "_en"} value={this.state.newElem[item.name + "_en"]} onChange={this.onChange}/>
                    </div>
                }
                return <div key={item.name}>
                        <p className="helvetica w3-show-inline-block">{item.name}</p> 
                        <input className="form-back" type="text" name={item.name} value={this.state.newElem[item.name]} onChange={this.onChange}/>
                    </div>
            }
            if (item.type === 'number') {
                return <div key={item.name}>
                        <p className="helvetica w3-show-inline-block">{item.name}</p> 
                        <input className="form-back" type="number" name={item.name} value={this.state.newElem[item.name]} onChange={this.onChange}/>
                    </div>
            }
            else if (item.type === 'file') {
                return <div key={item.name}>
                    <p className="helvetica w3-show-inline-block">{item.name}</p> 
                    <input className="helvetica" type="file" name={item.name} onChange={(e) => this.fileChange(e, item.name)} required/>
                </div>
            }
            return null
        });
        return newItem;
    }

    createItems(datas, properties, name) {
        const elems = datas.map((data) => {
            const elem = properties.map((property) => {
                if (property.type === 'text') {
                    if (property.lang) {
                        return <div key={property.name}>
                            <div className="text-back">
                                <p className="helvetica">{property.name + "_fr"}</p>
                                <p>{data[property.name + "_fr"]}</p>
                            </div>
                            <div className="text-back">
                                <p className="helvetica">{property.name + "_en"}</p>
                                <p>{data[property.name + "_en"]}</p>
                            </div>
                        </div>
                    }
                    return <div key={property.name} className="text-back">
                        <p className="helvetica">{property.name}</p>
                        <p>{data[property.name]}</p>
                    </div>
                }
                else if (property.type === 'number') {
                    return <div key={property.name} className="text-back">
                        <p className="helvetica">{property.name}</p>
                        <p>{data[property.name]}</p>
                    </div>
                }
                else if (property.type === 'file') {
                    return <img key={property.name} className="image-back" src={process.env.REACT_APP_S3_BUCKET_BASE_URL + `${data[property.name]}`} alt={property.name}/>
                }
                return null
            });
            return <article key={data.id} className="item-back w3-padding-24">
                <h3 className="noto w3-show-inline-block">{this.props.name.charAt(0).toUpperCase() + this.props.name.substr(1,this.props.name.length+1)} {data.id}</h3>
                <div className="w3-right">
                    <Link to={`${this.props.match.path}/${data.id}`}><button className="w3-bar-item w3-container">Modifier</button></Link>
                    <button onClick={() => this.deleteItem(data.id)} className="w3-bar-item w3-container">Supprimer</button>
                </div>
                {elem}
            </article>
        });
        return elems;
    }

    async onSubmit(event) {
        event.preventDefault();
        try {
            await requestUtils.post(`/admin/${this.props.name}`, this.state.newElem);
            this.loadData();
        }
        catch (err) {
            console.log(err);
            this.setState({ error: err.message });
        }
    }

    onChange(event) {
        const newElem = this.state.newElem;
        newElem[event.target.name]= event.target.value;
        this.setState({ newElem });
    }

    render() {
        const newItem = this.createRender();
        const listItems = this.createItems(this.state.data, this.props.items, this.props.name);
        return <>
            <div className="noto w3-center">{this.state.error}</div>
            <Route exact path={this.props.match.path} render= {() => <div className="w3-row-padding">
                    <section className="w3-col l4">
                        <h2 className="noto">Ajouter un {this.props.name}</h2>
                        <form onSubmit={this.onSubmit}>
                            {newItem}
                            <input readOnly className="w3-panel" type="Submit" value ="Ajouter" />
                        </form>
                    </section>

                    <section className="w3-col l8">
                        <h2 className="noto">{this.props.name.charAt(0).toUpperCase() + this.props.name.substr(1,this.props.name.length+1)}s déjà ajoutés</h2>
                        {listItems}
                    </section>
                </div>}/>
            <Route path={this.props.match.path+"/:itemId"} render={(props) => <AdminElem items={this.props.items} name={this.props.name} {...props} gotFileList={this.props.gotFileList}/> } />
        </>

    }
}