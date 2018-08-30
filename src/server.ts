import express from 'express';
import morgan from 'morgan';
import options from 'options-parser';
import fileUpload from 'express-fileupload';
import HomeController from './controllers/home'
import FilesController from './controllers/files'
import AuthController from './controllers/auth';

const { opt } = options.parse({
    user: {default: ' '},
    pass: {default: ' '},
    rootDir: {default: __dirname + '/../mock'},
    port: {default: 3000}
});
const ROOT_DIR = opt.rootDir;
const USERNAME = opt.user;
const PASSWORD = opt.pass;
const PORT = opt.port;

const app = express();
const home = new HomeController();
const files = new FilesController(ROOT_DIR);
const auth = new AuthController(USERNAME, PASSWORD);

app.set('view engine', 'ejs');
app.set('view options', { root: __dirname + '/../views'})
app.set('views', __dirname + "/../views");
app.set('port', PORT);

app.use(morgan('combined'));
app.use(fileUpload());
app.use(auth.router);
app.use(express.static(ROOT_DIR));
app.use(express.static(__dirname + '/../public', {dotfiles: 'allow'}));
app.use('/', home.router);
app.use('/files', files.router);

app.listen(app.get('port'));
