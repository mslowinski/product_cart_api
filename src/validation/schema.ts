import * as Joi from 'Joi';
const priceSchema = {
  value: Joi.number().positive().required(),
  currency: Joi.string().required()
};
const productSchema = {
      id: Joi.string().required(),
      name: Joi.string().required(),
      price: Joi.object(priceSchema).required(),
      quantity: Joi.number().positive().required(),
      description: Joi.string()
};
export const productsSchema = Joi.object({
  products: Joi.array().min(1).items(Joi.object(productSchema)).unique((a, b) => a.id === b.id).required()
});