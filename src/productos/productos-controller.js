import Producto from './productos-model.js';
import Categoria from '../categorias/categorias-model.js';
import User from '../user/user-model.js';

export const createProducto = async (req, res) => {
    try {
        const { name, description, price, stock, category, sales, status, username } = req.body;
        const user = await User.findOne({ username }); //user verification ROL
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        if (user.role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: Only admins can add products'
            });
        }
        const categoriaExistente = await Categoria.findOne({ name: category });
        if (!categoriaExistente) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        const newProduct = new Producto({
            name,
            description,
            price,
            stock,
            category: categoriaExistente._id, // {/*categoriaExistente._id*/ }
            sales,
            status: status ?? true
        });
        await newProduct.save();
        res.status(201).json({
            success: true,
            message: 'Se agrego producto a inventario exitosamente',
            product: newProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'error al crear el producto',
            error: error.message
        });
        console.error(error);
    }
};

export const getProducts = async (req, res) => {
    try {
        const productos = await Producto.find();
        if (productos.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No products found'
            });
        }
        res.status(200).json({
            success: true,
            productos,
            message: 'Productos encontrados'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error getting products',
            error: error.message
        });
        console.error(error);
    }
}

export const getTopSellingProducts = async (req, res) => {
    try {
        const productos = await Producto.find().sort({ sales: -1 });// Obtener los productos ordenados por ventas (sales) de forma descendente
        // Verificar si se encontraron productos
        if (productos.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No se encontraron productos'
            });
        }
        res.status(200).json({ // Responder con los productos más vendidos
            success: true,
            productos,
            message: 'Productos más vendidos obtenidos exitosamente'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los productos más vendidos',
            error: error.message
        });
        console.error(error);
    }
};
export const getSearchProductsByName = async (req, res) => {
    try {
        const { name } = req.query; // Extraer el término de búsqueda del query parameter
        if (!name) { // verification of the name of the product
            return res.status(400).json({
                success: false,
                message: 'Debes proporcionar un nombre para buscar'
            });
        }
        const productos = await Producto.find({
            name: { $regex: name, $options: 'i' } // Búsqueda insensible a mayúsculas/minúsculas
        });
        if (productos.length === 0) { // Verificar si se encontraron productos
            return res.status(404).json({
                success: false,
                message: 'No se encontraron productos con ese nombre'
            });
        }
        res.status(200).json({
            success: true,
            productos,
            message: 'Productos encontrados'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al buscar productos por nombre',
            error: error.message
        });
        console.error(error);
    }
};

export const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.query; // Extraer el ID o nombre de la categoría del query parameter
        if (!category) { // Verificar si se proporcionó una categoría para filtrar
            return res.status(400).json({
                success: false,
                message: 'Debes proporcionar una categoría para filtrar'
            });
        }
        const categoriaExistente = await Categoria.findOne({ // Buscar la categoría en la base de datos (por ID o nombre)
            $or: [
                { _id: category }, // Buscar por ID
                { name: category } // Buscar por nombre
            ]
        });
        if (!categoriaExistente) { // Verificar si la categoría existe
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            });
        }
        const productos = await Producto.find({ category: categoriaExistente._id }); // Buscar productos que pertenezcan a la categoría
        if (productos.length === 0) { // Verificar si se encontraron productos
            return res.status(404).json({
                success: false,
                message: 'No se encontraron productos en esta categoría'
            });
        }
        res.status(200).json({ // Responder con los productos encontrados
            success: true,
            productos,
            message: 'Productos filtrados por categoría'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al filtrar productos por categoría',
            error: error.message
        });
        console.error(error);
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { uid } = req.params;
        const data = req.body;

        const editedProduct = await Producto.findByIdAndUpdate(uid, data, {new: true} )

        return res.status(200).json({
            message: "Updated product",
            editedProduct
        });
    } catch (err) {
        return res.status(500).json({
            message: "Product update failed",
            error: err.message
        });
    }
}


export const deleteProduct = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Producto no encontrado" });
        }

        res.status(200).json({ success: true, message: "Producto eliminado con éxito" });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar el producto",
            error: error.message,
        });
    }
};


export const getOutOfStockProducts = async (req = request, res = response) => {
    try {
        const outOfStockProducts = await Product.find({ stock: 0 });
        res.status(200).json({ success: true, outOfStockProducts });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener productos agotados",
            error: error.message,
        });
    }
};

