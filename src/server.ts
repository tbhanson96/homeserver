import express from 'express';
import morgan from 'morgan';
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

    private ROOT_DIR: string;
    private EBOOK_DIR: string;
    private USER: string;
    private PASSWORD: string;
    private PORT: number;

    constructor() {
        this.app = express();
    }

    public configure(opts: any): void {
        this.PORT = opts.port;
        this.ROOT_DIR = opts.rootDir;
        this.EBOOK_DIR = opts.ebookDir;
        this.USER = opts.user;
        this.PASSWORD = opts.pass;

        this.home = new HomeController();
        this.files = new FilesController(opts.rootDir);
        this.auth = new AuthController(opts.user, opts.pass);

        this.app.set('view engine', 'ejs');
        this.app.set('view options', { root: __dirname + '/../views'})
        this.app.set('views', __dirname + "/../views");
        this.app.set('port', this.PORT);

        this.app.use(morgan('combined'));
        this.app.use(fileUpload());
        this.app.use(this.auth.router);
        this.app.use(express.static(this.ROOT_DIR));
        this.app.use(express.static(__dirname + '/../public', {dotfiles: 'allow'}));
        this.app.use('/', this.home.router);
        this.app.use('/files', this.files.router);
    }

    public start(): void {
        this.app.listen(this.PORT);
    }
};

module.exports = Server;
