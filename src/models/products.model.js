import mongoose from "mongoose";

const productsCollecttion = "products";

const productsSchema = new mongoose.Schema({
    nombre:{ type:String, max:20, required:true},
    descripcion: {type : String, max:25, required:true},
    precio:{type:Number, required: true},
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    minimo: { type: Number, required: true },
    availability: {type: Boolean,required: true}
});

export const productsModel = mongoose.model(productsCollecttion, productsSchema)