import jwt from 'jsonwebtoken';

export const generarJWT = (uid = ' ') => {

    return new Promise((resolve, reject)=>{

        const payload = { uid };

        jwt.sign(
            payload,
            process.env.SECRETORPRIVATEKEY,
            {
                expiresIn: '1h'
            },
            (err, token) => {
                err ? (console.log(err), reject('No se pudo generar el token')) : resolve(token);
            }
        );
    });
}


export const esAdminRole = (req, res, next) => {
    if (!req.usuario) {
        return res.status(500).json({
            msg: "Se quiere verificar el rol sin validar el token primero"
        });
    }

    if (req.usuario.role !== "ADMIN_ROLE") {
        return res.status(403).json({
            msg: "No tienes el rol de Administrador para realizar esta acción"
        });
    }

    next();
};