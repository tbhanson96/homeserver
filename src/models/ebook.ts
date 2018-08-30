export default class Ebook {
    name: string;
    author: string;
    length: string;
    constructor(attr: any) {
        this.name = attr.name;
        this.author = attr.author;
        this.length = attr.length;
    }
}