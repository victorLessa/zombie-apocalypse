# Codeminer 42

## Setup

* Before running migrations create a database and then run the migration.
* Why did I choose sequelize ORM? It allows you to create, fetch, alter and remove data from the database using JS methods, as well as allow you to modify the structure of the tables, making it easy to create, populate and migrate databases.
* Database used: Mysql.

### Run to install dependences

```shell
npm i
```

### Run to install migrations

```shell
sequelize db:migrate
or
.\node_modules\.bin\sequelize db:migrate
```

### Run to install seeders

```shell
sequelize db:seed:all
or
.\node_modules\.bin\sequelize db:seed:all
```

### Run to start server

```shell
npm run dev
```

### Run to start test

```shell
npm run test
```

# Items

* Items registered by seed:

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

# Survivors

### Prefix

```npm
/api/survivors
```

## Route GET/:id

* Return survivor by id

```js
router.get('/:id', SurvivorsController.index);
```

### Return example

```js
{
  "result": [
    {
      "id": 1,
      "name": "Codeminer",
      "age": 21,
      "sex": "Masculino",
      "last_place": {
        "x": -22.8945014,
        "y": -43.1185202
      },
      "created_at": "2019-10-04T14:12:35.000Z",
      "updated_at": "2019-10-04T14:50:50.000Z",
      "infected": 0
    }
  ]
}
else:
{
  "message": "Survivors not found",
  "status": 404
}
```

## Route GET/

* Returns all survivors

```js
router.get('/', SurvivorsController.show);
```

### Return example

```js
{
  "result": [
    {
      "id": 1,
      "name": "Codeminer",
      "age": 21,
      "sex": "Masculino",
      "last_place": {
        "x": -22.8945014,
        "y": -43.1185202
      },
      "created_at": "2019-10-04T14:12:35.000Z",
      "updated_at": "2019-10-04T14:50:50.000Z",
      "infected": 0
    },
    {
      "id": 2,
      "name": "Codeminer42",
      "age": 21,
      "sex": "Masculino",
      "last_place": {
        "x": -22.8945014,
        "y": -43.1185222
      },
      "created_at": "2019-10-04T14:12:48.000Z",
      "updated_at": "2019-10-04T14:12:48.000Z",
      "infected": 0
    }
  ]
}
or
{
  "message": "Survivor not found or got infected",
  "status": 404
}
```



## Route POST/register

* Perform the registration of a survivor

```js
router.post('/register', SurvivorsController.store);
```

### Parameters

```js
{
  "name": "Codeminer",
  "age": 21,
  "sex": "Masculino",
  "last_place": "-22.8945014,-43.1185222",
  "items": [
    { "item_id": 1, "quantity": 1 },
    { "item_id": 2, "quantity": 5 },
    { "item_id": 3, "quantity": 3 },
    { "item_id": 4, "quantity": 4 }
  ]
}
```

### Return example

```js
{
  "id": 1,
  "name": "John Doe",
  "age": 21
}
if there is error:
{
  "message": "User is already in the database",
  "status": 500
}
```

## Route PATCH/:id/place

* Update survivor localize

```js
router.patch('/:id/place', SurvivorsController.update);
```

### Parameters

```js
{
	"last_place": "-22.8945014,-43.1185222"
}
```

### Return example

```js
{
  "message": "Survivor location successfully updated",
  "status": 200
}
or
{
  "message": "Survivor not found",
  "status": 404
}
```




## Router PATCH/report_infection/:id

* Reports if one survivor is infected


```js
router.patch('/report_infection/:id', SurvivorsController.updateInfectionIndicator);
```

### Return example

```js
{
  "message": "Successful alert",
  "status": 200
}
if there is error:
{
  "message": "Survivor not found",
  "status": 404
}
```

# Reports

## Prefix

```bash
/api/reports
```

## Router  GET/

* returns report on: percentage of infected survivors, Percentage of uninfected survivors, average amount of each resource type per survivor (ex 5 waters per survivor), points lost because of infected survivor.
* Obs: Media of each resource type is taken from the 'uninfected'
* Calculation based on points * quantities

```js
router.get('/', ReportsController.infectedPercentage);
```

### Return Example

```js
{
  "calculatePercentage": {
    "infected": "66.67%",
    "notInfected": "33.33%"
  },
  "averageProperties": {
    "averageWater": 0.33,
    "averageFood": 1.67,
    "averageMedication": 1,
    "averageAmmunition": 1.33
  },
  "lostPoints": 58
}
```

# Properties

## Prefix

```bash
/api/properties
```

## Router  GET /:Id

* Fetches all items of the survivor

```js
router.get('/:id', PropertiesController.index);
```

### Return example

```js
{
  "result": {
    "name": "Victorc",
    "items": [
      {
        "name": "Water",
        "quantity": 0
      },
      {
        "name": "Food",
        "quantity": 5
      },
      {
        "name": "Medication",
        "quantity": 3
      },
      {
        "name": "Ammunition",
        "quantity": 8
      }
    ]
  }
}
or
{
  "message": "Infected Survivor",
  "status": 400
}
```

## Router GET/

* Search all items from all survivors

```js
router.get('/', PropertiesController.show);
```

### Return example

```js
{
  "result": [
    {
      "name": "Jhon Doe",
      "items": [
        {
          "name": "Water",
          "quantity": 2
        },
        {
          "name": "Food",
          "quantity": 5
        },
        {
          "name": "Medication",
          "quantity": 3
        },
        {
          "name": "Ammunition",
          "quantity": 0
        }
      ]
    },
    {
      "name": "Victorc",
      "items": [
        {
          "name": "Water",
          "quantity": 0
        },
        {
          "name": "Food",
          "quantity": 5
        },
        {
          "name": "Medication",
          "quantity": 3
        },
        {
          "name": "Ammunition",
          "quantity": 8
        }
      ]
    },
    {
      "name": "Codeminer 42",
      "items": [
        {
          "name": "Water",
          "quantity": 1
        },
        {
          "name": "Food",
          "quantity": 5
        },
        {
          "name": "Medication",
          "quantity": 3
        },
        {
          "name": "Ammunition",
          "quantity": 4
        }
      ]
    }
  ]
}
```

## Router  POST/:id

* Make a trade transaction between survivors

```js
router.post('/:id', PropertiesController.tradeItems);
```

### Parameters

```js
{
	"from": {
			"item_id": 1,
			"quantity": 4	
	},
	"per": {
			"survivor_id": 2,
			"item_id": 1,
			"quantity": 1
	}
}
```

### Return example

```js
{
  "message": "Trade was successful",
  "status": 200
}
if the user is infected: 
{ 
    "message": 'User Infected, can not trade', 
    "status": 400 
}
else if If you do not have the required quantity:
{
  "message": "User doesn't have this many items",
  "status": 500
}
else if User has no points needed to make the trade:
{
  "message": "Not enough points to trade",
  "status": 400
}
```
