import React from 'react';
import requestUtils from '../../Utils/request.utils';

export default class ListImageForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            images: {}
        }
    }

    setNewOrder = async (e, file) => {
        try {
            this.state.confirmationNewOrder = null;
            await requestUtils.put(`/admin/${this.props.name}/${this.props.match.params.itemId}/image/${file.id}`, {order: e.target.value});
            this.props.loadData();
            this.setState({ confirmationNewOrder: "Order saved !" });
            setTimeout(()=> this.setState({confirmationNewOrder: null}), 400)
        }
        catch (err) {
            console.log(err);
            this.setState({ error: err.message });
            setTimeout(()=> this.setState({error: null}), 3000) 
        }
    }

    deleteImage = async (event, imageId) => {
        event.preventDefault();
        try {
            await requestUtils.delete(`/admin/${this.props.name}/${this.props.itemId}/image/${imageId}`);
            this.props.loadData();
        }
        catch (err) {
            this.setState({ error: err.message });
            setTimeout(()=> this.setState({error: null}), 3000)
        }
    }

    render() {
            const images = this.props.images.map((file) => {
                return <div key={file._id}>
                    <p>{this.state.confirmationNewOrder}</p>
                    <input type="number" name='order' value={file.ordered} onChange={(e) => this.setNewOrder(e, file)} required/>                
                    <img className="image-back" src={process.env.REACT_APP_S3_BUCKET_BASE_URL + file.small} tag={file.name} alt={file.name}/>
                    <img className="image-back" src={process.env.REACT_APP_S3_BUCKET_BASE_URL + file.medium} tag={file.name} alt={file.name}/>
                    <img className="image-back" src={process.env.REACT_APP_S3_BUCKET_BASE_URL + file.large} tag={file.name} alt={file.name}/>
                    <button onClick={(e) => this.deleteImage(e, file._id)}>supprimer</button>
                </div>
            });
        // }
        return <>
            {this.state.error}
            {images}
        </>
    }
}
