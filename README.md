# Local run with yarn
- Copy .env.exmaple into .env file.
- Install node modules:
```
yarn install
```
- Build the application
```
yarn build
```
- Run application server locally:
```
yarn dev
```
API should  be reachable on http://localhost:3000
#Running unit tests
To ran unit test on local machine just run below commands:
```
yarn pretest
yarn test
```
#Swagger documentation
API description is served on: http://localhost:3000/api/docs/

#cURL
- create a new Cart
```
curl -X POST \
  http://localhost:3000/cart \
  -H 'Accept: */*' \
  -H 'Accept-Encoding: gzip, deflate' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Content-Length: 0' \
  -H 'Host: localhost:3000' \
  -H 'cache-control: no-cache'
```
Should return created Cart object with id which can be used in below commands as a cart_id
- add sample Products to existing Cart


```
curl -X POST \
  http://localhost:3000/cart/{cart_id}/add \
  -H 'Accept: */*' \
  -H 'Accept-Encoding: gzip, deflate' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Content-Length: 336' \
  -H 'Content-Type: application/json' \
  -H 'Host: localhost:3000' \
  -H 'cache-control: no-cache' \
  -d '{
	"products": [
		{
			"id": "1",
			"name": "Product1",
			"price": {
				"value": 5,
				"currency": "PLN"
			},
			"quantity": 4,
			"description": "Desc Product 1"
		},
		{
			"id": "2",
			"name": "Product2",
			"price": {
				"value": 15,
				"currency": "PLN"
			},
			"quantity": 4,
			"description": "Desc Product 2"
		}
		]
}'
```
- remove Product from existing Cart
```
curl -X POST \
  http://localhost:3000/cart/{cart_id}/remove \
  -H 'Accept: */*' \
  -H 'Accept-Encoding: gzip, deflate' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Content-Length: 34' \
  -H 'Content-Type: application/json' \
  -H 'Host: localhost:3000' \
  -H 'cache-control: no-cache' \
  -d '{
	"removed_products_ids": ["1"]
}'
```
- checkout Cart products
```
curl -X GET \
  http://localhost:3000/cart/{cart_id}/checkout/CAD \
  -H 'Accept: */*' \
  -H 'Accept-Encoding: gzip, deflate' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Host: localhost:3000' \
  -H 'Postman-Token: 4931a220-4a2a-4616-ac15-abedf0c3b249,3a9a3d8d-97cb-48e3-9ed3-19e5a6adc0b4' \
  -H 'User-Agent: PostmanRuntime/7.20.1' \
  -H 'cache-control: no-cache'
```
