import express from 'express';
import morgan from 'morgan';
import HomeController from './controllers/home'
import FilesController from './controllers/files'
import AuthController from './controllers/auth';

const ROOT_DIR = process.env.rootDir || __dirname + '/../mock';
const USERNAME = process.env.username || '';
const PASSWORD = process.env.password || '';
const app = express();
const home = new HomeController();
const files = new FilesController(ROOT_DIR);
const auth = new AuthController(USERNAME, PASSWORD);

app.set('view engine', 'ejs');
app.set('views', __dirname + "/../views");
app.set('port', process.env.port || 3000);

app.use(morgan('combined'));
app.use(auth.router);
app.use(express.static(ROOT_DIR));
app.use(express.static(__dirname + '/../public', {dotfiles: 'allow'}));
app.use('/', home.router);
app.use('/files', files.router);

app.listen(app.get("port"));
