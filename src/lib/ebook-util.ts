import epub from 'epub';
import Calibre from 'node-calibre';

function parseName(filename: string): string {
    let arr = filename.split('.');
    arr.splice(-1);
    return arr.join('.');
}

function getFileExt(filename: string): string {
    return filename.split('.').slice(-1)[0];
}

function getEpubCover(filepath: string, cb: Function): void {
    let book = new epub(filepath);
    book.on("end", function(err){
        if(err) {
            cb(err, null);
        } else {
            book.getImage('coverimage', (err, img, mimType) => {
                if (err) {
                    console.log(err);
                } else {
                    cb(null, img);
                }
            });
        }
    });
    book.parse();
}

function convertToMobi(filename: string, cb: Function): void {
    const calibre = new Calibre({ library: this.ebookDir });
    calibre.run('ebook-convert', [this.ebookDir + filename, this.ebookDir + parseName(filename) + '.mobi'])
           .then(result => {
                cb(result);
            });
}

export { parseName, getFileExt, getEpubCover, convertToMobi };