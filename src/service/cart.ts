import { Product } from "../model/Product";
import axios from 'axios'
import { setupCache } from 'axios-cache-adapter'
import {CartAPILogger} from "../lib/logger";

const cache = setupCache({
  maxAge: 30*1000 // in case of testing cache is valid for 30s. It should be replaced by 24h
});

const ratesApi = axios.create({
  adapter: cache.adapter
});

export const calculateTotalCartAmount = (products: Array<Product>): number =>
  products.length? products.map(product => product.price.value * product.quantity).reduce((total, amount) => total + amount) : 0;

export const getCurrentRate = async (rate: string) => {
  const response = await ratesApi({
    url: process.env.RATES_API_URL,
    method: 'get'
  });
  const { data, request: { fromCache=false  } } = response;
  CartAPILogger.logger.info(`[service.cart] [getCurrentRate()] Rates fetch from cache: ${fromCache}`);
  // console.log('fromCache:', fromCache);
  return data.rates[rate];

};

export const addProductsToCart = async (cartProducts: Array<Product>, addedProducts: Array<Product>) => {

  if (!cartProducts.length) { // if cart is empty, add products
    cartProducts.push(...addedProducts);

  } else { // if cart is not empty, increase product quantity for existing product
    addedProducts.forEach((addedProduct) => {
      const cartProduct = cartProducts.find(product => product.id === addedProduct.id);
      if (cartProduct) cartProduct.quantity += addedProduct.quantity; else cartProducts.push(addedProduct);
    });
  }
  return {
    cartProducts,
    message: `Products were added`
  };
};

export const removeProductsFromCart = async (products: Array<Product>, removedProductIds: Array<string>) => {
  const message = [];
  if (!products.length) {
    message.push('Cart is empty');
  } else {
    removedProductIds.forEach((removedProductId) => {
      const cartProduct = products.find(product => product.id === removedProductId);

      if (cartProduct) {
        cartProduct.quantity -= 1;
        if (cartProduct.quantity <= 0) {
          products = products.filter(product => product.id !== removedProductId);
        }
        message.push(`Product with id: ${removedProductId} removed`);
      } else {
        message.push(`Product with id: ${removedProductId} not exists`);
      }
    })
  }
  return {
    products,
    message
  }
};