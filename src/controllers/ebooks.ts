import express, { Router } from 'express';
import fs from 'fs';
import util from 'util';
import epub from 'epub';
import Calibre from 'node-calibre';
import Ebook from '../models/ebook';

export default class EbooksController {
    public router: Router;
    private ebookDir: string;

    public constructor(ebookDir: string) {
        this.ebookDir = ebookDir;
        this.router = express.Router();
        this.router.get('*', this.index.bind(this));
        this.router.post('*', this.upload.bind(this))
    }

    public index(req, res): void {
        this.getBooks((books) => {
            res.render('ebooks/index', { books });
        });
    }

    public upload(req, res): void {
        let errors = [];
        Object.keys(req.files).forEach((filename) => {
            let file = req.files[filename]; 
            if(!file.name) {
                return;
            }
            file.mv(this.ebookDir + file.name, (err) => {
                if(err) {
                    errors.push(err);
                } else if(errors.length === 0) {
                    this.index(req, res);
                }
            });
        });
        if (errors.length !== 0) {
            res.status(500).send(util.inspect(errors));
        }
    }

    private getBooks(cb: Function): void {
        let ret: Ebook[] = [];
        let done = false;
        fs.readdirSync(this.ebookDir).forEach((file, index, arr) => {
            const ebook = new epub(this.ebookDir + file);
            ebook.on('end', function() {
                ret.push(new Ebook({
                    name: ebook.metadata.title,
                    author: ebook.metadata.creator,
                    description: ebook.metadata.description

                }));
                if(index === arr.length-1) {
                    cb(ret);
                }
            });
            ebook.parse();
        });
    }

    private convertEpubToMobi(filename: string): void {
        const calibre = new Calibre({ library: this.ebookDir });
        // calibre.run('calibredb add', [this.ebookDir + filename])
        //         .then(result => {
        //             console.log(result);

        //             return calibre.run('ebook-convert', [this.ebookDir + filename, this.ebookDir + ])
        //         })
    }


}