# Codeminer 42

## Setup

### Use command for installer dependences

```shell
npm i
```

### Use command for installer migrations

```shell
sequelize db:migrate
or
.\node_modules\.bin\sequelize db:migrate
```

### Use command for installer seeders

```shell
sequelize db:seed:all
or
.\node_modules\.bin\ db:seed:all
```

Use command for start server

```shell
npm run dev
```

Use command for start test

```shell
npm run test
```



# Items

```js
{
    {
      id: 1,
      name: 'Water',
      points: 4
    },{
      id: 2,
      name: 'Food',
      points: 3
    },
    {
      id: 3
      name: 'Medication',
      points: 2
    },
    {
      id: 4
      name: 'Ammunition',
      points: 1
    }
}
```



# Routes 



## Router GET/

```js
router.get('/', SurvivorsController.index);
```

### Return example

```js
{ "Hello World" }
```



## Router POST/register

```js
router.post('/register', SurvivorsController.store);
```

### Params

```js
{
        "name": "John Doe",
        "age": 42,
        "sex": "Masculino",
        "last_place": null,
        "items": [
          {"item_id": 1, "quantity": 1},
          {"item_id": 2, "quantity": 5},
          {"item_id": 3, "quantity": 3}
        ]
}
```

### Return example

```js
{
  "id": 42,
  "name": "John Doe",
  "age": 42
}
```



## Router PATCH/indicators

```js
router.patch('/indicators', SurvivorsController.updateInfectionIndicator);
```

### Prams

```js
{
	"survivor_id": 1
}
```

### Return example

```js
{
  "message": "Successful alert",
  "status": 200
}
```



## Router  POST/trade

```js
router.post('/trade', TradeController.tradeItems);
```

### Prams

```js
{
	"from": {
			"survivor_id": 3,
			"item_id": 3,
			"quantity": 2	
	},
	"per": {
			"survivor_id": 4,
			"item_id": 2,
			"quantity": 1
	}
}
```

### Return example

```js

```



## Router  GET/reports

```js
router.get('/reports', ReportsController.infectedPercentage);
```

### Return Example

```js
{
  "infected": "100%",
  "notInfected": "0%"
}
```

