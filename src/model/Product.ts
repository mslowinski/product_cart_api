interface Price {
  value: number,
  currency: string
}
export interface Product {
  id: string,
  name: string,
  price: Price,
  quantity: number,
  description?: string
}