import express, {Router} from 'express';

const cards = ['files'];

export default class HomeController {
    public router: Router;
    constructor() {
        this.router = express.Router();
        this.router.get('/', this.index.bind(this));
    }

    private index(req, res): void {
        res.render('home/index', { cards });
    }

};