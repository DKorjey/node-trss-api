# Main

TRSS (Team Run Skin Storage) allows you to store a large number of skins (maximum 3 in the game itself). So the API was created to work with it.

## Install:
```sh
npm i node-trss-api
```

## Error codes
- 0: Invalid user or password

- 1: The user could not be found in the Team Run database
- 2: Failed to generate unique token
- 3: User already registered
- 4: User or skin not found
- 5: Exactly the same skin from the same author is already in the database
- 6: Skin not found
- 7: Skin creator ID does not match user ID",
- 8: Incorrect value
- -1: Unknown error

## Types
* `TrssErrorCode: number` (from -1 to 8)
* `skinDecoded: string[][]`
* `skinEncoded: string`

## Interfaces
### SkinInfo
* `author_id: number`
* `id: number`
* `likes: number`
* `primary_color: string`
* `secondary_color: string`
* `skin: skinEncoded`
* `skin_name: string`
* `views: number`

### UserInfo
* `id: number`
* `login: string`
* `skin: skinEncoded`
* `primary_color: string`
* `secondary_color: string`

### UserInfoByToken
* `id: number`
* `login: string`
* `skin: skinEncoded`
* `private_token: string`
* `primary_color: string`
* `secondary_color:  string`

### ChangedSkin
* `skin: skinEncoded`
* `primary_color: string`
* `secondary_color: string`

### SameSkinErrorInterface
* `error_code: TrssErrorCode`
* `id: number`

## TrssError class
```js
new TrssError(error_code);
```

constructor arguments: `error_code: TrssErrorCode`: matches its error

class properties: `code: TrssErrorCode`: matches its error


## SameSkinError class
```js
new SameSkinError(errorObject);
```
constructor arguments: `errorObject: SameSkinErrorInterface`

class properties: `obj: SameSkinError`

Initially only appears in the uploadSkin function

# Functions

## decodeSkin()

```js
decodeSkin(skin, twoDimensional);
```

Decodes the skin string into a 2D array

### Arguments:
* `skin: encodedSkin`
* `twoDimensional?: boolean`

### Returns:
* `decodedSkin`

### Example:
```js
console.log(decodeSkin("trSkin1MzCAAGsDHAzaUyQx6E0NIqfgcNhgokY4ww0MYBQ1FI66dagyRsN3lDHKGGWMMkYZQ4ABAA=="))
// Outputs like [
//  [
//    '#00000000', '#00000000',
//    '#00000000', '#000000FF',
//    '#000000FF', '#000000FF',
//    '#000000FF', '#000000FF',
//    '#000000FF', '#000000FF',
//    '#000000FF', '#000000FF',
//    '#000000FF', '#000000FF',
//    '#000000FF', '#000000FF',
//    '#000000FF', '#00000000',
//   '#00000000', '#00000000'
//  ], ...and more 18 items];

console.log(decodeSkin("trSkin1MzCAAGsDHAzaUyQx6E0NIqfgcNhgokY4ww0MYBQ1FI66dagyRsN3lDHKGGWMMkYZQ4ABAA==", false))
// Outputs like [
//   '#00000000', '#00000000',
//   '#00000000', '#000000FF',
//   '#000000FF', '#000000FF',
//   '#000000FF', '#000000FF',
//   '#000000FF', '#000000FF',
//   '#000000FF', '#000000FF',
//   '#000000FF', '#000000FF',
//   '#000000FF', '#000000FF',
//   '#000000FF', '#00000000',
//   '#00000000', '#00000000'
//   ...and more 340 items];
```

## isDecodedSkin()


Check if argument is decoded skin `(string[18][20])`

```js
isDecodedSkin(skin);
```

### Arguments:
* `skin: any`

### Returns:
* `boolean`

### Example:
```js
console.log(isDecodedSkin("trSkin1MzCAAGsDHAzaUyQx6E0NIqfgcNhgokY4ww0MYBQ1FI66dagyRsN3lDHKGGWMMkYZQ4ABAA=="))
// Outputs false

console.log(isDecodedSkin(decodeSkin("trSkin1MzCAAGsDHAzaUyQx6E0NIqfgcNhgokY4ww0MYBQ1FI66dagyRsN3lDHKGGWMMkYZQ4ABAA==")))
// Outputs true
```

## encodeSkin()

```js
encodeSkin(skin);
```

Encodes the 2D array into a skin string

### Arguments:
* `skin: decodedSkin`

### Returns:
* `encodedSkin`

