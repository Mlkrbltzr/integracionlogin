import { Router } from "express";
import { messageModel } from "../models/messages.model.js";

const router = Router()

//get
router.get("/", async(req,res)=> {
    try {
        let  message= await messageModel.find()
        res.send({result : "success", payload:  message})
    } catch(error){
        console.log(error)
    }
})

//post
router.post("/" , async(req,res)=> {
    let{user,message}= req.body
    if(!user || !message){
        res.send({status: "error", error: "Faltan datos"})
    }
    let result = await messageModel.create({user, message})
    res.send({result: "success", payload: result})
})

//put
router.put("/:id_msg", async(req,res)=> {
    let{id_msg} = req.params

    let messageToReplace = req.body
    if(!messageToReplace.user || !messageToReplace.message){
        res.send({status: "error", error: "no hay datos en parametros"})
    }
    let result = await messageModel.updateOne({_id: id_msg}, messageToReplace)
    res.send({result: "success", payload: result})
})

//delete
router.delete("/:id_msg", async(req,res)=>{
    let{id_msg}= req.params
    let result = await messageModel.deleteOne({_id: id_msg})
    res.send({ result: "success", payload:result})
})


export default router