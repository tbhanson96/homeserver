import express, { Router } from 'express';
import fs from 'fs';
import util from 'util';
import EMAIL_CRED from '../../config/email-credentials';
import epub from 'epub';
import { parseName, getFileExt, convertToMobi, getEpubCover } from '../lib/ebook-util';
import nodemailer from 'nodemailer';
import Ebook from '../models/ebook';

export default class EbooksController {
    public router: Router;
    private ebookDir: string;
    private EMAIL_USER: string;
    private EMAIL_PASS: string;

    public constructor(ebookDir: string, emailUser: string, emailPass: string) {
        this.EMAIL_USER = emailUser;
        this.EMAIL_PASS = emailPass;
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
                    if(req.body && req.body.sendToKindle === 'on') {
                        console.log('sent to kindle');
                        this.sendEbookToKindle(file.name);
                    }
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
        const files = fs.readdirSync(this.ebookDir);
        let numMobi = 0;
        files.forEach((file, index, arr) => {
            if (getFileExt(file) === 'epub') {
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
            } else {
                numMobi++;
            }
        });
        if(numMobi === files.length) {
            cb(ret);
        }
    }



    private sendEbookToKindle(filename: string): void {
        const { host, port, secure, from, to } = EMAIL_CRED;
        let mailer = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: {
                user: this.EMAIL_USER,
                pass: this.EMAIL_PASS
            }
        });
        let options = {
            from,
            to,
            attachments: [
                {
                    path: this.ebookDir + parseName(filename) + '.mobi'
                }
            ]
        }
        if (getFileExt(filename) === 'epub') {
            convertToMobi(filename, (result) => {
                mailer.sendMail(options, (err, info) => {
                    if(err) {
                        return console.log(err);
                    }
                });
            });
        } else {
            mailer.sendMail(options, (err, info) => {
                if (err) {
                    return console.log(err);
                }
            });
        }
    }
}