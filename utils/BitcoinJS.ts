import BIP32Factory from "bip32";
import * as ecc from "tiny-secp256k1";
export const bip32 = BIP32Factory(ecc);
