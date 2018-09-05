import epub from 'epub';
import fs from 'fs';
import Calibre from 'node-calibre';

function parseName(filename: string): string {
    let arr = filename.split('.');
    arr.splice(-1);
    return arr.join('.');
}

function getFileExt(filename: string): string {
    return filename.split('.').slice(-1)[0];
}

function convertToMobi(ebookDir: string, filepath: string, cb: Function): void {
    const calibre = new Calibre({ library: ebookDir });
    calibre.run('ebook-convert', [filepath, parseName(filepath) + '.mobi'])
           .then(result => {
                cb(result);
            });
}

function scanLibForEpubs(ret: any[], ebookDir: string, curDir: string): void {
    fs.readdirSync(ebookDir + curDir).forEach((path, index, arr) => {
        let stats = fs.statSync(ebookDir + curDir + '/' + path);
        if(stats.isDirectory()) {
            scanLibForEpubs(ret, ebookDir, curDir +'/' + path);
        }
        if (getFileExt(path) === 'epub') {
            ret.push({
                book: curDir + '/' + path,
                cover: fs.existsSync(ebookDir + curDir + '/cover.jpg') ? curDir + '/cover.jpg' : null
            });
        }
    });
}

function addBook(ebookDir: string, filepath: string, cb: Function): void {
    const calibre = new Calibre({ library: ebookDir });
    calibre.run('calibredb add', [filepath])
            .then(result => {
                console.log(result);
                cb(result);
            });
}

export { parseName, getFileExt, convertToMobi, scanLibForEpubs, addBook };