import express from 'express'
import { __dirname } from './utils.js'
import handlebars from 'express-handlebars'
import cartsRouter from './routes/carts.router.js'
import producstRouter from './routes/products.router.js'
import homeRouter from './routes/home.router.js'
import realTimeProductsRouter from './routes/realTimeProducts.router.js'
import { Server } from 'socket.io'
import './dao/dbConfig.js'


// import DBConfig:

const app = express()
const PORT = 3000;

console.log(__dirname);//me brinda el path exacto p acceder a carpeta PUBLIC

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))


// Configurar handlebars
app.engine('handlebars', handlebars.engine())//solo para handlebars. Importo hanldebars
app.set('views', __dirname + '/views') //ubicacion de carpeta vistas
app.set('view engine', 'handlebars') //cual motor de plantilla uso

// rutas

app.use('/api/products',producstRouter)
app.use('/api/carts',cartsRouter)

app.use('/',homeRouter)
app.use('/realTimeProducts',realTimeProductsRouter)



const httpServer = app.listen(PORT, () => {
    console.log(`Escuchando al puerto ${PORT}`);
})
const socketServer = new Server(httpServer)
export default socketServer