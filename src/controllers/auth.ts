import auth from 'basic-auth';
import secureCompare from 'secure-compare';
import express, { Router } from 'express';

export default class AuthController {

    private username: string;
    private password: string;
    public router: Router;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
        this.router = express.Router();
        this.router.get('*', this.authenticate.bind(this));
    }

    private authenticate(req, res, next) {
        if(this.username === ' ' || this.password === ' ') {
            next();
            return;
        }
        const credentials = auth(req);

        if (credentials) {
            const usernameEqual = secureCompare(this.username, credentials.name);
            const passwordEqual = secureCompare(this.password, credentials.pass);

            if (usernameEqual && passwordEqual) {
                next();
                return;
            }
        }

        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm=""');
        res.end('Access denied');
    }


}