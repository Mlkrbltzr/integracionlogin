import { Router } from "express";
import { productsModel } from "../models/products.model.js";
import ProductManager  from "../controllers/ProductManager.js"
export const router = Router()
const products =new ProductManager()

//get
router.get("/", async(req,res)=> {
    try {
        let  products= await productsModel.find()
        res.send({result : "success", payload:  products})
    } catch(error){
        console.log(error)
    }
})

//get producto por id
router.get("/:id", async (req, res) => {
    try{
        const prodId = req.params.id;
        const productDetails = await products.getProductById(prodId);
        res.send({ product: productDetails });
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    } 
});

//put
router.put("/:id_products", async(req,res)=> {
    let{id_products} = req.params

    let productsToReplace = req.body
    if(!productsToReplace.title || !productsToReplace.description || !productsToReplace.price || !productsToReplace.stock || !productsToReplace.category ||!productsToReplace.thumbnails || !productsToReplace.carru1 || !productsToReplace.carru2 || !productsToReplace.carru3 || !productsToReplace.minimo || !productsToReplace.availability){
        res.send({status: "error", error: "no hay datos en parametros"})
    }
    let result = await productsModel.updateOne({_id: id_products}, productsToReplace)
    res.send({result: "success", payload: result})
})

//delete
router.delete("/:id_products", async(req,res)=>{
    let{id_products}= req.params
    let result = await productsModel.deleteOne({_id: id_products})
    res.send({ result: "success", payload:result})
})

// Endpoints opcionales
router.get("/limit/:limit" , async (req,res) => {
    let limit = parseInt(req.params.limit)
    if (isNaN(limit) || limit <= 0){
        limit = 10
    } res.send( await products.getProductsByLimit(limit))
})

router.get("/page/:page" , async (req,res) => {
    let page = parseInt(req.params.page)
    if (isNaN(page) || page <= 0){
        page = 1
    } 
    const productsPerPage = 1
    res.send( await products.getProductsByPage(page, productsPerPage))
})

router.get("/buscar/query", async(req,res) =>{
    const query = req.query.q
    res.send(await product.getProductsByQuery(query))
})



//info
router.get("/info", async (req, res) => {
    let sortOrder = req.query.sortOrder; 
    let category = req.query.category; 
    let availability = req.query.availability; 
    if(sortOrder === undefined){
        sortOrder = "asc"
    }
    if(category === undefined){
        category = ""
    }
    if(availability === undefined){
        availability = ""
    }
    res.send(await products.getProductsMaster(null,null,category,availability, sortOrder))
})

export default router