import { Router } from "express";
import { cartsModel } from "../models/carts.model.js";
import CartManager from "../controllers/CartManager.js";

const router = Router()
const carts = new CartManager()


//GESTION DE CARRITO
//get
router.get("/", async(req,res)=> {
    try {
        let carts = await cartsModel.find()
        res.send({result : "success", payload:  carts})
    } catch(error){
        console.log(error)
        res.status(500).send({ status: "error", error: "Error al obtener carritos" })
    }
})

// post
router.post("/", async (req, res) => {
    if (!req.body) {
        res.status(400).send({ status: "error", error: "Solicitud sin cuerpo (body)" });
        return;
    }

    let { description, quantity, total } = req.body;
    if (!description || !quantity || !total) {
        res.status(400).send({ status: "error", error: "Faltan datos" });
        return;
    }

    try {
        let result = await cartsModel.create({ description, quantity, total });
        res.send({ result: "success", payload: result });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "error", error: "Error al crear carrito" });
    }
});

// put actualiza los carritos
router.put("/:id_carts", async (req, res) => {
    if (!req.body) {
        res.status(400).send({ status: "error", error: "Solicitud sin cuerpo (body)" });
        return;
    }

    let { id_carts } = req.params;
    let cartsToReplace = req.body;
    if (!cartsToReplace.description || !cartsToReplace.quantity || !cartsToReplace.total) {
        res.status(400).send({ status: "error", error: "Faltan datos en parámetros" });
        return;
    }

    try {
        let result = await cartsModel.updateOne({ _id: id_carts }, cartsToReplace);
        res.send({ result: "success", payload: result });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "error", error: "Error al actualizar carrito" });
    }
});

// delete
router.delete("/:id_carts", async (req, res) => {
    let { id_carts } = req.params;
    try {
        let result = await cartsModel.deleteOne({ _id: id_carts });
        res.send({ result: "success", payload: result });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "error", error: "Error al eliminar carrito" });
    }
});




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
router.get("/population/:cid", async (req,res)=>{
    let cartId = req.params.cid
    res.send(await carts.getCartWithProducts(cartId))
})



export default router;