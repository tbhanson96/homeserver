import express from 'express';
import morgan from 'morgan';
import gallery from 'express-photo-gallery';
import fileUpload from 'express-fileupload';
import HomeController from './controllers/home'
import FilesController from './controllers/files'
import AuthController from './controllers/auth';
import EbooksController from './controllers/ebooks';

class Server {
    private app: any;
    private home: HomeController;
    private files: FilesController;
    private auth: AuthController;
    private ebooks: EbooksController;

    private ROOT_DIR: string;
    private EBOOK_DIR: string;
    private PHOTOS_DIR: string;
    private USER: string;
    private PASSWORD: string;
    private PORT: number;
    private EMAIL_USER: string;
    private EMAIL_PASS: string;

    constructor() {
        this.app = express();
    }

    public configure(opts: any): void {
        this.PORT = opts.port;
        this.ROOT_DIR = opts.rootDir;
        this.EBOOK_DIR = opts.ebookDir;
        this.PHOTOS_DIR = opts.photosDir;
        this.USER = opts.user;
        this.PASSWORD = opts.pass;
        this.EMAIL_USER = opts.emailUser;
        this.EMAIL_PASS = opts.emailPass;

        this.home = new HomeController();
        this.files = new FilesController(opts.rootDir);
        this.auth = new AuthController(opts.user, opts.pass);
        this.ebooks = new EbooksController(this.EBOOK_DIR, this.EMAIL_USER, this.EMAIL_PASS);

        this.app.set('view engine', 'ejs');
        this.app.set('view options', { root: __dirname + '/../views'})
        this.app.set('views', __dirname + "/../views");
        this.app.set('port', this.PORT);

        this.app.use(morgan('combined'));
        this.app.use(fileUpload());
        this.app.use(this.auth.router);
        this.app.use(express.static(this.ROOT_DIR));
        this.app.use(express.static(this.EBOOK_DIR));
        this.app.use(express.static(__dirname + '/../public', {dotfiles: 'allow'}));
        this.app.use('/', this.home.router);
        this.app.use('/files', this.files.router);
        this.app.use('/ebooks', this.ebooks.router);
        this.app.use('/photos', gallery(this.PHOTOS_DIR, {title: "Photos"}));
    }

    public start(): void {
        this.app.listen(this.PORT);
    }

    public getExpressApp(): any {
        return this.app;
    }
};

module.exports = Server;
