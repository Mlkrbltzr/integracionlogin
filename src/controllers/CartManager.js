import {promises as fs} from "fs"
import ProductManager from "./ProductManager.js"
import { cartsModel } from "../models/carts.model.js";
import mongoose from "mongoose";

const ProductALL = new ProductManager

class CartManager extends cartsModel{
    constructor() {
        super()

        this.path = "./src/models/carts.json"
        this.nextId = null;
        this.initNextId()
    }

    async initNextId() {
        this.nextId = await this.calculateNextId();
    }

    calculateNextId = async () => {
        try {
            let carts = await this.readCarts();
            if (carts.length === 0) {
                return 1;
            } else {
                const maxId = Math.max(...carts.map((cart) => parseInt(cart.id)));
                return maxId + 1;
            }
        } catch (error) {
            console.error("Error al calcular el próximo ID:", error);
            return null;
        }
    }

    readCarts = async () => {
        let carts = await fs.readFile(this.path , "utf-8")
        return JSON.parse(carts)
    }

    writeCarts = async (carts) =>{
        await fs.writeFile(this.path , JSON.stringify(carts))
        
    }

    exist = async(id) => {
        let carts= await this.readCarts()
        return carts.find(carts => carts.id === id)
    }

    addCarts = async () => {
        let cartsOld = await this.readCarts();
        let id = this.nextId;
        this.nextId++;
        let cartsConcat = [{ id: id, products: [] }, ...cartsOld];
        await this.writeCarts(cartsConcat);
        return "Carrito Agregado";
    }

    getCartsById = async (id) => {
        let cartById = await this.exist(id)
        if ( !cartById) return "Carrito no encontrado :("
        return cartById
    }

    
    async addProductInCart(cartId, prodId) 
      {
        try 
        {
          const cart = await cartsModel.findById(cartId);
    
          if (!cart) 
          {
            return 'Carrito no encontrado';
          }
    
          // Verifica si el producto ya está en el carrito
          const existingProduct = cart.products.find((product) => product.productId === prodId);
    
          if (existingProduct) 
          {
            // Si el producto ya está en el carrito, aumenta la cantidad
            existingProduct.quantity += 1;
          } 
          else 
          {
            // Si el producto no está en el carrito, agrégalo
            cart.products.push({
              productId: prodId,
              quantity: 1,
            });
          } 
          await cart.save();
          return 'Producto agregado al carrito';
        } catch (error) {
          console.error('Error al agregar el producto al carrito:', error);
          return 'Error al agregar el producto al carrito';
        }
      }



      async getCartWithProducts(cartId) 
      {
        try
        {
          const cart = await cartsModel.findById(cartId).populate('products.productId').lean();
          if (!cart) {
            return 'Carrito no encontrado';
          }
      
          return cart;
        } catch (error) {
          console.error('Error al obtener el carrito con productos:', error);
          return 'Error al obtener el carrito con productos';
        }}


        async updateProductInCart(cartId, prodId, updatedProduct) 
        {
          try 
          {
            const cart = await cartsModel.findById(cartId);
            if (!cart) 
            {
              return 'Carrito no encontrado';
            }     
            // Busca el producto en el carrito por su ID
            const productToUpdate = cart.products.find((product) => product.productId === prodId);
        
            if (!productToUpdate) 
            {
              return 'Producto no encontrado en el carrito';
            }
        
            // Actualiza el producto con la información proporcionada
            Object.assign(productToUpdate, updatedProduct);
        
            await cart.save();
            return 'Producto actualizado en el carrito';
          } catch (error) {
            console.error('Error al actualizar el producto en el carrito:', error);
            return 'Error al actualizar el producto en el carrito';
          }
        }


        async existProductInCart(cartId, prodId) {
            try {
              const cart = await cartsModel.findById(cartId);
          
              if (!cart) {
                return 'Carrito no encontrado';
              }
          
              // Verifica si el producto está 
              const existingProduct = cart.products.find(
                (product) => product.productId.toString() === prodId
              );
          
              if (existingProduct) {
                return 'El producto está en el carrito';
              } else {
                return 'El producto no está en el carrito';
              }
            } catch (error) {
              console.error('Error al verificar el producto en el carrito:', error);
              return 'Error al verificar el producto en el carrito';
            }
          }


          async removeProductFromCart(cartId, prodId) {
            try {
                const cart = await cartsModel.findById(cartId);
        
                if (!cart) {
                    return 'Carrito no encontrado';
                }
        
                // Convierte prodId en un ObjectId
                const productObjectId = new mongoose.Types.ObjectId(prodId);
        
                // Encuentra el índice del producto a eliminar
                const productIndex = cart.products.findIndex((product) =>
                    product.productId.equals(productObjectId)
                );
        
                if (productIndex === -1) {
                    return 'Producto no encontrado en el carrito';
                }
        
                // Elimina el producto del carrito
                cart.products.splice(productIndex, 1);
        
                await cart.save();
                return 'Producto eliminado del carrito';
            } catch (error) {
                console.error('Error al eliminar productos del carrito:', error);
                return 'Error al eliminar productos del carrito';
            }
        }
        
        
          
}

/* primera entrega
class CartManager {
    constructor() {
        this.path = "./src/models/cart.json";
    };


readCarts = async () => {
    let carts = await fs.readFile(this.path, "utf-8");
    return JSON.parse(carts);
    };

writeCarts = async(carts) => {
    await fs.writeFile(this.path, JSON.stringify(carts))
    };

    exist = async (id) => {
        let carts = await this.readCarts();
        return carts.find(cart => cart.id === id)

    }

    addCarts = async() => {
        let cartPrevious= await this.readCarts();
        let id = nanoid()
        let cartsConcat = [{id :id, products : []}, ...cartPrevious]
        await this.writeCarts(cartsConcat)
        return "Carrito Agregado"
    }

    getCartsById = async (id) => {
        let cartById = await this.exist(id)
        if (!cartById) return "Carrito no existe"
        return cartById
    };

    

    addProductInCart = async (cartId, productId) => {
        let cartById = await this.exist(cartId)
        if (!cartById) return "Carrito no existe"
        let productById = await ProductALL.exist(productId)
        if(!cartById) return "No se encuentra producto"

        let cartsAll = await this.readCarts();
        let cartFilter = cartsAll.filter((cart) => cart.id !== cartId)

        if(cartById.products.some((prod) => prod.id === productId)){
            let moreproductInCart = cartById.products.find((prod) => prod.id === productId)
            moreproductInCart.quantity++;
            console.log(moreproductInCart.quantity);
            let cartsConcat = [cartById, ...cartFilter]
            await this.writeCarts(cartsConcat)
            return "Producto agregado a el carro"
        }

        cartById.products.push({id:productById.id, quantity: 1})
        let cartsConcat = [cartById, ...cartFilter];
        await this.writeCarts(cartsConcat)
        return "Producto en el carro :)"

    };
}*/

export default CartManager