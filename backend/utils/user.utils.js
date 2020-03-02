const Schema = require('validate')
const user_model = require('./user_model');
const express = require('express');
const uuidv1 = require('uuid/v1');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        length: { min: 4, max: 255},
    },
    password: {
        type: String,
        required: true,
        length: { min: 4, max: 255  }
    },
    email: {
        type: String,
        required: true,
        length: { min: 4, max: 255  }
    }
});



const userUpdateSChema = new Schema({
    username: {
        type: String,
        required: false,
        length: { min: 4, max: 255},
    },
    password: {
        type: String,
        required: false,
        length: { min: 4, max: 255  }
    },
    email: {
        type: String,
        required: false,
        length: { min: 4, max: 255  }
    }
});

class User {
    constructor(databse) {
        // this.allow_signup = params.allow_signup;
        this.bdd = new user_model(databse.config);
        this.router = express.Router();
        this.generateRouter();
    }

    generateRouter() {
        // if (this.allow_signup) {
        //     this.router.post('/signup', (req, res) => this.signup(req, res));
        // }
        this.router.post('/login', (req, res) => this.login(req, res));
        this.router.post('/logout', (req, res) => this.logout(req, res));
        this.router.get('/me', (req, res) => this.connected(req, res));
    }

    connected(req, res) {
        console.log("connected")
        if (req.session.connected === true) {
            return res.send({connected: true})
        }
        res.status(401).send()
    }
    async login(req, res) {
        console.log("here")
        if (req.session.connected === true) {
            throw new Error('Already connected')
        }
        const errors = userSchema.validate(req.body);
        if (errors.length > 1) {
            await res.status(400).send({ errors: errors.map(error => error.message) })
            return;
        }
        console.log("getting bdd");
        const user = await this.bdd.get({
            password: req.body.password,
            login: req.body.email
        });
        console.log(user)
        if (user.length < 1) {
            throw new Error('Wrong login or password');
        }
        req.session.user = user[0];
        req.session.connected = true;
        await this.renderResponse({ user: user[0]}, res);

    }

    // async signup(req, res) {
    //     const errors = userSchema.validate(req.body);
    //     if (errors.length > 1) {
    //         await res.status(400).send({ errors: errors.map(error => error.message) })
    //         return;
    //     }
    //     console.log(req.body);
    //     const userId = await this.bdd.add(req.body);
    //     const user = await this.bdd.get({ id: userId });
    //     await this.renderResponse({ user: user[0] }, res);
    // }

    // async update(req, res) {
    //     const errors = userUpdateSChema.validate(req.body);
    //     if (errors.length > 1) {
    //         await res.status(400).send({ errors: errors.map(error => error.message) })
    //         return;
    //     }
    //     const newUser = await this.bdd.update({
    //         username: req.body.username,
    //         password: req.body.password,
    //         email: req.body.email
    //     }, req.session.user.id);
    //     req.session.user = newUser;
    //     await this.renderResponse({ user: user }, res);
    // }

    // async setProfilePicture(req, res) {
    //     const path = await this.fileUtils.uploadBase64File(req.body.data, 'user_profile', uuidv1());
    //     const newUser = await this.bdd.update({
    //         profile: path
    //     }, req.session.user.id);
    //     await this.renderResponse({ user: newUser}, res);
    // }

    async logout(req, res) {
        delete req.session.user;
        delete req.session.connected;
        await this.renderResponse({ message: "ok" }, res)
    }

    async renderResponse(data, res) {
        await res.send({ status: 200, data });
    }
}

module.exports = User;