# Node TRSS api

TRSS (Team Run Skin Storage) allows you to store a large number of skins (maximum 3 in the game itself). So the API was created to work with it.

## Install:
```sh
npm i node-trss-api
```

## Example (get views)
```js
const num = 42;
console.log(await getSkinById(num).views) // Outputs amount of views
```
