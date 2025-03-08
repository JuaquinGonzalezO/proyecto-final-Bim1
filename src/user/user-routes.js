import { Router } from "express";
import { check } from "express-validator";
import { updateUser, deleteUser,getUsers,getUserById } from "./user-controller.js";
import { existeUsuarioById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import {uploadProfilePicture} from "../middlewares/multer-upload.js"

const router =  Router();

router.get("/", getUsers);

router.get(
    "/findUser/:id",
    [
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    getUserById
)

router.put(
    "/:id",
    uploadProfilePicture.single('profilePicture'),
    [
        check("id","No es un ID valido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos

    ],
    updateUser
)



router.delete(
    "/:id",
    [
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeUsuarioById),
        check("confirm", "Confirmación no proporcionada").exists(), 
        check("confirm", "Confirmación no válida").isBoolean(),  
        check("confirm", "Confirmación no válida").equals("true"), 
        validarCampos
    ],
    deleteUser
)





export default router;