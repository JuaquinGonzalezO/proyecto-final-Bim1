import { Router } from "express";
import { confirmPurchase } from "./factura-controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js"; 

const router = Router();

router.post("/generate", validarJWT, confirmPurchase);

export default router;