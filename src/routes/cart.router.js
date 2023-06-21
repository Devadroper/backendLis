import { Router } from "express";

const router = Router()

// renderiza carrito
router.get('/', async (req, res) => { // si llamo al slash views renderio formualrio
    // si el us no esta logeado
    if (req.session && !req.session.email) {
        res.redirect('/users/login')//redireccion a vista de login
    } else {
        const baseUrl = req.protocol + '://' + req.get('host')
        const cartApi = await fetch(baseUrl + `/api/carts/${req.session.cartId}`)
        const dataCart = await cartApi.json()
        let total = 0
        let items = []
        for (const item of dataCart.products) {
            const prod = await fetch(baseUrl + `/api/products/${item.productId}`)
            const prodData = await prod.json()
            const subtotal = prodData.price * item.quantity
            total += subtotal
            items.push({...prodData, 'quantity': item.quantity, 'subtotal': subtotal})
        }
        res.render('carts', { 'prods': items, 'userName': req.session.userName, 'cartId': req.session.cartId, 'total':total })
    }
})

export default router