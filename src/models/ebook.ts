export default class Ebook {
    name: string;
    author: string;
    length: string;
    coverPath: string;
    constructor(attr: any) {
        this.name = attr.name;
        this.author = attr.author;
        this.length = attr.length;
        this.coverPath = attr.coverPath;
    }
}