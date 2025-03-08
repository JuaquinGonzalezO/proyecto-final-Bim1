import {Schema, model} from 'mongoose';

const cartSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [
        {
            idProduct: {
                type: Schema.Types.ObjectId,
                ref: "Producto",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            subTotal: {
                type: Number,
                required: true,
                default: 0
            }
        }
    ]
},
{
    timestamps: true,
    versionKey: false
    
})

cartSchema.methods.toJSON = function(){
    const {_id, ...cart} = this.toObject();
    cart.cid = _id;
    return cart;
}

export default model('Cart', cartSchema);
