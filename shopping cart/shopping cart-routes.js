import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { addToCart, deleteProductFromCart, updateProductQuantityInCart } from "./shopping cart-controller.js";  
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();


router.post(
    "/addcart",
    [
        validarJWT,  
        check("idProduct", "El ID del producto es obligatorio").not().isEmpty(),
        check("quantity", "La cantidad debe ser un número").isInt({ gt: 0 }),  
        validarCampos  
    ],
    addToCart
)

router.delete(
    "/deleteproduct/:idProduct",
    [
        validarJWT,
        check("idProduct", "El ID del producto es obligatorio").not().isEmpty(),
        validarCampos
    ],
    deleteProductFromCart
)

router.patch(
    "/updatequantity/:idProduct",
    [
        validarJWT,
        check("idProduct", "El ID del producto es obligatorio").not().isEmpty(),
        validarCampos 
    ],
    updateProductQuantityInCart

)

export default router;