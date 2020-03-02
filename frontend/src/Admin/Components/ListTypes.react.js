import React from 'react';
import requestUtils from '../../Utils/request.utils';

class Type extends React.Component {
    render() {
        return <div>
            {this.props.elems}
        </div>
    }
}

export default class ListTypes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error:null
        }
    }

    deleteType = async (event, typeId) => {
        event.preventDefault();
        try {
            await requestUtils.delete(`/admin/${this.props.name}/${this.props.itemId}/type/${typeId}`);
            this.props.loadData();
        }
        catch (err) {
            console.log(err);
            this.setState({ error: err.message });
            setTimeout(()=> this.setState({error: null}), 3000)
        }
    }
    componentDidCatch(err) {
        console.log(err)
    }

    render() {
        const listItems = this.props.listItems.map((item, index) => {

            let ret = this.props.types[0].items.map((elem, indexelem) => {
                if (elem.type === "text") {
                    return <div key={index *100 + indexelem}>
                        <div className="color-box" style={{"background-color":  item.color}}></div>
                        <p>{item[elem.name]}</p>
                    </div>
                }
                else if (elem.type === "file") {
                    return <img className="image-back" src={process.env.REACT_APP_S3_BUCKET_BASE_URL + item[elem.name]} tag={item.name} alt={item.name}/>
                }
                return <> </>
            });
            ret.push(<button className="helvetica" onClick={(e) => this.deleteType(e, item._id)}>supprimer</button>)
            return ret;
        });
 
        return <>
        {this.state.error}
            {
                listItems.map((item, index)=> {
                return <div key={index}>
                    <Type elems={item} />
                    </div>
            })}
        </>
    }
}