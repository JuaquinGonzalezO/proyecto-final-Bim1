import { response, request } from "express";;
import User from "./user-model.js";
import { hash, verify } from "argon2";


export const getUsers = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { estado: true };

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])
        res.status(200).json({
            succes: true,
            total,
            users


        })

    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error al obtener usuarios',
            error
        })
    }

}
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return req.status(404).json({
                succes: false,
                msg: 'usuario not found'
            })
        }

        res.status(200).json({
            succes: true,
            user
        })


    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error al obtener usuarios',
            error
        })
    }
}

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, password, ...data } = req.body;


        const userExists = await User.findById(id);
        if (!userExists) {
            return res.status(404).json({
                succes: false,
                msg: "Usuario no encontrado",
            });
        }

        if (password) {
            const salt = bcrypt.genSaltSync(10);
            data.password = bcrypt.hashSync(password, salt);
        }


        const user = await User.findByIdAndUpdate(id, data, { new: true });

        return res.status(200).json({
            succes: true,
            msg: "Usuario actualizado correctamente",
            user,
        });

    } catch (error) {
        console.error("Error al actualizar usuario:", error);

        return res.status(500).json({
            succes: false,
            msg: "Error al actualizar Usuario",
            error: error.message, 
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "Usuario no encontrado",
            });
        }
        return res.status(200).json({
            success: true,
            msg: "Usuario eliminado correctamente",
            deletedUser: user
        });

    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        return res.status(500).json({
            success: false,
            msg: "Error al eliminar usuario",
            error: error.message
        });
    }
};
   
   
    export const updateUserProfile = async (req, res) => {
        try {
          const { uid } = req.user;  
          const { name, email, preferences } = req.body;
          if (!name && !email && !preferences) {
            return res.status(400).json({ msg: 'No se proporcionaron datos para actualizar' });
          }
          const user = await User.findById(uid);
          if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
          }
      
          if (name) user.name = name;
          if (email) user.email = email;
          if (preferences) user.preferences = preferences;
          await user.save();
      
          return res.status(200).json({ msg: 'Perfil actualizado con éxito', user });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ msg: 'Error interno del servidor', error: error.message });
        }
      };