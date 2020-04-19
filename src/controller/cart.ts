import { NextFunction, Request, Response } from "express";
import { Cart } from "../model/Cart";
import { CartAPILogger } from "../lib/logger";
import { productsSchema } from '../validation/schema'
import { addProductsToCart, calculateTotalCartAmount, getCurrentRate, removeProductsFromCart} from "../service/cart";
import { v4 as uuid } from 'uuid';

const carts: Array<Cart> = [];

export const createEmptyCart = async (req: Request, res: Response) => {
  const cart: Cart = {
    id: uuid(),
    products: [],
    totalAmount: 0,
    currency: process.env.DEFAULT_CURRENCY,
    checkoutAmount: ''
  };
  carts.push(cart);
  CartAPILogger.logger.info(`[POST] [/cart]`);
  return res.status(200).send(cart);
};
export const getCart = async (req: Request, res: Response) => {
  const { cart_id } = req.params;
  CartAPILogger.logger.info(`[GET] [/cart/:cart_id] ${cart_id}`);
  const cartInstance = carts.find(cart => cart.id === cart_id);
  if (cartInstance)  {
    return res.status(200).send(cartInstance);
  } else {
    CartAPILogger.logger.info(`[GET] [/cart/:cart_id] Cart ${cart_id} not exist`);
    return res.status(404).send({message: `Cart ${cart_id} not exist`});
  }
};

export const addProducts = async (req: Request, res: Response, next: NextFunction) => {

  const { cart_id } = req.params;
  const { products } = req.body;
  const { error } = productsSchema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json(error);
  const cartInstance: Cart = carts.find(cart => cart.id === cart_id);
  if (!cartInstance) {
    CartAPILogger.logger.info(`[POST] [/cart/:cart_id/add] Cart ${cart_id} not exist`);
    return res.status(404).send({message: `Cart ${cart_id} not exist`});
  }
  try {
    const { cartProducts, message } = await addProductsToCart(cartInstance.products, products);
    cartInstance.products = cartProducts;
    cartInstance.totalAmount = calculateTotalCartAmount(cartInstance.products);
    CartAPILogger.logger.info(`[POST] [/cart/:cart_id/add] Added products ${JSON.stringify(products)}`);
    return res.status(200).send({ cartInstance, message });
  } catch (error) {
      next(error);
  }
};

export const removeProducts = async (req: Request, res: Response, next: NextFunction) => {
  const { cart_id } = req.params;
  const { removed_products_ids } = req.body;
  const cartInstance: Cart = carts.find(cart => cart.id === cart_id);
  if (!cartInstance) {
    CartAPILogger.logger.info(`[POST] [/cart/:cart_id/remove] Cart ${cart_id} not exist`);
    return res.status(404).send({message: `Cart ${cart_id} not exist`});
  }
  try {
    const { products, message } = await removeProductsFromCart(cartInstance.products, removed_products_ids);
    cartInstance.products = products;
    cartInstance.totalAmount = calculateTotalCartAmount(cartInstance.products);
    CartAPILogger.logger.info(`[POST] [/cart/:cart_id/remove] Removed products ids ${JSON.stringify(removed_products_ids)}`);
    return res.status(200).send({ cartInstance, message });
  } catch (error) {
      next(error);
  }
};

export const checkoutCart = async (req: Request, res: Response, next: NextFunction) => {
  const { cart_id, rate } = req.params;
  const cartInstance: Cart = carts.find(cart => cart.id === cart_id);
  if (!cartInstance) {
    CartAPILogger.logger.info(`[POST] [/cart/:cart_id/checkout] Cart ${cart_id} not exist`);
    return res.status(404).send({message: `Cart ${cart_id} not exist`});
  }
  try {
    const currentRate = await getCurrentRate(rate);
    cartInstance.checkoutAmount = `${cartInstance.totalAmount * currentRate} ${rate}`;
    return res.status(200).send(cartInstance);
  } catch (error) {
      next(error);
  }
};