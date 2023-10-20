import express from "express";
import { engine } from "express-handlebars";
import * as path from "path";
import __dirname from "./utils.js";
import mongoose from "mongoose";
import cartsRouter from "./router/carts.routes.js";
import productsRouter from "./router/product.routes.js";
import ProductManager from "./controllers/ProductManager.js";
import CartManager from "./controllers/CartManager.js";

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => console.log("Listen puerto 8080"));
const product = new ProductManager();
const cart = new CartManager();

// Mongoose
mongoose
  .connect("mongodb+srv://geastudilloaray:Kekax3E6hriT9VIm@cluster0.y9dzoa8.mongodb.net/segundaentrega?retryWrites=true&w=majority")
  .then(() => {
    console.log("Conectado a la base de datos");
  })
  .catch((error) => {
    console.error("Error al intentar conectarse a la base de datos", error);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas CRUD con Postman
app.use("/api/carts", cartsRouter);
app.use("/api/prod", productsRouter);

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));

// Static
app.use("/", express.static(__dirname + "/public"));

// Chat
app.get("/chat", (req, res) => {
  res.render("chat", {
    title: "Chat con Mongoose",
  });
});

// Renderizado de productos
app.get("/products", async (req, res) => {
  let allProducts = await product.getProducts();
  allProducts = allProducts.map((product) => product.toJSON());
  res.render("home", {
    title: "Mestizzo | Productos",
    products: allProducts,
  });
});

// Renderizado de detalle de productos
app.get("/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const productDetails = await product.getProductById(productId);
    if (productDetails) {
      const price = typeof productDetails.price === "number" ? productDetails.price : 0;
      const stock = typeof productDetails.stock === "number" ? productDetails.stock : 0;
      const minimo = typeof productDetails.minimo === "number" ? productDetails.minimo : 0;

      const cleanedProduct = {
        nombre: productDetails.title,
        descripcion: productDetails.description,
        precio: price,
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

// Detalles del carrito
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

export default app;