
import __dirname from "./utils.js";
import CartManager from "./controllers/CartManager.js";
import ProductManager from "./controllers/ProductManager.js";
import cartsRouter from "./router/carts.routes.js";
import productsRouter from "./router/product.routes.js";
import userRouter from "./router/user.routes.js";
import messagesRouter from "./router/messages.routes.js";
import { messagesModel } from "./models/messages.model.js";
import express from "express";
import { engine } from "express-handlebars";
import * as path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import session from 'express-session';
import FileStore from 'session-file-store';
import passport from "passport";
import initializePassword from "./config/passport.config.js";
import MongoStore from 'connect-mongo';


const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => console.log("Listen puerto 8080"));

const product = new ProductManager();
const cart = new CartManager();

app.use(cookieParser());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser())
// Configuración de express-session
// Configuración de express-session con MongoStore
app.use(
  session({
    store: MongoStore.create({
      // Utilizamos MongoDB para almacenar sesiones
      mongoUrl: "mongodb+srv://geastudilloaray:Kekax3E6hriT9VIm@cluster0.y9dzoa8.mongodb.net/segundaentrega?retryWrites=true&w=majority",
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 3600, // Tiempo de vida de la sesión en segundos
    }),
    secret: "ClaveSecreta",
    resave: false,
    saveUninitialized: false,
  })
);

// Configuración de Passport para autenticación
initializePassword();
app.use(passport.initialize());
app.use(passport.session());

// Conexión a la base de datos MongoDB
mongoose
  .connect("mongodb+srv://geastudilloaray:Kekax3E6hriT9VIm@cluster0.y9dzoa8.mongodb.net/segundaentrega?retryWrites=true&w=majority")
  .then(() => {
    console.log("Conectado a la base de datos");
  })
  .catch((error) => {
    console.error("Error al intentar conectarse a la base de datos", error);
  });

// Configuración de rutas
app.use("/api/carts", cartsRouter); // Rutas relacionadas con carritos
app.use("/api/products", productsRouter); // Rutas relacionadas con productos
app.use("/api/msg", messagesRouter); // Rutas relacionadas con mensajes
app.use("/api/sessions", userRouter); // Rutas relacionadas con sesiones de usuario

// Configuración de Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));

// Archivos estáticos
app.use("/", express.static(__dirname + "/public"));

// Rutas adicionales
app.get("/chat", (req, res) => {
  // Página de chat
  res.render("chat", {
    title: "Chat con Mongoose",
  });
});

app.get("/products", async (req, res) => {
  if (!req.session.emailUsuario) {
    // Redirigir a la página de inicio de sesión si el usuario no ha iniciado sesión
    return res.redirect("/login");
  }
  let allProducts = await product.getProducts();
  allProducts = allProducts.map((product) => product.toJSON());
  res.render("home", {
    title: "Mestizzo | Productos",
    products: allProducts,
  });
});

app.get("/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const productDetails = await product.getProductById(productId);
    if (productDetails) {
      const price = typeof productDetails.price === "number" ? productDetails.price : 0;
      const stock = typeof productDetails.stock === "number" ? productDetails.stock : 0;
      const minimo = typeof productDetails.minimo === "number" ? productDetails.minimo : 0;

      const cleanedProduct = {
        title: productDetails.title,
        description: productDetails.description,
        price: price,
        stock: stock,
        minimo: minimo,
        category: productDetails.category,
        thumbnails: productDetails.thumbnails,
      };

      res.render("products", { product: cleanedProduct });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

app.get("/cart/:cid", async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cartWithProducts = await cart.getCartWithProducts(cartId);

    res.render("cart", {
      title: "Detalles del Carrito",
      cartWithProducts: cartWithProducts,
    });
  } catch (error) {
    console.error("Error al obtener los detalles del carrito:", error);
    res.status(500).json({ error: "Error al obtener los detalles del carrito" });
  }
});

app.get("/chat", async (req, res) => {
  res.render("chat", {
    title: "Chat con Mongoose",
  });
});

app.get("/multer", async (req, res) => {
  res.render("upload", {
    title: "Multer",
  });
});

