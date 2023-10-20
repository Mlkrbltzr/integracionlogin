import mongoose from "mongoose";

const cartsCollecttion = "carts";


const cartsSchema = new mongoose.Schema({
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId, 
                ref:`products`},
            quantity: Number,
        }
    ]
})
/* info integral
const cartsSchema = new mongoose.Schema({
    nombre:{ type:String, max:20, required:true},
    descripcion: {type : String, max:25, required:true},
    precio:{type:Number, required: true}
});
*/
export const cartsModel = mongoose.model(cartsCollecttion, cartsSchema)