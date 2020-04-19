import { addProducts, checkoutCart, createEmptyCart, getCart, removeProducts } from '../controller/cart';

export class CartRoute {
  public routes(app): void {
    app.route('/cart/:cart_id').get(getCart);
    app.route('/cart/:cart_id/checkout/:rate').get(checkoutCart);
    app.route('/cart').post(createEmptyCart);
    app.route('/cart/:cart_id/add').post(addProducts);
    app.route('/cart/:cart_id/remove').post(removeProducts);
  }
}