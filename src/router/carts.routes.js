import { Router } from "express";
import CartManager from "../controllers/CartManager.js";


const cartRouter = Router();
const carts = new CartManager()
const router = Router();

//Se agrega producto http://localhost:8080/api/carts con post donde nos ingresa un id y un producto con arreglo vacio
cartRouter.post("/", async (req,res) =>{
    let newCart = req.body
    res.send(await carts.addCart(newCart))
})
//Traemos todos los carritos con http://localhost:8080/api/carts con get
cartRouter.get("/", async (req,res)=>{
    res.send(await carts.getCarts())
})
//Traemos el carro por id con http://localhost:8080/api/carts/idCarts con get
cartRouter.get("/:id", async (req,res)=>{
    res.send(await carts.getCartById(req.params.id))
})

//Ingresamos el producto al carrito con el siguiente formato http://localhost:8080/api/carts/idCarts/products/idProd con post
cartRouter.post("/:cid/products/:pid", async (req,res) => {
    let cartId = req.params.cid
    let prodId = req.params.pid
    res.send(await carts.addProductInCart(cartId, prodId))
})

//Eliminar el producto al carrito con el siguiente formato http://localhost:8080/api/carts/idCarts/products/idProd con delete
cartRouter.delete("/:cid/products/:pid", async (req,res) => {
    let cartId = req.params.cid
    let prodId = req.params.pid
    res.send(await carts.removeProductFromCart(cartId, prodId))
})

//Actualizar el carro con varios productos con el siguiente formato http://localhost:8080/api/carts/idCarts con put
cartRouter.put("/:cid", async (req,res) => {
    let cartId = req.params.cid
    let newProducts = req.body
    res.send(await carts.updateProductsInCart(cartId, newProducts))
})

//Actualizar el carro con varios productos con el siguiente formato http://localhost:8080/api/carts/idCarts con put
cartRouter.put("/:cid/products/:pid", async (req,res) => {
    let cartId = req.params.cid
    let prodId = req.params.pid
    let newProduct = req.body
    res.send(await carts.updateProductInCart(cartId, prodId, newProduct))
})
//Eliminar todos los productos del carro http://localhost:8080/api/carts/idCarts con delete
cartRouter.delete("/:cid", async (req,res) => {
    let cartId = req.params.cid
    res.send(await carts.removeAllProductsFromCart(cartId))
})
//Population
//Traemos todos los carritos con http://localhost:8080/api/carts con get
cartRouter.get("/population/:cid", async (req,res)=>{
    let cartId = req.params.cid
    res.send(await carts.getCartWithProducts(cartId))
})






//GESTION DE PRODUCTOS DENTRO DE CARRITO
// Verificar si un producto está en el carrito
router.get("/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;  // Obtener cartId de los parámetros de la URL
    const prodId = req.params.pid;  // Obtener prodId de los parámetros de la URL
  
    try {
      const result = await carts.existProductInCart(cartId, prodId);
      console.log("Producto agregado exitosamente al carrito:", result); // CONSOLELOG VERIFICACION
  
      res.send({ result: "success", payload: result });
    } catch (error) {
      console.error("Error al verificar el producto en el carrito:", error);
      res.status(500).send({ status: "error", error: "Error al verificar el producto en el carrito" });
    }
  });
  
// Agregar productos a un carrito -- :cid es el id del carrito y :pid es el id del producto
router.post("/:cid/products/:pid", async (req, res) => {
    let cartId = req.params.cid;
    let prodId = req.params.pid;
    let { product_id, quantity } = req.body; 

    try {
        const result = await carts.addProductInCart(cartId, prodId, product_id, quantity);

        res.send({ result: "success", payload: result });
    } catch (error) {
        console.error("Error al agregar productos al carrito:", error);
        res.status(500).send({ status: "error", error: "Error al agregar productos al carrito" });
    }
});

// Modificar productos de un carrito
router.put("/:cid/products/:pid", async (req, res) => {
    let cartId = req.params.cid;
    let prodId = req.params.pid;
    let { product_id, quantity } = req.body;

    try {
        const result = await carts.updateProductInCart(cartId, prodId, product_id, quantity);

        res.send({ result: "success", payload: result });
    } catch (error) {
        console.error("Error al modificar productos en el carrito:", error);
        res.status(500).send({ status: "error", error: "Error al modificar productos en el carrito" });
    }
});

// Eliminar productos de un carrito
router.delete("/:cid/products/:pid", async (req, res) => {
    let cartId = req.params.cid;
    let prodId = req.params.pid;

    try {
        const result = await carts.removeProductFromCart(cartId, prodId);

        res.send({ result: "success", payload: result });
    } catch (error) {
        console.error("Error al eliminar productos del carrito:", error);
        res.status(500).send({ status: "error", error: "Error al eliminar productos del carrito" });
    }
});



//Population
//Traemos todos los carritos con http://localhost:8080/api/carts con get
//Population

router.get("/population/:cid", async (req, res) => {
    const cartId = req.params.cid;  // Obtener cartId de los parámetros de la URL

    try {
        const cartWithProducts = await carts.getCartWithProducts(cartId);  // Usa la instancia de CartManager
        res.send({ result: "success", payload: cartWithProducts });
    } catch (error) {
        console.error("Error al obtener el carrito con productos poblados:", error);
        res.status(500).send({ status: "error", error: "Error al obtener el carrito con productos poblados" });
    }
});


export default cartRouter