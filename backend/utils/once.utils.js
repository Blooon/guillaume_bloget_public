const knex = require('./knex.utils');
const express = require('express');
const middlewares = require('./middlewares.utils');
const onceModel = require('./once_mongo.model');


function objectToLang(itemsConfig, object, lang) {
    itemsConfig.forEach((item) => {
        if (item.lang === true) {
            item[item.name] = item[`${item.name}_${lang}`]
        }
    })
}

function returnLangage(itemsConfig, dtbResponse, req) {
    let lang;
    if (req.body && req.body.lang) {
        lang = req.body.lang;
    }
    else if (req.query && req.query.lang) {
        lang = req.query.lang;
    }
    else {
        throw new Error("No lang specified");
    }
    if (typeof(dtbResponse) === Array) {
        dtbResponse.forEach(response => {
            objectToLang(itemsConfig, response, lang);
        });
        return dtbResponse;
    }
    return objectToLang(itemsConfig, dtbResponse, lang);
}
class Static {
    constructor(key, entries) {
        this.key = key;
        this.entries = entries;
        this.router = express.Router();
        this.setRoads();
    }

    setRoads() {
        if (this.adminPath) {
            this.router.use(`/admin/${this.key}`, middlewares.isAdmin);
        }
        this.router.get(`/once/${this.key}`, (req, res) => this.getOnceItem(req, res))
        this.router.get(`/admin/once/${this.key}`, (req, res) => this.getOnceItemAdmin(req, res))
        this.router.put(`/admin/once/${this.key}`, (req, res) => this.updateOnceItem(req, res))
    }

    async updateOnceItem(req, res) {
        await onceModel.updateOnce(req.body, this.key);
        const once = await onceModel.getOnce(this.key)
        await this.renderResponse(once, res);
    }

    async getOnceItem(req, res) {

        let once = await onceModel.getOnce(this.key);
        if (!once) {
            once = {}
        }
        returnLangage(this.entries, once, req);
        await this.renderResponse(once, res);
    }

    async getOnceItemAdmin(req, res) {
        let once = await onceModel.getOnce(this.key);
        if (!once) {
            once = {}
        }
        await this.renderResponse(once, res);
    }


    async renderResponse(data, res) {
        await res.send({ status: 200, data });
    }


}

module.exports = Static