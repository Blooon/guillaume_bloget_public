const express = require('express');
const databaseModel = require('./base_model');
const mongoModel = require('./mongo_model')
const uuidv1 = require('uuid/v1');

function objectToLang(itemsConfig, object, lang) {
    // console.log({object})
    itemsConfig.forEach((item) => {
        if (item.lang === true) {
            object[item.name] = object[`${item.name}_${lang}`]
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
    if (Array.isArray(dtbResponse)) {
        dtbResponse.forEach(response => {
            objectToLang(itemsConfig, response, lang);
        });
        return dtbResponse;
    }
    return objectToLang(itemsConfig, dtbResponse, lang);
}

function getCurrentBasket(req, table) {
    if (!req.session.basket) {
        req.session.basket = []
    }
    return req.session.basket
}

function findInBasket(basket, table, id, typeId) {
    let value = basket.findIndex((item) => {
        if (item.table === table && item.id === id) {
            if(typeId && item.type && typeId == item.type._id) {
                return true;
            }
            else if (!typeId && !item.type) {
                return true
            }
        }
    });
    if (value !== -1) return value;
    return false;
}

class baseDatabase {
    constructor(database, isAdmin, FileUtils, config, freeAccessRule) {
        const params = config.params;

        this.items = config.items;
        this.types = config.types;

        this.files = config.items.filter(item => {return item.type === "file"} );
        this.table = params.name;
        this.filePath = params.filePath;
        this.fileList = params.gotFileList;
        this.gotImagesList = params.gotImagesList;
        this.adminPath = params.adminPath;
        this.freeAccess = params.freeAccess;
        this.buyable = params.buyable;
        this.gotTypes = params.gotTypes;
        this.multi_lang = params.multi_lang;
        this.FileUtils = FileUtils;
        this.isAdmin = isAdmin;
        this.freeAccessRule = freeAccessRule;
        this.router = express.Router();
        this.setRoad();
        if (database.type === "mysql") {
            this.databaseModel = new databaseModel(database.config);
        }
        else if (database.type === "nosql") {
            this.databaseModel = new mongoModel(database.config, this.table);
        }
    }

    setRoad() {
        if (this.adminPath) {
            this.router.use(`/admin/${this.table}`, this.isAdmin);
        }
        this.router.get(`/admin/${this.table}/:${this.table}Id`, (req, res) => this.getAdminItem(req, res));
        this.router.get(`/admin/${this.table}s`, (req, res) => this.getAdminItems(req, res));
        this.router.post(`/admin/${this.table}`, (req, res) => this.addItem(req, res));
        this.router.put(`/admin/${this.table}/:${this.table}Id`, (req, res) => this.updateItem(req, res));
        this.router.delete(`/admin/${this.table}/:${this.table}Id`, (req, res) => this.deleteItem(req, res));
        if (this.freeAccess) {
            this.router.use(`/${this.table}`, this.freeAccessRule);
            this.router.get(`/${this.table}/:${this.table}Id`, (req, res) => this.getItem(req, res));
            this.router.get(`/${this.table}s`, (req, res) => this.getItems(req, res));
            this.router.get(`/${this.table}s/full`, (req, res) => this.getFullItems(req, res));
        }
        if (this.buyable) {
            this.router.get(`/basket`, (req, res) => this.getBasket(req, res));
            this.router.post(`/basket/${this.table}/:${this.table}Id`, (req, res) => this.addToBasket(req, res));
            this.router.put(`/basket/${this.table}/:${this.table}Id`, (req, res) => this.addToBasket(req, res));
            this.router.delete(`/basket/${this.table}/:${this.table}Id`, (req, res) => this.removeFromBasket(req, res));
        }
        if (this.fileList) {
            this.router.post(`/admin/${this.table}/:${this.table}Id/file`, (req, res) => this.addFilesToItem(req, res));
            this.router.delete(`/admin/${this.table}/:${this.table}Id/file/:fileId`, (req, res) => this.deleteFileAssociatedToItem(req, res));
        }
        if (this.gotImagesList) {
            this.router.post(`/admin/${this.table}/:${this.table}Id/image`, (req, res) => this.addImagesToItem(req, res));
            this.router.delete(`/admin/${this.table}/:${this.table}Id/image/:imagesId`, (req, res) => this.deleteImagesAssociatedToItem(req, res));
            this.router.put(`/admin/${this.table}/:${this.table}Id/image/:imagesId`, (req, res) => this.updateImageOrder(req, res));
        }
        if (this.gotTypes) {
            this.router.post(`/admin/${this.table}/:${this.table}Id/type`, (req, res) => this.addTypeToItem(req, res));
            this.router.delete(`/admin/${this.table}/:${this.table}Id/type/:typesId`, (req, res) => this.deleteTypesAssociatedToItem(req, res));
            // this.router.put(`/admin/${this.table}/:${this.table}Id/type/:typesId`, (req, res) => this.updateTypeOrder(req, res));            
        }
    }

    async addTypeToItem(req, res) {
        for (let item of this.types[0].items) {
            if (item.type === 'file') {
                let filename = uuidv1();
                const base64result = req.body.files[item.name].data.split(',')[1];
                const fileData =  Buffer.from(base64result, 'base64');
                await this.FileUtils.uploadFile(fileData, this.filePath + filename);
                req.body[item.name] = this.filePath + filename;
            }
        }
        delete req.body.files;
        await this.databaseModel.addTypeToItem(this.table, req.params[`${this.table}Id`], req.body)
        await this.getAdminItem(req, res);
    }

    async deleteTypesAssociatedToItem(req, res) {
        await this.databaseModel.removeTypefromItem(this.table, req.params[`${this.table}Id`], req.params.typesId);
        await this.getAdminItem(req, res);
    }

    async getBasket(req, res) {
        const basket = getCurrentBasket(req)
        await this.renderResponse(basket, res);
    }
    async addToBasket(req, res) {
        const basket = getCurrentBasket(req);
        let index = findInBasket(basket, this.table, req.params[`${this.table}Id`], req.body.typeId);
        let item = basket[index];
        if (item) {
            item.amount = (req.body.amount) ? req.body.amount : item.amount + 1
        }
        else {
            item = await this.databaseModel.getItem(this.table, req.params[`${this.table}Id`]);
            if (this.types && req.body.typeId) {
                item.type = await this.databaseModel.getType(req.body.typeId);
            }
            let newItem = {
                table: this.table,
                id: req.params[`${this.table}Id`],
                amount: (req.body.amount) ? req.body.amount : 1,
                ...item
            }
            basket.push(newItem);
        }
        await this.renderResponse(basket, res);
    }

    async removeFromBasket(req, res) {
        const basket = getCurrentBasket(req);
        let index = findInBasket(basket, this.table, req.params[`${this.table}Id`], req.body.typeId);
        if (index >= 0) {
            basket.splice(index, 1);
        }
        await this.renderResponse(basket, res);

    }

    async getItem(req, res) {
        const item = await this.databaseModel.getItem(this.table, req.params[`${this.table}Id`]);

        if (this.fileList) {
            item.files = await this.databaseModel.getFilesAssociatedToItem(this.table, req.params[`${this.table}Id`])
        }
        if (this.gotImagesList) {
            item.images = await this.databaseModel.getImagesAssociatedToItem(this.table, req.params[`${this.table}Id`]);
        }
        if (this.types) {
            item.types = await this.databaseModel.getTypesAssociatedToItem(this.table, req.params[`${this.table}Id`]);
        }
        if (this.multi_lang) {
            returnLangage(this.items, item, req);
        }
        await this.renderResponse(item, res);
    }

    async getItems(req, res) {
        const items = await this.databaseModel.getItems(this.table);
        if (this.multi_lang) {
            returnLangage(this.items, items, req);
        }
        await this.renderResponse(items, res);
    }
    async getFullItems(req, res) {
        const items = await this.databaseModel.getItems(this.table);
        for(let i = 0; i < items.length; i++) {
            items[i].images = await this.databaseModel.getImagesAssociatedToItem(this.table, items[i].id.toString());
        }
        if (this.multi_lang) {
            returnLangage(this.items, items, req);
        }
        await this.renderResponse(items, res);
    }
    async getAdminItem(req, res) {
        const item = await this.databaseModel.getItem(this.table, req.params[`${this.table}Id`]);
        if (this.fileList) {
            item.files = await this.databaseModel.getFilesAssociatedToItem(this.table, req.params[`${this.table}Id`])
        }
        if (this.gotImagesList) {
            item.images = await this.databaseModel.getImagesAssociatedToItem(this.table, req.params[`${this.table}Id`]);
        }
        if (this.types) {
            item.types = await this.databaseModel.getTypesAssociatedToItem(this.table, req.params[`${this.table}Id`]);
        }
        await this.renderResponse(item, res);
    }

    async getAdminItems(req, res) {
        const items = await this.databaseModel.getItems(this.table);
        await this.renderResponse(items, res);
    }

    async updateItem(req, res) {
        for (let i = 0; i < this.files.length; i++) {
            let filename = req.body[this.files[i].name].name
            if (req.body[this.files[i].name].data) {
                const base64result = req.body[this.files[i].name].data.split(',')[1];
                const fileData =  Buffer.from(base64result, 'base64');
                await this.FileUtils.uploadFile(fileData,this.filePath + filename);
                req.body[this.files[i].name] =this.filePath + req.body[this.files[i].name].name;
            }
        }
        delete req.body.files;
        delete req.body.images;
        delete req.body.order;
        await this.databaseModel.updateItem(this.table, req.body, req.params[`${this.table}Id`]);
        const item = await this.databaseModel.getItem(this.table, req.params[`${this.table}Id`]);
        await this.renderResponse(item, res);
    }
    async deleteItem(req, res) {
        await this.databaseModel.deleteItem(this.table, req.params[`${this.table}Id`]);
        await this.renderResponse({ message: "Success" }, res);

    }
    async addItem(req, res) {
        for (let i = 0; i < this.files.length; i++) {
            let filename = req.body[this.files[i].name].name
            const base64result = req.body[this.files[i].name].data.split(',')[1];
            const fileData =  Buffer.from(base64result, 'base64');
            await this.FileUtils.uploadFile(fileData,this.filePath + filename);
            req.body[this.files[i].name] = this.filePath + filename;
        }
        const types = req.body.types
        delete req.body.types;
        const itemId = await this.databaseModel.addItem(this.table, req.body);
        if (this.types && types) {
            for (let i = 0; i < types.length; i++) {
                let filename = uuidv1();
                const base64result = types[i].data.split(',')[1];
                const fileData =  Buffer.from(base64result, 'base64');
                await this.FileUtils.uploadFile(fileData, this.filePath + filename);
                types[i].filename = this.filePath + filename;
                delete type[i].data;
                await this.databaseModel.addTypeToItem(this.table, itemId, types[i])
            }
        }
        const item = await this.databaseModel.getItem(this.table, itemId);
        await this.renderResponse(item, res);
    }

    async addFilesToItem(req, res) {
        const dossier =this.filePath
        await this.FileUtils.uploadBase64File(req.body.file.data, dossier, req.body.file.name)        
        let filename = dossier + req.body.file.name;
        await this.databaseModel.addFileToItem(this.table, req.params[`${this.table}Id`], filename, req.body.file.order)
        await this.getItem(req, res);
    }

    async deleteFileAssociatedToItem(req, res) {
        await this.databaseModel.deleteFileAssociatedToItem(this.table, req.params.fileId);
        await this.renderResponse({ message: 'Success' }, res);
    }

    async addImagesToItem(req, res) {
        const dossier =this.filePath
        await this.FileUtils.uploadBase64File(req.body.file_small.data, dossier, req.body.file_small.name)
        await this.FileUtils.uploadBase64File(req.body.file_medium.data, dossier, req.body.file_medium.name)
        await this.FileUtils.uploadBase64File(req.body.file_large.data, dossier, req.body.file_large.name)
        await this.databaseModel.addImagesToItem(
            this.table,
            req.params[`${this.table}Id`],
            dossier + req.body.file_small.name,
            dossier + req.body.file_medium.name,
            dossier + req.body.file_large.name,
            req.body.order)
        await  new Promise(function(resolve) {
            setTimeout(resolve, 1000);
        });
        await this.getAdminItem(req, res);
    }

    async updateImageOrder(req, res) {
        if (!req.body.order) {
            req.body.order = 0;
        }
        await this.databaseModel.updateImageOrder(this.table, req.params.imagesId, req.body.order);
        await this.renderResponse({ message: 'Success' }, res);
    }

    async deleteImagesAssociatedToItem(req, res) {
        await this.databaseModel.deleteImagesAssociatedToItem(this.table, req.params.imagesId);
        await this.renderResponse({ message: 'Success' }, res);
    }

    async renderResponse(data, res) {
        await res.send({ status: 200, data });
    }

}

module.exports = baseDatabase;