import { Schema, model } from "mongoose";

const ProductoSchema = Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            unique: true
        },
        description: {
            type: String,
            required: [true, "Product description is required"]
        },
        price: {
            type: Number,
            required: [true, "Product price is required"]
        },
        stock: {
            type: Number,
            required: [true, "Product stock is required"],
            default: 0
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Categoria',
            required: [true, "Product category is required"]
        },
        sales: {
            type: Number,
            default: 0, 
        },
        status: {
            type: Boolean,
            default: true, 
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

ProductoSchema.methods.toJSON = function () {
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

export default model('Producto', ProductoSchema);