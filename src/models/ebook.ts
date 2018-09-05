export default class Ebook {
    id: number;
    name: string;
    author: string;
    length: string;
    description: string;
    coverPath: string;
    constructor(attr: any) {
        this.id = attr.id;
        this.name = attr.name;
        this.author = attr.author;
        this.length = attr.length;
        this.coverPath = attr.coverPath;
        this.description = attr.description;
    }
}