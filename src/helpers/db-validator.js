import User from '../user/user-model.js';
import Categoria from "../categorias/categorias-model.js"
import Producto from "../productos/productos-model.js"


export const existenteEmail = async (correo = ' ') => {

    const existeEmail = await User.findOne({ correo });

    if(existeEmail){
        throw new Error(`The email ${ correo } already exists in the database`);
    }
}

export const existeUsuarioById = async (id = "") => {
    const existeUsuario = await User.findById(id);
 
    if(!existeUsuario){
        throw new Error(`The id  ${id} does not exist in the database`)
    }
}

export const existeCategoriaById = async (name = "") => {
    const existeCategoria = await Categoria.findOne({name: name});
 
    if(!existeCategoria){
        throw new Error(`The category ${name} already exists in the database`)
    }
}

export const existeProductById = async (uid = "") => {
    const existeProduct = await Producto.findById(uid);
    
    if (!existeProduct) {
        throw new Error(`The product with id ${uid} does not exist in the database`);
    }
};

export const existeInvoiceoById = async (id = "") => {
    const existeProduct = await Producto.findById(id);
    
    if (!existeProduct) {
        throw new Error(`The product with id ${id} does not exist in the database`);
    }
};

