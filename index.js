import fetch from "node-fetch";
import { deflateRawSync, inflateRawSync } from "zlib";
import _ from "lodash";
const { chunk } = _;
import chroma from "chroma-js";

export const links = {
  mainLink: "http://trsstest.crystalcloud.xyz/game-dev/TRSSDatabase/",
  usersLink: "http://trsstest.crystalcloud.xyz/game-dev/TRSSDatabase/users.php",
  skinsLink: "http://trsstest.crystalcloud.xyz/game-dev/TRSSDatabase/skins.php",
};

Object.freeze(links);

export const actions = {
  login: "login",
  getUserById: "get_user_by_id",
  getUserByToken: "get_user_by_token",
  changeUserSkin: "change_skin",
  toggleLike: "toggle_like",
  registerView: "register_view",
  getLike: "get_like",
  uploadSkin: "upload_skin",
  removeSkin: "remove_skin",
  getSkinById: "get_skin_by_id",
  getSkinsById: "get_skins_by_id",
  getRecentSkins: "get_recent_skins",
  getSkinsByAuthorId: "get_skins_by_author_id",
  getSkinsByLikes: "get_skins_by_likes",
  getSkinsByViews: "get_skins_by_views",
  getLikes: "get_likes",
  getViews: "get_views",
};

Object.freeze(actions);

export const trssErrors = {
  0: "Invalid user or password",
  1: "The user could not be found in the Team Run database",
  2: "Failed to generate unique token",
  3: "User already registered",
  4: "User or skin not found",
  5: "Exactly the same skin from the same author is already in the database",
  6: "Skin not found",
  7: "Skin creator ID does not match user ID",
  8: "Incorrect value",
  "-1": "Unknown error",
};

Object.freeze(trssErrors);

export class TrssError extends Error {
  name = "TrssError";
  code;
  constructor(errorCode) {
    super(trssErrors[errorCode]);
    this.code = errorCode;
  }
}

export class SameSkinError extends Error {
  name = "TrssError";
  /**@type {{error_code: number, id: number}} */
  obj;
  /**
   * @constructor
   * @param {{error_code: number, id: number}} errorObject
   */
  constructor(errorObject) {
    if (errorObject.error_code === 5 && "id" in errorObject) {
      super(errorObject);
    } else
      throw new TypeError('Wrong object in the "SameSkinError" constructor');
  }
}

function isJson(item) {
  item = typeof item !== "string" ? JSON.stringify(item) : item;
  try {
    item = JSON.parse(item);
  } catch (e) {
    return false;
  }
  if (typeof item === "object" && item !== null) {
    return true;
  }
  return false;
}

export function decodeSkin(skin, twoDimensional = true) {
  const bufdata = Buffer.from(skin.replace("trSkin1", "").trim(), "base64");
  const binData = new Uint8Array(bufdata);
  const compressed = inflateRawSync(binData);
  const str = String.fromCharCode.apply(null, new Uint16Array(compressed));
  const arr = str.split(";").map((e) => "#" + e + (e.length === 6 ? "FF" : ""));
  arr.pop();
  return twoDimensional ? chunk(arr, 20) : arr;
}

export function isDecodedSkin(skin) {
  return (
    Array.isArray(skin) &&
    skin.length === 18 &&
    skin.every(
      (e) =>
        Array.isArray(e) &&
        e.length === 20 &&
        e.every(
          (d) => typeof d == "string" && d.length < 10 && d.startsWith("#")
        )
    )
  );
}

export function encodeSkin(skin) {
  skin.push("");
  return (
    "trSkin1" +
    deflateRawSync(
      skin.flat().join(";").replace(/#/g, "").toUpperCase()
    ).toString("base64")
  );
}

export function isEncodedSkin(skin) {
  return isDecodedSkin(decodeSkin(skin));
}

async function makeRequest(link, action, params) {
  const data = new URLSearchParams();
  data.append("action", action);
  Object.entries(params).forEach((e) => data.append(...e));
  const response = await fetch(link, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: data,
  }).catch((e) => console.error(e));
  return await response.text();
}

// USERS.PHP

export async function login(login, password) {
  if (typeof login != "string") {
    throw new TypeError('"login" is not string');
  }
  if (typeof password != "string") {
    throw new TypeError('"password" is not string');
  }
  const res = await makeRequest(links.usersLink, actions.login, {
    login,
    password,
  });
  if (isJson(res) && "error_code" in JSON.parse(res)) {
    throw new TrssError(JSON.parse(res).error_code);
  }
  return res;
}

