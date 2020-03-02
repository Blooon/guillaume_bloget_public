import React, { Component } from 'react';
import { loadDataIfNeeded } from '../Utils/loadDataIfNeeded.utils'
import { UserContext } from '../Contexts/UserContext';
import { Link } from "react-router-dom";

export default class About extends Component {
    constructor(props) {
        super(props);
        this.state = {
            about: {
                tel: "",
                mail: "",
                bio: "",
                prizes: "",
                exhibs: ""
            }
        }
    }

    renderContent(content) {
        if (content !== undefined && content !== null) {
            content = content.split('§')
            const render = content.map((part, index) => {
                if (index === content.length-1) {
                    return <span key={index}>{part}</span>
                }
                return <span key={index}>{part}<br/></span>
            })
            return render
        }
        return null
    }

    render() {

        loadDataIfNeeded(this, '/once/about',  { lang: this.context.lang }, 'about');

        return <main id="About">
            <section>
                <article>
                    <p>{"T "+this.state.about.tel}</p>
                    <p>{"E "+this.state.about.mail}</p>
                </article>

                <article>
                    <p>{this.renderContent(this.state.about['bio_'+this.context.lang])}</p>    
                </article>

                <article>
                    <h1>{(this.context.lang === 'fr') ? 'Prix, compétitions' : 'Prizes, competitions'}</h1>
                    <p>{this.renderContent(this.state.about['prizes_'+this.context.lang])}</p>
                </article>

                <article>
                    <h1>{(this.context.lang === 'fr') ? 'Expositions' : 'Exhibitions'}</h1>
                    <p>{this.renderContent(this.state.about['exhibs_'+this.context.lang])}</p>
                </article>

                <article id="Credits">
                    <h2>Content</h2>
                    <p>Guillaume Bloget Industrial Design</p>

                    <h2>Graphic design</h2>
                    <p>Lisa Sturraci</p>
                    
                    <h2>Code</h2>
                    <p>Lorenzo Armandin, Baptiste André</p>
                    
                    <h2>Photography</h2>
                    <p>Guillaume Bloget, Véronique Huyghe</p>
                    
                    <Link to="/legalnotices" className="underhover navbar-brand"><u>Mentions légales</u></Link>
                </article>
            </section>
        </main>
    }
}

About.contextType = UserContext;