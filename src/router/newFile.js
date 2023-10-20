import { productsModel } from "../models/products.model.js";
import { router } from "./product.routes.js";

//post
router.post("/", async (req, res) => {
    let { nombre, descripcion, precio, stock, category, minimo, availability
    } = req.body;

    if (!nombre || !descripcion || !precio || !stock || !category || !minimo || !availability) {
        res.send({ status: "error", error: "Faltan datos" });
    }
    let result = await productsModel.create({
        nombre,
        descripcion,
        precio,
        stock,
        category,
        minimo,
        availability
    });
    res.send({ result: "success", payload: result });
});
