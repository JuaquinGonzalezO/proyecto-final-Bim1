import Cart from "./shopping cart-model.js";
import Producto from "../productos/productos-model.js";

export const addToCart = async (req, res) => {
  try {
      // este const lo que hace es recibir los datos que proporciona el token
      const {usuario} = req;
      // esto es el id del producto y la cantidad
      const {idProduct, quantity} = req.body;


      // este busca si el usuario tiene un carrito, y de no tenerlo le asigna uno con el array de los productos vacio
      let cart = await Cart.findOne({owner: usuario._id});
      if(!cart) {
          cart = new Cart({
              owner: usuario._id, 
              products: []
          });
      }

      // este busca si existe un producto con el id del producto puesto en la peticion
      const product = await Producto.findById(idProduct);
      if (!product) {
          return res.status(400).json({ 
              success: false,
              message: "Product not avalaible" 
          });
      }
      // de encontrar el producto pero este tiene de stock 0, manda un error diciendo que el producto no tiene stock
      if(product.stock === 0) {
          return res.status(400).json({
              success: false,
              message: "Product out of stock"
          });
      }
      const productIndex = cart.products.findIndex(product => product.idProduct.toString() == idProduct.toString());
      let currentQuantity = 0;
      if(productIndex > -1) {
          currentQuantity = cart.products[productIndex].quantity;
      }
      if (currentQuantity + parseInt(quantity) > product.stock) {
          return res.status(400).json({
              success: false,
              message: "There are no sufficient units of this product"
          });
      }
      if(productIndex > -1) {
          cart.products[productIndex].quantity += parseInt(quantity);
          cart.products[productIndex].subTotal += (parseInt(quantity) * product.price);
      } else {
          cart.products.push({
              idProduct,
              quantity: parseInt(quantity),
              subTotal: parseInt(quantity) * product.price
          });
      }
      await cart.save();
      res.status(200).json({
          success: true,
          message: "Product added to cart successfully",
          data: cart
      });

  } catch (err) {
      res.status(500).json({
          success: false,
          message: "Error adding product to cart",
          error: err.message
      });
  }
}
  
export const deleteProductFromCart = async (req, res) => {
  try {
      const { usuario } = req;
      const { idProduct } = req.params;
      const cart = await Cart.findOne({ owner: usuario._id });
      if (!cart) {
          return res.status(400).json({ 
              success: false, 
              message: "Cart not found" 
          });
      }
      const productIndex = cart.products.findIndex(product => product.idProduct.toString() === idProduct);
      if (productIndex === -1) {
          return res.status(400).json({
              success: false,
              message: "Product not in cart"
          });
      }
      cart.products.splice(productIndex, 1);
      await cart.save();
      res.status(200).json({
          success: true,
          message: "Product deleted from cart successfully",
          data: cart
      });
  } catch (err) {
      res.status(500).json({
          success: false,
          message: "Error deleting product from cart",
          error: err.message
      });
  }
}

  
export const updateProductQuantityInCart = async (req, res) => {
  try {
      const { usuario } = req;
      const { idProduct } = req.params;
      const { quantity } = req.body;

      // Validar que la cantidad sea un número válido y mayor a 0
      if (!quantity || quantity <= 0) {
          return res.status(400).json({
              success: false,
              message: "Quantity must be greater than 0"
          });
      }

      // Buscar el carrito del usuario
      const cart = await Cart.findOne({ owner: usuario._id });

      if (!cart) {
          return res.status(400).json({ 
              success: false, 
              message: "Cart not found" 
          });
      }

      // Buscar el producto en el carrito
      const productIndex = cart.products.findIndex(product => product.idProduct.toString() === idProduct);

      if (productIndex === -1) {
          return res.status(400).json({
              success: false,
              message: "Product not in cart"
          });
      }

      // Obtener el precio del producto
      const product = await Producto.findById(idProduct);
      if (!product) {
          return res.status(400).json({
              success: false,
              message: "Product not found"
          });
      }

      // Actualizar la cantidad y recalcular el subtotal
      cart.products[productIndex].quantity = quantity;
      cart.products[productIndex].subTotal = product.price * quantity;

      await cart.save();

      res.status(200).json({
          success: true,
          message: "Product quantity updated successfully",
          data: cart
      });
  } catch (err) {
      res.status(500).json({
          success: false,
          message: "Error updating product quantity in cart",
          error: err.message
      });
  }
};
  