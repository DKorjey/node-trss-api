import fetch from "node-fetch";

export const usersLink = mainLink + "users.php";
export const skinsLink = mainLink + "skins.php";

export const links = {
  mainLink: "http://trsstest.crystalcloud.xyz/game-dev/TRSSDatabase/",
  usersLink: "http://trsstest.crystalcloud.xyz/game-dev/TRSSDatabase/users.php",
  skinsLink: "http://trsstest.crystalcloud.xyz/game-dev/TRSSDatabase/skins.php",
};

export const actions = ["login"];

export const trssErrors = {
  0: "Invalid user or password",
  1: "The user could not be found in the Team Run database",
  2: "Failed to generate unique token",
  3: "User already registered",
  4: "User or skin not found",
  5: "Exactly the same skin from the same author is already in the database",
  6: "Skin not found",
  7: "Skin creator ID does not match user ID",
  "-1": "Unknown error",
};

/**
 * @typedef {(string)} token
 */

export class TrssError extends Error {
  message = "TrssError";
  /**@type {number} */
  code;
  /**
   * @constructor
   * @param {number} errorCode
   */
  constructor(errorCode) {
    super(trssErrors[errorCode]);
    this.code = errorCode;
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

/**
 * @param {string} action
 * @param {Object} params
 */
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
  return response.text();
}

/**
 * @param {any} skin
 * @returns {boolean}
 */
export function isSkin(skin) {
  return (
    Array.isArray(skin) &&
    skin.length === 18 &&
    skin.every(
      (e) =>
        Array.isArray(e) &&
        e.length === 20 &&
        e.every((d) => typeof d == "string" && d.length < 9)
    )
  );
}

/**
 * @param {string} login
 * @param {string} password
 * @returns {token}
 */
export async function login(login, password) {
  if (typeof login != "string" && typeof password != "string") {
    throw new Error('"login" and "password" is not string');
  }
  if (typeof login != "string") {
    throw new Error('"login" is not string');
  }
  if (typeof password != "string") {
    throw new Error('"password" is not string');
  }
  const res = await makeRequest(links.usersLink, "login", {
    login,
    password,
  });
  if (isJson(res) && "error_code" in JSON.parse(res)) {
    throw new TrssError(res.error_code);
  }
  return res;
}
