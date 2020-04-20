import { addProducts, checkoutCart, createEmptyCart, getCart, removeProducts } from '../controller/cart';
import { auth } from '../lib/jwtToken';

export class CartRoute {
  public routes(app): void {
    app.route('/cart/:cart_id').get(auth, getCart);
    app.route('/cart/:cart_id/checkout/:rate').get(auth, checkoutCart);
    app.route('/cart').post(auth, createEmptyCart);
    app.route('/cart/:cart_id/add').post(auth, addProducts);
    app.route('/cart/:cart_id/remove').post(auth, removeProducts);
  }
}