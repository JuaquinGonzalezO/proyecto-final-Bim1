import { response, request } from "express";;
import Categoria from "./categorias-model.js";
import Producto from "../productos/productos-model.js"
import { hash, verify } from "argon2";
import User from "../user/user-model.js"

export const createCategoria = async (req, res) => {
    try {
        const data = req.body;
        const categoriaExistente = await Categoria.findOne({ name: data.name });
        if (categoriaExistente) {
            return res.status(400).json({
                success: false,
                message: 'Category already exists'
            });
        }
        const user = await User.findOne({ username: data.username });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'user not found'
            });
        }
        const categoria = new Categoria({
            ...data,
            user: user._id
        });
        await categoria.save();
        res.status(200).json({
            success: true,
            categoria
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating category',
            error
        });
    }
};

export const getCategoria = async (req, res) => {
    try {
        const categorias = await Categoria.find();
        if (categorias.length === 0) {
            return res.status(404).json({
                success: false,
                msg: 'No se encontraron categorías'
            });
        }

        res.status(200).json({
            success: true,
            categorias
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener categorías',
            error: error.message
        });
    }
};



export const getCategoriaById = async (req, res) => {
    try {
        const { cid } = req.params;
        const categoria = await Categoria.findById(cid);

        if (!categoria) {
            return res.status(404).json({
                succes: false,
                msg: 'Categoría no encontrada'
            });
        }

        res.status(200).json({
            succes: true,
            categoria
        });

    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error al obtener categoría',
            error
        });
    }
};


export const updateCategoria = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { _id, ...data } = req.body;


        if (data.password) {
            data.password = await hash(data.password);
        }

        const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });
        res.status(200).json({
            succes: true,
            msg: 'Categoría actualizada',
            categoria
        });

    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error al actualizar categoría',
            error
        });
    }
};


export const deleteCategoria = async (req, res) => {
    try {
        const { cid } = req.params;
        const category = await Categoria.findByIdAndUpdate(cid, { status: false }, { new: true });
        console.log(category)
        const defaultCategory = await Categoria.findOne({ name: 'defecto' });

        

        const product = await Producto.find({ category: cid });

        await Promise.all(
            product.map(async (prdct) => {
                prdct.category = defaultCategory._id;
                return prdct.save();
            })
        );

        return res.status(200).json({
            success: true,
            message: 'Deleted category',
            category
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error deleting category',
            error: err.message
        });
    }
}