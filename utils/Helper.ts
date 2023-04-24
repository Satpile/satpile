import runes from "runes";
import { AddingEnum, FolderType } from "./Types";
import addressValidation from "bitcoin-address-validation";

function numberWithCommas(x) {
  const parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

export function convertSatoshiToString(
  satoshi,
  prependSign = false,
  unit: "sats" | "bitcoin" = "sats"
) {
  let string = "";
  if (unit === "bitcoin") {
    string = numberWithCommas((satoshi / 1e8).toFixed(8));
  } else {
    string = numberWithCommas(Math.round(satoshi));
  }

  if (satoshi > 0 && prependSign) {
    return `+ ${string}`;
  }
  return string;
}

export function generateUid(size = 30) {
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let uid = "";
  for (let i = 0; i < size; i++) {
    uid += chars.charAt(Math.floor(Math.random() * size));
  }

  return uid;
}

export function truncate(
  string: string,
  maxSize,
  ellipsis: "end" | "middle" | "start" = "middle"
) {
  const chars = runes(string);
  if (chars.length <= maxSize) {
    return string;
  }

  const ellipsisUnicode = "\u2026";

  switch (ellipsis) {
    case "end":
      return chars.splice(0, maxSize).join("") + ellipsisUnicode;
    case "start":
      return ellipsisUnicode + chars.splice(-maxSize, maxSize).join("");
    case "middle":
      return (
        chars.splice(0, maxSize / 2).join("") +
        ellipsisUnicode +
        chars.splice(-maxSize / 2, maxSize / 2).join("")
      );
  }
}

export function isSorted<T extends { name: string }>(array: T[]) {
  let last = "";
  for (const element of array) {
    if (element.name < last) {
      return false;
    }
    last = element.name;
  }
  return true;
}

export function isAddressValid(address: string, type: AddingEnum) {
  if (type === AddingEnum.XPUB_WALLET) {
    return /^[xyz]pub[A-Za-z0-9]+/.test(address);
  }

  return addressValidation(address) !== false;
}
