import { productsModel } from "../models/products.model.js"


class ProductManager extends productsModel{
    constructor (){ 
        super();
    }

    readProducts = async () => {
      try {
          const products = await productsModel.find();
          return products;
      } catch (error) {
          console.error("Error al leer productos de MongoDB:", error);
          return [];
      }
  }
  

    exist = async (id) => {
      try {
          const product = await productsModel.findById(id);
          return product;
      } catch (error) {
          console.error("Error al verificar la existencia del producto:", error);
          return null;
      }
  }


    async addProducts(product) {
        try {
          const newProduct = new productsModel(product);
          await newProduct.save();
          return "Producto Agregado";
        } catch (error) {
          console.error('Error al agregar el producto:', error);
          return 'Error al agregar el producto';
        }
      }
    
    
    
    getProducts = async () => {
        return await this.readProducts()
    }

    async getProductById(productId) {
      try {
        const product = await productsModel.findById(productId);
        if (!product) {
          return null; // Si no se encuentra el producto, devuelve null o un valor que indique que no se encontró.
        }
        return product;
      } catch (error) {
        console.error('Error al buscar el producto por ID:', error);
        return null; // Manejo de errores, puedes cambiar esto según tus necesidades.
      }
    }

 

  updateProducts = async (id, product) => {
    const updatedProduct = await productsModel.findOneAndUpdate({ _id: id }, product, { new: true });
    if (updatedProduct) {
        return "Producto Actualizado";
    } else {
        return "Producto no encontrado :(";
    }
}


    deleteProducts = async (id) => {
        let products= await this.readProducts()
        let existProducts = products.some( prod => prod.id === id)
        if (existProducts) {
            let filterProducts = products.filter( prod => prod.id != id)
            await this.writeProducts(filterProducts)
            return "Producto eliminado"
        } 
        return "Producto no existe"
    }

    async getProductsByLimit(limit){
        try {
            const products = await productsModel.find().limit(limit)
            if (products.length < limit){
                limit = products.length
            }
            return products;
        }catch (error){
            throw error;}
    }


    async getProductsByPage(page, productsPerPage){
        if (page <= 0){
            page = 1
        }
        try {
            const products = await productsModel.find()
            .skip((page - 1) * productsPerPage )
            .limit(productsPerPage)
            return products
        }catch (error){
            throw error
        }
    }

    async getProductsByQuery(query){
        try {
            const products = await productsModel.find({
                description: {$regex: query, $options: `i`}}
            )
            return products
        }catch (error){
            throw error
        }
    }

    async getProductsMaster(page = 1, limit = 10, category, availability, sortOrder) 
      {
        try
        {
          // Construye un objeto de filtro basado en los parámetros de consulta
          let filter = {};
          // Calcula el índice de inicio y fin para la paginación
          const startIndex = (page - 1) * limit;
          const endIndex = page * limit;

          const sortOptions = {};
          
          if (sortOrder === 'asc') {
            sortOptions.price = 1; // Ordenar ascendentemente por precio
          } else if (sortOrder === 'desc') {
            sortOptions.price = -1; // Ordenar descendente por precio
          } else {
            throw new Error('El parámetro sortOrder debe ser "asc" o "desc".');
          }

          if (category != "") {
            filter.category = category;
          }
          if (availability != "") {
            filter.availability = availability;
          }

          // Realiza la consulta utilizando el filtro y la paginación
          const query = ProductManager.find(filter)
            .skip(startIndex)
            .limit(limit)
            .sort(sortOptions); ;
          const products = await query.exec();

        // Calcula el total de páginas y otros detalles de paginación
        const totalProducts = await ProductManager.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);
        const hasPrevPage = startIndex > 0;
        const hasNextPage = endIndex < totalProducts;
        const prevLink = hasPrevPage ? `/api/products?page=${page - 1}&limit=${limit}` : null;
        const nextLink = hasNextPage ? `/api/products?page=${page + 1}&limit=${limit}` : null;

        // Devuelve la respuesta con la estructura requerida
        return {
          status: 'success',
          payload: products,
          totalPages: totalPages,
          prevPage: hasPrevPage ? page - 1 : null,
          nextPage: hasNextPage ? page + 1 : null,
          page: page,
          hasPrevPage: hasPrevPage,
          hasNextPage: hasNextPage,
          prevLink: prevLink,
          nextLink: nextLink,
        };
        } catch (error) {
          console.error('Error al obtener los productos:', error);
          // Si se produce un error, devuelve un objeto con status "error" y el mensaje de error en "payload"
          return { status: 'error', payload: 'Error al obtener los productos' };
        }
      }
}


/* primera entrega aprobada
import {promises as fs} from 'fs'
import { nanoid } from 'nanoid';

class ProductManager{
    constructor(){
        this.path = "./src/models/products.json";
    }

    readProducts = async () => {
        let products = await fs.readFile(this.path, "utf-8");
        return JSON.parse(products);
    }

    writeProducts = async(product) => {
        await fs.writeFile(this.path, JSON.stringify(product))
    }

    exist = async (id) => {
        let products = await this.readProducts();
        return products.find(prod => prod.id === id)

    }

    addProducts = async (product) =>{
        let productsPrevious= await this.readProducts();
        product.id = nanoid()
        let productALL = [...productsPrevious, product];
        await this.writeProducts(productALL)
        return "Producto agregado correctamente";
    };
    
    getProducts = async ()=>{
        return await this.readProducts();
    }

    getProductsById = async (id) => {
        let productById = await this.exist(id)
        if (!productById) return "Producto no encontrado"
        return productById
    };
    

    UpdateProduct = async(id, product) =>{
        let productById = await this.exist(id)
        if (!productById) return "Producto no encontrado"

        await this.delateProducts(id)
        let productPrevious = await this.readProducts()
        let products = [{...product, id : id}, ...productPrevious]
        await this.writeProducts(products)
        return "Producto actualizado"
    }

    delateProducts = async (id)=>{
        let products = await this.readProducts();
        let existProducts = products.some(prod => prod.id ===id)
        if (existProducts) {
            let filterProducts = products.filter(prod => prod.id != id)
            await this.writeProducts(filterProducts)
            return "Producto eliminado"
        }
        return "El producto que quiere eliminar no existe"
        
    }
}*/

export default ProductManager


