import util from 'util';
import downloader from 'youtube-mp3';
import express, { Router } from 'express';

export default class MusicController {
    public router: Router;

    public constructor() {
        this.router = express.Router();
        this.router.get('/', this.index.bind(this));
    }

    private index(req, res): void {
        res.render('music/index', {});
    }
    
};