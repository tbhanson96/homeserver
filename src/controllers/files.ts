import express, { Router } from 'express';
import fs from 'fs';
import file from '../models/file';
import { parseTimestamp, parsePerms } from '../lib/file-util';

// const files = [ 
//     { name: 'file1', type: 'pdf', timestamp: '303003', size: '11 bytes', permissions: 'r--rw-rwx'},
//     { name: 'file2', type: 'png', timestamp: '3034353', size: '133 bytes'},
//     { name: 'file3', type: 'pdf', timestamp: '30asdf3', size: '133 bytes'},
//     { name: 'file4', type: 'mp3', timestamp: '303003', size: '19432 bytes'},
//     { name: 'file5', type: 'xls', timestamp: '303sdf3', size: '14 bytes'}
// ]

export default class FilesController {
    public router: Router;
    public ROOT_DIR = '.';
    constructor() {
        this.router = express.Router();
        this.router.get('*', this.index.bind(this));
    }

    private index(req, res) {
        let dir = this.ROOT_DIR + req.path;
        console.log(dir);
        let files = this.getFiles(dir);
        res.render('files/index', { dir, files });
    }

    private getFiles(dir: string): file[] {
        let ret: file[] = [];
        let files = fs.readdirSync(dir);
        for (let f of files) {
            let stats = fs.statSync(f);
            ret.push(new file({
                name: f,
                timestamp: parseTimestamp(stats.birthtime.toDateString()),
                permissions: parsePerms(stats.mode.toString()),
                type: f.split('.').slice(-1)[0],
                size: stats.size,
            }));
        }
        return ret;
    }
}