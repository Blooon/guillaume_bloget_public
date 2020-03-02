import React from 'react';
// import { Link } from 'react-router-dom';
// import { LangContext } from '../Contexts/LangContext';

export default class FrontUtils {
    constructor(props){
        // super(props);
        this.state = {
            lang: 'en'
        }
    }
    
    static renderText(text) {
        if (text !== undefined && text !== null) {
            text = text.split('§')
            const render = text.map((part, index) => {
                if (index === text.length-1) {
                    return <span key={index}>{part}</span>
                }
                return <span key={index}>{part}<br/></span>
            })
            return render
        }
        return null
    }

    static renderReversedGrid(datas, nbItemsPerRow, renderCol) {
        const size = datas.length;
        const colWidth = 12/nbItemsPerRow;
        const rest = size % (12/colWidth);
        let rows = [];
        let i = 0;
        if (rest !== 0) {
            rows.push(this.renderRow(datas, i, rest, nbItemsPerRow, renderCol))
        }
        i = rest;
        for (i; i < size; i+=nbItemsPerRow) {
            rows.push(this.renderRow(datas, i, i+nbItemsPerRow, nbItemsPerRow, renderCol))
        }
        return <div className="">
            {rows}
        </div>
    }

    static renderRow(datas, start, end, nbItemsPerRow, renderCol) {
        let cols = [];
        const width = 12/nbItemsPerRow
        for (let i = end-1; i >= start; i--) {
            cols.push(renderCol(datas[i], width));
        }
        return <section key={datas[start].id} className="w3-row">
            {cols}
        </section>
    }

    // date input format : numDay Mmm YYYY (en)
    static orderByDate(array) {
        let i = 0;
        while (i < array.length-1) {
            if (new Date(array[i].date) < new Date(array[i+1].date)) {
                let tmp = array[i];
                array[i] = array[i+1]
                array[i+1] = tmp
                i = 0
            } else i++
        }
        return array
    }
}