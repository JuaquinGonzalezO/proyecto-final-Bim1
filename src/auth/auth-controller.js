import Usuario from '../user/user-model.js';
import { hash, verify } from 'argon2';
import { generarJWT} from '../helpers/genrate-jwt.js';


export const register = async (req, res) => {
    try {
        const data = req.body;


        const existingUser = await Usuario.findOne({ email: data.email });
        console.log(data)
        if (existingUser) {
            return res.status(400).json({ msg: "The user is already registered" });
        }

        data.password = await hash(data.password);

        const newUser = new Usuario(data);
        data.role || 'USER_ROLE'
        await newUser.save();

        res.status(201).json({
            msg: "Successfully created user",
            newUser
        });
        
    } catch (err) {
        res.status(500).json({ msg: "Error creating user", error: err.message });

    }
}

export const login = async (req, res) => {
    const { email, username, password } = req.body
    try{

        const user = await Usuario.findOne({$or:[{email: email}, {username: username}]})

        if(!user){
            return res.status(400).json({
                message: "Invalid Credentials",
                error:"The email or username entered does not exist"
            })
        }

        const validPassword = await verify(user.password, password)

        if(!validPassword){
            return res.status(400).json({

                message: "Invalid Credentials",

                error: "Incorrect password"
            })
        }

        const token = await generarJWT(user.id)

        return res.status(200).json({
            message: "Login successful",
            userDetails: {
                token: token,
                message: "Welcome Back!"

            }
        })
    }catch(err){
        return res.status(500).json({
            message: "login failed, server error",
            error: err.message
        })
    }
}

