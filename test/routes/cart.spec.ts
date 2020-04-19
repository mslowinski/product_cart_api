import * as chai from 'chai';
import chaiHttp = require('chai-http');
import 'mocha';
import app from '../../src/app';

chai.use(chaiHttp);

const expect = chai.expect;

const singleTestProduct = {
      id: '1',
      name: 'Product 1',
      price: {
        value: 5,
        currency: 'EUR'
      },
      quantity: 3,
      description: 'Product 1 details'
};
const testAddedProducts = {
  products: [
    {
      id: '1',
      name: 'Product 1',
      price: {
        value: 5,
        currency: 'EUR'
      },
      quantity: 1,
      description: 'Product 1 details'
    },
    {
      id: '2',
      name: 'Product 2',
      price: {
        value: 10,
        currency: 'EUR'
      },
      quantity: 2,
      description: 'Product 2 details'
    }
  ]
};
const testAddedProduct = {
  id: '1',
  name: 'Product 1',
  price: {
    value: 5,
    currency: 'EUR'
  },
  quantity: 1,
  description: 'Product 1 details'
};

const testRemovedProductsIds = { removed_products_ids: ['1'] };

describe('cartRoute', () => {
  let cart;

  it('should ', async () => {
    const response = await chai.request(app).get(`/cart/1`);

    expect(response).to.have.status(404);
  });

  it('POST /cart should create a new Cart and retrieve it back', async () => {
    const response = await chai.request(app).post('/cart');
    cart = response.body;

    expect(response).to.have.status(200);
    expect(response.body).to.be.an('object');
    expect(response.body).to.have.property('id', cart.id);
  });
  it('POST /cart/:cart_id/add should add product to existing Cart and retrieve it back', async () => {
    const response = await chai.request(app).post(`/cart/${cart.id}/add`).send(testAddedProducts);
    cart = response.body.cartInstance;

    expect(response).to.have.status(200);
    expect(response.body).to.be.an('object');
    expect(response.body.cartInstance).to.be.an('object');
    expect(response.body.cartInstance.products).to.be.an('array');
    expect(response.body.cartInstance.products).to.deep.include(testAddedProduct);
    expect(response.body.message).to.be.an('string');
    expect(response.body.message).to.be.equal('Products were added');
  });
  it('POST /cart/:cart_id/add should increase quantity if product exist in the Cart', async () => {
    const productQuantity  = cart.products.find(product => product.id === '1').quantity;
    const responseCart = await chai.request(app).post(`/cart/${cart.id}/add`).send({products:[singleTestProduct]});
    const increasedProductQuantity =
      responseCart.body.cartInstance.products.find(product => product.id === '1').quantity;

    expect(increasedProductQuantity).to.be.equal(productQuantity+singleTestProduct.quantity);
  });
  it('POST /cart/:cart_id/remove should remove products from existing Cart', async () => {
    const response = await chai.request(app).post(`/cart/${cart.id}/remove`).send(testRemovedProductsIds);

    expect(response).to.have.status(200);
    expect(response.body.cartInstance.products).to.not.include(testAddedProduct);
    expect(response.body.message).to.be.an('array').that.does.include('Product with id: 1 removed');
  });
  it('GET /cart/:cart_id should respond with Cart', async () => {
    const response = await chai.request(app).get(`/cart/${cart.id}`);

    expect(response).to.have.status(200);
    expect(response.body).to.be.an('object');
    expect(response.body.id).to.be.equal(cart.id);
  });
});



