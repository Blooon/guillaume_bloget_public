import React from 'react';
import front from '../Utils/front.utils';
import { UserContext } from '../Contexts/UserContext';
import { loadDataIfNeeded } from '../Utils/loadDataIfNeeded.utils';
import { HashLink as Link } from 'react-router-hash-link';

export default class Index extends React.Component {
    constructor(props) {
        super (props);
        this.state = {
            projects: [],
            items: [],
            // all: [],
            error: '',
            lang: 'en'
        }
        this.renderCol = this.renderCol.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.renderReversedGrid = this.renderReversedGrid.bind(this);
        this.setMarginTop = this.setMarginTop.bind(this)
    }

    renderReversedGrid(datas, nbItemsPerRow) {
        const size = datas.length;
        const colWidth = 12/nbItemsPerRow;
        const rest = size % (12/colWidth);
        let rows = [];
        let i = 0;
        if (rest !== 0) {
            rows.push(this.renderRow(datas, i, rest, nbItemsPerRow))
        }
        i = rest;
        for (i; i < size; i+=nbItemsPerRow) {
            rows.push(this.renderRow(datas, i, i+nbItemsPerRow, nbItemsPerRow))
        }
        return <>
            {rows}
        </>
    }

    renderRow(datas, start, end, nbItemsPerRow) {
        let cols = [];
        const width = 12/nbItemsPerRow
        for (let i = end-1; i >= start; i--) {
            cols.push(this.renderCol(datas[i], width));
        }
        return <section key={datas[start].id} className="w3-row">
            {cols}
        </section>
    }

    renderCol(data, width){
        var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        var homeMargin = 0
        if (w <= 992) {
            homeMargin = 61
        }
        if (w <= 720) {
            homeMargin = 102
        }
        if (w <= 359) {
            homeMargin = 123
        }
        
        return <article key={data.id} className={"index-project w3-right w3-col s6 m6 l"+width+" w3-display-container"}>
                <Link to={`/#${data['id']}`} scroll={el => {el.scrollIntoView({ behavior: 'instant', block: 'start', inline: 'nearest' }); window.scrollBy(0, -homeMargin); }}>
                    <img className="index-cover image-fuild opacity-hover" src={process.env.REACT_APP_S3_BUCKET_BASE_URL + data.cover} alt={data['name_' + this.context.lang]}/>
                    <div className="index-title w3-display-topleft w3-display-hover">
                        <h1>{data['name_' + this.context.lang]}</h1>
                        <p>{new Date(data.date).getFullYear()}</p>
                    </div>
                </Link>
            </article>
    }

    setMarginTop(all) {
        var nbSections = (all.length - all.length % 6) / 6 + 1
        window.addEventListener('load', function () {
            var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            if (w > 1920) {
                var paddingTop = 10
            } else {
                paddingTop = 20
            }
            var index = document.getElementById('Index')
            var sectionHeight = index.getElementsByTagName('section')[0].clientHeight
            var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            index.style.marginTop = h - sectionHeight * nbSections - 2*paddingTop + "px"
        })
    }

    render() {
        let nbArticles = 6
        var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        if (w <= 992) {
            nbArticles = 2
        }

        loadDataIfNeeded(this, '/projects', { lang: this.context.lang }, 'projects')
        loadDataIfNeeded(this, '/items', { lang: this.context.lang }, 'items')
        
        let all = front.orderByDate(this.state.projects.concat(this.state.items));
        
        // this.setMarginTop(all)

        var nbSections = 1
        var nbItems = all.length
        if (nbItems % 6 === 0) {
            nbSections = (nbItems - nbItems % 6) / 6
        } else {
            nbSections += (nbItems - nbItems % 6) / 6
        }
        if (nbSections > 4) {
            nbSections = 4
        }
        var paddingTop = 20
        if (w > 1920) {
            paddingTop = 10
        }
        let margin = '';
        if (w > 992) {
            var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            var sectionHeight = w*0.1057
            margin = h - sectionHeight * nbSections - 2*paddingTop
        }

        return <main id="Index" style={{marginTop: margin + 'px'}}>
            <div className="index-inner">
                    {this.renderReversedGrid(all, nbArticles)}
            </div>
            <div className="index-margin-bot w3-bottom"></div>
        </main>
    }
}

Index.contextType = UserContext;