### Example:
```js
const decoded = [
  [
    '#00000000', '#00000000',
    '#00000000', '#000000FF',
    '#000000FF', '#000000FF',
    '#000000FF', '#000000FF',
    '#000000FF', '#000000FF',
    '#000000FF', '#000000FF',
    '#000000FF', '#000000FF',
    '#000000FF', '#000000FF',
    '#000000FF', '#00000000',
    '#00000000', '#00000000'
  ], ...and more 18 items
];

console.log(encode(decoded))
// Outputs like  "trSkin1MzCAAGsDHAzaUyQx6E0NIqfgcNhgokY4ww0MYBQ1FI66dagyRsN3lDHKGGWMMkYZQ4ABAA=="
```

## isDecodedSkin()


Check if argument is decoded skin `(string[18][20])`

```js
isDecodedSkin(skin);
```

### Arguments:
* `skin: any`

### Returns:
* `boolean`

### Example:
```js
console.log(isEncodedSkin("trSkin1MzCAAGsDHAzaUyQx6E0NIqfgcNhgokY4ww0MYBQ1FI66dagyRsN3lDHKGGWMMkYZQ4ABAA=="))
// Outputs true

console.log(isEncodedSkin(decodeSkin("trSkin1MzCAAGsDHAzaUyQx6E0NIqfgcNhgokY4ww0MYBQ1FI66dagyRsN3lDHKGGWMMkYZQ4ABAA==")))
// Outputs false
```

## logIn()

Login the user into trss db

```js
logIn(login, password);
```

### Arguments:
* `login: string`
* `password: string`

### Returns:
* `Promise<string>`

### Example:
```js
console.log(await logIn("qwessomen", "42qwe137"));
// Returns like aJSL6n#91F~(3BlM%*Wk2Nsd(kZp7x1pq
```

## getUserById()

Gets user by given id

```js
getUserById(id);
```

### Arguments:
* `id: number`

### Returns:
* `Promise<UserInfo>`

### Example:
```js
console.log(await getUserById(3));
/*
Returns like {
  id: 3,
  login: 'gstroin',
  skin: 'trSkin17dZLCoAgFIXhLWmoIc2C3P+SEgURpOOj64PI0T/I/LwQxJhfB/tWGLemM0CcbsXUuVE1VRDXrsWuugaVOXuWMVEoGzITz7tKzCTjtWf518UBzODh3wxuMdhMMvCVzWDOVNHPPCAGmIXmkm92UCBemmnHEjyAmsZc/BgzCbWref0vrsScBvyvo7ppy3tKzBE+HFEVqbBleyq8AQ==',
  primary_color: '#542A2A',
  secondary_color: '#744F44'
}
*/
```

## getUserByToken()

Gets user by given token

```js
getUserByToken(token);
```

### Arguments:
* `token: string`

### Returns:
* `Promise<UserInfoByToken>`

### Example:
```js
console.log(await getUserByToken("aJSL6n#91F~(3BlM%*Wk2Nsd(kZp7x1pq"))
/*
Returns like {
  id: 42,
  login: 'qwessomen',
  skin: 'trSkin1MzCAAGsDHAzaUyQx6E0NIqfgcNhgokY4ww0MYBQ1FI66dagyRsN3lDHKGGWMMkYZQ4ABAA==',
  private_token: 'aJSL6n#91F~(3BlM%*Wk2Nsd(kZp7x1p',
  primary_color: '#FFFFFF',
  secondary_color: '#000000'
}
*/
```

## changeUserSkin()

Changes the user's main skin to the skin given in the arguments

```js
changeUserSkin(token, newSkinEncoded, primaryColor, secondaryColor);
```

### Arguments:
* `token: string`
* `newSkinEncoded: skinEncoded`
* `primaryColor: string`
* `secondaryColor: string`

### Returns:
* `Promise<ChangedSkin>`

### Example:
```js
console.log(await changeUserSkin("aJSL6n#91F~(3BlM%*Wk2Nsd(kZp7x1pq", "trSkin1MzCAAGuDUcYoY5QxyhjpDCNHNzfSVED5WClCmkiwFod9RLuPHM/T0agBCkWcEoMzFIm2DH84UsNpQ5pBZvDglCA6HEmPUBK8Q7a7qVYakZqrSPcK0QaR4Hii+ZQrJOyYAUqTAA==", "#a93769", "#00ff11"));
// Return the last three arguments
```

## toggleLike()

Toggle like

```js
toggleLike(token, skinId);
```

