import { Router } from "express";
import {uploader} from "../controllers/multer.js"

const router = Router()

let products = [] ; //cambia el nombre de la variable products

router.get("/", (req, res) => {
    res.send({ status:"success", payload: products}); //deberia cambiar products como id a products
});

router.post("/upload", uploader.single("file"),(req,res) => {
    if (!req.file) {
        return res.status(400).send({ status:"error", error: "no se pudo guardar la imagen"});
    }
    let prod = { ...req.body, profile: req.file.path }; //let prod = req.body;
    prod.profile = req.file.path;
    products.push(prod);
    res.send({status:"success", message:"Imagen Guardada"})
});

export default router;