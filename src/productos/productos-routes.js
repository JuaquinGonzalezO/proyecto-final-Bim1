import { Router } from "express";
import {
    createProducto,
    getProducts,
    getTopSellingProducts,
    getSearchProductsByName,
    getProductsByCategory,
    updateProduct,
    getOutOfStockProducts
} from "./productos-controller.js";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { existeProductById } from "../helpers/db-validator.js";



const router = Router();

router.get("/viewProductsNotFound", (req, res) => {
    res.send("Ruta de productos");
});

router.get(
    "/viewProducts", getProducts
);

router.get(
    "/productsMasvendidos", getTopSellingProducts
);

router.get(
    "/productsName", getSearchProductsByName //?name={nameProduct}
);

router.get(
    "/productsCategory", getProductsByCategory //?category=64f8b1e2f1a2b3c4d5e6f7g9
);

router.get("/productsOutOfStock", getOutOfStockProducts);

router.post(
    "/createProduct",
    [
        check("name", "Name is required").not().isEmpty(),
        check("description", "Description is required").not().isEmpty(),
        validarCampos
    ],
    createProducto
);

export default router;


router.put(
    "/:uid",
    [
        check("uid","No es un ID valido").isMongoId(),
        check("uid").custom(existeProductById),
        validarCampos

    ],
    updateProduct
)