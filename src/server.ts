import express from 'express';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';
import HomeController from './controllers/home'
import FilesController from './controllers/files'

const ROOT_DIR = process.env.rootDir || __dirname + '/../mock';
const app = express();
const home = new HomeController();
const files = new FilesController(ROOT_DIR);

app.set('view engine', 'ejs');
app.set('views', __dirname + "/../views");
app.set('port', process.env.port || 3000);

app.use(fileUpload());
app.use(express.static(ROOT_DIR));
app.use(express.static(__dirname + '/../public', {dotfiles: 'allow'}));
app.use(morgan('combined'));
app.use('/', home.router);
app.use('/files', files.router);

app.listen(app.get("port"));