### Arguments:
* `token: string`
* `skinId: number`

### Returns:
* `Promise<boolean>`

### Example:
```js
// User alread liked

console.log(await toggleLike("aJSL6n#91F~(3BlM%*Wk2Nsd(kZp7x1pq", 42));
// Will return false

// And toggle again
console.log(await toggleLike("aJSL6n#91F~(3BlM%*Wk2Nsd(kZp7x1pq", 42));
// Will return true
```

## registerView()

Registers a view from the owner of the token and returns true on success and false if the view is already registered.

```js
registerView(token, skinId);
```

### Arguments:
* `token: string`
* `skinId: number`

### Returns:
* `Promise<boolean>`

### Example:
```js
// User didn't watch the skin
console.log(await registerView("aJSL6n#91F~(3BlM%*Wk2Nsd(kZp7x1pq"), 42);
// Will return true: the user has now viewed the skin

// Register again
console.log(await registerView("aJSL6n#91F~(3BlM%*Wk2Nsd(kZp7x1pq"), 42);
// Will return false: the user has already viewed the skin
```

## getLike()

Checks if the user liked the skin

```js
getLike(userId, skinId);
```
### Arguments:
* `userId: number`
* `skinId: number`

### Returns:
* `Promise<boolean>`

### Example:
```js
// Let's say the user has already liked
console.log(await getLike(42, 42));
// Will return true

// Now remove like
await toggleLike("aJSL6n#91F~(3BlM%*Wk2Nsd(kZp7x1pq", 42);

// And get again
console.log(await getLike(42, 42));
// Will return false
```

## uploadSkin()

Upload skin to trss database, and returns true if the skin is uploaded successfully

```js
uploadSkin(token, encodedSkin, skinName, primaryColor, secondaryColor);
```

### Arguments:
* `token: string`
* `encodedSkin: skinEncoded`
* `skinName: string`
* `primaryColor: string`
* `secondaryColor: string`

### Returns:
* `Promise<boolean>`

### Example:
```js
if (await uploadSkin("aJSL6n#91F~(3BlM%*Wk2Nsd(kZp7x1pq", "trSkin1MzCAAGsDHAzaUyQx6E0NIqfgcNhgokY4ww0MYBQ1FI66dagyRsN3lDHKGGWMMkYZQ4ABAA==", "A hat", "#000", "#fff")) {
  console.log("Success!");
}
```

## removeSkin()

Remove skin from trss database

```js
removeSkin(token, skinId);
```

### Arguments:
* `token: string`
* `skinId: number`

### Returns:
* `Promise<boolean>`


### Example:
```js
try {
  if (await removeSkin("aJSL6n#91F~(3BlM%*Wk2Nsd(kZp7x1pq", 74)) {
    console.log("Success!");
  }
} catch (e) {
  if (e instanceof TrssError) {
    console.log(e.message);
  }
}
```

## getSkinById()

Gets information about a skin

```js
getSkinById(id);
```

### Arguments:
* `id: number`

### Returns:
* `Promise<SkinInfo>`

### Example:
```js
console.log(await getSkinById(42));
/*
Will return like
{
  id: 42,
  skin_name: '6',
  author_id: 16,
  skin: 'trSkin17dMxEgAQDETRK6XX7/2PZFChIMRISKpfyHgFQBqigDoAXdEL3WzFTHm4ccW8RmXiy6ldsxRViXlmnRlufsQs94yVmpX8QYtm8S3j5gH+K/NauPkofu6u1hwB',
  primary_color: '#FFFFFF',
  secondary_color: '#000000',
  likes: 4,
  views: 4
}
*/
```

## getSkinsById()

Gets information about a skins

```js
getSkinById(fromId, amount);
```

### Arguments:
* `fromId: number`
* `amount: number`

### Returns:
* `Promise<SkinInfo[]>`

