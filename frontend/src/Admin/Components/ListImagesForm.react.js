import React from 'react'
import requestUtils from '../../Utils/request.utils';

export default class ListImageForm extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            data: {},
            order: props.order,
            error: null
        }
        this.fileReader = {}
    }


    handleFileRead = (e, filename, itemName) => {
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

    submitImage = async (event) => {
        event.preventDefault();
        try {
            await requestUtils.post(`/admin/${this.props.name}/${this.props.itemId}/image`, {
                file_small: this.state.data.file_small,
                file_medium: this.state.data.file_medium,
                file_large: this.state.data.file_large,
                order: this.state.order
            });
            this.props.loadData();
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
        return <div>
                <h2 className="noto">Ajouter une image au diapo</h2>
                {this.state.error}
                <form onSubmit={this.submitImage}>
                    <div>
                        <p className="helvetica w3-show-inline-block">Image n°</p>
                        <input className="helvetica" type="number" name='order' value={this.state.data.order} onChange={this.onChange} required/>
                    </div>
                    <div>
                        <p className="helvetica w3-show-inline-block">Petit format ({(this.props.name === 'project') ? '952 x 607 px' : '952 x 607 px'})</p>
                        <input className="helvetica" type="file" name='file' onChange={(e) => this.fileChange(e, 'file_small')} required/>
                    </div>
                    <div>
                        <p className="helvetica w3-show-inline-block">Moyen format ({(this.props.name === 'project') ? '1119 x 713 px' : '1212 x 773 px'})</p>
                        <input className="helvetica" type="file" name='file' onChange={(e) => this.fileChange(e, 'file_medium')} required/>
                    </div>
                    <div>
                        <p className="helvetica w3-show-inline-block">Grand format ({(this.props.name === 'project') ? '1587 x 1018 px' : '1597 x 1019 px'})</p>
                        <input className="helvetica" type="file" name='file' onChange={(e) => this.fileChange(e, 'file_large')} required/>
                    </div>
                    <input className="helvetica" type="submit" value ="Ajouter" />
                </form>
            </div>
    }
}