export async function getUserById(id) {
  id = Math.floor(id);
  if (isNaN(id)) {
    throw new TypeError('"id" is not a number');
  }
  const res = JSON.parse(
    await makeRequest(links.usersLink, actions.getUserById, {
      id,
    })
  );
  if ("error_code" in res) {
    throw new TrssError(res.error_code);
  }
  return res;
}

export async function getUserByToken(token) {
  if (typeof token != "string") {
    throw new TypeError('"token" is not a string');
  }
  const res = JSON.parse(
    await makeRequest(links.usersLink, actions.getUserByToken, { token })
  );
  if ("error_code" in res) {
    throw new TrssError(res.error_code);
  }
  return res;
}

export async function changeUserSkin(
  token,
  newSkinEncoded,
  primaryColor,
  secondaryColor
) {
  if (typeof token != "string") {
    throw new TypeError('"token" is not a string');
  }
  if (!isEncodedSkin(newSkinEncoded)) {
    throw new TypeError('"newSkinEncoded" is not a string');
  }
  primaryColor = chroma(primaryColor).hex().toUpperCase();
  secondaryColor = chroma(secondaryColor).hex().toUpperCase();
  const res = JSON.parse(
    await makeRequest(links.usersLink, actions.changeUserSkin, {
      token,
      new_skin: newSkinEncoded,
      primary_color: primaryColor,
      secondary_color: secondaryColor,
    })
  );
  if ("error_code" in res) {
    throw new TrssError(res.error_code);
  }
  return res;
}

export async function toggleLike(token, skinId) {
  if (typeof token != "string") {
    throw new TypeError('"token" is not a string');
  }
  skinId = Math.floor(skinId);
  if (isNaN(skinId)) {
    throw new TypeError('"skinId" is not a number');
  }
  const res = await makeRequest(links.usersLink, actions.toggleLike, {
    token,
    skin_id: skinId,
  });
  if (isJson(res) && "error_code" in JSON.parse(res)) {
    throw new TrssError(JSON.parse(res).error_code);
  }
  return res;
}

export async function registerView(token, skinId) {
  if (typeof token != "string") {
    throw new TypeError('"token" is not a string');
  }
  skinId = Math.floor(skinId);
  if (isNaN(skinId)) {
    throw new TypeError('"skinId" is not a number');
  }
  const res = await makeRequest(links.usersLink, actions.registerView, {
    token,
    skin_id: skinId,
  });
  if (isJson(res) && "error_code" in JSON.parse(res)) {
    throw new TrssError(JSON.parse(res).error_code);
  }
  return res;
}

export async function getLike(userId, skinId) {
  userId = Math.floor(userId);
  if (isNaN(userId)) {
    throw new TypeError('"userId" is not a number');
  }
  skinId = Math.floor(skinId);
  const res = await makeRequest(links.usersLink, actions.getLike, {
    user_id: userId,
    skin_id: skinId,
  });
  if (isJson(res) && "error_code" in JSON.parse(res)) {
    throw new TrssError(JSON.parse(res).error_code);
  }
  return res;
}

// SKINS.PHP

export async function uploadSkin(
  token,
  encodedSkin,
  skinName,
  primaryColor,
  secondaryColor
) {
  if (typeof token != "string") {
    throw new TypeError('"token" is not a string');
  }
  if (!isEncodedSkin(encodedSkin)) {
    throw new TypeError('"encodedSkin" is not an encoded skin');
  }
  primaryColor = chroma(primaryColor).hex().toUpperCase();
  secondaryColor = chroma(secondaryColor).hex().toUpperCase();
  const res = await makeRequest(links.skinsLink, actions.uploadSkin, {
    token,
    skin: encodedSkin,
    skin_name: String(skinName),
    primary_color: primaryColor,
    secondary_color: secondaryColor,
  });
  if (isJson(res) && "id" in JSON.parse(res)) {
    throw new SameSkinError(JSON.parse(res));
  }
  if (isJson(res) && "error_code" in JSON.parse(res)) {
    throw new TrssError(JSON.parse(res).error_code);
  }
  return res;
}

export async function removeSkin(token, skinId) {
  if (typeof token != "string") {
    throw new TypeError('"token" is not a string');
  }
  skinId = Math.floor(skinId);
  if (isNaN(skinId)) {
    throw new TypeError('"skinId" is not a number');
  }
  const res = await makeRequest(links.skinsLink, actions.removeSkin, {
    token,
    skin_id: skinId,
  });
  if (isJson(res) && "error_code" in JSON.parse(res)) {
    throw new TrssError(JSON.parse(res).error_code);
  }
  return res;
}

