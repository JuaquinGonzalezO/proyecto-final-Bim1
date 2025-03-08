import { Router } from "express";
import { check } from "express-validator";
import { updateCategoria, deleteCategoria, getCategoria, getCategoriaById, createCategoria } from "./categorias-controller.js";
import { existeUsuarioById, existeCategoriaById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router();

router.get("/viewCategory", getCategoria);

router.get(
    "/findUser/:id",
    [
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    getCategoriaById
)

router.post(
    "/createCategory",
    [
        check("name", "Name is required").not().isEmpty(),
        check("description", "description is required").not().isEmpty(),
        validarCampos
    ],
    createCategoria
)

router.put(
    "/:id",
    [
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos

    ],
    updateCategoria
)

router.delete(
    "/:cid",
    [
        check("cid", "No es un ID valido").isMongoId(),
        //check("uid").custom(existeCategoriaById),
        validarCampos
    ],
    deleteCategoria
)


export default router;