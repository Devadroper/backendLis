import express from "express";
import { __dirname } from "./utils.js";
import handlebars from "express-handlebars";
import cartsRouter from "./routes/carts.router.js";
import producstRouter from "./routes/products.router.js";
import homeRouter from "./routes/home.router.js";
import chatRouter from "./routes/chat.router.js";
import hbsCartsRouter from "./routes/hbsCarts.router.js"
import hbsProdsRouter from "./routes/hbsProds.router.js"
import realTimeProductsRouter from "./routes/realTimeProducts.router.js";
import { Server } from "socket.io";
import MessageManager from "./dao/mongoManager/MessageManager.js"; // TODO meter la clase en chat.router.js
import ProductManager from "./dao/mongoManager/ProductManager.js";
import CartManager from "./dao/mongoManager/CartManager.js";
import "./dao/dbConfig.js";

//Creacion del servidor
const app = express();
const PORT = 3000;

console.log(__dirname); //Brinda el path exacto para acceder a la carpeta PUBLIC

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// Configurar handlebars
app.engine("handlebars", handlebars.engine()); //solo para handlebars.
app.set("views", __dirname + "/views"); //Ubicación de carpeta vistas
app.set("view engine", "handlebars"); //Qué motor de plantilla uso

// rutas
app.use("/api/products", producstRouter); //cdo llamo a ruta /api/products renderiza productsRouter
app.use("/api/carts", cartsRouter);
app.use("/products", hbsProdsRouter)
app.use("/carts", hbsCartsRouter)
app.use("/", homeRouter);
app.use("/realTimeProducts", realTimeProductsRouter);
app.use('/chat', chatRouter)


//El servidor escucha al puerto
const httpServer = app.listen(PORT, () => {
  console.log(`Escuchando al puerto ${PORT}`);
});

//servidor socketServer
const socketServer = new Server(httpServer);

const mm = new MessageManager();
const pm = new ProductManager()
const cm = new CartManager()

//Emicion de eventos para el chat
socketServer.on("connection", (socket) => {
  socket.on("show", async () => {
    const getAll = await mm.getMsgs();
    socket.emit("loadMsg", getAll);
  });

  socket.on("sendInfo", async (e) => {
    const sendMsg = await mm.sendMsg(e);
    const getAll = await mm.getMsgs();
    socket.emit("sendMsg", sendMsg);
    socket.emit("loadMsg", getAll);
  });

  socket.on('mongoProds', async (e) => {
    const getProds = await pm.getProducts()
    socket.emit('prods', getProds)
  })

  socket.on('addToCart', async (e) => {
    await cm.addToCart('640ea258622d266fa187c527', e._id)
  })
});

export default socketServer;