### Example:
```js
console.log(await getSkinsById(20, 2));
/*
Will return like
[
  {
    id: 34,
    skin_name: '=]',
    author_id: 14,
    skin: 'trSkin1MzCAAGuDocxwMwdBZMYgcRgxDFdjEHRzQzAGicOGtFOHoptdzEGQWm6G68JkUKgY2amjbh518zBwMyaDGDe7gQFW2+FSJDEIeodUN7tBAT4GwRCjkDHqZho5Hs3AAa+/Rhn0YZBRgAw4g0IXAgA=',
    primary_color: '#FFFFFF',
    secondary_color: '#000000',
    likes: 1,
    views: 4
  },
  {
    id: 36,
    skin_name: 'thicc amoeba',
    author_id: 15,
    skin: 'trSkin17dNNCoAgEIDRK43QInFVwtz/SGXjItKG8SdNUDcfZPUKBaBhYEan0LubiEZvbp6BfrSITGpXM4MnWBh3qsRMj4tGlcWpW2Ka/2P+LkRm6z85DMQOwVDtOp55xP88tBlA4bZciyOh/LloGdOcHJizWGZ2m+kFnwJjohI1ND8v0bngQ/KKwtvzQoJnGIXmAw==',
    primary_color: '#FFFFFF',
    secondary_color: '#000000',
    likes: 0,
    views: 2
  }
]
*/
```

## getRecentSkins()

Gets information about recent skins

```js
getRecentSkins(fromId, amount);
```

### Arguments:
* `fromId: number`
* `amount: number`

### Returns:
* `Promise<SkinInfo[]>`

### Example:
```js
console.log(await getRecentSkins(0, 2));
/*
Will return like
[
  {
    id: 69,
    skin_name: '9',
    author_id: 18,
    skin: 'trSkin1MzCAAGsDGMMNDLBTKGqJofAZhmImsgswGdRxDPFOG/5uolDlqJtG09NgchOFTqOlm4igRt002NyE1SbiqUHlJqIDlh75jtTIpml6IpkadRO5bgIA',
    primary_color: '#FFFFFF',
    secondary_color: '#000000',
    likes: 1,
    views: 1
  },
  {
    id: 68,
    skin_name: 'Inverted looper',
    author_id: 18,
    skin: 'trSkin1MzCAAGuDUcYoY5QxjBjWVFc46tZRt44yRhn0ZxBKnoMp+Y66dZQxysDBAAA=',
    primary_color: '#000000',
    secondary_color: '#FFFFFF',
    likes: 1,
    views: 1
  }
]
*/
```

## getSkinsByLikes()

Gets information about the most forced skins

```js
getSkinsByLike(fromId, amount);
```

### Arguments:
* `fromId: number`
* `amount: number`

### Returns:
* `Promise<SkinInfo[]>`

### Example:
```js
console.log(await getSkinsByLikes(4, 1));
/*
Will return like
[
  {
    id: 9,
    skin_name: 'Kvadrat',
    author_id: 3,
    skin: 'trSkin17ZY7DsAgDEOvlJ3d9z8SA1UHwqdFgWBElrwhw5NlIUTSBCAHERrQ8r7wxTAtYBfQ8g1nPOMDhznXgMLZKudSIUeOV3aD0dkKtHP3PbzOJs6M3WB0bshv68yY8+tMlDN1N2qAmd/LX6Bzjg==',
    primary_color: '#FFFFFF',
    secondary_color: '#000000',
    likes: 4,
    views: 10
  }
]
*/
```

## getSkinsByViews()

Gets information about the most forced viewed skins

```js
getSkinByViews(fromId, amount);
```

### Arguments:
* `fromId: number`
* `amount: number`

### Returns:
* `Promise<SkinInfo[]>`

### Example:
```js
console.log(await getSkinsByViews(4, 1));
/*
Will return like
[
  {
    id: 19,
    skin_name: 'TF2 Spy',
    author_id: 3,
    skin: 'trSkin17dZLCoAgFIXhLWmoIc2C3P+SEgURpOOj64PI0T/I/LwQxJhfB/tWGLemM0CcbsXUuVE1VRDXrsWuugaVOXuWMVEoGzITz7tKzCTjtWf518UBzODh3wxuMdhMMvCVzWDOVNHPPCAGmIXmkm92UCBemmnHEjyAmsZc/BgzCbWref0vrsScBvyvo7ppy3tKzBE+HFEVqbBleyq8AQ==',
    primary_color: '#542A2A',
    secondary_color: '#744F44',
    likes: 3,
    views: 7
  }
]
*/
```

## getLikes()

Gives the number of likes on the skin

```js
getLikes(skinId);
```

### Arguments:
* `skinId: number`

### Returns:
* `Promise<number>`

### Example:
```js
console.log(await trss.getLikes(42));
// Will return like 4
```

## getViews()

Gives the number of likes on the skin

```js
getViews(skinId);
```

### Arguments:
* `skinId: number`

### Returns:
* `Promise<number>`

### Example:
```js
console.log(await trss.getViews(42));
// Will return like 4
```

That's all
