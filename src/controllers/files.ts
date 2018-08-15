import express, { Router } from 'express';
import fs from 'fs';


export default class FilesController {
    public router: Router;
    private ROOT_DIR = '~/Documents/'
    constructor() {
        this.router = express.Router()
        this.router.get('*', this.index)
    }

    private index(req, res) {
        const dir = req.baseUrl;
        console.log(dir);
        res.send("YAY");
    }
}