const request = require('superagent');

export default class NavbarUtils {
    static async login(mail, password) {
        try {
            const body = await request.get('/login',{
                mail,
                password
            })
            return body.user;
        }
        catch(err){
            console.log(err);
            return err.message;   
        }
    }

    static async getMe(){
        try {
            const body = await request.get('/me',)
            return body.user;
        }
        catch(err){
            console.log(err);
            return err.message;   
        }
    }

    static async signUp(params) {
        try {
            const body = await request.get('/signup',params);
            return body.user;
        }
        catch(err){
            console.log(err);
            return err.message;   
        }
    }

    static async logout(){
        try {
            await request.get('/logout');
        }
        catch(err){
            console.log(err);
            return err.message;   
        }
    }
}