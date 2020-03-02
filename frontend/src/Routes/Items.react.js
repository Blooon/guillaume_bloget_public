import React from 'react';
import { Link } from "react-router-dom";
import front from '../Utils/front.utils';
import { UserContext } from '../Contexts/UserContext';
import { loadDataIfNeeded } from '../Utils/loadDataIfNeeded.utils';

export default class Items extends React.Component {
    constructor(props) {
        super (props);
        this.state = {
            items: [],
            error: '',
            lang: 'en'
        }
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
        return <article key={data.id} className={"index-project w3-right w3-col s12 m8 l"+width+" w3-display-container"}>
                <Link to={`/items/${data.id}`}>
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
            var shop = document.getElementById('Shop')
            var sectionHeight = shop.getElementsByTagName('section')[0].clientHeight
            var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            shop.style.marginTop = h - sectionHeight * nbSections - paddingTop + "px"
        })
    }

    render() {
        let nbArticles = 3
        var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        if (w <= 992) {
            nbArticles = 1
        }
        
        loadDataIfNeeded(this, '/items/full', { lang: this.context.lang }, 'items')

        let items = front.orderByDate(this.state.items);
        // this.setMarginTop(items)

        var nbSections = 1
        var nbItems = items.length
        if (nbItems % 3 === 0) {
            nbSections = (nbItems - nbItems % 3) / 3
        } else {
            nbSections += (nbItems - nbItems % 3) / 3
        }
        if (nbSections > 2) {
            nbSections = 2
        }
        var paddingTop = 20
        if (w > 1920) {
            paddingTop = 10
        }
        let margin = '';
        if (w > 992) {
            var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            var sectionHeight = w*0.2071
            margin = h - sectionHeight * nbSections - 2*paddingTop
        }

        return <main id="Shop" style={{marginTop: margin + 'px'}}>
            <div className="shop-inner">
                {this.renderReversedGrid(items, nbArticles)}
            </div>
            <div className="index-margin-bot w3-bottom"></div>
        </main>
    }
}

Items.contextType = UserContext;
