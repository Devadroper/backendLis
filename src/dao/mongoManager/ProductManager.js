import { productsModel } from '../models/products.model.js'

export default class ProductManager {

    async addProduct({ title, description, code, price, status = true, stock, category, thumbnails }) {
        const addProd = await productsModel.create({
            'title': title,
            'description': description,
            'code': code,
            'price': price,
            'status': status,
            'stock': stock,
            'category': category,
            'thumbnails': thumbnails
        })
        return addProd
    }

    // consultar todos 
    async getProducts(query) {
        const prods = await productsModel.find({})
        if (query) {
            const { limit } = query
            if (limit) {
                return prods.splice(0, limit)
            }
        }
        return prods
    }

    async updateProductById(prodToUpdate) {
        const objName = Object.getOwnPropertyNames(prodToUpdate.data)
        const update = await productsModel.findOneAndUpdate(
            { _id: prodToUpdate.id },
            { $set: { objName: prodToUpdate.data } }
        )
        return update
    }

    async removeProductById(id) {
        const deleted = await productsModel.findByIdAndDelete(id)
        return deleted
    }

}