declare module "node-trss-api" {
  export type TrssErrorCode = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  export type skinDecoded = string[][];
  export type skinEncoded = string;

  export interface SkinInfo {
    author_id: number;
    id: number;
    likes: number;
    primary_color: string;
    secondary_color: string;
    skin: skinEncoded;
    skin_name: string;
    views: number;
  }

  export interface UserInfo {
    id: number;
    login: string;
    skin: skinEncoded;
    primary_color: string;
    secondary_color: string;
  }

  export interface UserInfoByToken {
    id: number;
    login: string;
    skin: skinEncoded;
    private_token: string;
    primary_color: string;
    secondary_color: string;
  }

  export interface ChangedSkin {
    skin: skinEncoded;
    primary_color: string;
    secondary_color: string;
  }

  export interface LinksInterface {
    readonly mainLink: "http://trsstest.crystalcloud.xyz/game-dev/TRSSDatabase/";
    readonly usersLink: "http://trsstest.crystalcloud.xyz/game-dev/TRSSDatabase/users.php";
    readonly skinsLink: "http://trsstest.crystalcloud.xyz/game-dev/TRSSDatabase/skins.php";
  }

  export interface ActionsInterface {
    readonly login: "login";
    readonly getUserById: "get_user_by_id";
    readonly getUserByToken: "get_user_by_token";
    readonly changeUserSkin: "change_skin";
    readonly toggleLike: "toggle_like";
    readonly registerView: "register_view";
    readonly getLike: "get_like";
    readonly uploadSkin: "upload_skin";
    readonly removeSkin: "remove_skin";
    readonly getSkinById: "get_skin_by_id";
    readonly getSkinsById: "get_skins_by_id";
    readonly getRecentSkins: "get_recent_skins";
    readonly getSkinsByAuthorId: "get_skins_by_author_id";
    readonly getSkinsByLikes: "get_skins_by_likes";
    readonly getSkinsByViews: "get_skins_by_views";
    readonly getLikes: "get_likes";
    readonly getViews: "get_views";
  }

  export interface TrssErrorCodesInterface {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    7: string;
    8: string;
    "-1": string;
  }

  export interface SameSkinErrorInterface {
    error_code: TrssErrorCode;
    id: number;
  }

  export class TrssError extends Error {
    readonly name = "TrssError";
    code: TrssErrorCode;
    constructor(errorCode: TrssErrorCode);
  }

  export class SameSkinError extends Error {
    name: "TrssError";
    obj: SameSkinErrorInterface;
    constructor(errorObject: SameSkinErrorInterface);
  }

  export function decodeSkin(
    skin: skinEncoded,
    twoDimensional?: boolean
  ): skinDecoded;
  export function isDecodedSkin(skin: any): boolean;

  export function encodeSkin(skin: skinDecoded): skinEncoded;

  export function isEncodedSkin(skin: any): boolean;

  export function makeRequest(
    link: string,
    action: string,
    params: object
  ): Promise<string>;

  export function logIn(login: string, password: string): Promise<string>;

  export function getUserById(id: number): Promise<UserInfo>;

  export function getUserByToken(token: string): Promise<UserInfoByToken>;

  export function changeUserSkin(
    token: string,
    newSkinEncoded: skinEncoded,
    primaryColor: string,
    secondaryColor: string
  ): Promise<ChangedSkin>;

  export function toggleLike(
    token: string,
    skinId: number
  ): Promise<boolean>;

  export function registerView(
    token: string,
    skinId: number
  ): Promise<boolean>;

  export function getLike(
    userId: number,
    skinId: number
  ): Promise<boolean>;

  // SKINS.PHP

  export function uploadSkin(
    token: string,
    encodedSkin: skinEncoded,
    skinName: string,
    primaryColor: string,
    secondaryColor: string
  ): Promise<boolean>;

  export function removeSkin(
    token: string,
    skinId: number
  ): Promise<boolean>;

  export function getSkinById(skinId: number): Promise<SkinInfo>;

  export function getSkinsById(
    fromId: number,
    amount: number
  ): Promise<SkinInfo[]>;

  export function getRecentSkins(
    fromId: number,
    amount: number
  ): Promise<SkinInfo[]>;

  export function getSkinsByLikes(
    fromId: number,
    amount: number
  ): Promise<SkinInfo[]>;

  export function getSkinsByViews(
    fromId: number,
    amount: number
  ): Promise<SkinInfo[]>;

  export function getLikes(skinId: number): Promise<number>;

  export function getViews(skinId: number): Promise<number>;

  export const danger: {
    makeRequest: (
      link: string,
      action: string,
      params: object
    ) => Promise<string>;
  };
}
