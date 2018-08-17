import express, { Router } from 'express';
import fs from 'fs';
import file from '../models/file';
import { parseTimestamp, parsePerms, splitDir } from '../lib/file-util';
import VALID_FILE_TYPES from '../../config/valid-file-types'


export default class FilesController {
    public router: Router;
    public ROOT_DIR = '/home/tim';
    constructor() {
        this.router = express.Router();
        this.router.get('*', this.index.bind(this));
    }

    private index(req, res) {
        let localDir = this.ROOT_DIR + req.path;
        let reqDir = req.path;
        let pathArr = splitDir(reqDir);
        let files = this.getFiles(localDir);
        res.render('files/index', { reqDir, localDir, pathArr, files });
    }

    private getFiles(dir: string): file[] {
        let ret: file[] = [];
        let files = fs.readdirSync(dir);
        for (let f of files) {
            let stats = fs.statSync(dir + f);
            const props = this.getFileProps(f, stats); 
            ret.push(new file(props));
        }
        return ret;
    }

    private getFileProps(filename, stats: any): object {
        let timestamp = parseTimestamp(stats.birthtime.toDateString());
        let permissions = parsePerms(stats.mode.toString());
        let type = filename.split('.').slice(-1)[0];
        if (!VALID_FILE_TYPES.includes(type)) {
            type = "file";
        }
        if (stats.isDirectory()) {
            type = "dir";
        }
        let size = stats.size;
        let name = stats.isDirectory() ? filename+'/' : filename;

        return { name, type, size, timestamp, permissions };
        
    }
};