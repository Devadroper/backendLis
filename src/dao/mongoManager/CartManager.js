import { cartsModel } from "../models/carts.model.js";

export default class CartManager {
  async readFile() {
    const read = await cartsModel.find({});
    return read;
  }

  async createCart() {
    try {
      const create = await cartsModel.create({
        products: [],
      });
      return create;
    } catch (err) {
      console.log(err);
    }
  }

  async getCartById(id) {
    try {
      const getId = await cartsModel.findById(id).populate("products");
      return getId;
    } catch (err) {
      console.log(err);
    }
  }

  async addToCart(cid, pid) {
    try {
      const cart = await cartsModel.findById(cid);

      // me fijo si el carrito esta creado
      if (!!cart) {

        const prod = cart.products.find(e => e.productId === pid)

        // despues me fijo que el producto ya exista en el carrito
        if (!!prod) {

          // const update = cart.products.map(prod => {
          //   if (prod.productId == pid) {
          //     prod.quantity += quantity
          //   }
          //   return prod
          // })
          // return await cartsModel.findByIdAndUpdate(cid, { products: update })

          return { message: "Producto existente en el carrito" }

        } else {

          // const addProd = await cartsModel.findOneAndUpdate(
          //   { _id: cid },
          //   { $push: { products: { productId: pid, quantity: quantity } } }
          // );
          // return addProd

          cart.products.push(pid)
          return cart.save()

        }
      } else {
        return { error: "Carrito no encontrado" };
      }
    } catch (err) {
      console.log(err);
    }
  }

  async deleteFromCart(cid, pid) {
    try {

      const cart = await cartsModel.findById(cid);

      if (!!cart) {
        const prod = cart.products.find((e) => e.toString() === pid);
        if (!!prod) {
          cart.products.splice(cart.products.indexOf(prod), 1)
          return cart.save()
        } else {
          return { error: "El producto no fue encontrado" };
        }
      } else {
        return { error: "El carrito no fue encontrado" };
      }
    } catch (err) {
      console.log(err);
    }
  }

  async deleteCart(cid) {
    try {
      const cart = await cartsModel.findByIdAndUpdate(cid, { products: [] })
      if (!!cart) {
        return cart
      } else {
        return { error: "El carrito no fue encontrado" };
      }
    } catch (err) {
      console.log(err);
    }
  }
}
