import express from "express"
import prodRouter from "./router/product.routes.js"
import cartRouter from "./router/cart.routes.js"
import ProductManager from "./DAO/manager/ProductManager.js"
import CartManager from "./DAO/manager/CartManager.js"
import mongoose from "mongoose"
import { engine } from "express-handlebars"
import * as path from "path"
import __dirname from "./utils.js"
import userRouter from "./router/user.routes.js"
import MongoStore from "connect-mongo"
import session from 'express-session'
import FileStore from 'session-file-store'
import passport from "passport"
import initializePassword from "./config/passport.config.js"

//El funcionamiento se valido con la extensión Thunder Client desde Visual Studio Code
//Actualmente el proyecto se ejecuta desde el ingreso del  Login http://localhost:8080/login
const app = express()
//Se define puerto 8080 para ejecutar la aplicacion
const PORT = 8080
const fileStorage = FileStore(session)
const product = new ProductManager()
const cart = new CartManager()

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.listen(PORT, () => {
    console.log(`Servidor Express Puerto ${PORT}`)
})
//-------------------------------------Mongoose----------------------------------------------------------//
mongoose.connect("mongodb+srv://geastudilloaray:Kekax3E6hriT9VIm@cluster0.y9dzoa8.mongodb.net/segundaentrega?retryWrites=true&w=majority")
.then(()=>{
    console.log("Conectado a la base de datos")
})
.catch(error => {
    console.error("Error al conectarse a la base de datos, error"+error)
})

//-----------------------------Session Mongo Atlas-----------------------------------------//

app.use(session({
    //Session registrada en mongo atlas
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://geastudilloaray:Kekax3E6hriT9VIm@cluster0.y9dzoa8.mongodb.net/segundaentrega?retryWrites=true&w=majority",
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true}, ttl: 3600
    }),
    secret: "ClaveSecreta",
    resave: false,
    saveUninitialized: false,
}))
//Passport//
initializePassword()
app.use(passport.initialize())
app.use(passport.session())
//End Passport//
//-------------------------------------------------------------------------------------//
//Se simplifica codigo de middleware colocando lo siguiente
//IMPORTANTE COLOCAR LAS RUTAS DESPUES DE QUE SE CREE LA SESION PORQUE SI NO, NO FUNCIONA EL REQ.SESSION
app.use("/api/products", prodRouter)
app.use("/api/carts", cartRouter)
app.use("/api/sessions", userRouter)

//-----Handlebars-----//
//------------------------Handlebars----------------------------------//
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"))

//CSS Static
app.use("/", express.static(__dirname + "/public"))

//Ingreso Products http://localhost:8080/products
app.get("/products", async (req, res) => {
    if (!req.session.emailUsuario) 
    {
        return res.redirect("/login")
    }
    let allProducts  = await product.getProducts()
    allProducts = allProducts.map(product => product.toJSON());
    res.render("products", {
        title: "Vista Productos",
        products : allProducts,
        email: req.session.emailUsuario,
        rol: req.session.rolUsuario,
    });
})
app.get("/carts/:cid", async (req, res) => {
    let id = req.params.cid
    let allCarts  = await cart.getCartWithProducts(id)
    res.render("cart", {
        title: "Vista Carro",
        carts : allCarts
    });
})
//Ingreso Login http://localhost:8080/login
app.get("/login", async (req, res) => {
    res.render("login", {
        title: "Vista Login",
    });
    
})
//Ingreso Register http://localhost:8080/register
app.get("/register", async (req, res) => { 
    res.render("register", {
        title: "Vista Register",
    });
})
//Ingreso Profile http://localhost:8080/profile
app.get("/profile", async (req, res) => { 
    if (!req.session.emailUsuario) 
    {
        return res.redirect("/login")
    }
    res.render("profile", {
        title: "Vista Profile Admin",
        first_name: req.session.nomUsuario,
        last_name: req.session.apeUsuario,
        email: req.session.emailUsuario,
        rol: req.session.rolUsuario,

    });
})

app.get("/", async (req, res) => { 
    if (!req.session.emailUsuario) 
    {
        return res.redirect("/login")
    }
})