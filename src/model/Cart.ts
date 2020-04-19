import { Product} from "./Product";

export interface Cart {
  id: string,
  products: Array<Product>,
  totalAmount: number,
  currency: string,
  checkoutAmount: string
}