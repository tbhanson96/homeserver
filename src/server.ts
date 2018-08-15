import express from 'express';
import morgan from 'morgan';
import HomeController from './controllers/home'
import FilesController from './controllers/files'

const app = express();
const home = new HomeController();
const files = new FilesController();

app.use(express.static(__dirname + '/../public'));
app.set('view engine', 'ejs');
app.set('views', __dirname + "/../views");
app.set('port', process.env.port || 3000);

app.use(morgan('combined'));
app.use('/', home.router);
app.use('/files', files.router);

app.listen(app.get("port"));
