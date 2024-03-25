import express from "express"
import { engine } from 'express-handlebars';
import  {pool}  from './db.js'
import { join, dirname } from 'path'
import { fileURLToPath } from "url"
import morgan from 'morgan'
import productosRoutes from './routes/producto.routes.js'
import categoriaRoutes from './routes/categoria.routes.js'

//Initialization
const app = express()
const __dirname = dirname(fileURLToPath(import.meta.url))

//Settings
app.set('port', process.env.PORT || 3000);
app.set('views', join(__dirname, 'views'));
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: join(app.get('views'), 'layouts'),
    partialsDir: join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

//MiddleWare
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//Routes
app.get('/', (req, res) => {
        res.render('index');
})

app.use(productosRoutes);
app.use(categoriaRoutes);

//Public Files
app.use(express.static(__dirname))
 
//Run Server
app.listen( app.get('port'), () => (3000))
console.log("Server Running on 3000 Port");
