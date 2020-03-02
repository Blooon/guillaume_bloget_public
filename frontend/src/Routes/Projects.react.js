import React from 'react';
import front from '../Utils/front.utils';
import { UserContext } from '../Contexts/UserContext';
// import { loadDataIfNeeded } from '../Utils/loadDataIfNeeded.utils';
import request from '../Utils/request.utils';
import Carousel from './Components/Carousel.react';

export default class Projects extends React.Component {
    constructor(props) {
        super (props);
        this.state = {
            projects: [],
            items: [],
            error: '',
        }
        this.loadData = this.loadData.bind(this);
    }

    async loadData() {
        try {
            const body1 = await request.get(`/projects/full`, { lang: this.context.lang });
            const body2 = await request.get(`/items/full`, { lang: this.context.lang });
            // const all = front.orderByDate(body1.data.concat(body2.data.items));
            this.setState({projects: body1.data, items: body2.data});
            // this.setState({all: all});
        }
        catch (err) {
            console.log(err.message);
            this.setState({error: err.message })
        }
    }
    
    changeImg(e, elem) {
        this.setState({sliding: true})
        const img = e.currentTarget
        img.classList.remove('animate-right');
        img.classList.remove('animate-left');
        const sens = (elem.cursorState === 'left') ? -1: +1;
        let imgId = elem.imgId + sens
        if (imgId === elem.images.length) {
            imgId = 0
        }
        else if (imgId === -1) {
            imgId = elem.images.length - 1;
        }
        this.setState({imgId});
        img.classList.add('animate-'+elem.cursorState);
        setTimeout(() => {
            img.classList.remove('animate-right');
            img.classList.remove('animate-left');
            this.setState({sliding: false})
        }, 1000);
    }

    LeftRightImage(e, elem) {
        if (e.clientY >= e.target.y && e.clientY <= e.target.y + e.target.height) {
            if (e.clientX >= e.target.x && e.clientX <= e.target.x + e.target.width /2) {
                elem.cursorState = 'left';
            }
            else if (e.clientX >= e.target.x && e.clientX <= e.target.x + e.target.width) {
                elem.cursorState = 'right';
            }
        }
    }

    componentDidMount(){
        window.onbeforeunload = function () {
            window.scrollTo(0, 0);
        }
        this.loadData()
    }

    render() {
        // loadDataIfNeeded(this, '/projects/full', { lang: this.context.lang }, 'projects')
        // loadDataIfNeeded(this, '/items/full', { lang: this.context.lang }, 'items')
                
        let all = front.orderByDate(this.state.projects.concat(this.state.items));

        const allRender = all.map((elem) => {
            let slides = null;
            slides = <Carousel
                images = {elem.images}
                />
            return <article key={elem.id} id={elem['id']} className="home-project">
                <div className="w3-row">
                    {slides}
                </div>
                <div className="project-caption">
                    <h1>{elem['name_'+this.context.lang]}</h1>
                    <p>{elem['caption_'+this.context.lang]}</p>
                    <button data-toggle="collapse" data-target={"#infos-"+elem.id}>infos</button>
                    <div id={"infos-"+elem.id} className="project-info collapse">{front.renderText(elem['description_'+this.context.lang])}</div>
                </div>
            </article>
        });
        
        return <main id="Home">
            {allRender}
        </main>
    }
}

Projects.contextType = UserContext;
