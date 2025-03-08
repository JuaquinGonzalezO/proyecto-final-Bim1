import { Schema, model } from "mongoose";

const CategoriaSchema = Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            unique: true,
            maxLength: [25, "Cant be overcome 25 characters"]
        },
        description: {
            type: String,
            required: [true, " description is required"],
            maxLength: [2000, "Cant be overcome 25 characters"]
        },
        status:{
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

CategoriaSchema.methods.toJSON = function () {
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.cid = _id;
    return usuario;
}

export default model('Categoria', CategoriaSchema);