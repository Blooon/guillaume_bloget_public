import React from 'react';
import requestUtils from '../../Utils/request.utils';

export default class TypeForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                files: {}
            }
        }
    }


    submitType = async (event) => {
        event.preventDefault();
        try {
            await requestUtils.post(`/admin/${this.props.name}/${this.props.itemId}/type`, this.state.data);
            this.props.loadData();
        }
        catch (err) {
            console.log(err);
            this.setState({ error: err.message });
            setTimeout(()=> this.setState({error: null}), 3000)

        }
    }

    handleFileRead = (e, filename, itemName) => {
        // eslint-disable-next-line
        this.state.data.files[itemName] = {name: filename, data: e.target.result}
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

    onChange = (event) => {
        const data = this.state.data;
        data[event.target.name] = event.target.value;
        this.setState({ data });
    }

    render() {
        return <div>
            <h2 className="noto">Ajouter une couleur à l'item</h2>
            <form onSubmit={this.submitType}>
                {// eslint-disable-next-line
                this.props.types[0].items.map(item => {
                    if (item.type === "text") {
                        return <div key={item.name}>
                            <p className="helvetica w3-show-inline-block">{item.name}</p>
                            <input className="helvetica" type="text" name={item.name} value={this.state.data.order} onChange={this.onChange} required/>
                        </div>
                    }
                    else if (item.type === "file") {
                        return <div key={item.name}>
                        <p className="helvetica w3-show-inline-block">{item.name}</p>
                        <input className="helvetica" type="file" name={item.name} onChange={(e) => this.fileChange(e, item.name)} required/>
                    </div>
                    }
                })}
  
                <input className="helvetica" type="submit" value ="Ajouter"/>                   
            </form>
        </div> 
    }
}