export async function getSkinById(skinId) {
  skinId = Math.floor(skinId);
  if (isNaN(skinId)) {
    throw new TypeError('"skinId" is not a number');
  }
  const res = JSON.parse(
    await makeRequest(links.skinsLink, actions.getSkinById, {
      skin_id: skinId,
    })
  );
  if ("error_code" in res) {
    throw new TrssError(res.error_code);
  }
  return res;
}

export async function getSelfLike(skinId) {
  skinId = Math.floor(skinId);
  if (isNaN(skinId)) {
    throw new TypeError('"skinId" is not a number');
  }
  const skinData = await getSkinById(skinId)
  const res = getLike(skinData.author_id, skinId);
  if ("error_code" in skinData) {
    throw new TrssError(skinData.error_code);
  }
  return !!res;
}

export async function getSkinsById(fromId, amount) {
  fromId = Math.floor(fromId);
  if (isNaN(fromId)) {
    throw new TypeError('"fromId" is not a number');
  }
  amount = Math.floor(amount);
  if (isNaN(amount)) {
    throw new TypeError('"amount" is not a number');
  }
  const res = JSON.parse(
    await makeRequest(links.skinsLink, actions.getSkinsById, {
      from: fromId,
      amount,
    })
  );
  if (!Array.isArray(res) && "error_code" in res) {
    throw new TrssError(res.error_code);
  }
  return res;
}

export async function getRecentSkins(fromId, amount) {
  fromId = Math.floor(fromId);
  if (isNaN(fromId)) {
    throw new TypeError('"fromId" is not a number');
  }
  amount = Math.floor(amount);
  if (isNaN(amount)) {
    throw new TypeError('"amount" is not a number');
  }
  const res = JSON.parse(
    await makeRequest(links.skinsLink, actions.getRecentSkins, {
      from: fromId,
      amount,
    })
  );
  if (!Array.isArray(res) && "error_code" in res) {
    throw new TrssError(res.error_code);
  }
  return res;
}

export async function getSkinsByAuthorId(authorId, fromId, amount) {
  authorId = Math.floor(authorId);
  if (isNaN(authorId)) {
    throw new TypeError('"authorId" is not a number');
  }
  fromId = Math.floor(fromId);
  if (isNaN(fromId)) {
    throw new TypeError('"fromId" is not a number');
  }
  amount = Math.floor(amount);
  if (isNaN(amount)) {
    throw new TypeError('"amount" is not a number');
  }
  const res = JSON.parse(
    await makeRequest(links.skinsLink, actions.getSkinsByAuthorId, {
      author_id: authorId,
      from: fromId,
      amount,
    })
  );
  if (!Array.isArray(res) && "error_code" in res) {
    throw new TrssError(res.error_code);
  }
  return res;
}


export async function getSkinsByLikes(fromId, amount) {
  fromId = Math.floor(fromId);
  if (isNaN(fromId)) {
    throw new TypeError('"fromId" is not a number');
  }
  amount = Math.floor(amount);
  if (isNaN(amount)) {
    throw new TypeError('"amount" is not a number');
  }
  const res = JSON.parse(
    await makeRequest(links.skinsLink, actions.getSkinsByLikes, {
      from: fromId,
      amount,
    })
  );
  if (!Array.isArray(res) && "error_code" in res) {
    throw new TrssError(res.error_code);
  }
  return res;
}

export async function getSkinsByViews(fromId, amount) {
  fromId = Math.floor(fromId);
  if (isNaN(fromId)) {
    throw new TypeError('"fromId" is not a number');
  }
  amount = Math.floor(amount);
  if (isNaN(amount)) {
    throw new TypeError('"amount" is not a number');
  }
  const res = JSON.parse(
    await makeRequest(links.skinsLink, actions.getSkinsByViews, {
      from: fromId,
      amount,
    })
  );
  if (!Array.isArray(res) && "error_code" in res) {
    throw new TrssError(res.error_code);
  }
  return res;
}

export async function getLikes(skinId) {
  skinId = Math.floor(skinId);
  if (isNaN(skinId)) {
    throw new TypeError('"skinId" is not a number');
  }
  const res = await makeRequest(links.skinsLink, actions.getLikes);
  if (isJson(res) && "error_code" in JSON.parse(res)) {
    throw new TrssError(JSON.parse(res).error_code);
  }
  return res;
}

export async function getViews(skinId) {
  skinId = Math.floor(skinId);
  if (isNaN(skinId)) {
    throw new TypeError('"skinId" is not a number');
  }
  const res = await makeRequest(links.skinsLink, actions.getViews);
  if (isJson(res) && "error_code" in JSON.parse(res)) {
    throw new TrssError(JSON.parse(res).error_code);
  }
  return res;
}

export const danger = { makeRequest };
Object.freeze(danger);
