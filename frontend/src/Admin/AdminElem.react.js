import React from 'react';
import requestUtils from '../Utils/request.utils';

import ListImages from './Components/ListImages.react';
import ListImagesForm from './Components/ListImagesForm.react';
import ListTypes from './Components/ListTypes.react'
import TypeForm from './Components/TypeForm.react'
export default class AdminElem extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            data: {
                types: [],
                images: []
            },
            order: 1,
            newElem: {}
        }
        this.fileReader = {}
    }
    
    componentDidMount() {
        this.loadData()
    }
    loadData = async () => {
        try {
            const body = await requestUtils.get(`/admin/${this.props.name}/${this.props.match.params.itemId}`);
            if (body.data.images) {
                body.data.order = body.data.images.length+1
            }
            this.setState({data: body.data,});
        }
        catch (err) {
            console.log(err);
        }
    }


    handleFileRead(e, filename, itemName) {
        // eslint-disable-next-line
        this.state.data[itemName] = {name: filename, data: e.target.result}
    }

    fileChange = async (e, itemName) => {
        if (!e.target.files[0]) {
            return;
        }
        const filename = e.target.files[0].name;
        this.fileReader = new FileReader();
        this.fileReader.onloadend = (e) => {this.handleFileRead(e, filename, itemName)};
        this.fileReader.readAsDataURL(e.target.files[0]);

    }

    createRender = () => {
        const elem = this.props.items.map((item) => {
            if (item.type === 'text') {
                if (item.lang) {
                    return <div key={item.name}>
                        <p className="helvetica w3-show-inline-block">{item.name} français</p> 
                        <input className="form-back" type="text" name={item.name + "_fr"} value={this.state.data[item.name + "_fr"]} onChange={this.onChange} />
                        <p className="helvetica w3-show-inline-block">{item.name} anglais</p> 
                        <input className="form-back" type="text" name={item.name + "_en"} value={this.state.data[item.name + "_en"]} onChange={this.onChange} />
                    </div>
                }
                return <div key={item.name}>
                    <p className="helvetica w3-show-inline-block">{item.name}</p> 
                    <input className="form-back" type="text" name={item.name} value={this.state.data[item.name]} onChange={this.onChange} />
                </div>
            }
            if (item.type === 'number') {
                return <div key={item.name}>
                    <p className="helvetica w3-show-inline-block">{item.name}</p> 
                    <input className="form-back" type="number" name={item.name} value={this.state.data[item.name]} onChange={this.onChange} />
                </div>
            }
            else if (item.type === 'file') {
                return <div key={item.name}>
                    <p className="helvetica w3-show-inline-block">{item.name}</p> 
                    <input className="helvetica" type="file" name={item.name} onChange={(e) => this.fileChange(e, item.name)}/>
                    <img className="image-back" src={process.env.REACT_APP_S3_BUCKET_BASE_URL + `${this.state.data[item.name]}`} tag={item.name} alt={item.name}/>
                </div>
            }
            return null
        });
        return elem;
    }


    onSubmit = async (event) => {
        event.preventDefault();
        try {
            // eslint-disable-next-line
            this.state.modifierConfirmation = null;
            await requestUtils.put(`/admin/${this.props.name}/${this.props.match.params.itemId}`, this.state.data);
            this.loadData();
            this.setState({modifierConfirmation: "Success !"})
            setTimeout(()=> this.setState({modifierConfirmation: null}), 1000)

        }
        catch (err) {
            console.log(err);
            this.setState({ error: err.message });
            setTimeout(()=> this.setState({error: null}), 3000)

        }
    }

    onChange = (event) => {
        const data = this.state.data;
        data[event.target.name] = event.target.value;
        this.setState({ data });
    }  

    render() {
        let error = null;
        if (this.state.error) {
            error = <p>{this.state.error}</p>
        }
        const elem = this.createRender();
        let imagesForm = null;
        let images = null;
        let types = null;
        let typesForm = null;
        
        if (this.props.gotImagesList) {
            images = <ListImages 
                name={this.props.name}
                images={this.state.data.images}
                order={this.state.order}
                loadData={this.loadData}
                itemId={this.props.match.params.itemId}
                />
            imagesForm = <ListImagesForm
                name={this.props.name}
                images={this.state.data.images}
                order={this.state.order}
                loadData={this.loadData}
                itemId={this.props.match.params.itemId}
                />
        }
        if (this.props.types) {
            typesForm = <TypeForm
                name={this.props.name}
                types={this.props.types}
                itemId={this.props.match.params.itemId}
                loadData={this.loadData}
                />
            types = <ListTypes 
                name={this.props.name}
                listItems={this.state.data.types}
                types={this.props.types}
                itemId={this.props.match.params.itemId}
                loadData={this.loadData}
                />
        }

        return <>
            <div className="noto w3-center">{error}</div>
            <div className="w3-row-padding">
                <section className="w3-col l4">
                    <article>
                        <h2 className="noto">Modifier {this.props.name} {this.state.data.id}</h2>
                        <form onSubmit={this.onSubmit}>
                            {elem}
                            <p>{this.state.modifierConfirmation}</p>
                            <input className="w3-panel" type="submit" value="Modifier" />
                        </form>
                    </article>
                </section>

                <section className="w3-col l8">
                    <article>
                        {imagesForm}
                        <div>
                            {images}
                        </div>
                    </article>
                    <article>
                        {typesForm}
                        <div>
                        {types}
                        </div>
                    </article>
                </section>
            </div>
        </>
    }
}