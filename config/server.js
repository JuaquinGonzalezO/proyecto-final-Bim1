'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import authRoutes from '../src/auth/auth-routes.js';
import userRoutes from '../src/user/user-routes.js';
import productsRoutes from '../src/productos/productos-routes.js';
import categoriesRoutes from '../src/categorias/categorias-routes.js';
import facturaRoutes from "../src/factura/factura-routes.js";
import cartRoutes from "../src/shopping cart/shopping cart-routes.js"
import {createCategory} from "./datos-por-defecto.js"

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
}

const routes = (app) => {
    app.use("/ProyectoFSystem/v1/auth", authRoutes);
    app.use("/ProyectoFSystem/v1/users", userRoutes);
    app.use("/ProyectoFSystem/v1/products", productsRoutes);
    app.use("/ProyectoFSystem/v1/categories", categoriesRoutes);
    app.use("/ProyectoFSystem/v1/facture", facturaRoutes);
    app.use("/ProyectoFSystem/v1/cart",cartRoutes )
}

const conectarDB = async () => {
    try{
        await dbConnection();
        console.log("Conexión a la base de datos exitosa");
        await createCategory()
    }catch(error){
        console.error('Error conectando a la base de datos', error);
        process.exit(1);
    }
}

export const initServer = async () => {
    const app = express();
    const port = process.env.PORT || 3000;

    try {
        middlewares(app);
        conectarDB();
        routes(app);
        app.listen(port);
        console.log(`Server running on port: ${port}`);
    } catch (err) {
        console.log(`Server init failed: ${err}`);
    }
}