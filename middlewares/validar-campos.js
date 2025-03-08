import { validationResult } from 'express-validator';

export const validarCampos = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Errores de validación",
            errors: errors.array()  // Aquí retornamos el array de errores detallados
        });
    }

    next();  // Si no hay errores, sigue con el siguiente middleware (controlador)
};