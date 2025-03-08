import Categoria from '../src/categorias/categorias-model.js'

export const createCategory = async () => {
    try {
        const name = "defecto"
        const description = "Categoria por defecto"

        const existingCategory = await Categoria.findOne({ name })

        if (!existingCategory) {
        const newCategoria = new Categoria({
            name,
            description
        });

        await newCategoria.save()
        console.log("The default category has been created successfully")

        }else{
        console.log("A category already exists in the system, another one will not be created")
        }
    } catch (err) {
        console.error("Error creating categories:", err)
    }

}