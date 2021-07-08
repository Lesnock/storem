# Storem
A reactive store of data for global state management in JS.

- [`Installation`](#installation)

- [`Usage`](#usage)
  - [`Creating the store`](#creating-the-store)
  - [`Configurations`](#configurations)
- [`API Methods`](#api-methods)
  - [`set`](#set)
  - [`get`](#get)
  - [`all`](#all)
  - [`only`](#only)
  - [`delete`](#delete)
  - [`has`](#has)
- [`The reactive part`](#the-reactive-part)
  - [`listen`](#listen)
- [`Persisting Data`](#persisting-data)
  - [`Integration with React`](#using-storem-with-react)
  - [`Tutorials`](#tutorials)

## Installation
```sh
npm install storem
// OR
yarn add storem
```

## Usage

### Getting Started
In store.js file:

```javascript
import { Store } from 'storem';

const store = new Store();

export default store;
```

In otherfile.js file:
```javascript
import store from './store'

store.set({ name: 'John' })

// When "name" changes in the store, this callback will be executed
store.listen('name', (value, oldValue) => {
  if (value !== oldValue) {
    console.log(`name changed to ${value}`)
  }
})

store.set({ name: 'Mary' }) // Will emit the event binded before - name changed to 'Mary'

store.get('name') // Mary

store.delete('name')

store.get('name') // undefined
```

### Creating the store
To start using Storem we should create a file to instantiate the store. We can create multiple stores or create a **single source of truth** (**recommended**):

Example with **multiple** data sources:
```javascript
// store.js
import { Store } from 'storem'

const userStore = new Store({ persist: true })
const themeStore = new Store({ persist: true })
const productStore = new Store({ persist: true, debug: true })

export {
  userStore,
  themeStore,
  productStore
}
```

Example with a **single** source of data (single source of truth)
```javascript
// store.js
import { Store } from 'storem';

const store = new Store({ persist: true });

export default { store };
```

## Configurations

Storem can receive a configuration object as the constructor argument. Below are the available options:

- `persist`
Determines if the data should be persisted throughout the pages (uses localStorage, so it is only available in the browser)

- `debug`
Turn on debug mode. If enabled, all store changes will be logged in the console.

- `reactOnDelete`
If true, will execute the callback events when data is deleted in the store.

Example:

```javascript
import { Store } from 'storem'

const store = new Store({
  persist: true,
  debug: true,
  reactOnDelete: false
})

```

# API Methods

#### set
To add data to the store or update an existing data, we use the **set** method:

```javascript
import { Store } from 'storem'

const store = new Store()

store.set({ name: 'John' }) // Will create the data "name" with value "John"

store.set({ name: 'Mary' }) // Will update the data "name" to "Mary"
```

#### get
Fetch a specific field from the store:
```javascript
const name = store.get('name')
```

#### all
Fetch all data from the store.
```javascript
const storeData = store.all()

// Using destructuring assignment
const { name, age, address } = store.all()
```

#### only
Retrieves specifics fields from the store.
This method will return an object with the required data:
```javascript
const data = store.only(['name', 'age', 'address'])
// { name: 'John', age: 23, address: 'Lombard Street' }

// Using destructuring assignment
const { name, age, address } = store.only(['name', 'age', 'address'])
```

#### has
Verify if a data exists in the store:
```javascript
store.add({ name: 'John' })

store.has('name') // true
```

#### delete

You can aswell **delete** a data from the store

```javascript
store.set({ name: 'John' })
store.delete('name')

console.log(store.get('name')) // undefined
```

## The reactive part
Storem is reactive to data change. This means that Storem can detect all data changes in your application.
It's possible to attach an event callback to be executed whenever a specific data is updated in the store.
This is a powerfull tool, since it can be used to globally sinchronize all components of your application.

#### listen
Listen to changes in a specific data in the store, and once it changes, the callback function is executed. The callback  function will receive the current value and the old value as arguments:
```javascript
store.set({ activeLesson: 1 })

// Listen to changes in the activeLesson data, and executes the callback
store.listen('activeLesson', (value, oldValue) => {
  console.log('Active Lesson has changed to: ' + value)
}
```

The **listen** method is where the *magic* happens. You can synchronize all components within your application listening to changes in the store.

Example:

```javascript
// Whenever cart items changes, total value is recalculated
store.listen('cartItems', (cardItems) => {
  recalculateTotal(cardItems)
})
```

## Persisting Data

If you want the data to persist throughout the pages, and refreshes,
just set the **persist** config to true in the store configs. With this config, Storem will
save the data in the localStorage, and will automatically load it from there when the page refreshes
or the user change the route. Storem state will be the same, regardless of page change.
This will **NOT** work in the Node enviroment, just in the browsers.
```javascript
// Set persist to true when creating the store
const store = new Store({
  persist: true,
})
```

It's important to mention that, if you persist the data, when you refresh or change the page in your application, Storem will load the data automatically from localStorage, but if you set a data manually to the store, it will overwrite the data that was loaded from localStorage. So, if you want to avoid that behaviour, you can check if a data already exists before set the data:

```javascript
if (!store.has('name')) {
  store.set({ name: 'John Doe' })
}

// OR
!store.has('name') && store.set({ name: 'John Doe' })
```

## Using Storem with React
Storem works well with React, either.
In order to use a store in React, the most important thing is to sinchronyze the component rendering with the data in the store.
Storem makes this easy.

Look at how to sinchronyze a component with the store:

```javascript
import React, { useState, useEffect } from 'react'
import store from './store'

export default function Name() {
  const [name, setName] = useState(store.get('name') || 'John Doe')

  // Synchronize the component state with store data whenever it changes
  useEffect(() => {
    store.listen('name', value => setName(value))
  }, [])

  // Function to change the name
  const changeName = () => {
    store.set({ name: 'Mary' })
  }

  return (
    <div>
      <span>{name}</span>
      <button onClick={changeName}>Change name</button>
    </div>
  )
}
```
