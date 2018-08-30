import express, { Router } from 'express';
import fs from 'fs';
import util from 'util';
import file from '../models/file';
import { parseTimestamp, parsePerms, splitDir, parseSize } from '../lib/file-util';
import VALID_FILE_TYPES from '../../config/valid-file-types';


export default class FilesController {
    public router: Router;
    public rootDir: string;
    private reqDir: string;
    constructor(rootDir) {
        this.rootDir = rootDir;
        this.router = express.Router();
        this.router.get('*', this.index.bind(this));
        this.router.post('*', this.upload.bind(this))
    }

    private index(req, res): void {
        let localDir = this.rootDir + decodeURI(req.path);
        let reqDir = decodeURI(req.path);
        this.reqDir = reqDir;
        let pathArr = splitDir(reqDir);
        let files = this.getFiles(localDir);

        res.render('files/index', { reqDir, localDir, pathArr, files, upload: null});
    }

    private upload(req, res): void {
        let fileUploads = '';
        let errors = [];
        Object.keys(req.files).forEach((filename, index, arr) => {
            let file = req.files[filename];
            if(!file.name) {
                return;
            }
            const newpath = this.rootDir + req.path + file.name;
            fileUploads += file.name + ' ';
            file.mv(newpath, (err) => {
                if(err) {
                    errors.push(err);
                }
                if(index === arr.length - 1 && errors.length === 0) {
                    res.render('files/index', { 
                        reqDir: this.reqDir,
                        localDir: this.rootDir + this.reqDir,
                        pathArr: splitDir(this.reqDir),
                        files: this.getFiles(this.rootDir + this.reqDir),
                        upload: fileUploads
                    });
                }
            });
        });
        if(errors.length !== 0) {
            res.status(500).send(util.inspect(errors));
        }
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

    private getFileProps(filename: string, stats: any): object {
        let timestamp = parseTimestamp(stats.mtime.toDateString());
        let permissions = parsePerms(stats.mode.toString());
        let extension = filename.split('.').slice(-1)[0];
        let type = VALID_FILE_TYPES[extension];
        if(!type) {
            type = 'file';
        }
        if (stats.isDirectory()) {
            type = 'dir';
        }
        let size = parseSize(stats.size);
        let name = stats.isDirectory() ? filename+'/' : filename;
        let link = stats.isDirectory() ? '/files'+this.reqDir+filename+'/' : this.reqDir+filename;
        link = encodeURI(link);
        return { name, type, size, timestamp, permissions, link };
        
    }
};