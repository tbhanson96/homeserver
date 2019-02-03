import express, { Router } from 'express';
import fs from 'fs';
import util from 'util';
import file from '../models/file';
import { parseTimestamp, parsePerms, splitDir, parseSize, removeHiddenFiles } from '../lib/file-util';
import VALID_FILE_TYPES from '../../config/valid-file-types';


export default class FilesController {
    public router: Router;
    public rootDir: string;
    private reqPath: string;
    private reqUserAgent: string;
    private showHiddenFiles: boolean;
    constructor(rootDir) {
        this.showHiddenFiles = false;
        this.rootDir = rootDir;
        this.router = express.Router();
        this.router.get('*', this.index.bind(this));
        this.router.post('*', this.upload.bind(this))
    }

    private index(req, res): void {
        if(req.query.hiddenFiles !== undefined) {
            this.showHiddenFiles = req.query.hiddenFiles == 'true';
        }

        let localDir = this.rootDir + decodeURI(req.path);
        let reqDir = decodeURI(req.path);
        this.reqPath = req.path;
        this.reqUserAgent = req.headers['user-agent'];
        let pathArr = splitDir(reqDir);
        let files = this.getFiles(localDir);

        res.render('files/index', { reqPath: this.reqPath, localDir, pathArr, files, hiddenFiles: this.showHiddenFiles, upload: null});
    }

    private upload(req, res): void {
        console.log('req path: ' + req.path)
        let reqDir = decodeURI(req.path);
        console.log('dirPath: ' + reqDir);
        let fileUploads = '';
        let errors = [];
        Object.keys(req.files).forEach((filename, index, arr) => {
            let file = req.files[filename];
            if(!file.name) {
                return;
            }
            const newpath = this.rootDir + reqDir + file.name;
            fileUploads += file.name + ' ';
            file.mv(newpath, (err) => {
                if(err) {
                    errors.push(err);
                }
                if(index === arr.length - 1 && errors.length === 0) {
                    res.render('files/index', { 
                        reqPath: this.reqPath,
                        localDir: this.rootDir + reqDir,
                        pathArr: splitDir(reqDir),
                        files: this.getFiles(this.rootDir + reqDir),
                        upload: fileUploads,
                        hiddenFiles: this.showHiddenFiles
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
        let reqDir = decodeURI(this.reqPath);
        if(!this.showHiddenFiles) {
            files = removeHiddenFiles(files);
        }
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
        let reqDir = decodeURI(this.reqPath);
        let type = VALID_FILE_TYPES[extension];
        if(!type) {
            type = 'file';
        }
        if (stats.isDirectory()) {
            type = 'dir';
        }
        let size = parseSize(stats.size);
        let name = stats.isDirectory() ? filename+'/' : filename;
        let link;
        if (type === 'pdf' && this.reqUserAgent.includes('Android')) {
            link = 'https://drive.google.com/viewerng/viewer?embedded=true&url=https://hansonserver.ddns.net'+reqDir+filename;
        } else if (type === 'xls' || type === 'xlsx' || type === 'docx') {
            link = 'https://drive.google.com/viewerng/viewer?embedded=true&url=https://hansonserver.ddns.net'+reqDir+filename;
        } else {
            link = stats.isDirectory() ? '/files'+reqDir+filename+'/' : reqDir+filename;
        }
        link = encodeURI(link);
        return { name, type, size, timestamp, permissions, link };
        
    }
};
