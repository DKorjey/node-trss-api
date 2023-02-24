# Node TRSS api

(TRSS allows you to store a large number of skins (maximum 3 in the game itself))

## Install:
```sh
npm i node-trss-api
```

## Example (get views)
```js
const randint = (min, max) => Math.floor(Math.random() * (max - min) + min);

const num = 42;
console.log(await getSkinById(num)) // Outputs skin information
```
